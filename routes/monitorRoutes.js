//API endpoints for all monitor-related data.
const express = require("express");
const router = express.Router();
const monitorController = require("../controllers/monitorController");

router.get("/", monitorController.getMonitors);

// router.get("/getAverageUsage", monitorController.getAverageUsage);

// router.get("/getAverageMonitorUsage", monitorController.getAverageMonitorUsage);

router.post("/addMonitor", monitorController.addMonitor);

router.post("/updateEnergyUsage", monitorController.updateEnergyUsage);

module.exports = router;
