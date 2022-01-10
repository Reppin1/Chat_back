const sequelize = require("../server/core/database");
const Sequelize = require("sequelize");

const User = sequelize.define('User', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  firstName: {
    type: Sequelize.STRING
  },
  lastName: {
    type: Sequelize.STRING
  },
  email: {
    type: Sequelize.STRING
  },
  password: {
    type: Sequelize.STRING
  },
  avatarUrl: {
    type: Sequelize.STRING
  },
  isActive: {
    type: Sequelize.BOOLEAN
  },
  aboutMe: {
   type: Sequelize.STRING(1023)
  },
  isOnline: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  socket: {
    type: Sequelize.STRING,
  },
  lastSeen: {
    type: Sequelize.DATE,
    defaultValue: new Date()
  },
  createdAt: {
    allowNull: false,
    type: Sequelize.DATE
  },
  updatedAt: {
    allowNull: false,
    type: Sequelize.DATE
  }
})

module.exports = {User}