const router = require("express").Router();
const { verifyRefreshToken } = require("../middlewares/verifyTokens");
const generateToken = require("../utils/generateToken");
const cookieConfig = require("../configs/cookieConfig");
const { User } = require("../../db/models");

router.get("/refresh", verifyRefreshToken, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId);

    if (!user) {
      const error = new Error("Пользователь не найден");
      error.name = "NotFoundError";
      return next(error);
    }

    const plainUser = user.get();
    delete plainUser.password;

    const { accessToken, refreshToken } = generateToken({ user: plainUser });

    res
      .cookie("refreshToken", refreshToken, cookieConfig.refresh)
      .json({ user: plainUser, accessToken });
  } catch (error) {
    next(error);
  }
});

module.exports = router;