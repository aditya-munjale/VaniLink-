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
          return diffInDays <= 14;
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
        {/* Responsive Header Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 sm:mb-10 gap-6">
          <div className="flex items-center space-x-3 sm:space-x-5">
            <button
              onClick={() => routeTo("/home")}
              className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md hover:bg-purple-50 transition-all border border-gray-100 group text-gray-500 hover:text-purple-600"
            >
              <HomeIcon fontSize="small" />
            </button>
            <div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 tracking-tight flex items-center">
                <HistoryIcon
                  className="mr-2 sm:mr-3 text-purple-600"
                  sx={{ fontSize: { xs: 28, sm: 35 } }}
                />
                History
              </h1>
              <p className="text-gray-500 text-xs sm:text-sm mt-1 font-medium">
                Auto-deletes after 14 days
              </p>
            </div>
          </div>

          <button
            onClick={() => routeTo("/home")}
            className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold px-6 py-3 rounded-xl shadow-lg transition-all flex items-center justify-center"
          >
            <HomeIcon className="mr-2" fontSize="small" />
            <span className="text-sm">Back to Home</span>
          </button>
        </div>

        {/* Responsive Stats Grid - Stacks on Mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mb-8 sm:mb-10">
          <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-[10px] sm:text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                Total Recent
              </p>
              <p className="text-2xl sm:text-3xl font-black text-gray-800">
                {meetings.length}
              </p>
            </div>
            <div className="w-10 h-10 sm:w-14 sm:h-14 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
              <HistoryIcon fontSize="medium" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-[10px] sm:text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                This Month
              </p>
              <p className="text-2xl sm:text-3xl font-black text-gray-800">
                {
                  meetings.filter(
                    (m) =>
                      new Date(m.date).getMonth() === new Date().getMonth(),
                  ).length
                }
              </p>
            </div>
            <div className="w-10 h-10 sm:w-14 sm:h-14 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
              <CalendarTodayIcon fontSize="medium" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-[10px] sm:text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                Latest
              </p>
              <p className="text-base sm:text-xl font-bold text-gray-800 mt-1">
                {meetings.length > 0 ? getTimeAgo(meetings[0].date) : "N/A"}
              </p>
            </div>
            <div className="w-10 h-10 sm:w-14 sm:h-14 bg-fuchsia-50 rounded-xl flex items-center justify-center text-fuchsia-600">
              <AccessTimeIcon fontSize="medium" />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-100 border-t-purple-600 mb-4"></div>
            <p className="text-gray-500 font-medium">Loading history...</p>
          </div>
        ) : (
          <>
            {meetings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
                {meetings.map((meeting, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-2xl sm:rounded-3xl shadow-sm hover:shadow-md transition-all border border-gray-100 overflow-hidden group flex flex-col relative"
                  >
                    <div className="p-5 sm:p-6 flex-1">
                      <div className="flex items-center mb-5">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center mr-3 sm:mr-4 shadow-md shadow-purple-100">
                          <MeetingRoomIcon
                            className="text-white"
                            fontSize="small"
                          />
                        </div>
                        <div>
                          <h3 className="font-extrabold text-base sm:text-lg text-gray-900">
                            Session #{meetings.length - index}
                          </h3>
                          <p className="text-[11px] sm:text-sm font-medium text-gray-400 flex items-center">
                            <AccessTimeIcon
                              className="mr-1"
                              sx={{ fontSize: 14 }}
                            />
                            {getTimeAgo(meeting.date)}
                          </p>
                        </div>
                      </div>

                      <div className="bg-slate-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-slate-100">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                          Access Code
                        </p>
                        <p className="font-mono text-lg sm:text-xl font-bold text-purple-700">
                          {meeting.meetingCode}
                        </p>

                        <div className="mt-4 pt-3 border-t border-gray-200">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                            Date & Time
                          </p>
                          <p className="text-xs sm:text-sm font-semibold text-gray-700">
                            {formatDate(meeting.date)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="px-5 sm:px-6 pb-5 sm:pb-6 flex gap-2">
                      <button
                        onClick={() => handleJoinMeeting(meeting.meetingCode)}
                        className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl text-xs sm:text-sm transition-colors flex items-center justify-center"
                      >
                        Rejoin
                      </button>
                      <button
                        onClick={() =>
                          navigator.clipboard.writeText(meeting.meetingCode)
                        }
                        className="flex-1 bg-purple-50 text-purple-700 hover:bg-purple-100 font-bold py-3 rounded-xl text-xs sm:text-sm transition-colors"
                      >
                        Copy Code
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-3xl border border-gray-100 border-dashed text-center">
                <div className="w-20 h-20 sm:w-28 sm:h-28 bg-purple-50 rounded-full flex items-center justify-center mb-6">
                  <HistoryIcon
                    className="text-purple-200"
                    sx={{ fontSize: 50 }}
                  />
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-2">
                  No Recent Sessions
                </h3>
                <p className="text-gray-400 text-sm max-w-xs mb-8">
                  Your history is empty. We clear sessions older than 14 days
                  automatically.
                </p>
                <button
                  onClick={() => routeTo("/home")}
                  className="bg-purple-600 text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-purple-200 transition-all text-sm"
                >
                  Create New Meeting
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
