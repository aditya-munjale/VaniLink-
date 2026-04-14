import { useState, useEffect, useRef, useCallback } from "react";
import { useRoomContext, useDataChannel } from "@livekit/components-react";

export default function useSpeechToText() {
  const [caption, setCaption] = useState("");
  const [showCaptions, setShowCaptions] = useState(false);

  const fullTranscriptRef = useRef("");
  const socketRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const clearTimerRef = useRef(null);
  const engineStartedRef = useRef(false);

  const room = useRoomContext();

  useDataChannel("transcript-channel", (msg) => {
    const decoder = new TextDecoder();
    const data = JSON.parse(decoder.decode(msg.payload));
    const senderName = msg.participant?.identity || "Participant";

    fullTranscriptRef.current += `\n${senderName}: ${data.text}`;
    console.log(`📡 [NETWORK RECEIVE] ${senderName}: ${data.text}`);

    setCaption(`${senderName}: ${data.text}`);
    if (clearTimerRef.current) clearTimeout(clearTimerRef.current);
    clearTimerRef.current = setTimeout(() => setCaption(""), 3000);
  });

  const startDeepgramEngine = useCallback(async () => {
    if (engineStartedRef.current) return;
    engineStartedRef.current = true;

    try {
      const response = await fetch(
        "https://vanilink-backend.onrender.com/api/v1/livekit/deepgram/getToken",
      );
      const { key } = await response.json();

      const socket = new WebSocket(
        "wss://api.deepgram.com/v1/listen?model=nova-2&smart_format=true",
        ["token", key],
      );
      socketRef.current = socket;

      socket.onopen = async () => {
        console.log("☁️ Deepgram Engine Running Silently...");

        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.addEventListener("dataavailable", (event) => {
          if (event.data.size > 0 && socket.readyState === WebSocket.OPEN) {
            socket.send(event.data);
          }
        });
        mediaRecorder.start(250);
      };

      socket.onmessage = (message) => {
        const received = JSON.parse(message.data);
        const transcript = received.channel?.alternatives[0]?.transcript;

        if (transcript && received.is_final) {
          const finalSentence = transcript.trim();
          const myName = room?.localParticipant?.identity || "Me";

          fullTranscriptRef.current += `\n${myName}: ${finalSentence}`;

          if (room && room.state === "connected" && room.localParticipant) {
            try {
              const payloadString = JSON.stringify({ text: finalSentence });
              const payloadBytes = new TextEncoder().encode(payloadString);
              room.localParticipant.publishData(payloadBytes, {
                reliable: true,
                topic: "transcript-channel",
              });
            } catch (err) {
              console.warn("Skipping broadcast: Room is closing.");
            }
          }

          setCaption(`${myName}: ${finalSentence}`);
          if (clearTimerRef.current) clearTimeout(clearTimerRef.current);
          clearTimerRef.current = setTimeout(() => setCaption(""), 3000);
        }
      };

      socket.onclose = () => {
        console.log("☁️ Deepgram Engine Offline");
        engineStartedRef.current = false;
      };
    } catch (error) {
      console.error("Failed to start Deepgram Engine:", error);
      engineStartedRef.current = false;
    }
  }, [room]);

  const stopDeepgramEngine = useCallback(() => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
    }
    if (socketRef.current) {
      socketRef.current.close();
    }
    engineStartedRef.current = false;
    setCaption("");
  }, []);

  // AUTO-START ENGINE ON JOIN
  useEffect(() => {
    if (room) {
      startDeepgramEngine();
    }
    return () => stopDeepgramEngine(); // Cleanup when leaving room
  }, [room, startDeepgramEngine, stopDeepgramEngine]);

  const toggleCaptions = () => setShowCaptions((prev) => !prev);

  return { caption, showCaptions, toggleCaptions, fullTranscriptRef };
}
