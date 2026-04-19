import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { LiveKitRoom } from "@livekit/components-react";
import "@livekit/components-styles";

import MeetingLobby from "../components/MeetingLobby";
import ActiveRoomFeatures from "../components/ActiveRoomFeatures";
import PostMeetingSummary from "../components/PostMeetingSummary";
import { formatTranscript } from "../utils/formatTranscript";

export default function VideoMeetComponent() {
  const { url } = useParams();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [roomName, setRoomName] = useState(url || "");
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [sessionTitle, setSessionTitle] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const [meetingEnded, setMeetingEnded] = useState(false);
  const [summary, setSummary] = useState(null);
  const [isSummarizing, setIsSummarizing] = useState(false);

  const liveKitUrl = "wss://conferax-2-aoyhzsu3.livekit.cloud";

  const handleJoin = async () => {
    if (!username.trim() || !roomName.trim()) {
      setError("Please enter your name and room code.");
      return;
    }
    try {
      setIsLoading(true);
      setError("");
      const response = await fetch(
        "https://vanilink-backend.onrender.com/api/v1/livekit/getToken",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ roomName, participantName: username }),
        },
      );
      const data = await response.json();
      if (response.ok) {
        setToken(data.token);
        setMeetingEnded(false);
        setSummary(null);
      } else {
        setError(data.message || "Failed to get token");
      }
    } catch (err) {
      setError("Could not connect to server.");
    } finally {
      setIsLoading(false);
    }
  };

  const triggerMeetingSummary = async (finalTranscript) => {
    const cleanScript = formatTranscript(finalTranscript);
    setMeetingEnded(true);

    setTimeout(() => {
      setToken("");
    }, 300);

    if (!cleanScript || cleanScript.trim() === "") {
      setSummary("🎙️ No conversation was recorded during this session.");
      setIsSummarizing(false);
      return;
    }

    setIsSummarizing(true);
    try {
      const response = await fetch(
        "https://vanilink-backend.onrender.com/api/v1/meetings/summary",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ transcript: cleanScript }),
        },
      );

      const data = await response.json();
      if (response.ok) {
        setSummary(data.summary);
      } else {
        setSummary("Failed to generate summary: " + data.message);
      }
    } catch (err) {
      setSummary("Error connecting to the AI server.");
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleSaveToLibrary = async () => {
    if (!sessionTitle.trim()) {
      setSaveMessage("Please enter a title for this reading session!");
      return;
    }
    setIsSaving(true);
    setSaveMessage("");
    try {
      const response = await fetch(
        "https://vanilink-backend.onrender.com/api/v1/library/save",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: sessionTitle, content: summary }),
        },
      );
      if (response.ok) {
        setSaveMessage("✨ Successfully saved to the Community Library!");
      } else {
        setSaveMessage("Failed to save. Please try again.");
      }
    } catch (err) {
      setSaveMessage("Error connecting to the database.");
    } finally {
      setIsSaving(false);
    }
  };

  // --- RENDER LOGIC ---

  if (meetingEnded) {
    return (
      <PostMeetingSummary
        isSummarizing={isSummarizing}
        summary={summary}
        sessionTitle={sessionTitle}
        setSessionTitle={setSessionTitle}
        handleSaveToLibrary={handleSaveToLibrary}
        isSaving={isSaving}
        saveMessage={saveMessage}
        setMeetingEnded={setMeetingEnded}
      />
    );
  }

  if (token === "") {
    return (
      <MeetingLobby
        username={username}
        setUsername={setUsername}
        roomName={roomName}
        setRoomName={setRoomName}
        handleJoin={handleJoin}
        isLoading={isLoading}
        error={error}
      />
    );
  }

  return (
    <div
      style={{
        height: "100vh",
        backgroundColor: "#0f111a",
        position: "relative",
      }}
    >
      <LiveKitRoom
        video={true}
        audio={true}
        token={token}
        serverUrl={liveKitUrl}
        data-lk-theme="default"
        style={{ height: "100%" }}
        onDisconnected={() => navigate("/home")}
      >
        <ActiveRoomFeatures onMeetingEnd={triggerMeetingSummary} />
      </LiveKitRoom>
    </div>
  );
}
