"use client";

import React, { useState } from "react";
import { useAppStore } from "@/lib/store";
import { Download, QrCode, Truck, Package, ChefHat } from "lucide-react";

export function LogisticsView() {
  const { orders, students, schools } = useAppStore();
  const [tab, setTab] = useState<"production" | "packing" | "driver" | "qr">("production");

  // Production Summary
  const menuCounts = orders.reduce((acc, o) => {
    if (o.paymentStatus !== "Refunded") {
      acc[o.menuType] = (acc[o.menuType] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Logistics & Production 物流生產</h1>
        <p className="text-sm text-gray-500 mt-1">Production summaries, packing sheets, driver routes, and QR labels</p>
      </div>

      {/* Quick Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { key: "production" as const, label: "Production Summary", icon: ChefHat },
          { key: "packing" as const, label: "Packing Sheet", icon: Package },
          { key: "driver" as const, label: "Driver Sheet", icon: Truck },
          { key: "qr" as const, label: "QR Box Labels", icon: QrCode },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium transition ${
              tab === t.key ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <t.icon size={14} />
            {t.label}
          </button>
        ))}
        <button className="ml-auto flex items-center gap-1.5 px-3 py-2 bg-green-600 text-white rounded-lg text-xs font-medium">
          <Download size={14} />
          Export to Excel
        </button>
      </div>

      {tab === "production" && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-bold text-gray-800 mb-4">Production Summary 生產總表</h3>
          <div className="grid grid-cols-4 gap-4 mb-6">
            {["A", "B", "C", "D"].map((type) => (
              <div key={type} className="bg-blue-50 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-blue-700">{menuCounts[type] || 0}</p>
                <p className="text-xs text-blue-600 mt-1">Set {type}</p>
              </div>
            ))}
          </div>

          <table className="w-full text-xs">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-2 px-3 text-gray-500">School</th>
                <th className="text-center py-2 px-3 text-gray-500">Set A</th>
                <th className="text-center py-2 px-3 text-gray-500">Set B</th>
                <th className="text-center py-2 px-3 text-gray-500">Set C</th>
                <th className="text-center py-2 px-3 text-gray-500">Set D</th>
                <th className="text-center py-2 px-3 text-gray-500">Total</th>
              </tr>
            </thead>
            <tbody>
              {schools.filter((s) => s.contractStatus === "Active").map((school) => {
                const schoolStudents = students.filter((s) => s.schoolId === school.id).map((s) => s.id);
                const schoolOrders = orders.filter(
                  (o) => schoolStudents.includes(o.studentId) && o.paymentStatus !== "Refunded"
                );
                const counts = { A: 0, B: 0, C: 0, D: 0 };
                schoolOrders.forEach((o) => { counts[o.menuType as keyof typeof counts]++; });
                const total = Object.values(counts).reduce((a, b) => a + b, 0);
                return (
                  <tr key={school.id} className="border-t border-gray-100">
                    <td className="py-2 px-3 font-medium">{school.nameZh}</td>
                    <td className="py-2 px-3 text-center">{counts.A}</td>
                    <td className="py-2 px-3 text-center">{counts.B}</td>
                    <td className="py-2 px-3 text-center">{counts.C}</td>
                    <td className="py-2 px-3 text-center">{counts.D}</td>
                    <td className="py-2 px-3 text-center font-bold">{total}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {tab === "packing" && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-bold text-gray-800 mb-4">Packing Summary (Kitchen Box) 包裝總表</h3>
          <table className="w-full text-xs">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-2 px-3 text-gray-500">Box Code</th>
                <th className="text-left py-2 px-3 text-gray-500">School</th>
                <th className="text-left py-2 px-3 text-gray-500">Class</th>
                <th className="text-center py-2 px-3 text-gray-500">Items</th>
                <th className="text-left py-2 px-3 text-gray-500">Type</th>
              </tr>
            </thead>
            <tbody>
              {schools.filter((s) => s.contractStatus === "Active").map((school) =>
                school.classList.slice(0, 4).map((cls) => (
                  <tr key={`${school.id}-${cls}`} className="border-t border-gray-100">
                    <td className="py-2 px-3 font-mono text-blue-600">{school.insulatedBoxCode}-{cls}</td>
                    <td className="py-2 px-3">{school.nameZh}</td>
                    <td className="py-2 px-3">{cls}</td>
                    <td className="py-2 px-3 text-center font-bold">{Math.floor(Math.random() * 15) + 5}</td>
                    <td className="py-2 px-3">
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded">Regular</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {tab === "driver" && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-bold text-gray-800 mb-4">Driver Delivery Sheet 司機派送表</h3>
          <table className="w-full text-xs">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-2 px-3 text-gray-500">Route #</th>
                <th className="text-left py-2 px-3 text-gray-500">Driver</th>
                <th className="text-left py-2 px-3 text-gray-500">School</th>
                <th className="text-left py-2 px-3 text-gray-500">ETA</th>
                <th className="text-center py-2 px-3 text-gray-500">Boxes</th>
                <th className="text-left py-2 px-3 text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { route: "R001", driver: "Wong Siu Fung", school: "聖瑪利小學", eta: "11:00", boxes: 6, status: "En Route" },
                { route: "R002", driver: "Chan Tat Ming", school: "屯門天主教小學", eta: "11:15", boxes: 8, status: "Loading" },
                { route: "R003", driver: "Lam Ka Fai", school: "觀塘浸信會小學", eta: "11:30", boxes: 4, status: "Pending" },
              ].map((route) => (
                <tr key={route.route} className="border-t border-gray-100">
                  <td className="py-2 px-3 font-mono">{route.route}</td>
                  <td className="py-2 px-3">{route.driver}</td>
                  <td className="py-2 px-3">{route.school}</td>
                  <td className="py-2 px-3">{route.eta}</td>
                  <td className="py-2 px-3 text-center font-bold">{route.boxes}</td>
                  <td className="py-2 px-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      route.status === "En Route" ? "bg-green-50 text-green-700" :
                      route.status === "Loading" ? "bg-yellow-50 text-yellow-700" :
                      "bg-gray-50 text-gray-600"
                    }`}>
                      {route.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "qr" && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-bold text-gray-800 mb-4">QR Insulated Box Labels 保溫箱標籤</h3>
          <p className="text-xs text-gray-500 mb-4">Scan to confirm delivery. Drivers tap QR to stamp timestamp.</p>
          <div className="grid grid-cols-3 gap-4">
            {[
              { code: "IB-SM-001-3A", type: "Regular", school: "聖瑪利", cls: "3A" },
              { code: "IB-SM-001-SNK", type: "Snacks", school: "聖瑪利", cls: "ALL" },
              { code: "IB-TM-002-4A", type: "Regular", school: "屯門天主教", cls: "4A" },
              { code: "IB-KT-003-6A", type: "Regular", school: "觀塘浸信會", cls: "6A" },
              { code: "IB-SM-001-EXT", type: "Extra Orders", school: "聖瑪利", cls: "MISC" },
              { code: "IB-TM-002-SNK", type: "Snacks", school: "屯門天主教", cls: "ALL" },
            ].map((box) => (
              <div key={box.code} className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center">
                {/* Simulated QR Code */}
                <div className="w-24 h-24 mx-auto mb-3 bg-gray-900 rounded-lg flex items-center justify-center relative">
                  <div className="grid grid-cols-5 grid-rows-5 gap-0.5 w-16 h-16">
                    {Array.from({ length: 25 }).map((_, i) => (
                      <div
                        key={i}
                        className={`${Math.random() > 0.4 ? "bg-white" : "bg-gray-900"}`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs font-mono font-bold text-gray-800">{box.code}</p>
                <p className="text-[10px] text-gray-500 mt-1">{box.school} | {box.cls}</p>
                <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-medium ${
                  box.type === "Regular" ? "bg-blue-50 text-blue-700" :
                  box.type === "Snacks" ? "bg-orange-50 text-orange-700" :
                  "bg-purple-50 text-purple-700"
                }`}>
                  {box.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
