const mongoose = require("mongoose");

const alarmSchema = new mongoose.Schema({
	name: String,
	description: String,
	threshold: Number,
	monitor: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Monitor",
	},
});

module.exports = mongoose.model("Alarm", alarmSchema);
