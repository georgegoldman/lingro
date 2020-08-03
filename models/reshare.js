'use strict';
module.exports = (sequelize, DataTypes) => {
    const Reshare = sequelize.define('Reshare', {}, {});
    Reshare.associate = function(models) {
        // associations can be defined here
        Reshare.belongsTo(models.User, {
            foreignKey: {
                allowNull: false
            }
        })
        Reshare.belongsTo(models.Ling, {
            foreignKey: {
                allowNull: false
            }
        })
    };
    return Reshare;
};