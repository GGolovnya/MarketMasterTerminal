const jwt = require("jsonwebtoken");

const verifyRefreshToken = (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      console.warn("Refresh token потерян");
      return res.status(401).json({ message: "Refresh token is required" });
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    req.user = decoded.user;
    next();
  } catch (error) {
    console.error("Ошибка проверки refresh token:", error);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Refresh token expired" });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token signature" });
    }
    res.status(401).json({ message: "Invalid refresh token" });
  }
};

const verifyAccessToken = (req, res, next) => {
  console.log('Headers:', req.headers); // Добавлен лог заголовков
  console.log('Authorization:', req.headers.authorization); // Добавлен лог токена
  
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.warn("Authorization header is missing or invalid");
      return res.status(401).json({ message: "Authorization header is invalid" });
    }

    const accessToken = authHeader.split(" ")[1];
    if (!accessToken) {
      return res.status(401).json({ message: "Access token is missing" });
    }

    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    console.log('Decoded token:', decoded); // Добавлен лог расшифрованного токена
    req.user = decoded.user;
    next();
  } catch (error) {
    console.error("Ошибка проверки access token:", error);
    console.log('Token verification error details:', error); // Добавлен детальный лог ошибки

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Access token expired" });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token signature" });
    }
    res.status(401).json({ message: "Invalid access token" });
  }
};

const verifyAdmin = (req, res, next) => {
  try {
    if (!res.locals.user || res.locals.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    next();
  } catch (error) {
    console.error(error);
    res.status(403).json({ message: 'Admin verification failed' });
  }
};

module.exports = { verifyAccessToken, verifyRefreshToken , verifyAdmin};