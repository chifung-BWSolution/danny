"use client";

import React, { useState } from "react";
import { useAppStore } from "@/lib/store";
import { Search, FileText, Download, Plus, Eye } from "lucide-react";

export function SchoolMgtView() {
  const { schools } = useAppStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "Active" | "Expired">("all");
  const [selectedSchool, setSelectedSchool] = useState<string | null>(null);

  const filteredSchools = schools.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.nameZh.includes(searchQuery) ||
      s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || s.contractStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const selected = schools.find((s) => s.id === selectedSchool);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">學校管理</h1>
          <p className="text-sm text-gray-500 mt-1">管理學校、班級、假期及合約</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 px-3 py-2 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700">
            <Download size={14} />
            匯出PDF訂餐卡
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 bg-purple-600 text-white rounded-lg text-xs font-medium hover:bg-purple-700">
            <FileText size={14} />
            生成登入通知
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="按名稱、編號、地區、地址搜尋..."
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
        >
          <option value="all">所有狀態</option>
          <option value="Active">生效中</option>
          <option value="Expired">已過期</option>
        </select>
      </div>

      {/* Schools Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
        <table className="w-full text-xs">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-3 px-4 text-gray-500 font-medium">編號</th>
              <th className="text-left py-3 px-4 text-gray-500 font-medium">學校名稱</th>
              <th className="text-left py-3 px-4 text-gray-500 font-medium">地區</th>
              <th className="text-left py-3 px-4 text-gray-500 font-medium">班別</th>
              <th className="text-left py-3 px-4 text-gray-500 font-medium">每餐價格</th>
              <th className="text-left py-3 px-4 text-gray-500 font-medium">最低訂單</th>
              <th className="text-left py-3 px-4 text-gray-500 font-medium">狀態</th>
              <th className="text-left py-3 px-4 text-gray-500 font-medium">操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredSchools.map((school) => (
              <tr key={school.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 font-mono text-gray-600">{school.id}</td>
                <td className="py-3 px-4">
                  <p className="font-medium text-gray-800">{school.nameZh}</p>
                  <p className="text-gray-500">{school.name}</p>
                </td>
                <td className="py-3 px-4 text-gray-600">{school.area}</td>
                <td className="py-3 px-4 text-gray-600">{school.classList.length}</td>
                <td className="py-3 px-4 text-gray-600">HK${school.singleMealPrice}</td>
                <td className="py-3 px-4 text-gray-600">{school.moqPerClass}/班</td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-medium ${
                      school.contractStatus === "Active"
                        ? "bg-green-50 text-green-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    {school.contractStatus}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => setSelectedSchool(school.id)}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <Eye size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* School Detail */}
      {selected && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800">{selected.nameZh} 詳情</h3>
            <button onClick={() => setSelectedSchool(null)} className="text-xs text-gray-400 hover:text-gray-700">
              關閉 ✕
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500">地址</p>
              <p className="text-sm font-medium mt-1">{selected.address}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500">保溫箱編號</p>
              <p className="text-sm font-medium mt-1">{selected.insulatedBoxCode}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500">訂餐截止時間</p>
              <p className="text-sm font-medium mt-1">{selected.orderDeadlineHours} 小時前</p>
            </div>
          </div>

          <h4 className="text-sm font-semibold text-gray-700 mb-2">班級列表及控制</h4>
          <div className="grid grid-cols-6 gap-2 mb-4">
            {selected.classList.map((cls) => (
              <div key={cls} className="bg-blue-50 border border-blue-200 rounded-lg p-2 text-center">
                <p className="text-xs font-semibold text-blue-700">{cls}</p>
                <p className="text-[10px] text-blue-500">最低: {selected.moqPerClass}</p>
              </div>
            ))}
          </div>

          {selected.holidays.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">學校假期</h4>
              <div className="flex gap-2 flex-wrap">
                {selected.holidays.map((h) => (
                  <span key={h} className="px-2 py-1 bg-red-50 text-red-600 rounded text-xs">{h}</span>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <button className="px-3 py-2 bg-blue-600 text-white rounded-lg text-xs font-medium">
              編輯學校資料
            </button>
            <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium">
              設定班級假期
            </button>
            <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium">
              上傳合約
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
