'use strict';
module.exports = (sequelize, DataTypes) => {
    const UserType = sequelize.define('UserType', {
        farmer: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        agroCompany: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    }, {});
    UserType.associate = function(models) {
        // associations can be defined here
        UserType.belongsTo(models.User, {
            foreignKey: {
                allowNull: false
            }
        })
    };
    return UserType;
};