const { Router } = require("express");
const {
  streamDashboardData, // <-- AND HERE
  getDashboardData,
  ingestTelemetry,
  updateDashboardControls,
  updateAdminDashboardAttributes,
} = require("../controllers/Dashboard");

const dashboardRouter = Router();

// Ensure this route matches the function name exactly
dashboardRouter.get("/stream", streamDashboardData); 
dashboardRouter.get("/", getDashboardData);
dashboardRouter.post("/telemetry", ingestTelemetry);
dashboardRouter.patch("/controls", updateDashboardControls);
dashboardRouter.post("/admin", updateAdminDashboardAttributes);

module.exports = dashboardRouter;