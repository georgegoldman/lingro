'use strict';
module.exports = (sequelize, DataTypes) => {
    const Ling = sequelize.define('Ling', {
        content: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        reling: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: null
        },
        upVote: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: null
        },
        reling: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: null,
        },
        reshare: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: null
        },
        _sotpf: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: null
        }
    }, {});
    Ling.associate = function(models) {
        // associations can be defined here
        Ling.belongsTo(models.User, {
            foreignKey: {
                allowNull: false,
                as: 'users'
            }
        })
        Ling.hasMany(models.Reling, {
            onDelete: 'cascade'
        })
        Ling.hasMany(models.UpVote, {
            onDelete: 'cascade'
        })
        Ling.hasMany(models.SOTPF, {
            onDelete: 'cascade'
        })
    };
    return Ling;
};