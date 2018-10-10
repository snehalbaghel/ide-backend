'use strict';

const v4 = require('uuid/v4')
const DB = require('../models')

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('codes', 'title', {
      type: Sequelize.STRING
    }).then(() => {
      return DB.code.findAll()
    }).then(codes => {
      const promises = codes.map(code => (code.title = v4().split('-').pop(), code.save()))
      return Promise.all(promises)
    }).then(() => {
      return queryInterface.changeColumn("codes", "title", {
        type: Sequelize.STRING,
        allowNull: false
      })
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('codes', 'title')
  }
};
