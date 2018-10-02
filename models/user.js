'use strict';
module.exports = (sequelize, DataTypes) => {
  var user = sequelize.define('user', {
    oneauthId: DataTypes.BIGINT,
    username: DataTypes.STRING,
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING
  }, {});
  user.associate = function(models) {
    user.hasOne(models.token);
  };
  return user;
};
