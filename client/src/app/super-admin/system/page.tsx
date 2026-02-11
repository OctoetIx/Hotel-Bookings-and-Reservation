"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import api from "@/lib/api";

interface SystemSettings {
  maintenanceMode: boolean;
  commissionRate: number;
  currency: string;
}

export default function SuperAdminSystemPage() {
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get("/super-admin/system").then((res) => {
      setSettings(res.data);
    });
  }, []);

  const updateSettings = async () => {
    if (!settings) return;

    setLoading(true);
    await api.put("/super-admin/system", settings);
    setLoading(false);
  };

  if (!settings) return null;

  return (
    <div className="min-h-screen bg-neutral-100">
      <Navbar />

      <div className="pt-28 max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-semibold mb-6">
          System Settings
        </h1>

        <div className="bg-white rounded-2xl shadow p-6 space-y-6">
          {/* Maintenance Mode */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Maintenance Mode</p>
              <p className="text-sm text-neutral-500">
                Disable bookings temporarily
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.maintenanceMode}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  maintenanceMode: e.target.checked,
                })
              }
              className="h-5 w-5"
            />
          </div>

          {/* Commission */}
          <div>
            <label className="block font-medium mb-1">
              Platform Commission (%)
            </label>
            <input
              type="number"
              value={settings.commissionRate}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  commissionRate: Number(e.target.value),
                })
              }
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          {/* Currency */}
          <div>
            <label className="block font-medium mb-1">
              Default Currency
            </label>
            <select
              value={settings.currency}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  currency: e.target.value,
                })
              }
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="NGN">NGN</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
          </div>

          <button
            onClick={updateSettings}
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded-lg"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}