export const formatTranscript = (rawText) => {
  if (!rawText) return "";
  const lines = rawText.split("\n").filter((line) => line.trim() !== "");
  let formatted = "";
  let currentSpeaker = "";

  lines.forEach((line) => {
    const separatorIndex = line.indexOf(":");
    if (separatorIndex === -1) return;

    const speaker = line.substring(0, separatorIndex).trim();
    const text = line.substring(separatorIndex + 1).trim();

    if (speaker === currentSpeaker) {
      formatted += ` ${text}`;
    } else {
      formatted += `\n\n${speaker}: ${text}`;
      currentSpeaker = speaker;
    }
  });
  return formatted.trim();
};
