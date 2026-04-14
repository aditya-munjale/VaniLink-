import React, { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Snackbar } from "@mui/material";

export default function Authentication() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [formState, setFormState] = useState(0); // 0 = Login, 1 = Register
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { handleRegister, handleLogin } = useContext(AuthContext);

  // --- FRONTEND VALIDATION ---
  const validateForm = () => {
    // Standard email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (formState === 1 && name.trim().length < 2) {
      setError("Full name must be at least 2 characters long.");
      return false;
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
      // 1. Clear previous errors
      setError("");

      // 2. Run validation check BEFORE hitting the server
      if (!validateForm()) return;

      setIsLoading(true);

      if (formState === 0) {
        await handleLogin(username, password);
      }
      if (formState === 1) {
        let result = await handleRegister(name, username, password);
        setMessage(result);
        setOpen(true);
        setFormState(0); // Switch back to login view after successful registration
        setPassword("");
        setName("");
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
            <div className="space-y-6">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-white/10 backdrop-blur rounded-xl flex items-center justify-center mr-4 border border-white/20">
                  <span className="text-xl">🪷</span>
                </div>
                <span className="text-lg font-semibold tracking-wide">
                  Live Reading Sessions
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-white/10 backdrop-blur rounded-xl flex items-center justify-center mr-4 border border-white/20">
                  <span className="text-xl">📝</span>
                </div>
                <span className="text-lg font-semibold tracking-wide">
                  Real-Time Transcription
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-white/10 backdrop-blur rounded-xl flex items-center justify-center mr-4 border border-white/20">
                  <span className="text-xl">🧠</span>
                </div>
                <span className="text-lg font-semibold tracking-wide">
                  AI Wisdom Archiving
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- Right Panel (Form) --- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-white relative">
        {/* Subtle decorative background blur */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>

        <div className="w-full max-w-md relative z-10">
          {/* Logo for mobile */}
          <div className="lg:hidden mb-10 text-center">
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
              VaniLink
            </h1>
            <p className="text-gray-500 mt-2 font-medium">
              Community Reading Platform
            </p>
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

            {/* Remember Me & Forgot Password (Login only) */}
            {formState === 0 && (
              <div className="flex items-center justify-between mt-2">
                <label className="flex items-center cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500 transition-all"
                  />
                  <span className="ml-2 text-sm text-gray-600 font-medium group-hover:text-gray-900 transition-colors">
                    Remember me
                  </span>
                </label>
                <button className="text-sm text-purple-600 hover:text-purple-800 font-bold transition-colors">
                  Forgot password?
                </button>
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleAuth}
              disabled={isLoading}
              className="w-full mt-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-200 hover:shadow-xl transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center transform hover:-translate-y-0.5"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                  Processing...
                </div>
              ) : formState === 0 ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </button>

            {/* Bottom Toggle Text */}
            <div className="text-center mt-8">
              <p className="text-gray-500 text-sm font-medium">
                {formState === 0
                  ? "New to VaniLink?"
                  : "Already have an account?"}{" "}
                <button
                  onClick={() => {
                    setFormState(formState === 0 ? 1 : 0);
                    setError("");
                  }}
                  className="text-purple-600 hover:text-purple-800 font-bold transition-colors ml-1"
                >
                  {formState === 0 ? "Sign up for free" : "Sign in here"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>

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
