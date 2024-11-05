import jwt from "jsonwebtoken";

function verifyAdmin(req, res, next) {
  const token = req.header("Authorization");

  if (!token) return res.status(401).json({ error: "Access denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded?.role === "superadmin") next();
    return res.status(403).json({ message: "Insufficient privileges" });
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
}

export default verifyAdmin;
