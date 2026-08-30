import React, { useState } from 'react';
import { KPIStrip } from '../components/dashboard/KPIStrip';
import { LeafletMap } from '../components/map/LeafletMap';
import { ODMatrixTable } from '../components/dashboard/ODMatrixTable';
import { RecentDetectionsTable } from '../components/dashboard/RecentDetectionsTable';
import { SelectedDetectionPanel } from '../components/dashboard/SelectedDetectionPanel';
import { useApp } from '../context/AppContext';
import { Map, Flame, Grid3X3, Radio, RefreshCw } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const {
    cameras,
    detections,
    cityZones,
    selectedDetection,
    setSelectedDetection,
    selectedPlate
  } = useApp();

  const [activeMapTab, setActiveMapTab] = useState<'live' | 'heatmap' | 'od'>('live');

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      {/* 1. Top KPI Metric Strip */}
      <KPIStrip />

      {/* 2. Main Center Grid: Map / Visualizer + Selected Vehicle Side Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left/Center Column (8 cols): Map Container with 3-tab switcher */}
        <div className="lg:col-span-8 flex flex-col space-y-3">
          {/* Map Tabs Header */}
          <div className="bg-white border border-gray-200 rounded p-2.5 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-1 bg-gray-100 p-1 rounded">
              <button
                id="tab-live-map"
                onClick={() => setActiveMapTab('live')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-all ${
                  activeMapTab === 'live'
                    ? 'bg-white text-gray-900 shadow-xs border border-gray-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/60'
                }`}
              >
                <Map className="w-3.5 h-3.5 text-[#378ADD]" />
                <span>Live map</span>
              </button>

              <button
                id="tab-congestion-heatmap"
                onClick={() => setActiveMapTab('heatmap')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-all ${
                  activeMapTab === 'heatmap'
                    ? 'bg-white text-gray-900 shadow-xs border border-gray-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/60'
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-amber-600" />
                <span>Congestion heatmap</span>
              </button>

              <button
                id="tab-od-matrix"
                onClick={() => setActiveMapTab('od')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-all ${
                  activeMapTab === 'od'
                    ? 'bg-white text-gray-900 shadow-xs border border-gray-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/60'
                }`}
              >
                <Grid3X3 className="w-3.5 h-3.5 text-gray-700" />
                <span>OD matrix</span>
              </button>
            </div>

            {/* Live Feed Status Badge */}
            <div className="flex items-center space-x-2 text-xs text-gray-600">
              <span className="flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span className="font-mono text-gray-700">Real-time telemetry</span>
              </span>
              <span className="text-gray-300">|</span>
              <span className="text-[11px] text-gray-500 font-mono">Lucknow City Hub</span>
            </div>
          </div>

          {/* Active Tab Content Area */}
          {activeMapTab === 'od' ? (
            <ODMatrixTable />
          ) : (
            <LeafletMap
              viewMode={activeMapTab}
              cameras={cameras}
              detections={detections}
              cityZones={cityZones}
              selectedDetection={selectedDetection}
              onSelectDetection={setSelectedDetection}
              height="440px"
              focusVehiclePlate={activeMapTab === 'live' ? selectedPlate : undefined}
            />
          )}
        </div>

        {/* Right Column (4 cols): Selected Detection Details + Today's Summary */}
        <div className="lg:col-span-4">
          <SelectedDetectionPanel detection={selectedDetection} />
        </div>
      </div>

      {/* 3. Below: Recent Detections Control Room Table */}
      <RecentDetectionsTable onSelectDetection={setSelectedDetection} />
    </div>
  );
};
