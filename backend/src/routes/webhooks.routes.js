import express from "express";
import { WebhookReceiver } from "livekit-server-sdk";
import { Meeting } from "../models/meeting.model.js";
import { User } from "../models/user.model.js";

const router = express.Router();

const activeSessions = new Map();

// We use express.raw() to get the exact bytes LiveKit sent
router.post(
  "/livekit",
  express.raw({ type: "application/webhook+json" }),
  async (req, res) => {
    try {
      // ✅ WE MOVED IT DOWN HERE! Now the .env file is fully loaded!
      const receiver = new WebhookReceiver(
        process.env.LIVEKIT_API_KEY,
        process.env.LIVEKIT_API_SECRET,
      );

      const authorization = req.headers.authorization;

      if (!req.body) {
        console.log("⚠️ Received webhook but body was empty!");
        return res.status(400).send("Empty body");
      }

      const event = await receiver.receive(req.body, authorization);

      const roomName = event.room?.name;
      const participantIdentity = event.participant?.identity;

      if (!roomName) {
        return res.status(400).send("Missing room context");
      }

      const session = activeSessions.get(roomName);

      switch (event.event) {
        case "participant_joined": {
          // Use a case-insensitive regex search just in case room names differ in casing
          const meeting = await Meeting.findOne({
            roomId: { $regex: new RegExp(`^${roomName}$`, "i") },
          });

          // 🛑 SAFETY GUARD: If the meeting document doesn't exist in the DB yet, handle it gracefully
          if (!meeting) {
            console.log(
              `⚠️ Webhook received, but meeting room "${roomName}" was not found in the database yet.`,
            );
            return res
              .status(200)
              .send("Event received, but room record missing");
          }

          // Now it is 100% safe to access .participants
          // Example logic checking if participant is already tracked:
          const participantExists = meeting.participants?.some(
            (p) => p.identity === participantIdentity,
          );

          if (!participantExists) {
            meeting.participants.push({
              identity: participantIdentity,
              joinedAt: new Date(),
            });
            await meeting.save();
          }
          break;
        }

        case "participant_left": {
          const meeting = await Meeting.findOne({
            meetingCode: { $regex: new RegExp(`^${roomName}$`, "i") },
          });

          // 🛑 SAFETY GUARD
          if (!meeting) {
            console.log(
              `⚠️ Webhook received, but meeting room "${roomName}" was not found in the database.`,
            );
            return res
              .status(200)
              .send("Event received, but room record missing");
          }

          // Safely update participant attendance duration or leave time
          const participant = meeting.participants?.find(
            (p) => p.identity === participantIdentity,
          );
          if (participant) {
            participant.leftAt = new Date();
            await meeting.save();
          }
          break;
        }

        case "room_finished": {
          console.log(`🛑 Room Finished: ${roomName}`);
          const roomEndTime = new Date();
          const totalRoomSeconds = Math.floor(
            (roomEndTime - new Date(session.roomStartTime)) / 1000,
          );

          if (totalRoomSeconds <= 0) {
            activeSessions.delete(roomName);
            break;
          }

          const attendeesList = [];

          // Run the attendance percentage math for every tracked participant
          for (const [username, data] of Object.entries(session.participants)) {
            let finalSeconds = data.accumulatedSeconds;

            // If the room ends and the user never explicitly left, calculate their time up to the end boundary
            if (data.isInside) {
              const elapsed = Math.floor(
                (roomEndTime - new Date(data.joinedAt)) / 1000,
              );
              finalSeconds += elapsed;
            }

            // Compute status threshold based on 75% for Present, 25% for Partial
            const attendanceRatio = finalSeconds / totalRoomSeconds;
            let calculatedStatus = "Absent";

            if (attendanceRatio >= 0.75) {
              calculatedStatus = "Present";
            } else if (attendanceRatio >= 0.25) {
              calculatedStatus = "Partial";
            }

            attendeesList.push({
              name: data.name,
              username: username,
              accumulatedSeconds: finalSeconds,
              status: calculatedStatus,
            });
          }

          // Update the existing Meeting record with the processed analytics and absolute duration
          await Meeting.findOneAndUpdate(
            { meetingCode: roomName },
            {
              $set: {
                durationInSeconds: totalRoomSeconds,
                attendees: attendeesList,
              },
            },
            { new: true },
          );

          console.log(
            `💾 Saved attendance log for room ${roomName} successfully.`,
          );

          // Clean up server-side memory for this room to prevent memory leaks
          activeSessions.delete(roomName);
          break;
        }

        default:
          // Ignore unhandled LiveKit hook actions silently
          break;
      }

      // Always tell LiveKit that the hook payload was processed successfully
      res.status(200).send({ received: true });
    } catch (error) {
      console.error("❌ Webhook Processing Failure:", error.message);
      res.status(500).send("Internal Webhook Signature Error");
    }
  },
);

export default router;
