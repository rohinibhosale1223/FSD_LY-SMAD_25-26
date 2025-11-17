const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const User = sequelize.define('User', {
  username: { 
    type: DataTypes.STRING, 
    allowNull: false, 
    unique: true 
  },
  email: { 
    type: DataTypes.STRING, 
    allowNull: true 
  },
  password: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
}, {
  timestamps: true,
});

module.exports = User;
