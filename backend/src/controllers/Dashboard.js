const dashboardStore = require("../models/Dashboard");

const getDashboardData = async (_req, res) => {
  try {
    const snapshot = await dashboardStore.getSnapshot();
    return res.status(200).json({
      success: true,
      data: snapshot,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard data",
      error: error.message,
    });
  }
};

const ingestTelemetry = async (req, res) => {
  const payload = req.body;

  if (!payload || typeof payload !== "object") {
    return res.status(400).json({
      success: false,
      message: "Telemetry payload must be a JSON object",
    });
  }

  try {
    const snapshot = await dashboardStore.addTelemetry(payload);
    return res.status(201).json({
      success: true,
      message: "Telemetry accepted",
      data: snapshot,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to process telemetry",
      error: error.message,
    });
  }
};

const updateDashboardControls = async (req, res) => {
  const payload = req.body;

  if (!payload || typeof payload !== "object") {
    return res.status(400).json({
      success: false,
      message: "Control payload must be a JSON object",
    });
  }

  const hasControlKey =
    Object.prototype.hasOwnProperty.call(payload, "solarLimitPercent") ||
    Object.prototype.hasOwnProperty.call(payload, "dgSyncMode");

  if (!hasControlKey) {
    return res.status(400).json({
      success: false,
      message: "At least one control field is required: solarLimitPercent or dgSyncMode",
    });
  }

  try {
    const snapshot = await dashboardStore.updateControls(payload);
    return res.status(200).json({
      success: true,
      message: "Controls updated",
      data: snapshot,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update controls",
      error: error.message,
    });
  }
};

const updateAdminDashboardAttributes = async (req, res) => {
  const payload = req.body;

  if (!payload || typeof payload !== "object") {
    return res.status(400).json({
      success: false,
      message: "Admin payload must be a JSON object",
    });
  }

  try {
    const snapshot = await dashboardStore.updateAdminAttributes(payload);
    return res.status(200).json({
      success: true,
      message: "Admin attributes saved",
      data: snapshot,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to save admin attributes",
      error: error.message,
    });
  }
};
module.exports = {
  getDashboardData,
  ingestTelemetry,
  updateDashboardControls,
  updateAdminDashboardAttributes,
};

