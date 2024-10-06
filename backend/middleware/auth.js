import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];

  if (typeof bearerHeader !== "undefined") {
    const token = bearerHeader.split(" ")[1];
    req.token = token;
  }
  try {
    const decoded = jwt.verify(req.token, "jwt-secret-key");
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: err });
  }
};

export { verifyToken };
