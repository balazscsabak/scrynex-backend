const express = require("express");
const validator = require("validator");
const authHandler = require("../lib/middlewares/AuthHandler");
const Services = require("../models/Services");

const router = express.Router();

// Base login validation to all routes
router.use(authHandler.validateCookie);

/**
 * GET services
 */
router.get("/", async (req, res) => {
	let customer_id = req.customer.id;

	const services = await Services.find({ customer_id });

	return res.json({
		status: true,
		services,
	});
});

/**
 * GET service by id
 */
router.get("/:id", async (req, res) => {
	let customer_id = req.customer.id;
	const service_id = req.params.id;

	try {
		const service = await Services.findOne({
			$and: [{ _id: service_id }, { customer_id }],
		});

		return res.json({
			status: true,
			service,
		});
	} catch {
		return res.json({
			status: false,
			service: null,
		});
	}
});

/**
 * CREATE NEW Service
 */
router.post("/", async (req, res) => {
	let { service_name, screens } = req.body;
	let screens_type = "custom";
	let customer_id = req.customer.id;

	if (
		!service_name ||
		validator.isEmpty(service_name, { ignore_whitespace: true })
	) {
		return res.json({
			status: false,
			msg: "Missing required service name",
			code: "service_name-missing",
		});
	}

	if (!screens) {
		screens = [
			{ name: "__start", slug: "START" },
			{ name: "__pending", slug: "PENDING" },
			{ name: "__finish", slug: "FINISH" },
		];
		screens_type = "default";
	}

	service_name = validator.trim(service_name);

	let newService = new Services();

	newService.customer_id = customer_id;
	newService.service_name = service_name;
	newService.screens = screens;
	newService.screens_type = screens_type;

	newService.save((err) => {
		if (err) {
			return res.json({
				status: false,
				msg: "Error creating new service",
				code: "failed-to-create-service",
				genMsg: err,
			});
		}

		return res.json({
			status: true,
			msg: "Service created",
			code: "service-created",
			data: newService,
		});
	});
});

module.exports = router;
