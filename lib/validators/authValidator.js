const validator = require("validator");
const Customers = require("../../models/Customers");

const registrationValidation = (req, res, next) => {
	let { username, email, password, passwordConfirm } = req.body;
	let errors = [];

	if (!username || validator.isEmpty(username, { ignore_whitespace: true })) {
		errors.push({
			field: "username",
			code: "required",
		});
	}

	if (!email || validator.isEmpty(email, { ignore_whitespace: true })) {
		errors.push({
			field: "email",
			code: "required",
		});
	}

	if (
		!password ||
		!passwordConfirm ||
		validator.isEmpty(password, { ignore_whitespace: true }) ||
		validator.isEmpty(passwordConfirm, { ignore_whitespace: true })
	) {
		errors.push({
			field: "password",
			code: "required",
		});
	}

	if (errors.length > 0) {
		return res.json({
			status: false,
			errors,
		});
	}

	if (!validator.isEmail(email)) {
		errors.push({
			field: "email",
			code: "invalid",
		});
	}

	if (!validator.isLength(username, { min: 6 })) {
		errors.push({
			field: "username",
			code: "invalid",
		});
	}

	if (password !== passwordConfirm) {
		errors.push({
			field: "password",
			code: "different",
		});
	}

	if (errors.length > 0) {
		return res.json({
			status: false,
			errors,
		});
	}

	if (!validator.isStrongPassword(password)) {
		errors.push({
			field: "password",
			code: "simple",
		});
	}

	if (errors.length > 0) {
		return res.json({
			status: false,
			errors,
		});
	}

	next();
};

module.exports = {
	registrationValidation,
};
