//API endpoints for all monitor-related data.
const express = require("express");
const router = express.Router();
const monitorController = require("../controllers/monitorController");

router.get("/", monitorController.getMonitors);

router.get("/:id", monitorController.getMonitor);

// router.get("/getAverageUsage", monitorController.getAverageUsage);

router.post("/addMonitor", monitorController.addMonitor);

router.delete("/deleteMonitor/:id", monitorController.deleteMonitor);

router.post("/updateEnergyUsage", monitorController.updateEnergyUsage);

module.exports = router;
