'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class chat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // models.chat.belongsToMany(models.user, {through: "users_chats"})
      models.chat.belongsTo(models.user, {
        as: 'sender',
        foreignKey: 'fromUser'
      });
      
      models.chat.belongsTo(models.user, {
        as: 'reciever',
        foreignKey: 'toUser'
      });
      models.chat.hasMany(models.message)
    }

  }
  chat.init({
    toUser: DataTypes.INTEGER,
    fromUser: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'chat',
  });
  return chat;
};