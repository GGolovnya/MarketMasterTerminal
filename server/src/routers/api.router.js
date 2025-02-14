const router = require("express").Router();
const authRouter = require("./auth.api.router");
const tokenRouter = require("./token.api.router");

router.use("/auth", authRouter);
router.use("/token", tokenRouter);

module.exports = router;