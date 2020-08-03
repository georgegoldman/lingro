'use strict';
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        name: DataTypes.TEXT,
        email: DataTypes.TEXT,
        tell: DataTypes.TEXT,
        country: DataTypes.TEXT,
        password: DataTypes.TEXT
    }, {});
    User.associate = function(models) {
        // associations can be defined here
        User.hasMany(models.ProfilePix, {
            onDelete: 'cascade'
        })
        User.hasMany(models.Farm, {
            onDelete: 'cascade'
        })
        User.hasMany(models.ChatHistory, {
            onDelete: 'cascade'
        })
        User.hasMany(models.UserType, {
            onDelete: 'cascade'
        })
        User.hasMany(models.Ling, {
            onDelete: 'cascade'
        })
        User.hasMany(models.Reling, {
            onDelete: 'cascade'
        })
        User.hasMany(models.UpVote, {
            onDelete: 'cascade'
        })
    };
    return User;
};