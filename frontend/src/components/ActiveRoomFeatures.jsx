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

      {/* Responsive Captions */}
      {caption && (
        <div className="absolute bottom-28 sm:bottom-24 left-1/2 -translate-x-1/2 z-50 w-[90%] sm:w-auto max-w-2xl">
          <div className="bg-black/70 backdrop-blur-md text-white px-4 py-2 sm:px-6 sm:py-3 rounded-xl sm:rounded-2xl border border-white/20 shadow-2xl animate-in fade-in zoom-in duration-300 text-center">
            <p className="text-sm sm:text-lg font-medium tracking-wide leading-tight">
              {caption}
            </p>
          </div>
        </div>
      )}

      {/* Responsive Control Button */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50">
        {isAdmin ? (
          <button
            onClick={handleAdminDisconnect}
            className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-base font-bold shadow-2xl transition-all border-2 border-red-400 animate-pulse"
          >
            End & Summarize
          </button>
        ) : (
          <button
            onClick={handleUserDisconnect}
            className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-base font-bold shadow-2xl transition-all border border-gray-600"
          >
            Leave
          </button>
        )}
      </div>
    </div>
  );
}
