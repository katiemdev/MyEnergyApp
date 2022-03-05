const { response } = require("express");
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

	/**@GET: AVERAGE USAGE OF SINGLE MONITOR */
	// getAverageMonitorUsage: async (req, res) => {
	// 	let result = await Monitor.findOneAndUpdate([
	// 		{
	// 			$set: {
	// 				average: { $avg: "$monitorData.usage" },
	// 			},
	// 		},
	// 	]);
	// 	res.json(result);
	// },

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
		let date = new Date();
		let num = Number((Math.random() * 100).toFixed(2));
		try {
			//monitor object to test POST endpoint
			let monitor = {
				name: "Katie",
				description: "test" /*`Test ${Math.random() * 50}`, */,
				monitorData: [
					{
						date: date,
						time: date,
						usage: num,
					},
				],
				average: num,
				alarms: [],
			};
			const data = await Monitor.create(monitor);
			res.send(data);
		} catch (err) {
			console.log(err);
		}
	},

	/**@UPDATE: PUSH USAGE OBJECT TO MONITORDATA ARRAY OF PARTICUALAR MONITOR
	 * NOTE: THIS IS THE ENDPOINT THAT WILL BE NEEDED FOR SOCKET.IO AND CHARTJS
	 */
	updateEnergyUsage: async (req, res) => {
		let energyObj = {
			//test object
			date: Date.now(),
			time: Date.now(),
			usage: Number((Math.random() * 100).toFixed(2)),
		};
		try {
			//find monitor to update
			const monitor = await Monitor.findOne({ description: "test" });

			//add new data
			await monitor.monitorData.push(energyObj);

			//save updates
			await monitor.save();

			//set new average
			await Monitor.updateMany([
				{
					$set: {
						average: { $avg: "$monitorData.usage" },
					},
				},
			]);

			// await monitor.save();
			res.send("Monitor updated");
		} catch (err) {
			console.log(err);
		}
	},
};
