const mongoose = require("mongoose");

const monitorSchema = new mongoose.Schema({
	name: String,
	description: String,
	monitorData: [
		{
			date: { type: Date, default: Date.now },
			time: Date,
			usage: Number,
		},
	],
	average: Number,
	alarms: [],
});

module.exports = mongoose.model("Monitor", monitorSchema);