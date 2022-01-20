const JWTHelper = require("../helpers/JWTHelper");

const validateCookie = (req, res, next) => {
	// const jwtToken = req.cookies && req.cookies.jwt_token;
	let header = req.headers.authorization || "";
	const jwtToken = header.slice(7);
	let errors = [];

	if (!jwtToken) {
		errors.push({
			msg: "Invalid JWT token",
			code: "invalid-jwt",
		});

		return res.status(401).json({
			status: false,
			code: "invalid-jwt",
			errors,
		});
	}

	JWTHelper.validateCookie(jwtToken, (err, data) => {
		if (err) {
			errors.push({
				msg: "Unauthenticated",
				code: "unauthenticated",
			});

			return res.status(401).json({
				status: false,
				code: "unauthenticated",
				errors,
			});
		}

		req.customer = data;
		next();
	});
};

module.exports = {
	validateCookie,
};
