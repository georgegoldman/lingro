'use strict';
module.exports = (sequelize, DataTypes) => {
    const ChatHistory = sequelize.define('ChatHistory', {
        name: DataTypes.TEXT,
        message: DataTypes.TEXT,
    }, {});
    ChatHistory.associate = function(models) {
        // associations can be defined here
        ChatHistory.belongsTo(models.User, {
            foreignKey: {
                allowNull: false
            }
        })
    };
    return ChatHistory;
};