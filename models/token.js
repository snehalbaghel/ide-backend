'use strict';
module.exports = (sequelize, DataTypes) => {
  var Token = sequelize.define('Token', {
    accesstoken: DataTypes.STRING,
    clienttoken: DataTypes.STRING
  }, {});
  Token.associate = function(models) {
    // associations can be defined here
    Token.belongsTo(models.User);
  };
  return Token;
};