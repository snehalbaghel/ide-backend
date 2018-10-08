'use strict';
module.exports = (sequelize, DataTypes) => {
  var code = sequelize.define('code', {
    language: DataTypes.TEXT,
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