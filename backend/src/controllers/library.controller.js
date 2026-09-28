import { Summary } from "../models/summary.model.js";
import agenda from "../jobs/agenda.js";

// 1. Save a new summary to the database
export const saveSummary = async (req, res) => {
  try {
    // Extract meetingCode sent from the updated frontend
    const { title, content, meetingCode } = req.body;

    if (!content) {
      return res
        .status(400)
        .json({ message: "Content is required to save a summary." });
    }

    const newSummary = new Summary({ title, content });
    await newSummary.save(); 

    // --- NEW: Trigger the email agent after successful save ---
    if (meetingCode) {
      await agenda.now("send-summary-email", {
        meetingCode: meetingCode,
        summaryText: content, // This is the final, edited text from the counselor
        counselorName: req.user?.name,
      });
      console.log(
        `[LibraryController] Post-publish emails triggered for ${meetingCode}`,
      );
    }

    res
      .status(201)
      .json({
        message: "Summary saved to library and emails dispatched!",
        summary: newSummary,
      });
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({ message: "Failed to save summary." });
  }
};

// 2. Fetch all past summaries to display on the page
export const getAllSummaries = async (req, res) => {
  try {
    // .sort({ date: -1 }) ensures the newest readings show up at the very top of the page!
    const summaries = await Summary.find().sort({ date: -1 });
    res.status(200).json(summaries);
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({ message: "Failed to fetch summaries." });
  }
};

// 3. Delete a summary from the database
export const deleteSummary = async (req, res) => {
  try {
    const { id } = req.params;
    await Summary.findByIdAndDelete(id);
    res.status(200).json({ message: "Summary deleted successfully" });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ message: "Failed to delete summary." });
  }
};

// 4. Update an existing summary
export const updateSummary = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    const updatedSummary = await Summary.findByIdAndUpdate(
      id,
      { title, content },
      { new: true }, // This tells MongoDB to return the newly updated document
    );

    if (!updatedSummary) {
      return res.status(404).json({ message: "Summary not found." });
    }

    res.status(200).json({
      message: "Summary updated successfully",
      summary: updatedSummary,
    });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ message: "Failed to update summary." });
  }
};
