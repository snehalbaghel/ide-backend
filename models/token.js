'use strict';
module.exports = (sequelize, DataTypes) => {
  var token = sequelize.define('token', {
    accesstoken: DataTypes.STRING,
    clienttoken: DataTypes.STRING
  }, {});
  token.associate = function(models) {
    // associations can be defined here
    token.belongsTo(models.user);
  };
  return token;
};