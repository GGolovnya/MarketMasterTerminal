const jwt = require("jsonwebtoken");

const verifyRefreshToken = (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      const error = new Error("Требуется refresh token");
      error.name = "MissingTokenError";
      throw error;
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    req.user = decoded.user;
    next();
  } catch (error) {
    next(error);
  }
};

const verifyAccessToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      const error = new Error("Неверный заголовок авторизации");
      error.name = "AuthHeaderError";
      throw error;
    }

    const accessToken = authHeader.split(" ")[1];
    if (!accessToken) {
      const error = new Error("Отсутствует access token");
      error.name = "MissingTokenError";
      throw error;
    }

    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded.user;
    next();
  } catch (error) {
    next(error);
  }
};

const verifyAdmin = (req, res, next) => {
  try {
    if (!res.locals.user || res.locals.user.role !== 'admin') {
      const error = new Error('Требуются права администратора');
      error.name = 'AdminAccessError';
      throw error;
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { verifyAccessToken, verifyRefreshToken, verifyAdmin };