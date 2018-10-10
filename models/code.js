'use strict';
const v4 = require('uuid/v4')

module.exports = (sequelize, DataTypes) => {
  var code = sequelize.define('code', {
    language: DataTypes.TEXT,
    title: {
      type: DataTypes.STRING,
      defaultValue: function () {
        return v4().split('-').pop()
      }
    },
    code: DataTypes.TEXT,
    custom_input: DataTypes.TEXT,
    file_name: DataTypes.STRING
  }, {});
  code.associate = function(models) {
    // associations can be defined here
    code.belongsTo(models.user);
  };
  return code;
};