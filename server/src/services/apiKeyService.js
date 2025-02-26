const { encrypt, decrypt } = require('../utils/encryption');
const db = require('../../db/models');

class ApiKeyService {
  // Сохранение новых API ключей
  async saveApiKeys(data) {
    const { encrypted: encryptedKey, iv: keyIv, authTag: keyAuthTag } = encrypt(data.apiKey);
    const { encrypted: encryptedSecret, iv: secretIv, authTag: secretAuthTag } = encrypt(data.apiSecret);

    return await db.ExchangeApiKeys.create({
      userId: data.userId,
      exchangeName: data.exchangeName,
      apiKey: encryptedKey,
      apiKeyIv: keyIv,
      apiKeyAuthTag: keyAuthTag,
      apiSecret: encryptedSecret,
      apiSecretIv: secretIv,
      apiSecretAuthTag: secretAuthTag,
      nickName: data.nickName,
      isActive: true
    });
  }

  // Получение API ключей для конкретной биржи
  async getApiKeys(userId, exchangeName) {
    const keys = await db.ExchangeApiKeys.findOne({
      where: { 
        userId,
        exchangeName,
        isActive: true
      }
    });

    if (!keys) return null;

    return {
      apiKey: decrypt(keys.apiKey, keys.apiKeyIv, keys.apiKeyAuthTag),
      apiSecret: decrypt(keys.apiSecret, keys.apiSecretIv, keys.apiSecretAuthTag)
    };
  }

  // Получение всех API ключей пользователя
  async getAllUserKeys(userId) {
    return await db.ExchangeApiKeys.findAll({
      where: { 
        userId,
        isActive: true
      },
      attributes: ['id', 'exchangeName', 'nickName', 'createdAt', 'updatedAt']
    });
  }

  // Обновление API ключей
  async updateApiKeys(keyId, userId, data) {
    const key = await db.ExchangeApiKeys.findOne({
      where: { 
        id: keyId,
        userId,
        isActive: true
      }
    });

    if (!key) return null;

    const updates = {};
    
    if (data.apiKey) {
      const { encrypted: encryptedKey, iv: keyIv, authTag: keyAuthTag } = encrypt(data.apiKey);
      Object.assign(updates, {
        apiKey: encryptedKey,
        apiKeyIv: keyIv,
        apiKeyAuthTag: keyAuthTag
      });
    }

    if (data.apiSecret) {
      const { encrypted: encryptedSecret, iv: secretIv, authTag: secretAuthTag } = encrypt(data.apiSecret);
      Object.assign(updates, {
        apiSecret: encryptedSecret,
        apiSecretIv: secretIv,
        apiSecretAuthTag: secretAuthTag
      });
    }

    if (data.nickName) {
      updates.nickName = data.nickName;
    }

    await key.update(updates);
    return key;
  }

  // Удаление API ключей (soft delete)
  async deleteApiKey(keyId, userId) {
    const result = await db.ExchangeApiKeys.update(
      { isActive: false },
      { 
        where: { 
          id: keyId,
          userId,
          isActive: true
        }
      }
    );
    return result[0] > 0;
  }
}

module.exports = ApiKeyService;