const router = require("express").Router();
const crypto = require('crypto');
const logger = require('../configs/logger');
const checkBybitResources = require('../middlewares/checkResourceByBit');
const ApiKeyService = require("../services/apiKeyService");
const { decrypt } = require("../utils/encryption");
const bybitGenerateSignature = require('../utils/signatures/bybit/bybitGenerateSignature');

const BASE_URL = 'https://api.bybit.com';
const apiKeyService = new ApiKeyService();

const makeBybitRequest = async (apiKey, apiSecret, endpoint, params = {}) => {
  const { signature, timestamp, queryString } = bybitGenerateSignature(apiKey, apiSecret, params);
  
  const headers = {
    'X-BAPI-API-KEY': apiKey,
    'X-BAPI-SIGN': signature,
    'X-BAPI-TIMESTAMP': timestamp.toString()
  };

  logger.info('Making Bybit API request', { endpoint, params });

  const response = await fetch(`${BASE_URL}${endpoint}?${queryString}`, {
    method: 'GET',
    headers
  });

  if (!response.ok) {
    logger.error('Bybit API HTTP error', { 
      status: response.status,
      endpoint,
      params 
    });
    const error = new Error(`HTTP error! status: ${response.status}`);
    error.name = 'ServerError';
    throw error;
  }

  const data = await response.json();
  
  if (data.retCode !== 0) {
    logger.error('Bybit API response error', {
      retCode: data.retCode,
      retMsg: data.retMsg,
      endpoint,
      params
    });
    const error = new Error(data.retMsg || 'API error');
    error.name = 'ServerError';
    throw error;
  }

  logger.info('Bybit API request successful', { endpoint });
  return data;
};

router.get('/balance', async (req, res, next) => {
  try {
    const userId = req.user.id;
    logger.info('Fetching Bybit balance', { userId });
    
    const keys = await apiKeyService.getApiKeys(userId, 'bybit');
    
    if (!keys) {
      logger.warn('Bybit API keys not found', { userId });
      const error = new Error('API ключи Bybit не найдены');
      error.name = 'ValidationError';
      throw error;
    }

    const apiKey = decrypt(keys.apiKey, keys.apiKeyIv, keys.apiKeyAuthTag);
    const apiSecret = decrypt(keys.apiSecret, keys.apiSecretIv, keys.apiSecretAuthTag);

    const resourceStatus = await checkBybitResources();
    if (!resourceStatus.status) {
      logger.error('Bybit API access error', { 
        userId,
        message: resourceStatus.message 
      });
      return res.status(503).json({
        status: 'error',
        message: resourceStatus.message
      });
    }

    const data = await makeBybitRequest(apiKey, apiSecret, '/v5/account/wallet-balance', {
      accountType: 'UNIFIED'
    });
    res.json(data);
  } catch (error) {
    logger.error('Error fetching Bybit balance', {
      userId: req.user.id,
      error: error.message,
      stack: error.stack
    });
    next(error);
  }
});

router.get('/open-orders', async (req, res, next) => {
  try {
    const userId = req.user.id;
    logger.info('Fetching Bybit open orders', { userId });
    
    const keys = await apiKeyService.getApiKeys(userId, 'bybit');
    
    if (!keys) {
      logger.warn('Bybit API keys not found', { userId });
      const error = new Error('API ключи Bybit не найдены');
      error.name = 'ValidationError';
      throw error;
    }

    const apiKey = decrypt(keys.apiKey, keys.apiKeyIv, keys.apiKeyAuthTag);
    const apiSecret = decrypt(keys.apiSecret, keys.apiSecretIv, keys.apiSecretAuthTag);

    const resourceStatus = await checkBybitResources();
    if (!resourceStatus.status) {
      logger.error('Bybit API access error', {
        userId,
        message: resourceStatus.message
      });
      return res.status(503).json({
        status: 'error',
        message: resourceStatus.message
      });
    }

    const data = await makeBybitRequest(apiKey, apiSecret, '/v5/order/realtime', {
      category: 'spot',
      limit: 50
    });
    res.json(data);
  } catch (error) {
    logger.error('Error fetching Bybit open orders', {
      userId: req.user.id,
      error: error.message,
      stack: error.stack
    });
    next(error);
  }
});

module.exports = router;