// Look! No imports needed at all. Node.js natively supports fetch!

export const getDeepgramToken = async (req, res) => {
  try {
    const projectId = process.env.DEEPGRAM_PROJECT_ID;
    const apiKey = process.env.DEEPGRAM_API_KEY;

    if (!projectId || !apiKey) {
      return res
        .status(500)
        .json({ message: "Deepgram credentials missing in .env" });
    }

    // We ask Deepgram's REST API directly for a temporary 2-hour key
    const response = await fetch(
      `https://api.deepgram.com/v1/projects/${projectId}/keys`,
      {
        method: "POST",
        headers: {
          Authorization: `Token ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          comment: "ConferaX Temp Key",
          scopes: ["usage:write"],
          time_to_live_in_seconds: 7200, // Destroys itself after 2 hours
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to generate key: ${response.statusText}`);
    }

    const data = await response.json();

    // Deepgram sends back the temporary key inside data.key
    res.status(200).json({ key: data.key });
  } catch (error) {
    console.error("Deepgram Token Error:", error);
    res.status(500).json({ message: "Failed to generate Deepgram token" });
  }
};
