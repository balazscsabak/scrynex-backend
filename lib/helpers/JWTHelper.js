const jwt = require('jsonwebtoken');

const generateToken = (userData) => {
	return jwt.sign(userData, process.env.JWT_TOKEN_SECRET, { 
		expiresIn: '24h' 
	});
}

const validateCookie = (token, cb) => {
	jwt.verify(token, process.env.JWT_TOKEN_SECRET, function(err, decoded) {
		if(err) {
			return cb(err, null)
		}	
		
		return cb(null, decoded);
	});
}

module.exports = {
	generateToken,
	validateCookie
}