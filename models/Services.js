const mongoose = require("mongoose");

const servicesSchema = new mongoose.Schema(
	{
		customer_id: {
			type: String,
			required: true,
			index: true,
		},

		service_name: {
			type: String,
			required: true,
		},

		screens_type: {
			type: String,
			default: "default",
		},

		screens: {
			type: Array,
			default: null,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Services", servicesSchema);
