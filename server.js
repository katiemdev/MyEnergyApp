const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const connectDB = require("./db-config");
require("dotenv").config();
// const myData = require("./data.js");

app.use(cors());
app.use(express.json());

// myData.processLineByLine();

//** CONNECT DATABASE
connectDB();

// ***ROUTES
const monitorRoutes = require("./routes/monitorRoutes");
app.use("/monitors", monitorRoutes);

app.listen(process.env.PORT, () => {
	console.log(`Listening on port ${process.env.PORT}`);
});
