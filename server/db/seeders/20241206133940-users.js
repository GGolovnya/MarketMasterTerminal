'use strict';

const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('Users', [
      {
        username: 'testuser1',
        email: 'test1@example.com',
        password: await bcrypt.hash('password123', 10),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'testuser2',
        email: 'test2@example.com',
        password: await bcrypt.hash('password123', 10),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('Users', null, {});
  }
};