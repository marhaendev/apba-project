const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
    id_user: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING(80),
        allowNull: false
    },
    nama: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    hakakses: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    kdlink: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    kdcbang: {
        type: DataTypes.STRING(10),
        allowNull: true
    }
}, {
    tableName: 'users',
    timestamps: false // Requirement doesn't mention timestamps, so disabling for simplicity or adding if needed
});

module.exports = User;
