const sequelize = require("../server/core/database");
const {User} = require('./user')
const {Dialogs} = require('./dialogs')
const Sequelize = require("sequelize");

const Message = sequelize.define('Messages', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  text: {
    type: Sequelize.STRING(1023),
  },
  read: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  }
})

User.hasMany(Message)
Message.belongsTo(User)

Dialogs.hasMany(Message)
Message.belongsTo(Dialogs)

module.exports = {Message};
