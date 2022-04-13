const { updateEnergyUsage } = require("./controllers/monitorController");

io.on("connection", (socket) => {
	console.log(`New connection: ${socket.id}`);

	socket.emit("updateEnergyUsage", "energy usage updated");

	socket.on("disconnect", () => console.log("disconnected"));
});
