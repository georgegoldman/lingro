'use strict';
module.exports = (sequelize, DataTypes) => {
    const UpVote = sequelize.define('UpVote', {
        type: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        }
    }, {});
    UpVote.associate = function(models) {
        // associations can be defined here
        UpVote.belongsTo(models.Ling, {
            foreignKey: {
                allowNull: false
            }
        })
        UpVote.belongsTo(models.User, {
            foreignKey: {
                allowNull: false
            }
        })
    };
    return UpVote;
};