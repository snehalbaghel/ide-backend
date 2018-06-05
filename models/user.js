'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    oneauthId: DataTypes.BIGINT,
    username: DataTypes.STRING,
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING
  }, {});
  User.associate = function(models) {
    User.hasOne(models.Token);
  };
  return User;
};
