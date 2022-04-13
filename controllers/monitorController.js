const Monitor = require("../models/Monitor");

module.exports = {
	/**@GET: GET ALL MONITORS */
	getMonitors: async (req, res) => {
		try {
			Monitor.find((err, monitors) => {
				if (err) next(err);
				res.json(monitors);
			});
		} catch (err) {
			console.log(err);
		}
	},

	/** @GET: GET SINGLE MONITOR BY ID */
	getMonitor: async (req, res) => {
		try {
			const monitor = await Monitor.findById(req.params.id);
			res.send(monitor);
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
		// let date = new Date();
		// let num = Number((Math.random() * 100).toFixed(2));
		try {
			//monitor object to test POST endpoint
			const data = await Monitor.create({
				name: req.body.name,
				description: req.body.description /*`Test ${Math.random() * 50}`, */,
				monitorData: [],
				average: 0,
				alarms: [],
			});
			res.send(data);
			console.log(data);
		} catch (err) {
			console.log(err);
		}
	},

	/**@DELETE: DELETE A MONITOR */
	deleteMonitor: async (req, res) => {
		try {
			await Monitor.findByIdAndDelete(req.params.id);
			res.json("Monitor deleted");
		} catch (err) {
			console.log(err);
		}
	},

	/**@UPDATE: ADD ENERGY USAGE DATA TO MONITOR */
	updateEnergyUsage: async (req, res) => {
		//TEST OBJECT: remove this when adding real data
		let energyObj = {
			date: req.body.date,
			time: req.body.time,
			usage: req.body.usage.usage4,
			//Number((Math.random() * 100).toFixed(2)),
		};
		try {
			//find monitor to update
			const monitor = await Monitor.findOne({ description: "test" });

			//add new data
			await monitor.monitorData.unshift(energyObj);

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

			res.json(`Monitor usage updated: ${JSON.stringify(energyObj)}`);
		} catch (err) {
			console.log(err);
		}

		//emit event to client when data has been updated
		require("../server").io.emit("monitorUpdate", energyObj);
	},
};
