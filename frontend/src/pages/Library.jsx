import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete"; // <-- Import the trash icon

export default function Library() {
  const [summaries, setSummaries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSummaries = async () => {
      try {
        const response = await fetch(
          "http://vanilink-backend.onrender.com/api/v1/library/all",
        );
        const data = await response.json();
        setSummaries(data);
      } catch (error) {
        console.error("Failed to fetch library", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSummaries();
  }, []);

  // --- INSTANT DELETE FUNCTION ---
  const handleDelete = async (id) => {
    // Popup removed!

    try {
      const response = await fetch(
        `http://vanilink-backend.onrender.com/api/v1/library/${id}`,
        {
          method: "DELETE",
        },
      );

      if (response.ok) {
        setSummaries(summaries.filter((session) => session._id !== id));
      } else {
        console.error("Failed to delete summary.");
      }
    } catch (error) {
      console.error("Error deleting summary:", error);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-[#0f111a] p-8 text-white font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-10 border-b border-gray-700 pb-6">
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
            Community Reading Library
          </h1>
          <Link
            to="/"
            className="px-5 py-2 bg-gray-800 hover:bg-gray-700 rounded-xl font-bold transition-all border border-gray-600"
          >
            Back to Home
          </Link>
        </div>

        {isLoading && (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {!isLoading && summaries.length === 0 && (
          <div className="text-center py-20 bg-gray-800/50 rounded-3xl border border-gray-700">
            <h2 className="text-2xl font-bold text-gray-400">
              No reading sessions saved yet.
            </h2>
            <p className="text-gray-500 mt-2">
              Host a meeting and publish a summary to see it here!
            </p>
          </div>
        )}

        <div className="space-y-8">
          {!isLoading &&
            summaries.map((session) => (
              <div
                key={session._id}
                className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-3xl p-8 shadow-xl hover:border-purple-500/30 transition-all relative group"
              >
                {/* --- NEW DELETE BUTTON --- */}
                <button
                  onClick={() => handleDelete(session._id)}
                  className="absolute top-6 right-6 p-2 bg-gray-900/50 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                  title="Delete Summary"
                >
                  <DeleteIcon />
                </button>
                {/* ------------------------- */}

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pr-12">
                  <h2 className="text-2xl font-bold text-purple-300">
                    {session.title}
                  </h2>
                  <span className="text-sm font-medium text-gray-400 bg-gray-900 px-3 py-1 rounded-full mt-2 sm:mt-0">
                    {new Date(session.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>

                <div className="text-gray-300 text-lg leading-relaxed">
                  <ReactMarkdown
                    components={{
                      strong: ({ node, ...props }) => (
                        <span className="font-bold text-white" {...props} />
                      ),
                      ul: ({ node, ...props }) => (
                        <ul
                          className="list-disc pl-6 space-y-2 my-4 marker:text-purple-500"
                          {...props}
                        />
                      ),
                      h3: ({ node, ...props }) => (
                        <h3
                          className="text-xl font-bold mt-6 mb-2 text-indigo-300"
                          {...props}
                        />
                      ),
                    }}
                  >
                    {session.content}
                  </ReactMarkdown>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
