import React, { useContext, useState } from "react";
import withAuth from "../utils/withAuth";
import { useNavigate, Link } from "react-router-dom";
import { TextField, Button } from "@mui/material";
import RestoreIcon from "@mui/icons-material/Restore";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import LogoutIcon from "@mui/icons-material/Logout";
import HistoryIcon from "@mui/icons-material/History";
import { AuthContext } from "../contexts/AuthContext";

function HomeComponent() {
  let navigate = useNavigate();
  const [meetingCode, setMeetingCode] = useState("");
  const [isCreatingMeeting, setIsCreatingMeeting] = useState(false);

  const { addToUserHistory } = useContext(AuthContext);

  let handleJoinVideoCall = async () => {
    if (meetingCode.trim()) {
      await addToUserHistory(meetingCode);
      navigate(`/${meetingCode}`);
    }
  };

  const handleCreateMeeting = () => {
    const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    setMeetingCode(randomCode);
    setIsCreatingMeeting(true);
  };

  const handleJoinMeeting = () => {
    if (meetingCode.trim()) {
      handleJoinVideoCall();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleJoinMeeting();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Navigation - Responsive height and layout */}
      <nav className="px-4 py-3 sm:px-6 lg:px-8 bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-md shadow-purple-200">
              <span className="font-black text-white text-lg sm:text-xl">
                V
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
              VaniLink
            </h2>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-5">
            <button
              onClick={() => navigate("/history")}
              className="flex items-center space-x-1 text-gray-600 hover:text-purple-600 font-semibold transition-colors p-2 rounded-lg hover:bg-purple-50"
            >
              <HistoryIcon fontSize="small" />
              <span className="hidden sm:inline">History</span>
            </button>
            <div className="h-5 w-px bg-gray-200 hidden sm:block"></div>
            <button
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/auth");
              }}
              className="flex items-center space-x-1 bg-white border border-gray-200 hover:border-red-200 hover:bg-red-50 text-gray-700 hover:text-red-600 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm transition-all"
            >
              <LogoutIcon sx={{ fontSize: { xs: 16, sm: 20 } }} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="px-4 sm:px-6 lg:px-8 py-8 sm:py-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-12">
            {/* Left Content */}
            <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
              <div className="inline-block px-3 py-1 rounded-full bg-purple-100 text-purple-700 font-bold text-xs sm:text-sm mb-4 sm:mb-6 border border-purple-200">
                ✨ Welcome back to the lobby
              </div>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-gray-900 leading-tight mb-4 sm:mb-6">
                Start or join a <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
                  reading session
                </span>
              </h1>
              <p className="text-base sm:text-lg text-gray-500 mb-8 sm:mb-10 max-w-lg font-medium">
                Crystal clear video, live AI transcription, and instant wisdom
                archiving.
              </p>

              {/* Action Buttons Grid - 2 columns on mobile */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full max-w-lg mb-4">
                <button
                  onClick={handleCreateMeeting}
                  className="bg-white border-2 border-purple-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center hover:border-purple-600 hover:shadow-lg hover:shadow-purple-100 transition-all duration-300 group"
                >
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 sm:w-14 sm:h-14 bg-purple-50 rounded-lg sm:rounded-2xl flex items-center justify-center mb-2 sm:mb-4 group-hover:bg-purple-600 transition-colors">
                      <VideoCallIcon
                        className="text-purple-600 group-hover:text-white transition-colors"
                        sx={{ fontSize: { xs: 24, sm: 32 } }}
                      />
                    </div>
                    <h4 className="font-extrabold text-gray-900 text-sm sm:text-base mb-1">
                      New Session
                    </h4>
                    <p className="hidden sm:block text-sm font-medium text-gray-500">
                      Generate link
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => navigate("/history")}
                  className="bg-white border-2 border-gray-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center hover:border-indigo-400 hover:shadow-lg hover:shadow-indigo-100 transition-all duration-300 group"
                >
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 sm:w-14 sm:h-14 bg-gray-50 rounded-lg sm:rounded-2xl flex items-center justify-center mb-2 sm:mb-4 group-hover:bg-indigo-600 transition-colors">
                      <RestoreIcon
                        className="text-gray-500 group-hover:text-white transition-colors"
                        sx={{ fontSize: { xs: 24, sm: 32 } }}
                      />
                    </div>
                    <h4 className="font-extrabold text-gray-900 text-sm sm:text-base mb-1">
                      History
                    </h4>
                    <p className="hidden sm:block text-sm font-medium text-gray-500">
                      View past
                    </p>
                  </div>
                </button>
              </div>

              {/* Community Library Button */}
              <Link
                to="/library"
                className="flex items-center justify-center gap-2 sm:gap-3 w-full max-w-lg bg-gray-900 hover:bg-gray-800 border border-gray-700 hover:border-purple-500 text-white font-bold py-3 sm:py-4 rounded-xl sm:rounded-2xl transition-all shadow-lg group text-sm sm:text-base"
              >
                <span className="text-xl sm:text-2xl group-hover:scale-110 transition-transform">
                  📚
                </span>
                Explore Community Library
              </Link>
            </div>

            {/* Right Content - Join Form */}
            <div className="w-full lg:w-[45%] mt-4 lg:mt-0">
              <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl shadow-gray-200/50 border border-gray-100 w-full max-w-md mx-auto relative overflow-hidden">
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-400 opacity-10 rounded-full blur-3xl"></div>

                <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-2 relative z-10">
                  Join a Session
                </h3>
                <p className="text-gray-500 text-xs sm:text-sm font-medium mb-6 sm:mb-8 relative z-10">
                  Enter a code to connect instantly.
                </p>

                <div className="space-y-4 relative z-10">
                  <TextField
                    fullWidth
                    onChange={(e) => {
                      setMeetingCode(e.target.value);
                      setIsCreatingMeeting(false);
                    }}
                    onKeyPress={handleKeyPress}
                    value={meetingCode}
                    label="Session Code"
                    variant="outlined"
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "10px",
                        "&.Mui-focused fieldset": { borderColor: "#9333ea" },
                      },
                      "& .MuiInputLabel-root.Mui-focused": { color: "#9333ea" },
                    }}
                  />
                  <Button
                    onClick={handleJoinMeeting}
                    variant="contained"
                    fullWidth
                    className="!py-3 !rounded-xl !text-sm sm:!text-base !font-bold !normal-case !shadow-none hover:!shadow-lg"
                    sx={{
                      background: "linear-gradient(to right, #9333ea, #4f46e5)",
                      "&:hover": {
                        background:
                          "linear-gradient(to right, #7e22ce, #4338ca)",
                      },
                    }}
                  >
                    Enter Room
                  </Button>
                </div>

                {isCreatingMeeting && (
                  <div className="mt-4 p-3 sm:p-4 bg-purple-50 rounded-xl border border-purple-100 flex items-center justify-between">
                    <div>
                      <p className="text-purple-600 text-[10px] font-bold uppercase tracking-wider mb-1">
                        Your Link
                      </p>
                      <p className="font-mono text-base sm:text-lg font-black text-purple-900">
                        {meetingCode}
                      </p>
                    </div>
                    <button
                      onClick={() => navigator.clipboard.writeText(meetingCode)}
                      className="p-2 hover:bg-purple-100 rounded-lg text-purple-600 transition-colors"
                    >
                      📋
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default withAuth(HomeComponent);
