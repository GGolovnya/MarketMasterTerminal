const router = require("express").Router();
const authRouter = require("./auth.api.router");
const tokenRouter = require("./token.api.router");
const balance = require("./balance.api.router.js");

router.use("/auth", authRouter);
router.use("/token", tokenRouter);
router.use("/balance", tokenRouter);

module.exports = router;