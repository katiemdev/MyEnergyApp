const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const connectDB = require("./db-config");
require("dotenv").config();
const { createServer } = require("http");
const { Server } = require("socket.io");

/* SOCKET.IO */
const httpServer = createServer(app);
const io = new Server(httpServer, {
	cors: {
		origin: "http://localhost:4200",
	},
});

io.on("connection", (socket) => {
	console.log(`New connection: ${socket.id}`);

	socket.emit("updateEnergyUsage", "energy usage updated");

	socket.on("disconnect", () => console.log("disconnected"));
});

app.use(cors());
app.use(express.json());

//** CONNECT DATABASE
connectDB();

// ***ROUTES
const monitorRoutes = require("./routes/monitorRoutes");
app.use("/monitors", monitorRoutes);

httpServer.listen(process.env.PORT, () => {
	console.log(`Listening on port ${process.env.PORT}`);
});

exports.io = io;
