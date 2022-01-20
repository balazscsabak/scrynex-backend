const mongoose = require('mongoose')

const itemsSchema = new mongoose.Schema(
	{
		serial_number: {
			type: Number,
			default: 1
		},

		item_lines: {
			type: Array,
			required: true
		}
	},
	{ 
		timestamps: true 
	}
)

module.exports = mongoose.model("Items", itemsSchema);
