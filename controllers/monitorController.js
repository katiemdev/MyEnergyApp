const Monitor = require("../models/Monitor");
const Alarm = require("../models/Alarm");

module.exports = {
	/**@GET: GET ALL MONITORS */
	getMonitors: async (req, res) => {
		try {
			return Monitor.find((err, monitors) => {
				if (err) next(err);
				res.json(monitors);
			}).clone();
		} catch (err) {
			console.log(err);
		}
	},

	/** @GET: GET SINGLE MONITOR BY ID */
	getMonitor: async (req, res) => {
		try {
			const monitor = await Monitor.findById(req.params.id);
			res.send(monitor);
			return monitor;
		} catch (err) {
			console.log(err);
		}
	},

	/** @GET: MONITORS BY USER */
	getUserMonitors: async (req, res, err) => {
		try {
			const monitors = await Monitor.find({ user: req.params.id });
			res.json(monitors);
		} catch (err) {
			console.log(err);
		}
	},

	/**@GET: CALCULATE AVERAGE ENERGY USAGE OVER ALL MONITORS */
	// getAverageUsage: async (req, res) => {
	// 	let result = await Monitor.aggregate().group({
	// 		_id: null,
	// 		average: { $avg: "monitorData.usage" },
	// 	});
	// 	res.json(Number(result));
	// },

	/**@POST: ADD A MONITOR */
	addMonitor: async (req, res) => {
		try {
			const data = await Monitor.create({
				name: req.body.name,
				description: req.body.description,
				monitorData: [],
				average: 0,
				user: req.body.user,
			});
			res.send(data);
			console.log(data);
			return data;
		} catch (err) {
			console.log(err);
		}
	},

	/**@DELETE: DELETE A MONITOR */
	deleteMonitor: async (req, res) => {
		try {
			const monitor = await Monitor.findByIdAndDelete(req.params.id);
			res.json("Monitor deleted");
			return monitor;
		} catch (err) {
			console.log(err);
		}
	},

	updateMonitor: async (req, res) => {
		try {
			console.log(req.body);
			const monitor = await Monitor.findByIdAndUpdate(
				req.body.id,
				{
					name: req.body.name,
					description: req.body.description,
				},
				{ new: true }
			);
			console.log(monitor);
			res.send(monitor);
		} catch (err) {
			console.log(err);
		}
	},

	/**@UPDATE: ADD ENERGY USAGE DATA TO MONITOR */
	updateEnergyUsage: async (req, res) => {
		try {
			const monitors = await Monitor.find({});
			for (let monitor of monitors) {
				let energyObj = {
					date: req.body.date,
					usage: Object.values(req.body.usage)[
						Math.floor(Math.random() * Object.keys(req.body.usage).length)
					],
					//Number((Math.random() * 100).toFixed(2)),
				};
				//add new data
				await monitor.monitorData.push(energyObj);

				//save updates
				await monitor.save();

				//set new average
				await Monitor.updateMany([
					{
						$set: {
							average: { $round: [{ $avg: "$monitorData.usage" }, 2] },
						},
					},
				]);

				//Get alarms associated with monitor
				const alarms = await Alarm.find({ monitor: monitor._id });

				//check if recent usage has gone over threshold
				for (let a of alarms) {
					if (energyObj.usage > a.threshold) {
						energyObj.threshold = true;
					} else {
						energyObj.threshold = false;
					}
				}
				energyObj.monitor = monitor._id;

				//emit event to client when data has been updated
				require("../server").io.emit("monitorUpdate", energyObj);
			}

			res.json(`Monitor usage updated`);
		} catch (err) {
			console.log(err);
		}
	},
	//@GET alarms associated with a monitor
	getAlarms: async (req, res, err) => {
		try {
			const alarms = await Alarm.find({ monitor: req.params.id });
			res.json(alarms);
		} catch (err) {
			console.log(err);
		}
	},

	/**@POST: ADD A MONITOR */
	addAlarm: async (req, res) => {
		try {
			const data = await Alarm.create({
				name: req.body.name,
				description: req.body.description,
				threshold: req.body.threshold,
				monitor: req.body.monitor,
			});
			res.send(data);
			console.log(data);
			return data;
		} catch (err) {
			console.log(err);
		}
	},

	updateAlarm: async (req, res) => {
		try {
			const alarm = await Alarm.findOneAndUpdate(
				req.body.id,
				{
					name: req.body.name,
					description: req.body.description,
					threshold: req.body.threshold,
				},
				{ new: true }
			);
			res.send(alarm);
		} catch (err) {
			console.log(err);
		}
	},

	deleteAlarm: async (req, res) => {
		try {
			const alarm = await Alarm.findByIdAndDelete(req.params.id);
			res.json("Alarm deleted");
			return alarm;
		} catch (err) {
			console.log(err);
		}
	},
};
