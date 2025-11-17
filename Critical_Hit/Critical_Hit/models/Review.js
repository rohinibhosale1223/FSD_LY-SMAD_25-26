const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const Review = sequelize.define('Review', {
  username: { type: DataTypes.STRING, allowNull: false, defaultValue: 'Anonymous' },
  gameTitle: { type: DataTypes.STRING, allowNull: false },
  rating: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  text: { type: DataTypes.TEXT },
}, {
  // timestamps: createdAt and updatedAt
  timestamps: true,
});

module.exports = Review;
