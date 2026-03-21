const mongoose = require("mongoose");

const MAX_POWER_POINTS = 24;
const MAX_ALERTS = 10;

const defaultPowerHistory = [
  { time: "06:00", solar: 5, dg: 40, load: 45 },
  { time: "08:00", solar: 20, dg: 30, load: 50 },
  { time: "10:00", solar: 38, dg: 15, load: 53 },
  { time: "12:00", solar: 48, dg: 10, load: 55 },
  { time: "14:00", solar: 45, dg: 12, load: 57 },
  { time: "16:00", solar: 30, dg: 25, load: 54 },
  { time: "18:00", solar: 10, dg: 40, load: 50 },
];

const defaultSavingsHistory = [
  { day: "Mon", savings: 3800 },
  { day: "Tue", savings: 4200 },
  { day: "Wed", savings: 3600 },
  { day: "Thu", savings: 4800 },
  { day: "Fri", savings: 5100 },
  { day: "Sat", savings: 2900 },
  { day: "Sun", savings: 1500 },
];

const alertEntrySchema = new mongoose.Schema(
  {
    id: String,
    type: { type: String },
    msg: String,
    timestamp: String,
  },
  { _id: false }
);

const dashboardStateSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, default: "default" },
    metrics: {
      solarOutputKw: { type: Number, default: 42.8 },
      dgOutputKw: { type: Number, default: 18.3 },
      loadDemandKw: { type: Number, default: 56.1 },
      todaySavingsInr: { type: Number, default: 4280 },
      safeMode: { type: Boolean, default: false },
      throttlePercent: { type: Number, default: 25 },
    },
    controls: {
      solarLimitPercent: { type: Number, default: 75 },
      dgSyncMode: { type: Boolean, default: true },
    },
    histories: {
      power: {
        type: [
          {
            time: String,
            solar: Number,
            dg: Number,
            load: Number,
          },
        ],
        default: defaultPowerHistory,
      },
      savings: {
        type: [
          {
            day: String,
            savings: Number,
          },
        ],
        default: defaultSavingsHistory,
      },
    },
    alerts: {
      type: [alertEntrySchema],
      default: [
        {
          id: "seed-1",
          type: "warning",
          msg: "Reverse power risk detected - solar throttled to 60%",
          timestamp: new Date().toISOString(),
        },
      ],
    },
    lastTelemetryAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const DashboardState = mongoose.model("DashboardState", dashboardStateSchema);

