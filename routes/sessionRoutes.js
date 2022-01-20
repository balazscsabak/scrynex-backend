const express = require("express");
const authHandler = require("../lib/middlewares/AuthHandler");
const ScreenSessions = require("../models/ScreenSessions");
const Services = require("../models/Services");

const router = express.Router();

// Base login validation to all routes
router.use(authHandler.validateCookie);

/**
 * Session - START new session
 */
router.post("/start", async (req, res) => {
	let { customer } = req;
	let serviceId = req.body && req.body.service_id;

	if (!serviceId) {
		return res.json({
			status: false,
			msg: "Missing service ID",
			code: "missing-data",
		});
	}

	try {
		let service = await Services.findOne({ _id: serviceId });

		if (!service) {
			return res.json({
				status: false,
				msg: "Service not found",
				code: "service-not-found",
			});
		}

		let newSession = new ScreenSessions();

		newSession.customer_id = customer.id;
		newSession.started = true;
		newSession.start_time = Date.now();
		newSession.service_id = serviceId;

		newSession.save((err) => {
			if (err) {
				return res.json({
					status: false,
					msg: "Error creating new session",
					genMsg: err,
				});
			}

			return res.json({
				status: true,
				msg: "Session created",
				data: newSession,
			});
		});
	} catch (serviceErr) {
		return res.json({
			status: false,
			msg: "Error on querying service",
			code: "service-query-error",
			genMsg: serviceErr,
		});
	}
});

/**
 * Session - CLOSE session
 */
router.post("/close", async (req, res) => {
	let sessionId = req.body && req.body.id;
	let { customer } = req;

	if (!sessionId) {
		return res.json({
			status: false,
			msg: "Not found or no permission to close session",
		});
	}

	try {
		let screenSession = await ScreenSessions.findOne({ _id: sessionId });

		if (!screenSession) {
			return res.json({
				status: false,
				msg: "Not found or no permission to close session",
			});
		}

		if (screenSession.customer_id !== customer.id) {
			return res.json({
				status: false,
				msg: "Not found or no permission to close session",
			});
		}

		if (screenSession.finished) {
			return res.json({
				status: false,
				msg: "Session already closed",
			});
		}

		screenSession.finished = true;
		screenSession.finish_time = Date.now();

		screenSession.save().then((updatedSession) => {
			res.json({
				status: true,
				msg: "Session closed successfully",
				data: updatedSession,
			});
		});
	} catch (error) {
		return res.json({
			status: false,
			msg: "Not found or no permission to close session",
		});
	}
});

/**
 * Session - GET active sessions
 */
router.get("/", async (req, res) => {
	let { customer } = req;

	let activeSessions = await ScreenSessions.find({
		$and: [{ customer_id: customer.id }, { finished: false }],
	});

	res.json({
		status: true,
		sessions: activeSessions,
	});
});

/**
 * Session - GET active session by service
 */
router.get("/service/:id", async (req, res) => {
	let { customer } = req;
	const { id } = req.params;

	let activeSessions = await ScreenSessions.find({
		$and: [
			{ service_id: id },
			{ customer_id: customer.id },
			{ finished: false },
		],
	});

	res.json({
		status: true,
		sessions: activeSessions,
	});
});

/**
 * Session - GET closed sessions
 */
router.get("/closed", async (req, res) => {
	let { customer } = req;

	let closed = await ScreenSessions.find({
		$and: [{ customer_id: customer.id }, { finished: true }],
	});

	res.json({
		status: true,
		sessions: closed,
	});
});

module.exports = router;
