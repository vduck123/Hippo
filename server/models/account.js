'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Account extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Account.hasMany(models.Post, {
        foreignKey: 'acc_id',  
        as: 'posts',
      });
      Account.hasMany(models.Video, {
        foreignKey: 'acc_id',  
        as: 'videos',
      });
      Account.hasMany(models.Comment, {
        foreignKey: 'acc_id',  
        as: 'comments',
      });
      Account.hasMany(models.Like, {
        foreignKey: 'acc_id',  
        as: 'likes',
      });
      Account.hasMany(models.ReplyComment, {
        foreignKey: 'acc_id',  
        as: 'reply_comments',
      });
      Account.hasMany(models.Friend, {
        foreignKey: 'acc_id',
        as: 'friends',
      });
      Account.hasMany(models.Friend, {
        foreignKey: 'friend_id',
        as: 'friend',
      });

      Account.hasMany(models.RequestFriend, {
        foreignKey: 'sender_id',
        as: 'request_friend_sender',
      });
      Account.hasMany(models.RequestFriend, {
        foreignKey: 'receiver_id',
        as: 'request_friend_receiver',
      });

      Account.hasMany(models.RoomParticipant, {
        foreignKey: 'user_id',
        as: 'room_participant',
      });

      Account.hasMany(models.RoomMessage, {
        foreignKey: 'sender_id',
        as: 'message_sender'
      });
<<<<<<< HEAD
      
=======
>>>>>>> 29fc6b1... update future Chat
      Account.hasMany(models.RoomMessage, {
        foreignKey: 'receiver_id',
        as: 'message_receiver'
      });

      Account.hasMany(models.Notify, {
        foreignKey: 'acc_id',
        as: 'notify_account',
      });
    }
  }
  Account.init({
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING,
    nickname: DataTypes.STRING,
    full_name: DataTypes.STRING,
    avatar: DataTypes.STRING,
    bio: DataTypes.STRING,
    tick: DataTypes.BOOLEAN,
    isOnline: DataTypes.BOOLEAN,
    lastOnline: DataTypes.DATE
  }, {
    sequelize,
    tableName: 'accounts',
    modelName: 'Account',
  });
  return Account;
};