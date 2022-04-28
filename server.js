const express = require("express");
const app = express();
const cors = require("cors");
const session = require("express-session");
const connectDB = require("./config/db-config");
const MongoStore = require("connect-mongo");
require("dotenv").config();
const { createServer } = require("http");
const { Server } = require("socket.io");

const allowedOrigins = process.env.CLIENT_URL;
app.use(
	cors({
		credentials: true,
		origin: (origin, callback) => {
			if (allowedOrigins.includes(origin)) {
				callback(null, true);
			} else {
				callback(new Error(`Origin: ${origin} is now allowed`));
			}
		},
	})
);

app.use(express.json());

//* SOCKET.IO
const httpServer = createServer(app);
const io = new Server(httpServer, {
	cors: {
		origin: process.env.CLIENT_URL,
	},
});

io.on("connection", (socket) => {
	console.log(`New connection: ${socket.id}`);

	socket.emit("updateEnergyUsage", "energy usage updated");

	socket.on("disconnect", () => console.log("disconnected"));
});

//** CONNECT DATABASE
connectDB();

//** SESSIONS
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
		store: MongoStore.create({
			mongoUrl: process.env.DB_STRING,
		}),
	})
);

// ***ROUTES
const monitorRoutes = require("./routes/monitorRoutes");
app.use("/monitors", monitorRoutes);

const authRoutes = require("./routes/authRoutes");
app.use("/auth", authRoutes);

app.use(express.static("energy-app"));

httpServer.listen(process.env.PORT, () => {
	console.log(`Listening on port ${process.env.PORT}`);
});

exports.io = io;
