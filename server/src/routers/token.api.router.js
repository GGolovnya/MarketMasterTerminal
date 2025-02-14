const router = require("express").Router();
const { verifyRefreshToken } = require("../middlewares/verifyTokens");
const generateToken = require("../utils/generateToken");
const cookieConfig = require("../configs/cookieConfig");
const { User } = require("../../db/models");

router.get("/refresh", verifyRefreshToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    const plainUser = user.get();
    delete plainUser.password;

    const { accessToken, refreshToken } = generateToken({ user: plainUser });

    res
      .cookie("refreshToken", refreshToken, cookieConfig.refresh)
      .json({ user: plainUser, accessToken });
  } catch (error) {
    console.error("Ошибка при обновлении токенов:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

module.exports = router;
