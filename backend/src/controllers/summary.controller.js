import { GoogleGenerativeAI } from "@google/generative-ai";

const generateSummary = async (req, res) => {
  const { transcript } = req.body; // 1. Edge Case: What if nobody spoke?

  if (!transcript || transcript.trim() === "") {
    return res
      .status(400)
      .json({ message: "No conversation was recorded to summarize." });
  }

  try {
    // 2. Initialize the AI using your secret key
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY); // Note: If 2.5-flash continues to throw 503 errors frequently, consider changing this to "gemini-1.5-flash"

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); // 3. The Smart Prompt

    const prompt = `
      You are an expert meeting assistant for a community book reading group. 
      Read the following raw transcript and summarize it. 

      CRITICAL RULE 1 (THE ESCAPE HATCH): If the transcript is extremely short (under 30 words), just random greetings, or clearly a microphone test, DO NOT invent a summary. DO NOT apologize. Simply output EXACTLY this text and nothing else:
      "🎙️ This appears to be a brief audio test or a very short session. No major topics were recorded."
      
      CRITICAL RULE 2 (CONCISENESS): If it is a real meeting, provide a crisp, highly accurate summary. Do not use fluffy AI filler words (like "delve", "tapestry", "beautifully"). Be concise so people can quickly capture the essence of the meeting, but do not leave out the core philosophies discussed.

      If it is a real meeting, format your response EXACTLY like this:

      ### 🎯 The Essence
      [Write 2 to 3 clear sentences summarizing the main theme of the discussion so an absent member instantly knows what they missed.]

      ### 🗣️ Key Points & Philosophies
      * [Use concise bullet points to list the actual topics, verses, or stories discussed.]
      * [Extract real details from the transcript. Do not invent details to fill space.]

      ### ✅ Action Items
      * [List any specific tasks, homework, or reading assignments given to people.]
      * [If no tasks were mentioned, just write: "No specific action items recorded today."]

      ### 🙏 Where We Left Off
      [Write 1 natural sentence about where the reading stopped and a brief welcoming thought for next time.]

      Here is the transcript to summarize:
      "${transcript}"
    `;

    let summaryText = "";
    let attempt = 0;
    const maxRetries = 3; // 4. Send it to the AI brain (With Retry Logic for 503 Traffic Spikes)

    while (attempt < maxRetries) {
      try {
        const result = await model.generateContent(prompt);
        summaryText = result.response.text();
        break; // Success! Break out of the retry loop
      } catch (apiError) {
        attempt++;
        console.warn(`AI Attempt ${attempt} failed: ${apiError.message}`);
        if (attempt >= maxRetries) throw apiError; // Out of retries, send to catch block
        // Wait 1 second, then 2 seconds before trying again
        await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
      }
    } // 5. Send the clean, beautifully formatted summary back to the frontend

    res.status(200).json({ summary: summaryText });
  } catch (error) {
    console.error("AI Error:", error); // Graceful handling for 503 so the frontend can display a clean message
    if (error.status === 503) {
      return res.status(503).json({
        message:
          "Google AI is currently experiencing high demand. Please try summarizing again in a minute.",
      });
    }
    res.status(500).json({ message: "Failed to generate AI summary." });
  }
};

export { generateSummary };
