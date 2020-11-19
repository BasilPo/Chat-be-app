const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");

  if (!authHeader) {
    req.isAuth = false;
    return next();
  }

  try {
    const decodedToken = jwt.verify(
      authHeader.replace(/^Bearer\s/, ""),
      process.env.JWT_KEY
    );

    req.isAuth = true;
    req.userId = decodedToken.userId;
  } catch (error) {
    req.isAuth = false;
  }

  next();
};
