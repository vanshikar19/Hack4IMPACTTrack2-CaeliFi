"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import LiveCards from "@/components/dashboard/LiveCards";
import EnergyFlow from "@/components/dashboard/EnergyFlow";
import DashboardCharts from "@/components/dashboard/DashboardCharts";
import DashboardControls from "@/components/dashboard/DashboardControls";
import AlertsPanel from "@/components/dashboard/AlertsPanel";

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

const numberOrFallback = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const normalizeDashboardPayload = (payload) => {
  const base = payload?.data ?? payload ?? {};

  if (base.metrics || base.controls || base.histories || base.alerts) {
    return base;
  }

  const solarFromLegacy = base.actual_watts !== undefined
    ? numberOrFallback(base.actual_watts, 0)
    : numberOrFallback(base.solarOutputKw, 0);

  const dgFromLegacy = base.dg_status !== undefined
    ? (Boolean(base.dg_status) ? Math.max(numberOrFallback(base.dgOutputKw, 0), 1) : 0)
    : numberOrFallback(base.dgOutputKw, 0);

  const loadFromLegacy = base.factory_load !== undefined
    ? numberOrFallback(base.factory_load, 0)
    : numberOrFallback(base.loadDemandKw, 0);

  const safeModeFromLegacy = base.safeMode !== undefined
    ? Boolean(base.safeMode)
    : String(base.mode || "").toLowerCase().includes("safe");

  return {
    updatedAt: base.updatedAt || new Date().toISOString(),
    metrics: {
      solarOutputKw: solarFromLegacy,
      dgOutputKw: dgFromLegacy,
      loadDemandKw: loadFromLegacy,
      todaySavingsInr: numberOrFallback(base.todaySavingsInr, 0),
      safeMode: safeModeFromLegacy,
      throttlePercent: numberOrFallback(base.throttlePercent, 0),
    },
  };
};

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState("dashboard");
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [streamStatus, setStreamStatus] = useState("connecting");
    const [streamDebug, setStreamDebug] = useState({
      lastRawEvent: "",
      lastParsedEvent: null,
      lastEventAt: "",
    });

    const getDashboardSnapshot = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/dashboard`, {
          method: "GET",
          cache: "no-store",
        });
        const json = await response.json();
        if (json?.success && json?.data) {
          setDashboardData(json.data);
          setError("");
        }
      } catch (err) {
        setError("Could not load initial dashboard data");
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      let mounted = true;

      getDashboardSnapshot();

      const eventSource = new EventSource(`${API_BASE}/api/dashboard/stream`);

      eventSource.onopen = () => {
        if (mounted) {
          setStreamStatus("connected");
          console.log("[SSE] Stream connected");
        }
      };

      eventSource.onmessage = (event) => {
        if (mounted) {
          try {
            console.log("[SSE] Raw livestream event:", event.data);
            const liveData = JSON.parse(event.data);
            const normalizedData = normalizeDashboardPayload(liveData);
            console.log("[SSE] Parsed livestream payload:", normalizedData);
            setStreamDebug({
              lastRawEvent: event.data,
              lastParsedEvent: normalizedData,
              lastEventAt: new Date().toLocaleTimeString(),
            });
            setDashboardData((prev) => ({
              ...(prev || {}),
              ...normalizedData,
              metrics: {
                ...((prev && prev.metrics) || {}),
                ...((normalizedData && normalizedData.metrics) || {}),
              },
              controls: {
                ...((prev && prev.controls) || {}),
                ...((normalizedData && normalizedData.controls) || {}),
              },
              histories: {
                ...((prev && prev.histories) || {}),
                ...((normalizedData && normalizedData.histories) || {}),
              },
              alerts: normalizedData.alerts || (prev && prev.alerts) || [],
            }));
            setError("");
          } catch (e) {
            console.error("Error parsing stream data", e);
          }
        }
      };

      eventSource.onerror = () => {
        if (mounted) {
          setStreamStatus("disconnected");
          setError("Live stream disconnected. Attempting to reconnect...");
        }
      };

      return () => {
        mounted = false;
        eventSource.close();
      };
    }, []);

    const handleControlsUpdate = async (patch) => {
      try {
        const response = await fetch(`${API_BASE}/api/dashboard/controls`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(patch),
        });
        const json = await response.json();
        if (json?.success && json?.data) {
          setDashboardData(json.data);
        }
      } catch (err) {
        console.error("Control update failed", err);
      }
    };

    const statusText = useMemo(() => {
      if (loading) return "Loading real-time data...";
      if (error) return error;
      return "Live real-time monitoring connected";
    }, [loading, error]);

    return (
      <div className="flex min-h-screen bg-background">
        <DashboardSidebar active={activeTab} onNavigate={setActiveTab}/>
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground">
              {activeTab === "dashboard" && "Dashboard"}
              {activeTab === "energy" && "Energy Flow"}
              {activeTab === "savings" && "Savings"}
              {activeTab === "alerts" && "Alerts"}
              {activeTab === "settings" && "Settings"}
            </h1>
            <p className={`text-sm mt-1 ${error ? "text-warning" : "text-success"}`}>
              {statusText}
            </p>
            <div className="mt-3 w-full max-w-md rounded-lg border border-border/60 bg-muted/20 p-3 text-xs">
              <p className="text-foreground">
                Stream status: <span className={streamStatus === "connected" ? "text-success" : streamStatus === "connecting" ? "text-warning" : "text-danger"}>{streamStatus}</span>
              </p>
              <p className="text-muted-foreground mt-1">Last event: {streamDebug.lastEventAt || "No event received yet"}</p>
              <pre className="mt-2 max-h-20 overflow-x-auto overflow-y-hidden rounded bg-background/60 p-2 text-[11px] text-muted-foreground whitespace-pre-wrap break-words">
                {streamDebug.lastRawEvent || "Waiting for stream data..."}
              </pre>
            </div>
          </div>

          {(activeTab === "dashboard" || activeTab === "energy" || activeTab === "savings") && (
            <div className="space-y-6">
              <LiveCards
                metrics={dashboardData?.metrics}
                controls={dashboardData?.controls}
                updatedAt={dashboardData?.updatedAt}
              />
              <EnergyFlow metrics={dashboardData?.metrics} />
              <DashboardCharts histories={dashboardData?.histories} />
              <div className="grid lg:grid-cols-2 gap-4">
                <DashboardControls
                  controls={dashboardData?.controls}
                  onUpdateControls={handleControlsUpdate}
                />
                <AlertsPanel alerts={dashboardData?.alerts} />
              </div>
            </div>
          )}

          {activeTab === "alerts" && (<AlertsPanel alerts={dashboardData?.alerts} />)}

          {activeTab === "settings" && (
            <div className="glass rounded-xl p-8 max-w-lg">
              <h3 className="font-semibold text-foreground mb-4">Device Settings</h3>
              <div className="space-y-4 text-sm text-muted-foreground">
                <div className="flex justify-between"><span>Device ID</span><span className="font-mono text-foreground">CF-2026-0847</span></div>
                <div className="flex justify-between"><span>Firmware</span><span className="font-mono text-foreground">v2.3.8</span></div>
                <div className="flex justify-between"><span>Connection</span><span className="text-success">Live Stream Active</span></div>
              </div>
            </div>
          )}
        </main>
      </div>
    );
};
export default Dashboard;