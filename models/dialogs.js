const sequelize = require("../server/core/database");
const {User} = require('./user')
const Sequelize = require("sequelize");

const Dialogs = sequelize.define('Dialogs', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
})

User.belongsToMany(Dialogs, {through: 'User_Dialogs', foreignKey: 'UserId'})
Dialogs.belongsToMany(User, {through: 'User_Dialogs', foreignKey: 'DialogId'})

module.exports = {Dialogs};
