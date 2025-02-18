const router = require("express").Router();
const crypto = require('crypto');
const logger = require('../configs/logger');

const API_KEY = process.env.BYBIT_API_KEY;
const API_SECRET = process.env.BYBIT_API_SECRET;
const BASE_URL = 'https://api.bybit.com';

const generateSignature = (params = {}) => {
  const timestamp = Date.now();
  const allParams = {
    ...params,
    api_key: API_KEY,
    timestamp: timestamp.toString()
  };

  const orderedParams = Object.keys(allParams)
    .sort()
    .reduce((obj, key) => {
      obj[key] = allParams[key];
      return obj;
    }, {});

  const queryString = Object.keys(allParams)
    .sort()
    .map(key => `${key}=${allParams[key]}`)
    .join('&');

  const signature = crypto
    .createHmac('sha256', API_SECRET)
    .update(timestamp.toString() + API_KEY + queryString)
    .digest('hex');

  return { signature, timestamp, queryString };
};

const makeBybitRequest = async (endpoint, params = {}) => {
  const { signature, timestamp, queryString } = generateSignature(params);
  
  logger.info('Параметры для подписи:', params);
  logger.info('Сгенерированная строка запроса:', { queryString });
  logger.info('Сгенерированная подпись:', { signature });

  const headers = {
    'X-BAPI-API-KEY': API_KEY,
    'X-BAPI-SIGN': signature,
    'X-BAPI-TIMESTAMP': timestamp.toString()
  };

  logger.info(`Отправка запроса к ${endpoint}`, { headers, params });

  const response = await fetch(`${BASE_URL}${endpoint}?${queryString}`, {
    method: 'GET',
    headers
  });

  if (!response.ok) {
    const error = new Error(`HTTP error! status: ${response.status}`);
    error.name = 'ServerError';
    throw error;
  }

  const data = await response.json();
  
  if (data.retCode !== 0) {
    const error = new Error(data.retMsg || 'API error');
    error.name = 'ServerError';
    throw error;
  }

  return data;
};

router.get('/balance', async (req, res, next) => {
  try {
    if (!API_KEY || !API_SECRET) {
      const error = new Error('API ключи Bybit не настроены');
      error.name = 'ValidationError';
      throw error;
    }

    const data = await makeBybitRequest('/v5/account/wallet-balance');
    res.json(data);
  } catch (error) {
    next(error);
  }
});

router.get('/open-orders', async (req, res, next) => {
  try {
    if (!API_KEY || !API_SECRET) {
      const error = new Error('API ключи Bybit не настроены');
      error.name = 'ValidationError';
      throw error;
    }

    const data = await makeBybitRequest('/v5/order/realtime', {
      category: 'spot',
      limit: 50
    });
    res.json(data);
  } catch (error) {
    next(error);
  }
});

module.exports = router;