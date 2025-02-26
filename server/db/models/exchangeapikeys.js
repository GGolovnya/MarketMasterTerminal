'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ExchangeApiKeys extends Model {
    static associate(models) {
      ExchangeApiKeys.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      });
    }
  }
  
  ExchangeApiKeys.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    exchangeName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    nickName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    apiKey: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    apiKeyIv: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    apiKeyAuthTag: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    apiSecret: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    apiSecretIv: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    apiSecretAuthTag: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    sequelize,
    modelName: 'ExchangeApiKeys',
    indexes: [
      {
        unique: true,
        fields: ['userId', 'nickName', 'exchangeName'],
        name: 'unique_user_nickname_exchange'
      },
      {
        fields: ['userId'],
        name: 'idx_user_id'
      }
    ]
  });
  return ExchangeApiKeys;
};