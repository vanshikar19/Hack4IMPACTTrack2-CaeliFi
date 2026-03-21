const dashboardStore = require("../models/Dashboard");

let clients = [];

const streamDashboardData = async (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  clients.push(res);
  console.log(
    `[STREAM] New frontend client connected. Total clients: ${clients.length}`,
  );

  try {
    const snapshot = await dashboardStore.getSnapshot();
    res.write(`data: ${JSON.stringify(snapshot)}\n\n`);
  } catch (error) {
    console.error("[STREAM] Failed to send initial snapshot:", error.message);
  }

  req.on("close", () => {
    clients = clients.filter((client) => client !== res);
    console.log(
      `[STREAM] Client disconnected. Total clients: ${clients.length}`,
    );
  });
};

const getDashboardData = async (_req, res) => {
  try {
    const snapshot = await dashboardStore.getSnapshot();
    return res.status(200).json({ success: true, data: snapshot });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch" });
  }
};

const ingestTelemetry = async (req, res) => {
  const payload = req.body;

  // LOG 1: See raw data coming from ESP32
  console.log(">>> [ESP32 INCOMING]:", JSON.stringify(payload));

  try {
    const snapshot = await dashboardStore.addTelemetry(payload);

    // Broadcast the same snapshot shape used by GET /api/dashboard.
    if (clients.length > 0) {
      console.log(`[STREAM] Broadcasting to ${clients.length} frontend(s)`);
      clients.forEach((client) => {
        client.write(`data: ${JSON.stringify(snapshot)}\n\n`);
      });
    } else {
      console.log("[STREAM] No frontend clients connected to receive data");
    }

    return res
      .status(201)
      .json({ success: true, message: "Telemetry accepted" });
  } catch (error) {
    console.error("[ERROR] Telemetry process failed:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updateDashboardControls = async (req, res) => {
  const payload = req.body;
  try {
    const snapshot = await dashboardStore.updateControls(payload);
    clients.forEach((client) => {
      client.write(`data: ${JSON.stringify(snapshot)}\n\n`);
    });
    return res.status(200).json({ success: true, data: snapshot });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updateAdminDashboardAttributes = async (req, res) => {
  const payload = req.body;
  try {
    const snapshot = await dashboardStore.updateAdminAttributes(payload);
    clients.forEach((client) => {
      client.write(`data: ${JSON.stringify(snapshot)}\n\n`);
    });
    return res.status(200).json({ success: true, data: snapshot });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  streamDashboardData, // <-- MAKE SURE THIS IS HERE
  getDashboardData,
  ingestTelemetry,
  updateDashboardControls,
  updateAdminDashboardAttributes,
};
