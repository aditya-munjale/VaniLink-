import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function LandingPage() {
  const router = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 overflow-hidden flex flex-col">
      {/* Navigation */}
      <nav className="px-4 py-4 sm:px-6 lg:px-8 bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-purple-200">
              <span className="font-black text-white text-xl">V</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
              VaniLink
            </h2>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={() => router("/auth")}
              className="text-gray-600 font-semibold hover:text-purple-600 transition-colors duration-300 px-3 py-2 text-sm sm:text-base rounded-lg hover:bg-purple-50"
            >
              Sign In
            </button>
            <button
              onClick={() => router("/auth")}
              className="bg-gray-900 hover:bg-gray-800 text-white font-bold px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-base rounded-xl transition-all shadow-md"
            >
              Enter Lobby
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="px-4 sm:px-6 lg:px-8 py-8 lg:py-24 relative flex-grow">
        <div className="absolute top-20 left-10 w-48 h-48 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-20 right-10 w-48 h-48 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-20">
            {/* Left Content - Top on mobile */}
            <div className="lg:w-1/2 text-center lg:text-left order-1 flex flex-col items-center lg:items-start">
              <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black text-gray-900 leading-[1.2] mb-6 tracking-tight">
                Preserve the Essence of Your{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-fuchsia-600">
                  Gatherings.
                </span>
              </h1>

              <p className="text-base md:text-xl text-gray-600 mb-8 max-w-lg font-medium leading-relaxed">
                Host live community readings, capture every word in real-time,
                and let AI distill wisdom into a searchable library.
              </p>

              <Link
                to={"/auth"}
                className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg text-center text-lg flex items-center justify-center transform hover:-translate-y-1"
              >
                Start a Reading Session
              </Link>

              {/* Features Grid */}
              <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-center sm:text-left">
                  <h3 className="font-extrabold text-gray-900 text-sm mb-1">
                    🪷 Live Video
                  </h3>
                  <p className="text-xs text-gray-500 font-medium">
                    Low-latency group reading.
                  </p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-center sm:text-left">
                  <h3 className="font-extrabold text-gray-900 text-sm mb-1">
                    📝 Smart Captions
                  </h3>
                  <p className="text-xs text-gray-500 font-medium">
                    Real-time transcription.
                  </p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-center sm:text-left">
                  <h3 className="font-extrabold text-gray-900 text-sm mb-1">
                    🧠 AI Wisdom
                  </h3>
                  <p className="text-xs text-gray-500 font-medium">
                    Core philosophies extracted.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Content - Bottom on mobile */}
            <div className="lg:w-1/2 flex justify-center order-2 w-full">
              <div className="relative w-full max-w-sm lg:max-w-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-200 to-indigo-200 rounded-[2rem] transform rotate-2 scale-105 opacity-50"></div>
                <div className="bg-white rounded-[2rem] p-3 sm:p-5 shadow-2xl relative z-10 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=1000&auto=format&fit=crop"
                    alt="Community"
                    className="w-full h-auto rounded-xl object-cover aspect-video sm:aspect-[4/3]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-4 py-8 border-t border-gray-200 bg-white mt-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-center sm:text-left">
            <p className="text-gray-900 font-extrabold text-lg">VaniLink</p>
            <p className="text-gray-500 text-xs font-medium mt-1">
              Preserving wisdom for future generations.
            </p>
          </div>
          <div className="flex gap-4 sm:gap-6 text-xs sm:text-sm font-semibold text-gray-500">
            <button className="hover:text-purple-600">Guidelines</button>
            <button className="hover:text-purple-600">Archive</button>
            <button className="hover:text-purple-600">Help</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
