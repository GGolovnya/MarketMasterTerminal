const crypto = require('crypto');

const bybitGenerateSignature = (apiKey, apiSecret, params = {}) => {
  const timestamp = Date.now();
  const allParams = {
    ...params,
    api_key: apiKey,
    timestamp: timestamp.toString()
  };

  const queryString = Object.keys(allParams)
    .sort()
    .map(key => `${key}=${allParams[key]}`)
    .join('&');

  const signature = crypto
    .createHmac('sha256', apiSecret)
    .update(timestamp.toString() + apiKey + queryString)
    .digest('hex');

  return { signature, timestamp, queryString };
};

module.exports = bybitGenerateSignature;