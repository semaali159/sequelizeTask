const jwt = require("jsonwebtoken");

// Verify Token
function verifyToken(req, res, next) {
  const authToken = req.headers.authorization;
  if (authToken) {
    const token = authToken.split(" ")[1];
    try {
      const decodedPayload = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decodedPayload;
      next();
    } catch (error) {
      return res.status(401).json({ message: "invalid token, access denied" });
    }
  } else {
    return res
      .status(401)
      .json({ message: "no token provided, access denied" });
  }
}

// Verify Token & Admin
function verifyTokenAndAdmin(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.role == "admin") {
      next();
    } else {
      return res.status(403).json({ message: "not allowed, only admin" });
    }
  });
}
// Verify Token & Buyer
function verifyTokenAndBuyer(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.role == "buyer") {
      next();
    } else {
      return res.status(403).json({ message: "not allowed, only buyer" });
    }
  });
}
// Verify Token & Buyer
function verifyTokenAndCustomer(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.role == "customer") {
      next();
    } else {
      return res.status(403).json({ message: "not allowed, only customer" });
    }
  });
}

module.exports = {
  verifyToken,
  verifyTokenAndAdmin,
  verifyTokenAndCustomer,
  verifyTokenAndBuyer,
};
