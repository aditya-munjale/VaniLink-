import { AccessToken } from "livekit-server-sdk";

// 1. LIVEKIT TOKEN (Video & Data Permissions)

export const getToken = async (req, res) => {
  const { roomName, participantName } = req.body;

  try {
    const at = new AccessToken(
      process.env.LIVEKIT_API_KEY,
      process.env.LIVEKIT_API_SECRET,
      { identity: participantName, name: participantName },
    );

    at.addGrant({
      roomJoin: true,
      room: roomName,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true, // Required for our new architecture!
    });

    const token = await at.toJwt();
    res.status(200).json({ token });
  } catch (error) {
    console.error("LiveKit Token Error:", error);
    res.status(500).json({ message: "Failed to generate LiveKit token" });
  }
};

// 2. DEEPGRAM TOKEN (Cloud AI Audio Pass)

export const getDeepgramToken = async (req, res) => {
  try {
    const projectId = process.env.DEEPGRAM_PROJECT_ID;
    const apiKey = process.env.DEEPGRAM_API_KEY;

    if (!projectId || !apiKey) {
      return res
        .status(500)
        .json({ message: "Deepgram credentials missing in .env" });
    }

    // Ask Deepgram for a temporary 2-hour key directly
    const response = await fetch(
      `https://api.deepgram.com/v1/projects/${projectId}/keys`,
      {
        method: "POST",
        headers: {
          Authorization: `Token ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          comment: "ConferaX Temp Key",
          scopes: ["usage:write"],
          time_to_live_in_seconds: 7200,
        }),
      },
    );

    if (!response.ok) {
      throw new Error(
        `Failed to generate Deepgram key: ${response.statusText}`,
      );
    }

    const data = await response.json();
    res.status(200).json({ key: data.key });
  } catch (error) {
    console.error("Deepgram Token Error:", error);
    res.status(500).json({ message: "Failed to generate Deepgram token" });
  }
};
