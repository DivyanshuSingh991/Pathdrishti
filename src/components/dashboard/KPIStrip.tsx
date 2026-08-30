import React from 'react';
import { Car, Camera, Gauge, AlertTriangle, ShieldAlert } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const KPIStrip: React.FC = () => {
  const { stats } = useApp();

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-4">
      {/* 1. Vehicles Tracked Today */}
      <div className="bg-white border border-gray-200 rounded p-3 flex flex-col justify-between">
        <div className="flex items-center justify-between text-gray-500 mb-1">
          <span className="text-xs font-medium text-gray-600">Vehicles tracked today</span>
          <Car className="w-4 h-4 text-gray-400" />
        </div>
        <div className="flex items-baseline space-x-1.5">
          <span className="text-2xl font-bold font-mono tracking-tight text-gray-900">
            {stats.totalVehiclesTracked}
          </span>
          <span className="text-[11px] text-gray-500">
            ({stats.totalDetectionsToday} reads)
          </span>
        </div>
        <div className="text-[11px] text-gray-500 mt-1 flex items-center justify-between border-t border-gray-100 pt-1">
          <span>Unique plates</span>
          <span className="text-emerald-600 font-medium">100% indexed</span>
        </div>
      </div>

      {/* 2. Active Cameras */}
      <div className="bg-white border border-gray-200 rounded p-3 flex flex-col justify-between">
        <div className="flex items-center justify-between text-gray-500 mb-1">
          <span className="text-xs font-medium text-gray-600">Active cameras</span>
          <Camera className="w-4 h-4 text-gray-400" />
        </div>
        <div className="flex items-baseline space-x-1.5">
          <span className="text-2xl font-bold font-mono tracking-tight text-gray-900">
            86/90
          </span>
          <span className="text-[11px] text-emerald-600 font-medium">
            (95.5%)
          </span>
        </div>
        <div className="text-[11px] text-gray-500 mt-1 flex items-center justify-between border-t border-gray-100 pt-1">
          <span>Local sector</span>
          <span className="font-mono text-gray-700 font-medium">
            {stats.activeCamerasCount}/{stats.totalCamerasCount} online
          </span>
        </div>
      </div>

      {/* 3. Avg City Speed */}
      <div className="bg-white border border-gray-200 rounded p-3 flex flex-col justify-between">
        <div className="flex items-center justify-between text-gray-500 mb-1">
          <span className="text-xs font-medium text-gray-600">Avg city speed</span>
          <Gauge className="w-4 h-4 text-gray-400" />
        </div>
        <div className="flex items-baseline space-x-1.5">
          <span className="text-2xl font-bold font-mono tracking-tight text-gray-900">
            {stats.avgCitySpeed}
          </span>
          <span className="text-[11px] text-gray-500 font-mono">km/h</span>
        </div>
        <div className="text-[11px] text-gray-500 mt-1 flex items-center justify-between border-t border-gray-100 pt-1">
          <span>Flow index</span>
          <span className="text-gray-700 font-medium">Moderate arterial</span>
        </div>
      </div>

      {/* 4. Active Alerts (Red / Danger Background) */}
      <div className="bg-red-50 border border-red-200 rounded p-3 flex flex-col justify-between">
        <div className="flex items-center justify-between text-red-700 mb-1">
          <span className="text-xs font-semibold text-red-900">Active alerts</span>
          <AlertTriangle className="w-4 h-4 text-red-600 animate-pulse" />
        </div>
        <div className="flex items-baseline space-x-1.5">
          <span className="text-2xl font-bold font-mono tracking-tight text-red-700">
            {stats.activeAlertsCount}
          </span>
          <span className="text-[11px] text-red-600 font-medium">unreviewed</span>
        </div>
        <div className="text-[11px] text-red-800 mt-1 flex items-center justify-between border-t border-red-200/60 pt-1">
          <span>Blacklist & cloned</span>
          <span className="font-semibold text-red-900 font-mono">High priority</span>
        </div>
      </div>

      {/* 5. Rule Violations Today (Red / Danger Background) */}
      <div className="bg-red-50 border border-red-200 rounded p-3 flex flex-col justify-between">
        <div className="flex items-center justify-between text-red-700 mb-1">
          <span className="text-xs font-semibold text-red-900">Rule violations today</span>
          <ShieldAlert className="w-4 h-4 text-red-600" />
        </div>
        <div className="flex items-baseline space-x-1.5">
          <span className="text-2xl font-bold font-mono tracking-tight text-red-700">
            {stats.activeViolationsCount}
          </span>
          <span className="text-[11px] text-red-600 font-medium">pending e-challan</span>
        </div>
        <div className="text-[11px] text-red-800 mt-1 flex items-center justify-between border-t border-red-200/60 pt-1">
          <span>Speed & signals</span>
          <span className="font-semibold text-red-900 font-mono">Automated log</span>
        </div>
      </div>
    </div>
  );
};
