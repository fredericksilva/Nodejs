var db = require('../config/db');

var DefinitionSchema = db.Schema({
	logtype: String,
	descritption: String,
	owner: { type: db.Schema.Types.ObjectId, ref: 'User'}
});

module.exports = DefinitionSchema;