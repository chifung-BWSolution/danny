"use client";

import React, { useState } from "react";
import { useAppStore } from "@/lib/store";
import { AlertTriangle, CloudLightning, ArrowRightLeft } from "lucide-react";
import { format } from "date-fns";

export function RefundCloudView() {
  const { batchRefund, swapMeals, schools, orders, students } = useAppStore();
  const [tab, setTab] = useState<"emergency" | "swap">("emergency");
  const [emergencyDate, setEmergencyDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [emergencyReason, setEmergencyReason] = useState("Black Rain Signal");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [swapDone, setSwapDone] = useState(false);

  // Swap State
  const [swapSchool, setSwapSchool] = useState("SCH001");
  const [swapClass, setSwapClass] = useState("3A");
  const [swapDate, setSwapDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [swapFrom, setSwapFrom] = useState("A");
  const [swapTo, setSwapTo] = useState("B");

  const handleEmergencyRefund = () => {
    batchRefund(emergencyDate, emergencyReason);
    setShowConfirmation(true);
    setTimeout(() => setShowConfirmation(false), 4000);
  };

  const handleSwap = () => {
    swapMeals(swapSchool, swapClass, swapDate, swapFrom, swapTo);
    setSwapDone(true);
    setTimeout(() => setSwapDone(false), 3000);
  };

  const affectedOrders = orders.filter((o) => o.date === emergencyDate && o.paymentStatus !== "Refunded");

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Refund & Cloud Control 退款控制</h1>
        <p className="text-sm text-gray-500 mt-1">Emergency batch refunds and class-wide meal swapping</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTab("emergency")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium ${
            tab === "emergency" ? "bg-red-600 text-white" : "bg-gray-100 text-gray-600"
          }`}
        >
          <CloudLightning size={14} />
          Emergency Batch Refund
        </button>
        <button
          onClick={() => setTab("swap")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium ${
            tab === "swap" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"
          }`}
        >
          <ArrowRightLeft size={14} />
          Class Meal Swap
        </button>
      </div>

      {tab === "emergency" && (
        <div className="bg-white rounded-xl border border-red-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="text-red-500" size={20} />
            <h3 className="text-lg font-bold text-red-700">Emergency Black Rain / Typhoon Batch Refund</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            一鍵批量退款 — This action will cancel ALL meals for ALL schools on the selected date, bypass the 30-day freeze period, and immediately process refunds.
          </p>

          <div className="bg-red-50 border border-red-100 rounded-lg p-4 mb-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 font-medium">Date 日期</label>
                <input
                  type="date"
                  value={emergencyDate}
                  onChange={(e) => setEmergencyDate(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 font-medium">Reason 原因</label>
                <select
                  value={emergencyReason}
                  onChange={(e) => setEmergencyReason(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                >
                  <option>Black Rain Signal</option>
                  <option>Typhoon Signal No.8+</option>
                  <option>School Closure (Other)</option>
                  <option>Health Emergency</option>
                </select>
              </div>
            </div>
            <p className="text-xs text-red-600 mt-3 font-medium">
              ⚠️ Affected Orders: {affectedOrders.length} orders will be cancelled
            </p>
          </div>

          <button
            onClick={handleEmergencyRefund}
            className="px-6 py-3 bg-red-600 text-white rounded-lg font-medium text-sm hover:bg-red-700 transition"
          >
            🚨 Execute Emergency Batch Refund
          </button>

          {showConfirmation && (
            <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-sm text-green-700 font-medium">
                ✓ Batch refund processed. {affectedOrders.length} orders refunded. 30-day freeze bypassed. Event logged.
              </p>
            </div>
          )}
        </div>
      )}

      {tab === "swap" && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Class-wide Meal Swap 全班轉餐</h3>
          <p className="text-sm text-gray-500 mb-4">
            Select a school, class, and date to swap all orders from one set to another.
          </p>

          <div className="grid grid-cols-5 gap-3 mb-6">
            <div>
              <label className="text-xs text-gray-500 font-medium">School</label>
              <select
                value={swapSchool}
                onChange={(e) => setSwapSchool(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
              >
                {schools.map((s) => (
                  <option key={s.id} value={s.id}>{s.nameZh}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium">Class</label>
              <select
                value={swapClass}
                onChange={(e) => setSwapClass(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
              >
                {schools.find((s) => s.id === swapSchool)?.classList.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium">Date</label>
              <input
                type="date"
                value={swapDate}
                onChange={(e) => setSwapDate(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium">From Set</label>
              <select
                value={swapFrom}
                onChange={(e) => setSwapFrom(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
              >
                {["A", "B", "C", "D"].map((t) => (
                  <option key={t} value={t}>Set {t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium">To Set</label>
              <select
                value={swapTo}
                onChange={(e) => setSwapTo(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
              >
                {["A", "B", "C", "D"].map((t) => (
                  <option key={t} value={t}>Set {t}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleSwap}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 transition"
          >
            Execute Swap 執行轉餐
          </button>

          {swapDone && (
            <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-sm text-green-700 font-medium">
                ✓ Meal swap completed. All Set {swapFrom} orders changed to Set {swapTo}. Insulated box logistics updated.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
