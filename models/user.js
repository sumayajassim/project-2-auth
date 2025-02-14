'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.user.belongsToMany(models.chat, {through: "users_chats"})
    }
  }
  user.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    firstName:  DataTypes.STRING,
    lastName:  DataTypes.STRING,
    avatar:  DataTypes.STRING,
    bio:  DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'user',
  });
  return user;
};