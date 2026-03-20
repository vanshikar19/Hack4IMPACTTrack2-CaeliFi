const { Router } = require("express");
const {
getDashboardData,
ingestTelemetry,
updateDashboardControls,
updateAdminDashboardAttributes,
} = require("../controllers/Dashboard");

const dashboardRouter = Router();

dashboardRouter.get("/", getDashboardData);
dashboardRouter.post("/telemetry", ingestTelemetry);
dashboardRouter.patch("/controls", updateDashboardControls);
dashboardRouter.post("/admin", updateAdminDashboardAttributes);

module.exports = dashboardRouter;
