'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        /*
          Add altering commands here.
          Return a promise to correctly handle asynchronicity.

          Example:
          return queryInterface.createTable('users', { id: Sequelize.INTEGER });
        */
        return Promise.all([
            queryInterface.addColumn('ChatHistories', 'user_id', Sequelize.INTEGER),
            queryInterface.addConstraint('ChatHistories', {
                fields: ['user_id'],
                type: 'foreign key',
                references: {
                    table: 'Users',
                    field: 'id',
                },
                onDelete: 'cascade',
                onUpdate: 'cascade',
            })
        ])
    },

    down: (queryInterface, Sequelize) => {
        /*
          Add reverting commands here.
          Return a promise to correctly handle asynchronicity.

          Example:
          return queryInterface.dropTable('users');
        */
        return Promise.all([])
    }
};