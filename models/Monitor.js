const mongoose = require("mongoose");

const monitorSchema = new mongoose.Schema(
	{
		name: String,
		description: String,
		monitorData: [
			{
				date: { type: Date, default: Date.now },
				usage: Number,
			},
		],
		average: Number,
		alarms: [],
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
	}
	// {
	// 	timeseries: {
	// 		timeField: "time",
	// 		granularity: "hours",
	// 	},
	// }
);

module.exports = mongoose.model("Monitor", monitorSchema);
