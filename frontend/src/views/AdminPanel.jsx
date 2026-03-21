"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

const AdminPanel = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [formState, setFormState] = useState({
    solarOutputKw: 0,
    dgOutputKw: 0,
    loadDemandKw: 0,
    todaySavingsInr: 0,
    throttlePercent: 0,
    safeMode: false,
    solarLimitPercent: 0,
    dgSyncMode: true,
    alertMessage: "",
  });

  const updateField = (key, value) => {
    setFormState((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  useEffect(() => {
    const loadCurrentValues = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/dashboard`, {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`Unable to load admin values (${response.status})`);
        }

        const json = await response.json();
        const data = json?.data;

        if (!json?.success || !data) {
          throw new Error("Invalid dashboard response");
        }

        setFormState((prev) => ({
          ...prev,
          solarOutputKw: Number(data.metrics?.solarOutputKw ?? 0),
          dgOutputKw: Number(data.metrics?.dgOutputKw ?? 0),
          loadDemandKw: Number(data.metrics?.loadDemandKw ?? 0),
          todaySavingsInr: Number(data.metrics?.todaySavingsInr ?? 0),
          throttlePercent: Number(data.metrics?.throttlePercent ?? 0),
          safeMode: Boolean(data.metrics?.safeMode),
          solarLimitPercent: Number(data.controls?.solarLimitPercent ?? 0),
          dgSyncMode: Boolean(data.controls?.dgSyncMode),
        }));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load values");
      } finally {
        setLoading(false);
      }
    };

    loadCurrentValues();
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const payload = {
        metrics: {
          solarOutputKw: Number(formState.solarOutputKw),
          dgOutputKw: Number(formState.dgOutputKw),
          loadDemandKw: Number(formState.loadDemandKw),
          todaySavingsInr: Number(formState.todaySavingsInr),
          throttlePercent: Number(formState.throttlePercent),
          safeMode: Boolean(formState.safeMode),
        },
        controls: {
          solarLimitPercent: Number(formState.solarLimitPercent),
          dgSyncMode: Boolean(formState.dgSyncMode),
        },
        alertMessage: formState.alertMessage,
      };

      const response = await fetch(`${API_BASE}/api/dashboard/admin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Failed to save admin values (${response.status})`);
      }

      const json = await response.json();

      if (!json?.success) {
        throw new Error(json?.message || "Save failed");
      }

      setMessage("Saved successfully. Changes were posted to backend and persisted to DB.");
      setFormState((prev) => ({
        ...prev,
        alertMessage: "",
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const numberInputClass = "w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground";

  return (
    <main className="min-h-screen bg-background p-6 lg:p-10">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-foreground">Temporary Admin Panel</h1>
          <Link href="/dashboard" className="text-sm text-primary underline-offset-4 hover:underline">
            Back to Dashboard
          </Link>
        </div>

        <p className="text-sm text-muted-foreground">
          Edit backend attributes, then click POST to persist updates in MongoDB.
        </p>

        <form onSubmit={onSubmit} className="space-y-6 rounded-xl border border-border bg-card p-5">
          <section className="space-y-3">
            <h2 className="text-base font-semibold text-foreground">Metrics</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="space-y-1 text-sm text-foreground">
                Solar Output (kW)
                <input type="number" step="0.1" className={numberInputClass} value={formState.solarOutputKw} onChange={(e) => updateField("solarOutputKw", e.target.value)} disabled={loading || saving} />
              </label>
              <label className="space-y-1 text-sm text-foreground">
                DG Output (kW)
                <input type="number" step="0.1" className={numberInputClass} value={formState.dgOutputKw} onChange={(e) => updateField("dgOutputKw", e.target.value)} disabled={loading || saving} />
              </label>
              <label className="space-y-1 text-sm text-foreground">
                Load Demand (kW)
                <input type="number" step="0.1" className={numberInputClass} value={formState.loadDemandKw} onChange={(e) => updateField("loadDemandKw", e.target.value)} disabled={loading || saving} />
              </label>
              <label className="space-y-1 text-sm text-foreground">
                Today Savings (INR)
                <input type="number" step="1" className={numberInputClass} value={formState.todaySavingsInr} onChange={(e) => updateField("todaySavingsInr", e.target.value)} disabled={loading || saving} />
              </label>
              <label className="space-y-1 text-sm text-foreground">
                Throttle (%)
                <input type="number" min="0" max="100" className={numberInputClass} value={formState.throttlePercent} onChange={(e) => updateField("throttlePercent", e.target.value)} disabled={loading || saving} />
              </label>
              <label className="flex items-center gap-2 pt-6 text-sm text-foreground">
                <input type="checkbox" checked={formState.safeMode} onChange={(e) => updateField("safeMode", e.target.checked)} disabled={loading || saving} />
                Safe Mode
              </label>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-foreground">Controls</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="space-y-1 text-sm text-foreground">
                Solar Limit (%)
                <input type="number" min="0" max="100" className={numberInputClass} value={formState.solarLimitPercent} onChange={(e) => updateField("solarLimitPercent", e.target.value)} disabled={loading || saving} />
              </label>
              <label className="flex items-center gap-2 pt-6 text-sm text-foreground">
                <input type="checkbox" checked={formState.dgSyncMode} onChange={(e) => updateField("dgSyncMode", e.target.checked)} disabled={loading || saving} />
                DG Sync Mode
              </label>
            </div>
          </section>

          <section className="space-y-1">
            <label className="text-sm text-foreground">Alert Message (optional)</label>
            <input type="text" className={numberInputClass} placeholder="Add a one-time note in alerts" value={formState.alertMessage} onChange={(e) => updateField("alertMessage", e.target.value)} disabled={loading || saving} />
          </section>

          <div className="flex items-center gap-3">
            <button type="submit" disabled={loading || saving} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:brightness-110 disabled:opacity-60">
              {saving ? "Posting..." : "POST Changes"}
            </button>
            {loading && <p className="text-sm text-muted-foreground">Loading current values...</p>}
            {message && <p className="text-sm text-green-600">{message}</p>}
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>
        </form>
      </div>
    </main>
  );
};

export default AdminPanel;
