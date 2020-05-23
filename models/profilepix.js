'use strict';
module.exports = (sequelize, DataTypes) => {
    const ProfilePix = sequelize.define('ProfilePix', {
        pix: DataTypes.TEXT
    }, {});
    ProfilePix.associate = function(models) {
        // associations can be defined here
        ProfilePix.belongsTo(models.User, {
            foreignKey: {
                allowNull: false
            }
        })
    };
    return ProfilePix;
};