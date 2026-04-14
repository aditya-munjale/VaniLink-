import React from "react";
import ReactMarkdown from "react-markdown";

export default function PostMeetingSummary({
  isSummarizing,
  summary,
  sessionTitle,
  setSessionTitle,
  handleSaveToLibrary,
  isSaving,
  saveMessage,
  setMeetingEnded,
}) {
  return (
    <div className="min-h-screen flex flex-col items-center p-8 bg-gradient-to-b from-gray-900 to-[#0f111a] font-sans text-white">
      <div className="max-w-3xl w-full bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 shadow-2xl mt-10">
        <h2 className="text-3xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
          Meeting Summary
        </h2>
        <div className="bg-gray-900/50 rounded-xl p-6 min-h-[200px] border border-gray-700">
          {isSummarizing ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4 pt-10 pb-10">
              <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="animate-pulse">
                Gemini AI is analyzing the transcript...
              </p>
            </div>
          ) : (
            <div className="text-gray-200 text-lg leading-relaxed">
              <ReactMarkdown
                components={{
                  strong: ({ node, children, ...props }) => (
                    <span className="font-bold text-purple-300" {...props}>
                      {children}
                    </span>
                  ),
                  ul: ({ node, children, ...props }) => (
                    <ul
                      className="list-disc pl-6 space-y-3 my-4 marker:text-purple-500"
                      {...props}
                    >
                      {children}
                    </ul>
                  ),
                  li: ({ node, children, ...props }) => (
                    <li {...props}>{children}</li>
                  ),
                  h3: ({ node, children, ...props }) => (
                    <h3
                      className="text-2xl font-bold mt-8 mb-3 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400"
                      {...props}
                    >
                      {children}
                    </h3>
                  ),
                  p: ({ node, children, ...props }) => (
                    <p className="mb-4" {...props}>
                      {children}
                    </p>
                  ),
                }}
              >
                {summary}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {!isSummarizing && summary && (
          <div className="mt-8 bg-gray-900/50 p-6 rounded-xl border border-gray-700">
            <h3 className="text-xl font-bold mb-4 text-purple-400">
              Save this Session
            </h3>
            <input
              type="text"
              value={sessionTitle}
              onChange={(e) => setSessionTitle(e.target.value)}
              placeholder="e.g., Team Sync"
              className="w-full px-5 py-3 mb-4 bg-gray-800 border border-gray-600 rounded-xl text-white outline-none focus:ring-2 focus:ring-purple-500"
            />
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleSaveToLibrary}
                disabled={isSaving}
                className="flex-1 bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "📚 Publish to Library"}
              </button>
              <button
                onClick={() => setMeetingEnded(false)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-xl transition-all"
              >
                Return to Lobby
              </button>
            </div>
            {saveMessage && (
              <p
                className={`mt-4 text-center font-bold ${
                  saveMessage.includes("✨") ? "text-green-400" : "text-red-400"
                }`}
              >
                {saveMessage}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
