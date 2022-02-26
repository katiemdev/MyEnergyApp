const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const connectDB = require("./db-config");
require("dotenv").config();

app.use(cors());
app.use(express.json());
connectDB();

app.get("/", (req, res) => {
	res.send("Hello");
});

app.listen(process.env.PORT, () => {
	console.log(`Listening on port ${process.env.PORT}`);
});
