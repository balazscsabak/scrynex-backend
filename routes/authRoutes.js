const express = require("express");
const validator = require("validator");
const bcrypt = require("bcrypt");
const Customers = require("../models/Customers");
const authValidation = require("../lib/validators/authValidator");
const JWTHelper = require("../lib/helpers/JWTHelper");
const authHandler = require("../lib/middlewares/AuthHandler");

const router = express.Router();

/**
 * Customer - REGISTRATION
 */
router.post(
	"/register",
	authValidation.registrationValidation,
	async (req, res) => {
		let { username, email, password, passwordConfirm } = req.body;
		let errors = [];

		username = validator.trim(username);
		email = validator.normalizeEmail(validator.trim(email));

		let emailExists = await Customers.find({ email });
		
		if (emailExists && emailExists.length > 0) {
			errors.push({
				msg: "User with this email already exists",
				code: "email-exists",
			});

			return res.json({
				status: false,
				errors
			});
		}

		let usernameExists = await Customers.find({ username })

		if (usernameExists && usernameExists.length > 0) {
			errors.push({
				msg: "Username already exists",
				code: "username-exists",
			});

			return res.json({
				status: false,
				errors
			});
		}

		bcrypt.genSalt(10, function (err, salt) {
			if (err) {
				errors.push({
					field: "salt",
					code: "salt-error",
				});
			}

			bcrypt.hash(password, salt, function (error, hash) {
				if (error) {
					errors.push({
						field: "hash",
						code: "hash-error",
					});
				}

				if (errors.length > 0) {
					return res.json({
						status: false,
						errors,
					});
				}

				let newCustomer = new Customers({
					username,
					email,
					hash,
					salt,
				});

				newCustomer.username = username;
				newCustomer.email = email;
				newCustomer.hash = hash;
				newCustomer.salt = salt;

				newCustomer.save((createError) => {
					if (createError) {
						errors.push({
							msg: "Error on creating new customer",
							genMsg: createError,
							code: "create-customer",
						});

						return res.json({
							status: false,
							errors,
						});
					}

					return res.json({
						status: true,
						errors: null,
						data: newCustomer,
					});
				});
			});
		});
	}
);

/**
 * Customer - LOGIN
 */
router.post('/login', async (req, res) => {
	let { loginname, password } = req.body;
	let errors = [];

	if (
		!loginname ||
		!password ||
		validator.isEmpty(loginname, { ignore_whitespace: true }) ||
		validator.isEmpty(password, { ignore_whitespace: true })
	) {
		errors.push({
			field: "Missing data",
			code: "missing-data",
		});

		return res.json({
			status: false,
			errors
		})
	}

	let customer = await Customers.findOne({ $or: [ { 'username': loginname }, { 'email': loginname } ]});

	if(!customer) {
		errors.push({
			field: "User not found",
			code: "user-not-found",
		});

		return res.json({
			status: false,
			errors
		})
	}

	const match = await bcrypt.compare(password, customer.hash);

	if(!match) {
		errors.push({
			field: "Login failed wrong user credentials",
			code: "wrong-credentials",
		});

		return res.json({
			status: false,
			errors
		})
	}

	const jwtToken = JWTHelper.generateToken({
		username: customer.username,
		id: customer._id,
		email: customer.email
	});

	res.json({
		status:true,
		token: jwtToken,
		username: customer.username,
		id: customer._id,
		email: customer.email
	});

} )

/**
 * VALIDATE COOKIE
 */
router.get('/validate-cookie', authHandler.validateCookie, (req, res) => {
	res.json({
		status: true,
		customer: req.customer
	})
})

module.exports = router;
