const mongoose = require('mongoose')

const dataflowSchema = new mongoose.Schema(
	{
		screen_session: {
			type: String,
			required: true,
		},

		flow: {
			type: Array,
			default: null
		},
	},
	{ 
		timestamps: true 
	}
)

module.exports = mongoose.model("Dataflow", dataflowSchema);
