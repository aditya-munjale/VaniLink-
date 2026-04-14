import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {
  
  const token =
    req.headers.authorization?.split(" ")[1] ||
    req.query.token ||
    req.body.token;

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
   
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your_super_secret_key",
    );

    
    req.user = decoded;

   
    next();
  } catch (e) {
    return res.status(401).json({ message: "Token is not valid" });
  }
};
