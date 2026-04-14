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
      <div className="bg-gray-800/80 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 max-w-md w-full shadow-2xl">
        <h2 className="text-3xl font-black mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
          Join ConferaX
        </h2>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-5 py-4 mb-4 bg-gray-900/50 border border-gray-700 rounded-xl text-white outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Display Name"
        />
        <input
          type="text"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          className="w-full px-5 py-4 mb-4 bg-gray-900/50 border border-gray-700 rounded-xl text-white uppercase outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Room Code"
        />
        {error && (
          <p className="text-red-500 text-sm font-bold text-center mb-4">
            {error}
          </p>
        )}
        <button
          onClick={handleJoin}
          disabled={isLoading}
          className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg"
        >
          {isLoading ? "Connecting..." : "Join Meeting"}
        </button>
      </div>
    </div>
  );
}
