'use strict';
module.exports = (sequelize, DataTypes) => {
    const Reling = sequelize.define('Reling', {}, {});
    Reling.associate = function(models) {
        // associations can be defined here
        Reling.belongsTo(models.Ling, {
            foreignKey: {
                allowNull: false
            }
        })
        Reling.belongsTo(models.User, {
            allowNull: false
        })

    };
    return Reling;
};