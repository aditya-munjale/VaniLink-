import React from "react";

export default function MeetingLobby({
  username,
  setUsername,
  roomName,
  setRoomName,
  handleJoin,
  isLoading,
  error,
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-gray-900 to-[#0f111a]">
      <div className="bg-gray-800/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl">
        <h2 className="text-2xl sm:text-3xl font-black mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
          Join VaniLink
        </h2>

        <div className="space-y-4">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3.5 sm:px-5 sm:py-4 bg-gray-900/50 border border-gray-700 rounded-xl text-white outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
            placeholder="Display Name"
          />

          <input
            type="text"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            className="w-full px-4 py-3.5 sm:px-5 sm:py-4 bg-gray-900/50 border border-gray-700 rounded-xl text-white uppercase outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
            placeholder="Room Code"
          />
        </div>

        {error && (
          <p className="text-red-500 text-xs sm:text-sm font-bold text-center mt-4">
            {error}
          </p>
        )}

        <button
          onClick={handleJoin}
          disabled={isLoading}
          className="w-full mt-6 bg-purple-600 hover:bg-purple-500 text-white font-bold py-3.5 sm:py-4 rounded-xl transition-all shadow-lg disabled:opacity-50 text-sm sm:text-base"
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Connecting...</span>
            </div>
          ) : (
            "Join Meeting"
          )}
        </button>
      </div>

      {/* Small footer hint for mobile */}
      <p className="text-gray-500 text-[10px] sm:text-xs mt-6 text-center px-4">
        Ensure your camera and microphone permissions are enabled.
      </p>
    </div>
  );
}
