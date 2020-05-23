'use strict';
module.exports = (sequelize, DataTypes) => {
    const Farm = sequelize.define('Farm', {
        name: DataTypes.TEXT,
        type: DataTypes.TEXT,
        produce: DataTypes.TEXT,
        amount: DataTypes.INTEGER,
        faming: DataTypes.TEXT
    }, {});
    Farm.associate = function(models) {
        // associations can be defined here
        Farm.belongsTo(models.User, {
            foreignKey: {
                allowNull: false
            }
        })
    };
    return Farm;
};