const numberOrFallback = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const createAlert = (type, msg) => ({
  id: `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
  type,
  msg,
  timestamp: new Date().toISOString(),
});

const ensureDashboardState = async () => {
  let doc = await DashboardState.findOne({ key: "default" }).lean();

  if (!doc) {
    await DashboardState.create({ key: "default" });
    doc = await DashboardState.findOne({ key: "default" }).lean();
  }

  return doc;
};

const pushPowerPoint = (doc) => {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");

  doc.histories.power.push({
    time: `${hh}:${mm}`,
    solar: Number(doc.metrics.solarOutputKw.toFixed(1)),
    dg: Number(doc.metrics.dgOutputKw.toFixed(1)),
    load: Number(doc.metrics.loadDemandKw.toFixed(1)),
  });

  if (doc.histories.power.length > MAX_POWER_POINTS) {
    doc.histories.power.shift();
  }
};

const bumpSavingsHistory = (doc, deltaInr) => {
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today = dayNames[new Date().getDay()];
  const target = doc.histories.savings.find((entry) => entry.day === today);

  if (target) {
    target.savings = Math.max(0, Math.round(target.savings + deltaInr));
  }
};

const getSnapshot = async () => {
  const doc = await ensureDashboardState();

  return {
    updatedAt: doc.updatedAt,
    metrics: doc.metrics,
    controls: doc.controls,
    histories: doc.histories,
    alerts: doc.alerts,
  };
};

const addTelemetry = async (payload) => {
  const doc = await ensureDashboardState();

  const now = new Date();
  const elapsedHours = Math.max((now - new Date(doc.lastTelemetryAt)) / (1000 * 60 * 60), 0);

  const hasSolarOutputKw = payload.solarOutputKw !== undefined;
  const hasLegacySolar = payload.actual_watts !== undefined;
  if (hasSolarOutputKw || hasLegacySolar) {
    doc.metrics.solarOutputKw = numberOrFallback(
      hasSolarOutputKw ? payload.solarOutputKw : payload.actual_watts,
      doc.metrics.solarOutputKw
    );
  }

  const hasDgOutputKw = payload.dgOutputKw !== undefined;
  const hasLegacyDgStatus = payload.dg_status !== undefined;
  if (hasDgOutputKw || hasLegacyDgStatus) {
    doc.metrics.dgOutputKw = numberOrFallback(
      hasDgOutputKw ? payload.dgOutputKw : (Boolean(payload.dg_status) ? doc.metrics.dgOutputKw : 0),
      doc.metrics.dgOutputKw
    );
  }

  const hasLoadDemandKw = payload.loadDemandKw !== undefined;
  const hasLegacyFactoryLoad = payload.factory_load !== undefined;
  if (hasLoadDemandKw || hasLegacyFactoryLoad) {
    doc.metrics.loadDemandKw = numberOrFallback(
      hasLoadDemandKw ? payload.loadDemandKw : payload.factory_load,
      doc.metrics.loadDemandKw
    );
  }

  if (payload.throttlePercent !== undefined) {
    doc.metrics.throttlePercent = clamp(numberOrFallback(payload.throttlePercent, doc.metrics.throttlePercent), 0, 100);
  }

  if (payload.safeMode !== undefined || payload.mode !== undefined) {
    doc.metrics.safeMode = Boolean(payload.safeMode);
    if (payload.safeMode === undefined) {
      doc.metrics.safeMode = String(payload.mode).toLowerCase().includes("safe");
    }
  }

  if (payload.solarLimitPercent !== undefined) {
    doc.controls.solarLimitPercent = clamp(numberOrFallback(payload.solarLimitPercent, doc.controls.solarLimitPercent), 0, 100);
  }

  if (payload.dgSyncMode !== undefined) {
    doc.controls.dgSyncMode = Boolean(payload.dgSyncMode);
  }

  const fuelSavedInrPerHour = numberOrFallback(payload.fuelSavedInrPerHour, 0);
  const inferredSavingsDelta = fuelSavedInrPerHour * elapsedHours;
  doc.metrics.todaySavingsInr = Math.max(0, Number((doc.metrics.todaySavingsInr + inferredSavingsDelta).toFixed(2)));

  bumpSavingsHistory(doc, inferredSavingsDelta);
  pushPowerPoint(doc);

  if (payload.alert && typeof payload.alert === "string") {
    doc.alerts.unshift(createAlert("info", payload.alert));
  }

  if (!doc.controls.dgSyncMode) {
    doc.alerts.unshift(createAlert("warning", "DG sync mode disabled from control panel"));
  }

  doc.alerts = doc.alerts.slice(0, MAX_ALERTS);
  doc.lastTelemetryAt = now;
  doc.updatedAt = now;

  await DashboardState.updateOne({ key: "default" }, doc);
  return getSnapshot();
};

const updateControls = async (payload) => {
  const doc = await ensureDashboardState();

  if (payload.solarLimitPercent !== undefined) {
    doc.controls.solarLimitPercent = clamp(numberOrFallback(payload.solarLimitPercent, doc.controls.solarLimitPercent), 0, 100);
  }

  if (payload.dgSyncMode !== undefined) {
    doc.controls.dgSyncMode = Boolean(payload.dgSyncMode);
  }

  doc.metrics.throttlePercent = clamp(100 - doc.controls.solarLimitPercent, 0, 100);
  doc.alerts.unshift(
    createAlert(
      "info",
      `Controls updated - Solar limit ${doc.controls.solarLimitPercent}% | DG Sync ${doc.controls.dgSyncMode ? "ON" : "OFF"}`
    )
  );
  doc.alerts = doc.alerts.slice(0, MAX_ALERTS);
  doc.updatedAt = new Date();

  await DashboardState.updateOne({ key: "default" }, doc);
  return getSnapshot();
};

const updateAdminAttributes = async (payload) => {
  const doc = await ensureDashboardState();
  const metricsPayload = payload.metrics && typeof payload.metrics === "object" ? payload.metrics : payload;
  const controlsPayload = payload.controls && typeof payload.controls === "object" ? payload.controls : payload;

  if (metricsPayload.solarOutputKw !== undefined) {
    doc.metrics.solarOutputKw = numberOrFallback(metricsPayload.solarOutputKw, doc.metrics.solarOutputKw);
  }

  if (metricsPayload.dgOutputKw !== undefined) {
    doc.metrics.dgOutputKw = numberOrFallback(metricsPayload.dgOutputKw, doc.metrics.dgOutputKw);
  }

  if (metricsPayload.loadDemandKw !== undefined) {
    doc.metrics.loadDemandKw = numberOrFallback(metricsPayload.loadDemandKw, doc.metrics.loadDemandKw);
  }

  if (metricsPayload.todaySavingsInr !== undefined) {
    doc.metrics.todaySavingsInr = Math.max(0, numberOrFallback(metricsPayload.todaySavingsInr, doc.metrics.todaySavingsInr));
  }

  if (metricsPayload.throttlePercent !== undefined) {
    doc.metrics.throttlePercent = clamp(numberOrFallback(metricsPayload.throttlePercent, doc.metrics.throttlePercent), 0, 100);
  }

  if (metricsPayload.safeMode !== undefined) {
    doc.metrics.safeMode = Boolean(metricsPayload.safeMode);
  }

  if (controlsPayload.solarLimitPercent !== undefined) {
    doc.controls.solarLimitPercent = clamp(numberOrFallback(controlsPayload.solarLimitPercent, doc.controls.solarLimitPercent), 0, 100);
  }

  if (controlsPayload.dgSyncMode !== undefined) {
    doc.controls.dgSyncMode = Boolean(controlsPayload.dgSyncMode);
  }

  if (typeof payload.alertMessage === "string" && payload.alertMessage.trim()) {
    doc.alerts.unshift(createAlert("info", payload.alertMessage.trim()));
  }

  doc.alerts.unshift(createAlert("info", "Admin panel updated dashboard attributes"));
  doc.alerts = doc.alerts.slice(0, MAX_ALERTS);
  doc.updatedAt = new Date();

  await DashboardState.updateOne({ key: "default" }, doc);
  return getSnapshot();
};

module.exports = {
  getSnapshot,
  addTelemetry,
  updateControls,
  updateAdminAttributes,
};
