//API endpoints for all monitor-related data.
const express = require("express");
const router = express.Router();
const monitorController = require("../controllers/monitorController");

router.get("/", monitorController.getMonitors);

router.get("/:id", monitorController.getMonitor);

router.get("/user/:id", monitorController.getUserMonitors);

// router.get("/getAverageUsage", monitorController.getAverageUsage);

router.post("/addMonitor", monitorController.addMonitor);

router.delete("/deleteMonitor/:id", monitorController.deleteMonitor);

router.post("/updateMonitor", monitorController.updateMonitor);

router.post("/updateEnergyUsage", monitorController.updateEnergyUsage);

router.get("/alarm/:id", monitorController.getAlarms);

router.post("/addAlarm", monitorController.addAlarm);

router.post("/updateAlarm", monitorController.updateAlarm);

router.delete("/deleteAlarm/:id", monitorController.deleteAlarm);
module.exports = router;
