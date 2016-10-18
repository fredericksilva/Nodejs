'use strict';

exports.seed = function(knex, Promise) {
    // Deletes ALL existing entries
    return knex('roles').del()
        .then(() => {
            return Promise.all([

                // Inserts seed entries
                //Roles seeds
                knex('roles').insert({ id: 1, name: 'Super Admin', description: 'This is the super admin role.',
                    status: 1, created_at: new Date() }),
                knex('roles').insert({ id: 2, name: 'Warehouse Admin', description: 'This is the warehouse admin role.',
                    status: 1, created_at: new Date() }),
                knex('roles').insert({ id: 3, name: 'User', description: 'This is the user role.', status: 1,
                    created_at: new Date() })
            ]);
        });
};
