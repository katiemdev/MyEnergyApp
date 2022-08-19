const nReadlines = require("n-readlines");
const fs = require("fs");
const fetch = require("node-fetch");
const dataLines = new nReadlines("household_power_consumption.txt");
const startingLinePositionFile = new nReadlines("data-position.txt");
require("dotenv").config();
const express = require("express");
const res = require("express/lib/response");
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

let lineNumber = 0;

//read latest starting position
let startingLinePosition = startingLinePositionFile.next();

//read through file until you reach starting position
if (startingLinePosition > 0) {
	dataLines.next();
	lineNumber++;

	while (startingLinePosition > lineNumber) {
		dataLines.next();
		lineNumber++;
	}
}

let usageObj;

function getData() {
	let line;

	line = dataLines.next().toString("ascii");

	//split into array of data
	let dataArr = line.split(";");

	//verify all data pieces are there (should always be 9)
	if (dataArr.length == 9) {
		//check if last value in array is a number. This will skip first line which contains headings
		if (!isNaN(dataArr[8])) {
			//make usage object to be used for 3 different monitors
			let usage = {
				usage1: Number(dataArr[6]),
				usage2: Number(dataArr[7]),
				usage3: Number(dataArr[8]),
				usage4: Number(dataArr[5]),
			};

			// console.log(`Line ${lineNumber}: ${JSON.stringify(usageObj)}`);
			usageObj = { date: Date.now(), usage: usage };
			postData(usageObj);

			return usageObj;
		}

		lineNumber++;
		fs.writeFileSync("data-position.txt", "" + lineNumber);
	}
}

//post data using fetch request
async function postData(usage) {
	try {
		const res = await fetch(process.env.SERVER_URL, {
			method: "POST",
			body: JSON.stringify(usage),
			headers: {
				"Content-Type": "application/json",
			},
		});
		const content = await res.json();

		console.log(content);
	} catch (err) {
		console.log(err);
	}
}

/* GENERATE RANDOM VALUES */
function generateRandomData(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);

	let usage = {
		usage1: Number((Math.random() * (max - min + 1) + min).toFixed(2)),
		usage2: Number((Math.random() * (max - min + 1) + min).toFixed(2)),
		usage3: Number((Math.random() * (max - min + 1) + min).toFixed(2)),
		usage4: Number((Math.random() * (max - min + 1) + min).toFixed(2)),
		usage5: Number((Math.random() * (max - min + 1) + min).toFixed(2)),
		usage6: Number((Math.random() * (max - min + 1) + min).toFixed(2)),
		usage7: Number((Math.random() * (max - min + 1) + min).toFixed(2)),
		usage8: Number((Math.random() * (max - min + 1) + min).toFixed(2)),
		usage9: Number((Math.random() * (max - min + 1) + min).toFixed(2)),
		usage10: Number((Math.random() * (max - min + 1) + min).toFixed(2)),
		usage11: Number((Math.random() * (max - min + 1) + min).toFixed(2)),
		usage12: Number((Math.random() * (max - min + 1) + min).toFixed(2)),
		usage13: Number((Math.random() * (max - min + 1) + min).toFixed(2)),
		usage14: Number((Math.random() * (max - min + 1) + min).toFixed(2)),
		usage15: Number((Math.random() * (max - min + 1) + min).toFixed(2)),
		usage16: Number((Math.random() * (max - min + 1) + min).toFixed(2)),
	};

	console.log(usage);
	postData({ date: Date.now(), usage: usage });
}

//interval to post data
// setInterval(() => getData(), 2000);

app.get("/", (req, res) => {
	res.send("<h1>Data Application is currently running!</h1>");
});

app.listen(PORT, () => {
	// start server and listen on specified port
	console.log(`App is running on ${PORT}`); // confirm server is running and log port to the console
	setInterval(() => generateRandomData(0, 5), 60000);
});
