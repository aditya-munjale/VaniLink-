import { Summary } from "../models/summary.model.js";

// 1. Save a new summary to the database
export const saveSummary = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!content) {
      return res
        .status(400)
        .json({ message: "Content is required to save a summary." });
    }

    const newSummary = new Summary({ title, content });
    await newSummary.save(); // Saves to MongoDB

    res
      .status(201)
      .json({ message: "Summary saved to library!", summary: newSummary });
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
