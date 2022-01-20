const uuidAPIKey = require('uuid-apikey');

const APIKeyGuard = (req, res, next) => {
	let authHeader = req.headers.authorization;
	let testUUid = '0b9ca335-92a8-46d8-b477-eb2ed83ac927';

	if(!authHeader || authHeader === '') {
		res.status(403);
		res.send();
	}

	if(!uuidAPIKey.isAPIKey(authHeader)) {
		res.status(403);
		res.send();
	}
	
	if(!uuidAPIKey.isUUID(testUUid)) {
		res.status(403);
		res.send();
	}

	if(!uuidAPIKey.check(authHeader, testUUid)) {
		res.status(403);
		res.send();
	}

	next();
}

module.exports = {
	APIKeyGuard
}