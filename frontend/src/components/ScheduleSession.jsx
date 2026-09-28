import React, { useState } from "react";
import axios from "axios";
import { Snackbar } from "@mui/material";
import server from "../environment.js";

export default function ScheduleSession() {
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState("");
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSchedule = async (e) => {
    e.preventDefault();
    if (!title || !startTime) {
      setMessage("Please fill in all fields.");
      setOpen(true);
      return;
    }

    setIsLoading(true);
    try {
      // Retrieve the JWT token from wherever your AuthContext saves it (e.g., localStorage)
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${server}/api/v1/livekit/schedule`, // Adjust port/route if needed
        { title, startTime },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setMessage(
        `Success! Notified ${response.data.devoteesNotified} devotees.`,
      );
      setTitle("");
      setStartTime("");
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.error || "Failed to schedule session.");
    } finally {
      setIsLoading(false);
      setOpen(true);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Schedule Reading Session
      </h2>

      <form onSubmit={handleSchedule} className="space-y-5">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wide text-gray-600 mb-2">
            Session Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all font-medium text-gray-900"
            placeholder="e.g. Srimad Bhagavatam Canto 1"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wide text-gray-600 mb-2">
            Start Time
          </label>
          <input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all font-medium text-gray-900"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-200 hover:shadow-xl transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center transform hover:-translate-y-0.5"
        >
          {isLoading ? "Scheduling..." : "Schedule & Notify Devotees"}
        </button>
      </form>

      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={() => setOpen(false)}
        message={message}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </div>
  );
}
