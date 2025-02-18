const router = require("express").Router();
const { User } = require("../../db/models");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");
const cookieConfig = require("../configs/cookieConfig");

router.post("/signup", async (req, res, next) => {
  const { username, email, password } = req.body;

  if (!(username && email && password)) {
    const error = new Error("Необходимо заполнить все поля");
    error.name = "ValidationError";
    return next(error);
  }

  try {
    const [user, isCreated] = await User.findOrCreate({
      where: { email },
      defaults: { username, email, password: await bcrypt.hash(password, 10) },
    });

    if (!isCreated) {
      const error = new Error("Такой пользователь существует");
      error.name = "ValidationError";
      return next(error);
    }

    const plainUser = user.get();
    delete plainUser.password;

    const { accessToken, refreshToken } = generateToken({ user: plainUser });
    await user.update({ refreshToken });

    res
      .cookie("refreshToken", refreshToken, cookieConfig.refresh)
      .json({ user: plainUser, accessToken });
  } catch (error) {
    next(error);
  }
});

router.post("/signin", async (req, res, next) => {
  const { email, password } = req.body;

  if (!(email && password)) {
    const error = new Error("Необходимо заполнить все поля");
    error.name = "ValidationError";
    return next(error);
  }

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      const error = new Error("Пользователь не найден");
      error.name = "NotFoundError";
      return next(error);
    }

    const isCorrectPassword = await bcrypt.compare(password, user.password);

    if (!isCorrectPassword) {
      const error = new Error("Некорректный email или пароль");
      error.name = "ValidationError";
      return next(error);
    }

    const plainUser = user.get();
    delete plainUser.password;

    const { accessToken, refreshToken } = generateToken({ user: plainUser });
    await user.update({ refreshToken });

    res
      .cookie("refreshToken", refreshToken, cookieConfig.refresh)
      .json({ user: plainUser, accessToken });
  } catch (error) {
    next(error);
  }
});

router.get("/logout", async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    
    if (refreshToken) {
      const user = await User.findOne({ where: { refreshToken } });
      if (user) {
        await user.update({ refreshToken: null });
      }
    }

    res.clearCookie("refreshToken").sendStatus(200);
  } catch (error) {
    next(error);
  }
});

module.exports = router;