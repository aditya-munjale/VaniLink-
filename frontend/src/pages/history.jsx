import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import HistoryIcon from "@mui/icons-material/History";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

export default function History() {
  const { getHistoryOfUser } = useContext(AuthContext);
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const routeTo = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const history = await getHistoryOfUser();

        // --- AUTO DELETE LOGIC: Keep only meetings from the last 14 days ---
        const now = new Date();
        const recentMeetings = history.filter((meeting) => {
          const meetingDate = new Date(meeting.date);
          const diffInTime = now.getTime() - meetingDate.getTime();
          const diffInDays = diffInTime / (1000 * 3600 * 24);
          return diffInDays <= 14; // Drops anything older than 2 weeks!
        });

        setMeetings(recentMeetings);
      } catch (error) {
        console.error("Error fetching history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [getHistoryOfUser]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${day}/${month}/${year} • ${hours}:${minutes}`;
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      return `${diffInMinutes} mins ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hrs ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} days ago`;
    }
  };

  const handleJoinMeeting = (meetingCode) => {
    routeTo(`/${meetingCode}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-6">
          <div className="flex items-center space-x-5">
            <button
              onClick={() => routeTo("/home")}
              className="flex items-center justify-center w-12 h-12 bg-white rounded-2xl shadow-sm hover:shadow-md hover:bg-purple-50 transition-all duration-300 border border-gray-100 group text-gray-500 hover:text-purple-600"
            >
              <HomeIcon />
            </button>
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight flex items-center">
                <HistoryIcon
                  className="mr-3 text-purple-600"
                  fontSize="large"
                />
                Meeting History
              </h1>
              <p className="text-gray-500 mt-1 font-medium">
                Recent sessions (Auto-deletes after 14 days)
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center px-5 py-2.5 bg-purple-100 text-purple-700 rounded-xl font-medium">
              <span className="font-bold mr-2 text-lg">{meetings.length}</span>
              Sessions
            </div>
            <button
              onClick={() => routeTo("/home")}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-purple-200 transition-all duration-300 flex items-center"
            >
              <HomeIcon className="mr-2 sm:mr-3" fontSize="small" />
              <span className="hidden sm:inline">Back to Home</span>
              <span className="sm:hidden">Home</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">
                  Total Recent
                </p>
                <p className="text-3xl font-black text-gray-800">
                  {meetings.length}
                </p>
              </div>
              <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600">
                <HistoryIcon fontSize="medium" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">
                  This Month
                </p>
                <p className="text-3xl font-black text-gray-800">
                  {
                    meetings.filter(
                      (m) =>
                        new Date(m.date).getMonth() === new Date().getMonth(),
                    ).length
                  }
                </p>
              </div>
              <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                <CalendarTodayIcon fontSize="medium" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">
                  Latest
                </p>
                <p className="text-xl font-bold text-gray-800 mt-2">
                  {meetings.length > 0 ? getTimeAgo(meetings[0].date) : "N/A"}
                </p>
              </div>
              <div className="w-14 h-14 bg-fuchsia-50 rounded-2xl flex items-center justify-center text-fuchsia-600">
                <AccessTimeIcon fontSize="medium" />
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="animate-spin rounded-full h-14 w-14 border-4 border-gray-100 border-t-purple-600 mb-6"></div>
            <p className="text-gray-500 font-medium text-lg">
              Loading your history...
            </p>
          </div>
        ) : (
          <>
            {meetings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {meetings.map((meeting, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group flex flex-col relative"
                  >
                    <div className="p-6 flex-1">
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mr-4 shadow-md shadow-purple-200">
                            <MeetingRoomIcon
                              className="text-white"
                              fontSize="small"
                            />
                          </div>
                          <div>
                            <h3 className="font-extrabold text-lg text-gray-900">
                              Session #{meetings.length - index}
                            </h3>
                            <p className="text-sm font-medium text-gray-500 flex items-center mt-0.5">
                              <AccessTimeIcon
                                className="mr-1.5"
                                style={{ fontSize: "14px" }}
                              />
                              {getTimeAgo(meeting.date)}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-slate-50 rounded-2xl p-5 mb-6 border border-slate-100">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                          Access Code
                        </p>
                        <p className="font-mono text-xl font-bold text-purple-700 tracking-wider">
                          {meeting.meetingCode}
                        </p>
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                            Date & Time
                          </p>
                          <p className="text-sm font-semibold text-gray-700">
                            {formatDate(meeting.date)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="px-6 pb-6 pt-2">
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleJoinMeeting(meeting.meetingCode)}
                          className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3.5 px-4 rounded-xl transition-colors flex items-center justify-center"
                        >
                          <MeetingRoomIcon className="mr-2" fontSize="small" />{" "}
                          Rejoin
                        </button>
                        <button
                          onClick={() =>
                            navigator.clipboard.writeText(meeting.meetingCode)
                          }
                          className="flex-1 bg-purple-50 text-purple-700 hover:bg-purple-100 font-bold py-3.5 px-4 rounded-xl transition-colors flex items-center justify-center"
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                    <div className="h-1.5 bg-gradient-to-r from-purple-500 to-indigo-500 w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 border-dashed">
                <div className="w-32 h-32 bg-purple-50 rounded-full flex items-center justify-center mb-6">
                  <HistoryIcon className="text-purple-300 text-6xl" />
                </div>
                <h3 className="text-2xl font-extrabold text-gray-900 mb-3">
                  No Recent Sessions
                </h3>
                <p className="text-gray-500 text-center max-w-md mb-8 font-medium">
                  Your recent history is empty. Sessions older than 14 days are
                  automatically removed.
                </p>
                <button
                  onClick={() => routeTo("/home")}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold px-8 py-4 rounded-xl shadow-lg shadow-purple-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center"
                >
                  <MeetingRoomIcon className="mr-3" /> Create New Meeting
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
