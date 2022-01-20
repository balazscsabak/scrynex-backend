const mongoose = require('mongoose')

const screenSessionsSchema = new mongoose.Schema(
	{
		customer_id: {
			type: String,
			required: true,
			index: true,
		},

		service_id: {
			type: String,
			required: true,
			index: true,
		},

		screen_links: {
			type: Array
		},

		started: {
			type: Boolean,
			required: true,
		},

		finished: {
			type: Boolean,
			required: true,
			default: false
		},

		start_time: {
			type: Number,
		},

		finish_time: {
			type: Number
		}
	},
	{ 
		timestamps: true 
	}
)

module.exports = mongoose.model("ScreenSessions", screenSessionsSchema);
