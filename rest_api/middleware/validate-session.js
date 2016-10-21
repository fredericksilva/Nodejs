var jwt = require('jsonwebtoken');
var User = require('../models/user');
var constants = require('../config/constants');

module.exports = (req, res, next) => {
	var sessionToken = req.headers.authorization;

	if(sessionToken) {
		jwt.verify(sessionToken, constants.JWT_SECRET, (err, decodedId) => {
			if (decodedId) {
				console.log(decodedId.id);
				User.findOne({_id: decodedId.id}).then((user) => {
					req['user'] = user;
					next();
				}, (err) => {
					res.send(401, 'Invalid User');
				});
			} else {
				res.send(401, 'not authotized');
			}
		});	
	} else {
		res.send(401, 'Auth token absent');
	}
};