'use strict';

exports.seed = function(knex, Promise) {
    // Deletes ALL existing entries
    return knex('warehouses').del()
    .then(() => {
        return Promise.all([

          // Inserts seed entries
          //Warehouse seed
          knex('warehouses').insert({ id: 1, name: 'isolo', status: 1 }),
          knex('warehouses').insert({ id: 2, name: 'ogba', status: 1 })
        ]);
    });
};
