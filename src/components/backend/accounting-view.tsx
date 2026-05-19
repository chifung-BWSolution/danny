"use client";

import React, { useState } from "react";
import { useAppStore } from "@/lib/store";
import { Lock, Download, FileText, Calculator } from "lucide-react";
import { format } from "date-fns";

export function AccountingView() {
  const { students, orders, frozenMonths, freezeMonth, toggleSubsidized } = useAppStore();
  const [tab, setTab] = useState<"subsidized" | "invoice" | "freeze">("subsidized");
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), "yyyy-MM"));

  const subsidizedStudents = students.filter((s) => s.subsidized);
  const isFrozen = frozenMonths.includes(selectedMonth);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Accounting Center 會計中心</h1>
        <p className="text-sm text-gray-500 mt-1">Subsidized accounts, invoicing, and data freeze controls</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { key: "subsidized" as const, label: "關愛基金 Subsidized", icon: Calculator },
          { key: "invoice" as const, label: "Invoice Renderer", icon: FileText },
          { key: "freeze" as const, label: "Data Freeze", icon: Lock },
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
      </div>

      {tab === "subsidized" && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-bold text-gray-800 mb-4">關愛基金 Subsidized Students 資助學生列表</h3>
          <table className="w-full text-xs">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-2 px-3 text-gray-500">ID</th>
                <th className="text-left py-2 px-3 text-gray-500">Name</th>
                <th className="text-left py-2 px-3 text-gray-500">School</th>
                <th className="text-left py-2 px-3 text-gray-500">Class</th>
                <th className="text-center py-2 px-3 text-gray-500">Orders This Month</th>
                <th className="text-center py-2 px-3 text-gray-500">Amount Due</th>
                <th className="text-left py-2 px-3 text-gray-500">Status</th>
                <th className="text-left py-2 px-3 text-gray-500">Toggle</th>
              </tr>
            </thead>
            <tbody>
              {subsidizedStudents.map((student) => {
                const studentOrders = orders.filter(
                  (o) => o.studentId === student.id && o.paymentStatus === "Subsidized"
                );
                const amount = studentOrders.length * 28;
                return (
                  <tr key={student.id} className="border-t border-gray-100">
                    <td className="py-2 px-3 font-mono">{student.id}</td>
                    <td className="py-2 px-3">
                      <p className="font-medium">{student.nameZh}</p>
                      <p className="text-gray-400">{student.name}</p>
                    </td>
                    <td className="py-2 px-3">{student.schoolId}</td>
                    <td className="py-2 px-3">{student.className}</td>
                    <td className="py-2 px-3 text-center font-bold">{studentOrders.length}</td>
                    <td className="py-2 px-3 text-center font-bold text-purple-700">HK${amount}</td>
                    <td className="py-2 px-3">
                      <span className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded font-medium">Active</span>
                    </td>
                    <td className="py-2 px-3">
                      <button
                        onClick={() => toggleSubsidized(student.id)}
                        className="px-2 py-1 bg-red-50 text-red-600 rounded text-[10px] hover:bg-red-100"
                        disabled={isFrozen}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {tab === "invoice" && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-gray-800">Care Welfare Invoice & Receipt 關愛基金發票</h3>
            <button className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium">
              <Download size={12} />
              Export to Excel
            </button>
          </div>

          {/* Invoice Preview */}
          <div className="border border-gray-300 rounded-lg p-6 bg-gray-50">
            <div className="text-center mb-4">
              <h2 className="text-lg font-bold">Danny Kitchen Limited</h2>
              <p className="text-xs text-gray-500">Care Welfare Fund Invoice 關愛基金發票及收據</p>
              <p className="text-xs text-gray-400 mt-1">Period: {selectedMonth}</p>
            </div>

            <div className="border-t border-b border-gray-300 py-3 my-4">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-1 text-gray-500">Student</th>
                    <th className="text-center py-1 text-gray-500">School Days</th>
                    <th className="text-center py-1 text-gray-500">Present</th>
                    <th className="text-center py-1 text-gray-500">Absent</th>
                    <th className="text-right py-1 text-gray-500">Amount</th>
                    <th className="text-right py-1 text-gray-500">Arrears</th>
                  </tr>
                </thead>
                <tbody>
                  {subsidizedStudents.map((student) => {
                    const present = Math.floor(Math.random() * 5) + 15;
                    const absent = 20 - present;
                    const amount = present * 28;
                    const arrears = absent > 2 ? absent * 28 : 0;
                    return (
                      <tr key={student.id} className="border-b border-gray-100">
                        <td className="py-1">{student.nameZh} ({student.className})</td>
                        <td className="py-1 text-center">20</td>
                        <td className="py-1 text-center text-green-600">{present}</td>
                        <td className="py-1 text-center text-red-600">{absent}</td>
                        <td className="py-1 text-right font-medium">HK${amount}</td>
                        <td className="py-1 text-right text-red-600">{arrears > 0 ? `HK$${arrears}` : "-"}</td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="border-t border-gray-300 font-bold">
                    <td className="py-2">Total 總計</td>
                    <td className="py-2 text-center">-</td>
                    <td className="py-2 text-center">-</td>
                    <td className="py-2 text-center">-</td>
                    <td className="py-2 text-right">HK${subsidizedStudents.length * 28 * 18}</td>
                    <td className="py-2 text-right text-red-600">HK$168</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="text-center text-[10px] text-gray-400 mt-4">
              <p>Generated: {format(new Date(), "yyyy-MM-dd HH:mm")}</p>
              <p>Danny Kitchen Limited | License #FL-2024-0382</p>
            </div>
          </div>
        </div>
      )}

      {tab === "freeze" && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-bold text-gray-800 mb-4">Data Freeze Control 數據凍結</h3>
          <p className="text-sm text-gray-500 mb-4">
            Once frozen, all accounting records for that month become read-only and cannot be modified.
          </p>

          <div className="flex items-center gap-4 mb-6">
            <div>
              <label className="text-xs text-gray-500 font-medium">Select Month</label>
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
              />
            </div>
            <div className="flex items-end">
              {isFrozen ? (
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                  <Lock size={14} className="text-blue-600" />
                  <span className="text-sm text-blue-700 font-medium">🔒 Month Frozen (Read-Only)</span>
                </div>
              ) : (
                <button
                  onClick={() => freezeMonth(selectedMonth)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700"
                >
                  <Lock size={14} />
                  Freeze Month Data
                </button>
              )}
            </div>
          </div>

          {/* Frozen months list */}
          {frozenMonths.length > 0 && (
            <div>
              <h4 className="text-xs font-medium text-gray-500 mb-2">Frozen Months:</h4>
              <div className="flex gap-2 flex-wrap">
                {frozenMonths.map((m) => (
                  <span key={m} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium border border-blue-200">
                    🔒 {m}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
