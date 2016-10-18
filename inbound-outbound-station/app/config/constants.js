'use strict';

let statuses = {
    active: 'active',
    inactive: 'inactive'
};

let basicRoles = {
    superAdmin: {
        id: 1,
        text: 'Super Admin'
    },
    warehouseAdmin: {
        id: 2,
        text: 'Warehouse Admin'
    }
};

module.exports = {
    statuses: statuses,
    users: {
        STATUSES: [statuses.active, statuses.inactive]
    },
    roles: {
        basic: basicRoles,
        STATUSES: [statuses.active, statuses.inactive]
    },
    warehouses: {
        STATUSES: [statuses.active, statuses.inactive]
    },
    salt_round: {
        DEFAULT: 10
    },
    allowedUrls: [
        '/login',
        '/logout',
        '/account/resetpassword',
        '/account/updatepassword'
    ]
};
