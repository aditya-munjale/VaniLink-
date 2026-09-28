import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { Snackbar } from "@mui/material";
import axios from "axios"; // Assuming you use axios, or use fetch

export default function Authentication() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [formState, setFormState] = useState(0); // 0 = Login, 1 = Register
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // --- NEW STATE FOR COUNSELORS ---
  const [counselors, setCounselors] = useState([]);
  const [selectedCounselor, setSelectedCounselor] = useState("");

  const { handleRegister, handleLogin } = useContext(AuthContext);

  // --- FETCH COUNSELORS ON MOUNT ---
  useEffect(() => {
    const fetchCounselors = async () => {
      try {
        // Adjust the URL to match your backend port and route
        const response = await axios.get(
          "http://localhost:8000/api/v1/users/counselors",
        );
        setCounselors(response.data);
      } catch (err) {
        console.error("Failed to fetch counselors:", err);
      }
    };
    fetchCounselors();
  }, []);

  // --- FRONTEND VALIDATION ---
  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (formState === 1) {
      if (name.trim().length < 2) {
        setError("Full name must be at least 2 characters long.");
        return false;
      }
      if (!selectedCounselor) {
        setError("Please select a Counselor from the dropdown.");
        return false;
      }
    }

    if (!emailRegex.test(username)) {
      setError("Please enter a valid email address.");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return false;
    }
    return true;
  };

  const handleAuth = async () => {
    try {
      setError("");
      if (!validateForm()) return;

      setIsLoading(true);

      if (formState === 0) {
        await handleLogin(username, password);
      }
      if (formState === 1) {
        // Passed selectedCounselor up to the AuthContext
        let result = await handleRegister(
          name,
          username,
          password,
          selectedCounselor,
        );
        setMessage(result);
        setOpen(true);
        setFormState(0);
        setPassword("");
        setName("");
        setSelectedCounselor("");
      }
    } catch (err) {
      console.log(err);
      let errorMessage = err.response?.data?.message || "An error occurred";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAuth();
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans">
      {/* --- Left Panel (Visuals) --- */}
      <div className="hidden lg:block lg:w-1/2 bg-purple-700 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=1920&auto=format&fit=crop')",
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/90 to-indigo-900/95"></div>
        <div className="relative h-full flex items-center justify-center p-12">
          <div className="text-white max-w-md">
            <h1 className="text-5xl font-black mb-6 tracking-tight">
              VaniLink
            </h1>
            <p className="text-xl mb-10 font-medium text-purple-100 leading-relaxed">
              Gather, read, and preserve collective wisdom. Seamless live
              sessions powered by AI.
            </p>
            {/* Visual bullets kept for brevity... */}
          </div>
        </div>
      </div>

      {/* --- Right Panel (Form) --- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-white relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>

        <div className="w-full max-w-md relative z-10">
          <div className="lg:hidden mb-10 text-center">
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
              VaniLink
            </h1>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-6 hidden lg:block">
            {formState === 0 ? "Welcome back" : "Create an account"}
          </h2>

          {/* Form Toggle */}
          <div className="flex mb-8 bg-gray-100/80 p-1 rounded-xl border border-gray-200">
            <button
              onClick={() => {
                setFormState(0);
                setError("");
              }}
              className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all duration-300 ${
                formState === 0
                  ? "bg-white text-purple-700 shadow-sm border border-gray-200/50"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setFormState(1);
                setError("");
              }}
              className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all duration-300 ${
                formState === 1
                  ? "bg-white text-purple-700 shadow-sm border border-gray-200/50"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form Inputs */}
          <div className="space-y-5">
            {formState === 1 && (
              <>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-gray-600 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all font-medium text-gray-900"
                    placeholder="e.g. Jane Doe"
                  />
                </div>

                {/* --- NEW COUNSELOR DROPDOWN --- */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-gray-600 mb-2">
                    Select Your Counselor
                  </label>
                  <select
                    value={selectedCounselor}
                    onChange={(e) => setSelectedCounselor(e.target.value)}
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all font-medium text-gray-900 appearance-none"
                  >
                    <option value="" disabled>
                      Select a Prabhuji...
                    </option>
                    {counselors.map((counselor) => (
                      <option key={counselor._id} value={counselor._id}>
                        {counselor.counselorName}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-gray-600 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all font-medium text-gray-900"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-gray-600 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all font-medium text-gray-900"
                placeholder="••••••••"
              />
            </div>

            {/* Error Message Display */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl animate-fade-in">
                <div className="flex items-center">
                  <span className="text-red-500 mr-2">⚠️</span>
                  <p className="text-red-700 text-sm font-bold">{error}</p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleAuth}
              disabled={isLoading}
              className="w-full mt-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-200 hover:shadow-xl transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center transform hover:-translate-y-0.5"
            >
              {isLoading
                ? "Processing..."
                : formState === 0
                  ? "Sign In"
                  : "Create Account"}
            </button>
          </div>
        </div>
      </div>
      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={() => setOpen(false)}
        message={message}
      />
    </div>
  );
}
