const router = require("express").Router();
const { verifyAccessToken } = require("../middlewares/verifyTokens");

// Импорт роутеров для API
const authRouter = require("./auth.api.router");
const tokenRouter = require("./token.api.router"); 
const bybitRouter = require("./byBit.api.router");
const binanceRouter = require("./binance.api.router");
const exchangeKeysRouter = require("./exchangeKeys.api.router");

// Публичные маршруты - не требуют авторизации
router.use("/auth", authRouter); // Регистрация, вход, выход
router.use("/token", tokenRouter); // Обновление токенов

// Защищенные маршруты - требуют валидный access token
router.use("/bybit", verifyAccessToken, bybitRouter); // Bybit API
router.use("/binance", verifyAccessToken, binanceRouter); // Binance API
router.use("/exchange-keys", verifyAccessToken, exchangeKeysRouter)

module.exports = router;