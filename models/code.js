'use strict';
module.exports = (sequelize, DataTypes) => {
  var Code = sequelize.define('code', {
    language: DataTypes.TEXT,
    code: DataTypes.TEXT,
    custom_input: DataTypes.TEXT,
    file_name: DataTypes.STRING
  }, {});
  Code.associate = function(models) {
    // associations can be defined here
    Code.belongsTo(models.user);
  };
  return Code;
};