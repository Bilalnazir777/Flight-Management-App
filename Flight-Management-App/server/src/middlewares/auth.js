const jwt = require("jsonwebtoken");
const { getUserById } = require("../services/authServices");

//this function will handle the admin functionality
const authorization = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ success: false, message: "404: you cant access this route" });
    }
    next();
  };
};

//this function will verify that user exist in database
const authentication = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      let user = await getUserById(decoded.id);
      req.user = user;
      next();
    } catch (error) {
      res.status(401).json({
        success: false,
        message: "authentication error , token expired/renew",
      });
    }
  }
  if (!token) {
    res
      .status(401)
      .json({ success: false, message: "authorized failed, provide token" });
  }
};

module.exports = { authentication, authorization };
