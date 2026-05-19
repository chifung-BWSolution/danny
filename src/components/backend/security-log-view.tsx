"use client";

import React, { useState } from "react";
import { useAppStore } from "@/lib/store";
import { Shield, Eye, EyeOff, Lock } from "lucide-react";

export function SecurityLogView() {
  const { systemLogs, rolePermissions, addLogEntry } = useAppStore();
  const [tab, setTab] = useState<"log" | "permissions">("log");

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">System Security Log 安全日誌</h1>
        <p className="text-sm text-gray-500 mt-1">Audit trail of all system actions and role-based permission management</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTab("log")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium ${
            tab === "log" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"
          }`}
        >
          <Shield size={14} />
          Action Log
        </button>
        <button
          onClick={() => setTab("permissions")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium ${
            tab === "permissions" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"
          }`}
        >
          <Lock size={14} />
          Role Permissions
        </button>
      </div>

      {tab === "log" && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-700">System Action Log 系統動作日誌</h3>
            <span className="text-xs text-gray-400">{systemLogs.length} entries</span>
          </div>
          <table className="w-full text-xs">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-2 px-4 text-gray-500 font-medium">Timestamp</th>
                <th className="text-left py-2 px-4 text-gray-500 font-medium">User</th>
                <th className="text-left py-2 px-4 text-gray-500 font-medium">Role</th>
                <th className="text-left py-2 px-4 text-gray-500 font-medium">Action</th>
                <th className="text-left py-2 px-4 text-gray-500 font-medium">Details</th>
              </tr>
            </thead>
            <tbody>
              {systemLogs.map((log) => (
                <tr key={log.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="py-2 px-4 text-gray-500 font-mono">{log.timestamp}</td>
                  <td className="py-2 px-4 font-medium text-gray-700">{log.user}</td>
                  <td className="py-2 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                      log.role === "Administrator" ? "bg-red-50 text-red-700" :
                      log.role === "Accountant" ? "bg-purple-50 text-purple-700" :
                      log.role === "System" ? "bg-gray-100 text-gray-600" :
                      "bg-blue-50 text-blue-700"
                    }`}>
                      {log.role}
                    </span>
                  </td>
                  <td className="py-2 px-4 font-medium text-gray-800">{log.action}</td>
                  <td className="py-2 px-4 text-gray-500 max-w-xs truncate">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "permissions" && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700">Role Permission Grid 角色權限設定</h3>
            <p className="text-xs text-gray-400 mt-1">Toggle visibility and access levels for each role</p>
          </div>
          <table className="w-full text-xs">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-2 px-4 text-gray-500 font-medium">Module</th>
                {rolePermissions.map((rp) => (
                  <th key={rp.role} className="text-center py-2 px-4 text-gray-500 font-medium">{rp.role}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.keys(rolePermissions[0].modules).map((module) => (
                <tr key={module} className="border-t border-gray-100">
                  <td className="py-2 px-4 font-medium text-gray-700">{module}</td>
                  {rolePermissions.map((rp) => (
                    <td key={rp.role} className="py-2 px-4 text-center">
                      {rp.modules[module] === "full" && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 rounded">
                          <Eye size={10} /> Full
                        </span>
                      )}
                      {rp.modules[module] === "read-only" && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-50 text-yellow-700 rounded">
                          <Lock size={10} /> Read-Only
                        </span>
                      )}
                      {rp.modules[module] === "hidden" && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-400 rounded">
                          <EyeOff size={10} /> Hidden
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
