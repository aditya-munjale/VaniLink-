import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function LandingPage() {
  const router = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 overflow-hidden">
      {/* Navigation */}
      <nav className="px-4 py-4 sm:px-6 lg:px-8 bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-purple-200">
              <span className="font-black text-white text-xl">V</span>
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
              VaniLink
            </h2>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={() => router("/auth")}
              className="text-gray-600 font-semibold hover:text-purple-600 transition-colors duration-300 px-4 py-2 text-sm sm:text-base rounded-lg hover:bg-purple-50"
            >
              Sign In
            </button>
            <button
              onClick={() => router("/auth")}
              className="bg-gray-900 hover:bg-gray-800 text-white font-bold px-5 py-2.5 text-sm sm:text-base rounded-xl transition-all shadow-md"
            >
              Enter Lobby
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="px-4 sm:px-6 lg:px-8 py-12 lg:py-24 relative">
       
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-20 right-10 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">
            {/* Left Content */}
            <div className="lg:w-1/2 text-center lg:text-left order-1 lg:order-1 flex flex-col items-center lg:items-start">
              {/* <div className="inline-block px-4 py-1.5 rounded-full bg-indigo-100 text-indigo-700 font-bold text-sm mb-6 border border-indigo-200">
                ✨ Powered by Deepgram & Gemini AI
              </div> */}
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-gray-900 leading-[1.1] mb-6 tracking-tight">
                Preserve the Essence of Your{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-fuchsia-600">
                  Gatherings.
                </span>
              </h1>

              <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-lg font-medium leading-relaxed">
                Host live community readings, capture every spoken word in
                real-time, and let AI distill your collective wisdom into a
                searchable library.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Link
                  to={"/auth"}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg shadow-purple-200 hover:shadow-xl text-center text-lg flex items-center justify-center transform hover:-translate-y-1"
                >
                  Start a Reading Session
                </Link>
              </div>

              {/* Features Grid */}
              <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm text-center sm:text-left flex flex-col items-center sm:items-start">
                  <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-4">
                    <span className="text-2xl">🪷</span>
                  </div>
                  <h3 className="font-extrabold text-gray-900 mb-1">
                    Live Video
                  </h3>
                  <p className="text-sm text-gray-500 font-medium">
                    Low-latency connection for seamless group reading.
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm text-center sm:text-left flex flex-col items-center sm:items-start">
                  <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-4">
                    <span className="text-2xl">📝</span>
                  </div>
                  <h3 className="font-extrabold text-gray-900 mb-1">
                    Smart Captions
                  </h3>
                  <p className="text-sm text-gray-500 font-medium">
                    Every voice is transcribed and attributed in real-time.
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm text-center sm:text-left flex flex-col items-center sm:items-start">
                  <div className="w-12 h-12 bg-fuchsia-50 rounded-xl flex items-center justify-center mb-4">
                    <span className="text-2xl">🧠</span>
                  </div>
                  <h3 className="font-extrabold text-gray-900 mb-1">
                    AI Wisdom
                  </h3>
                  <p className="text-sm text-gray-500 font-medium">
                    Automatically extracts core philosophies and actions.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Content - Image Wrapper */}
            <div className="lg:w-1/2 flex justify-center order-2 lg:order-2 w-full">
              <div className="relative w-full max-w-lg lg:max-w-xl xl:max-w-2xl">
                {/* Decorative border frame */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-200 to-indigo-200 rounded-[2rem] transform rotate-3 scale-105 opacity-50 z-0"></div>

                <div className="bg-white rounded-[2rem] p-4 sm:p-6 shadow-2xl border border-white relative z-10 overflow-hidden flex items-center justify-center">
                  <img
                    src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=1000&auto=format&fit=crop"
                    alt="Open book with glowing light representing knowledge"
                    className="w-full h-auto rounded-xl object-cover aspect-[4/3] shadow-inner"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://via.placeholder.com/800x600/9333ea/FFFFFF?text=Community+Library";
                    }}
                  />

                  {/* Floating badges for UI appeal */}
                  <div className="absolute bottom-10 left-10 bg-white/90 backdrop-blur rounded-2xl p-4 shadow-xl flex flex-col hidden sm:flex border border-purple-50 w-48">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Live AI Analysis
                      </span>
                    </div>
                    <p className="text-sm font-bold text-gray-800 leading-tight">
                      "Extracting key verses and action items..."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-4 py-8 border-t border-gray-200 bg-white mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <p className="text-gray-900 font-extrabold text-lg">VaniLink</p>
            <p className="text-gray-500 text-sm font-medium mt-1">
              Preserving spoken wisdom for future generations.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            <button className="text-sm font-semibold text-gray-500 hover:text-purple-600 transition-colors">
              Community Guidelines
            </button>
            <button className="text-sm font-semibold text-gray-500 hover:text-purple-600 transition-colors">
              Library Archive
            </button>
            <button className="text-sm font-semibold text-gray-500 hover:text-purple-600 transition-colors">
              Help
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
