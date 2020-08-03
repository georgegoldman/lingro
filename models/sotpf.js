'use strict';
module.exports = (sequelize, DataTypes) => {
    const SOTPF = sequelize.define('SOTPF', {
        link: {
            type: DataTypes.TEXT,
            allowNull: false
        },
    }, {});
    SOTPF.associate = function(models) {
        // associations can be defined here
        SOTPF.belongsTo(models.User, {
            foreignKey: {
                allowNull: false
            }
        })
        SOTPF.belongsTo(models.Ling, {
            foreignKey: {
                allowNull: false
            }
        })
    };
    return SOTPF;
};