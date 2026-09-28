import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const router = useNavigate();
  const [isFeaturesOpen, setIsFeaturesOpen] = useState(false);

  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();

    // Calculate cursor position relative to the card's center
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate rotation (-10 and 10 represent maximum tilt degrees)
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setTilt({ x: 0, y: 0 }); // Reset to flat
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden flex flex-col font-sans">
      {/* Navigation */}
      <nav className="px-4 py-4 sm:px-6 lg:px-8 bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* LEFT SIDE: Logo Only */}
          <div
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-200">
              <svg
                className="w-5 h-5 text-white"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M21.75 2.25L12 19.5 2.25 2.25h4.5L12 12l5.25-9.75h4.5z" />
              </svg>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
              VaniLink
            </h2>
          </div>

          {/* RIGHT SIDE: Links & Buttons Grouped */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            {/* Nav Links (Hidden on mobile) */}
            <div className="hidden md:flex items-center space-x-2 mr-4">
              <button
                onClick={() => scrollToSection("about")}
                className="text-gray-600 font-bold hover:text-indigo-600 transition-colors duration-300 px-4 py-2 text-sm rounded-lg hover:bg-indigo-50"
              >
                About
              </button>

              {/* Zoom-Style Features Dropdown */}
              <div
                className="relative group"
                onMouseEnter={() => setIsFeaturesOpen(true)}
                onMouseLeave={() => setIsFeaturesOpen(false)}
              >
                <button
                  onClick={() => scrollToSection("features")}
                  className="flex items-center space-x-1 text-gray-600 font-bold hover:text-indigo-600 transition-colors duration-300 px-4 py-2 text-sm rounded-lg hover:bg-indigo-50"
                >
                  <span>Features</span>
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${isFeaturesOpen ? "rotate-180 text-indigo-600" : "text-gray-400"}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Dropdown Menu Content */}
                <div
                  className={`absolute top-full left-0 mt-1 w-60 bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-gray-100 py-2 transition-all duration-200 origin-top-left ${isFeaturesOpen ? "opacity-100 scale-100 visible pointer-events-auto" : "opacity-0 scale-95 invisible pointer-events-none"}`}
                >
                  <div className="flex flex-col">
                    <button
                      onClick={() => scrollToSection("features")}
                      className="text-left px-5 py-2.5 text-sm font-semibold text-gray-700 hover:text-indigo-600 hover:bg-indigo-50/50 transition-colors"
                    >
                      Live Video Conferencing
                    </button>
                    <button
                      onClick={() => scrollToSection("features")}
                      className="text-left px-5 py-2.5 text-sm font-semibold text-gray-700 hover:text-indigo-600 hover:bg-indigo-50/50 transition-colors"
                    >
                      Live AI Transcription
                    </button>
                    <button
                      onClick={() => scrollToSection("features")}
                      className="text-left px-5 py-2.5 text-sm font-semibold text-gray-700 hover:text-indigo-600 hover:bg-indigo-50/50 transition-colors"
                    >
                      AI Wisdom Summaries
                    </button>
                    <button
                      onClick={() => scrollToSection("features")}
                      className="text-left px-5 py-2.5 text-sm font-semibold text-gray-700 hover:text-indigo-600 hover:bg-indigo-50/50 transition-colors"
                    >
                      Counselor Review Editor
                    </button>
                    <button
                      onClick={() => scrollToSection("features")}
                      className="text-left px-5 py-2.5 text-sm font-semibold text-gray-700 hover:text-indigo-600 hover:bg-indigo-50/50 transition-colors"
                    >
                      Automated Devotee Emails
                    </button>
                    <button
                      onClick={() => scrollToSection("features")}
                      className="text-left px-5 py-2.5 text-sm font-semibold text-gray-700 hover:text-indigo-600 hover:bg-indigo-50/50 transition-colors"
                    >
                      Community Library
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => router("/auth")}
              className="text-gray-600 font-bold hover:text-indigo-600 transition-colors duration-300 px-3 py-2 text-sm sm:text-base rounded-lg hover:bg-indigo-50"
            >
              Sign In
            </button>

            <div className="pl-2">
              <button
                onClick={() => {
                  const token = localStorage.getItem("token");
                  if (token) {
                    router("/home");
                  } else {
                    router("/auth");
                  }
                }}
                className="bg-gray-900 hover:bg-gray-800 text-white font-bold px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-base rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                Enter Lobby
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative pt-20 pb-32 lg:pt-32 lg:pb-40 overflow-hidden">
        {/* Premium Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-30 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-300 to-indigo-300 rounded-full blur-[100px] mix-blend-multiply"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
            {/* Left Content */}
            <div className="lg:w-1/2 text-center lg:text-left flex flex-col items-center lg:items-start">
              <div className="inline-flex items-center space-x-2 bg-purple-100 px-3 py-1 rounded-full mb-6">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-600"></span>
                </span>
                <span className="text-xs font-bold text-purple-800 uppercase tracking-wider">
                  Built for Devotee Communities
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-gray-900 leading-[1.1] mb-6 tracking-tight">
                Preserve the Wisdom of Your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
                  Online Sanga.
                </span>
              </h1>

              <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-lg font-medium leading-relaxed">
                Host live reading sessions of Srimad Bhagavatam, capture the
                divine nectar in real-time, and let AI distill the philosophy
                into a searchable library.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <button
                  onClick={() => router("/auth")}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg hover:shadow-purple-500/30 text-center text-lg flex items-center justify-center transform hover:-translate-y-1"
                >
                  Start a Reading Session
                </button>
                <button
                  onClick={() => scrollToSection("about")}
                  className="bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-800 font-bold px-8 py-4 rounded-xl transition-all text-center text-lg flex items-center justify-center"
                >
                  Learn More
                </button>
              </div>
            </div>

            {/* Right Content - Interactive 3D Mouse Tracking Mockup */}
            <div className="lg:w-[60%] w-full flex justify-center lg:justify-end mt-12 lg:mt-0 perspective-1000">
              <div
                className="relative w-full max-w-3xl mx-auto cursor-pointer"
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={handleMouseLeave}
                // Basic touch support for mobile
                onTouchMove={(e) => handleMouseMove(e.touches[0])}
                onTouchStart={() => setIsHovering(true)}
                onTouchEnd={handleMouseLeave}
              >
                {/* 1. Dynamic Background Glow */}
                <div
                  className={`absolute -inset-2 bg-gradient-to-r from-purple-600 via-indigo-500 to-fuchsia-500 rounded-[2rem] blur-xl transition-opacity duration-500 ${
                    isHovering ? "opacity-40" : "opacity-20 animate-pulse"
                  }`}
                ></div>

                {/* 2. 3D Floating Image Container reacting to React State */}
                <div
                  className="relative rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.3)] border border-gray-100/50 overflow-hidden bg-white"
                  style={{
                    transform: isHovering
                      ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.02, 1.02, 1.02)`
                      : "rotateX(2deg) rotateY(-4deg) scale3d(1, 1, 1)", // Default resting tilt
                    transition: isHovering
                      ? "transform 0.1s ease-out"
                      : "transform 0.7s ease-out",
                  }}
                >
                  {/* 3. The Actual Mockup Image */}
                  <img
                    src="/images/mockup.jpg"
                    alt="VaniLink AI Meeting Interface"
                    className="w-full h-auto object-cover"
                  />

                  {/* 4. Dynamic Glare Effect that follows the mouse */}
                  <div
                    className="absolute inset-0 pointer-events-none mix-blend-overlay"
                    style={{
                      background: `radial-gradient(circle at ${isHovering ? tilt.y * 5 + 50 : 50}% ${isHovering ? tilt.x * 5 + 50 : 50}%, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 60%)`,
                      opacity: isHovering ? 1 : 0,
                      transition:
                        "opacity 0.3s ease-out, background 0.1s ease-out",
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* About Section */}
      <section id="about" className="py-24 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-indigo-600 font-bold tracking-wide uppercase text-sm mb-3">
              The Mission
            </h2>
            <h3 className="text-3xl md:text-4xl font-black text-gray-900 mb-6 tracking-tight">
              Focus on Shravanam. <br /> Let AI take the notes.
            </h3>
            <p className="text-lg text-gray-600 font-medium leading-relaxed">
              VaniLink is designed specifically for online devotee gatherings.
              We remove the distraction of taking notes so participants can
              fully immerse in hearing (Shravanam) the spiritual subject matter,
              knowing the essence is being safely archived.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="group relative bg-slate-50/60 hover:bg-white p-8 rounded-3xl border border-gray-200/80 hover:border-purple-300 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-inner group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300">
                🪷
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">
                Host Gatherings
              </h4>
              <p className="text-gray-600 font-medium text-sm leading-relaxed">
                Counselors open dedicated, high-quality video rooms tailored for
                seamless, focused reading sessions.
              </p>
              <div className="mt-6 w-8 h-1 bg-transparent group-hover:bg-purple-500 rounded-full transition-all duration-300"></div>
            </div>

            {/* Card 2 */}
            <div className="group relative bg-slate-50/60 hover:bg-white p-8 rounded-3xl border border-gray-200/80 hover:border-indigo-300 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-inner group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                🧠
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">
                Extract Wisdom
              </h4>
              <p className="text-gray-600 font-medium text-sm leading-relaxed">
                The AI listens silently in real-time and drafts an accurate,
                structured summary of the philosophy discussed.
              </p>
              <div className="mt-6 w-8 h-1 bg-transparent group-hover:bg-indigo-500 rounded-full transition-all duration-300"></div>
            </div>

            {/* Card 3 */}
            <div className="group relative bg-slate-50/60 hover:bg-white p-8 rounded-3xl border border-gray-200/80 hover:border-fuchsia-300 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-fuchsia-100 text-fuchsia-600 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-inner group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300">
                📚
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-fuchsia-600 transition-colors">
                Preserve & Share
              </h4>
              <p className="text-gray-600 font-medium text-sm leading-relaxed">
                Counselors refine the notes, save them to the Community Library,
                and automatically email them to all devotees.
              </p>
              <div className="mt-6 w-8 h-1 bg-transparent group-hover:bg-fuchsia-500 rounded-full transition-all duration-300"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bento Box */}
      <section id="features" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
              Everything a Counselor Needs
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 - Large */}
            <div className="col-span-1 md:col-span-2 bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center text-xl mb-6">
                🎥
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Dedicated Reading Rooms
              </h3>
              <p className="text-gray-600 font-medium max-w-md">
                Seamless, low-latency LiveKit video integration ensures your
                voice is heard clearly, whether you are reading from the
                physical book or leading a discussion.
              </p>
            </div>

            {/* Feature 2 - Small */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center text-xl mb-6">
                ✍️
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Counselor Review
              </h3>
              <p className="text-gray-600 font-medium text-sm">
                A built-in editor allows Counselors to correct complex Sanskrit
                terminology before publishing.
              </p>
            </div>

            {/* Feature 3 - Small */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 bg-fuchsia-100 text-fuchsia-600 rounded-xl flex items-center justify-center text-xl mb-6">
                📩
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Automated Dispatch
              </h3>
              <p className="text-gray-600 font-medium text-sm">
                One click instantly routes beautifully formatted HTML summaries
                to the inbox of every registered devotee.
              </p>
            </div>

            {/* Feature 4 - Large */}
            <div className="col-span-1 md:col-span-2 bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
              <div className="absolute right-0 bottom-0 opacity-10 text-9xl transform translate-x-4 translate-y-4">
                📖
              </div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-gray-700 text-white rounded-xl flex items-center justify-center text-xl mb-6">
                  🏛️
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  The Community Library
                </h3>
                <p className="text-gray-300 font-medium max-w-md">
                  A centralized, searchable archive of all past sessions.
                  Devotees who missed the live class can easily catch up on the
                  verses and philosophies discussed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-12 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start space-x-2 mb-2">
              <div className="w-6 h-6 bg-gradient-to-br from-purple-600 to-indigo-600 rounded flex items-center justify-center">
                <span className="text-white text-xs font-black">V</span>
              </div>
              <p className="text-gray-900 font-extrabold text-lg">VaniLink</p>
            </div>
            <p className="text-gray-500 text-xs font-medium">
              Preserving spiritual wisdom for future generations.
            </p>
          </div>
          <div className="flex gap-6 text-sm font-semibold text-gray-500">
            <button
              onClick={() => scrollToSection("about")}
              className="hover:text-purple-600 transition-colors"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection("features")}
              className="hover:text-purple-600 transition-colors"
            >
              Features
            </button>
            <button className="hover:text-purple-600 transition-colors">
              Help
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
