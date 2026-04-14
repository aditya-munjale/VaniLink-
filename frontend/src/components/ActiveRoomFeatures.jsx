import React, { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { VideoConference, RoomAudioRenderer } from "@livekit/components-react";
import useSpeechToText from "../hooks/useSpeechToText";

export default function ActiveRoomFeatures({ onMeetingEnd }) {
  const { userData } = useContext(AuthContext);
  const isAdmin = userData?.role === "admin";

  const { fullTranscriptRef, caption } = useSpeechToText();

  const handleAdminDisconnect = () => {
    const finalNotes = fullTranscriptRef.current;
    onMeetingEnd(finalNotes);
  };

  const handleUserDisconnect = () => {
    window.location.href = "/home";
  };

  return (
    <div className="relative h-screen w-full">
      <VideoConference />
      <RoomAudioRenderer />

      {caption && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-50">
          <div className="bg-black/70 backdrop-blur-md text-white px-6 py-3 rounded-2xl border border-white/20 shadow-2xl animate-in fade-in zoom-in duration-300">
            <p className="text-lg font-medium tracking-wide">{caption}</p>
          </div>
        </div>
      )}

      <div className="absolute top-6 right-6 z-50">
        {isAdmin ? (
          <button
            onClick={handleAdminDisconnect}
            className="bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-xl font-bold shadow-2xl transition-all border-2 border-red-400 animate-pulse"
          >
            End Meeting & Summarize
          </button>
        ) : (
          <button
            onClick={handleUserDisconnect}
            className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-bold shadow-2xl transition-all border border-gray-600"
          >
            Leave Meeting
          </button>
        )}
      </div>
    </div>
  );
}
