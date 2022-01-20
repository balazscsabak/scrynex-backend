const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');

const customersSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			lowercase: true,
			unique: true,
			required: true,
			index: true,
		},

		email: {
			type: String,
			lowercase: true,
			unique: true,
			required: true,
			index: true,
		},

		hash: {
			type: String
		},
		
		salt: {
			type: String,
		}
	},
	{ 
		timestamps: true 
	}
);

customersSchema.methods.validatePassword = function(inputPassword, cb) {
	return 'hello';
};

module.exports = mongoose.model("Customers", customersSchema);
