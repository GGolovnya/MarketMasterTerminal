'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ExchangeApiKeys', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      exchangeName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      nickName: {
        type: Sequelize.STRING,
        allowNull: true
      },
      apiKey: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      apiKeyIv: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      apiKeyAuthTag: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      apiSecret: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      apiSecretIv: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      apiSecretAuthTag: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Добавляем составной уникальный индекс для userId + nickName + exchangeName
    await queryInterface.addIndex('ExchangeApiKeys', ['userId', 'nickName', 'exchangeName'], {
      unique: true,
      name: 'unique_user_nickname_exchange'
    });

    // Добавляем индекс для оптимизации поиска по userId
    await queryInterface.addIndex('ExchangeApiKeys', ['userId'], {
      name: 'idx_user_id'
    });
  },
  async down(queryInterface) {
    await queryInterface.removeIndex('ExchangeApiKeys', 'unique_user_nickname_exchange');
    await queryInterface.removeIndex('ExchangeApiKeys', 'idx_user_id');
    await queryInterface.dropTable('ExchangeApiKeys');
  }
};