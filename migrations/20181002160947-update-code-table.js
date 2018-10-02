'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    const createdAt = queryInterface.addColumn('codes', 'createdAt', {
      allowNull: false,
      defaultValue: Sequelize.fn('NOW'),
      type: Sequelize.DATE
    })
    const updatedAt = queryInterface.addColumn('codes', 'updatedAt', {
      allowNull: false,
      defaultValue: Sequelize.fn('NOW'),
      type: Sequelize.DATE
    })
    const userId = queryInterface.addColumn('codes', 'userId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'users',
        key: 'id',
      }
    })
    return Promise.all([createdAt, updatedAt, userId])
  },

  down: (queryInterface, Sequelize) => {
    const promises = ['createdAt', 'updatedAt', 'userId'].map(col => queryInterface.removeColumn('codes', col))
    return Promise.all(promises)
  }
};
