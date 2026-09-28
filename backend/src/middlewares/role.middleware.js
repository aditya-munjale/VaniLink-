export const verifyAdminOrCounselor = (req, res, next) => {
  // Ensure the user exists (set by your JWT auth middleware earlier in the chain)
  if (!req.user) {
    return res
      .status(401)
      .json({ message: "Unauthorized: No token provided." });
  }

  // Check if the role is allowed
  if (req.user.role === "admin" || req.user.role === "counselor") {
    next(); // Pass control to the controller
  } else {
    return res.status(403).json({
      message:
        "Access denied. Only Admins and Counselors can generate summaries.",
    });
  }
};
