const router = require("express").Router();
const ApiKeyService = require("../services/apiKeyService");
const { verifyAccessToken } = require("../middlewares/verifyTokens");

const apiKeyService = new ApiKeyService();

// Получение всех API ключей пользователя
router.get("/", verifyAccessToken, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const keys = await apiKeyService.getAllUserKeys(userId);
    res.json(keys);
  } catch (error) {
    next(error);
  }
});

// Добавление нового API ключа
router.post("/", verifyAccessToken, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { exchangeName, apiKey, apiSecret, nickName } = req.body;

    if (!exchangeName || !apiKey || !apiSecret) {
      return res.status(400).json({
        status: "error",
        message: "Не указаны обязательные поля"
      });
    }

    const newKey = await apiKeyService.saveApiKeys({
      userId,
      exchangeName,
      apiKey,
      apiSecret,
      nickName
    });

    res.status(201).json(newKey);
  } catch (error) {
    next(error);
  }
});

// Обновление API ключа
router.put("/:id", verifyAccessToken, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const keyId = req.params.id;
    const { apiKey, apiSecret, nickName } = req.body;

    const updatedKey = await apiKeyService.updateApiKeys(keyId, userId, {
      apiKey,
      apiSecret,
      nickName
    });

    if (!updatedKey) {
      return res.status(404).json({
        status: "error",
        message: "API ключ не найден"
      });
    }

    res.json(updatedKey);
  } catch (error) {
    next(error);
  }
});

// Удаление API ключа
router.delete("/:id", verifyAccessToken, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const keyId = req.params.id;

    const result = await apiKeyService.deleteApiKey(keyId, userId);

    if (!result) {
      return res.status(404).json({
        status: "error",
        message: "API ключ не найден"
      });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;