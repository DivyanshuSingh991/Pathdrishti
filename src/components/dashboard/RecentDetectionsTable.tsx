import React, { useState } from 'react';
import { DetectionEvent } from '../../types';
import { useApp } from '../../context/AppContext';
import { getCameraById } from '../../data/mock-data';
import { Search, Filter, CheckCircle, AlertTriangle } from 'lucide-react';

interface RecentDetectionsTableProps {
  onSelectDetection?: (detection: DetectionEvent) => void;
}

export const RecentDetectionsTable: React.FC<RecentDetectionsTableProps> = ({
  onSelectDetection
}) => {
  const { detections, selectedDetection, setSelectedDetection, setSelectedPlate } = useApp();
  const [filterText, setFilterText] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'alert' | 'normal'>('all');
  const [limitCount, setLimitCount] = useState<number>(8);

  const handleRowClick = (evt: DetectionEvent) => {
    setSelectedDetection(evt);
    setSelectedPlate(evt.plateText);
    if (onSelectDetection) {
      onSelectDetection(evt);
    }
  };

  // Filter detections
  const filteredDetections = detections.filter(d => {
    const matchesText =
      d.plateText.toLowerCase().includes(filterText.toLowerCase().trim()) ||
      d.cameraId.toLowerCase().includes(filterText.toLowerCase().trim()) ||
      d.vehicleType.toLowerCase().includes(filterText.toLowerCase().trim());

    if (!matchesText) return false;

    if (filterType === 'alert') {
      return d.status !== 'Normal' || !!d.violationFlag;
    }
    if (filterType === 'normal') {
      return d.status === 'Normal' && !d.violationFlag;
    }
    return true;
  });

  // Display recent records (descending order by timestamp or sliced)
  const displayList = [...filteredDetections].reverse().slice(0, limitCount);

  return (
    <div className="bg-white border border-gray-200 rounded p-3">
      {/* Table Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2.5 mb-2.5 border-b border-gray-200 gap-2">
        <div className="flex items-center space-x-2">
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
            Recent ANPR plate detections
          </h3>
          <span className="text-[11px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-mono">
            {filteredDetections.length} recorded today
          </span>
        </div>

        {/* Quick Filter Toolbar */}
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="w-3 h-3 text-gray-400 absolute left-2 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter plate / cam..."
              value={filterText}
              onChange={e => setFilterText(e.target.value)}
              className="text-xs pl-6 pr-2 py-1 bg-gray-50 border border-gray-200 rounded text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#378ADD] w-32 sm:w-40 font-mono"
            />
          </div>

          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value as any)}
            className="text-xs py-1 px-2 bg-gray-50 border border-gray-200 rounded text-gray-700 focus:outline-none focus:border-[#378ADD]"
          >
            <option value="all">All detections</option>
            <option value="alert">Alerts / Violations only</option>
            <option value="normal">Normal only</option>
          </select>

          <select
            value={limitCount}
            onChange={e => setLimitCount(Number(e.target.value))}
            className="text-xs py-1 px-2 bg-gray-50 border border-gray-200 rounded text-gray-700 focus:outline-none focus:border-[#378ADD]"
          >
            <option value={6}>6 rows</option>
            <option value={8}>8 rows</option>
            <option value={15}>15 rows</option>
            <option value={30}>30 rows</option>
          </select>
        </div>
      </div>

      {/* Control-room Dense Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-200 text-[11px]">
              <th className="py-2 px-2.5">Time</th>
              <th className="py-2 px-2.5">Camera node</th>
              <th className="py-2 px-2.5">Plate number</th>
              <th className="py-2 px-2.5">Vehicle</th>
              <th className="py-2 px-2.5 text-right">Confidence</th>
              <th className="py-2 px-2.5 text-right">Speed</th>
              <th className="py-2 px-2.5">Direction</th>
              <th className="py-2 px-2.5">Status</th>
              <th className="py-2 px-2.5">Violation flag</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-mono">
            {displayList.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-6 text-center text-gray-400 text-xs font-sans">
                  No matching detections found for the applied filter.
                </td>
              </tr>
            ) : (
              displayList.map(evt => {
                const cam = getCameraById(evt.cameraId);
                const isSelected = selectedDetection?.id === evt.id;
                const isAlert = evt.status !== 'Normal';
                const hasViolation = !!evt.violationFlag;

                return (
                  <tr
                    key={evt.id}
                    onClick={() => handleRowClick(evt)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-blue-50/80 border-l-2 border-l-[#378ADD]'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    {/* Time */}
                    <td className="py-1.5 px-2.5 text-gray-700 font-medium">
                      {evt.timestamp}
                    </td>

                    {/* Camera */}
                    <td className="py-1.5 px-2.5 text-gray-800 font-sans">
                      <span className="font-semibold">{evt.cameraId}</span>
                      <span className="text-[11px] text-gray-500 ml-1 hidden lg:inline">
                        ({cam?.name.split(',')[1] || cam?.zone})
                      </span>
                    </td>

                    {/* Plate */}
                    <td className="py-1.5 px-2.5 font-bold text-gray-900">
                      <span className="bg-gray-100 text-gray-900 px-1.5 py-0.5 rounded border border-gray-200 text-[11px]">
                        {evt.plateText}
                      </span>
                    </td>

                    {/* Vehicle */}
                    <td className="py-1.5 px-2.5 text-gray-600 font-sans capitalize text-[11px]">
                      {evt.vehicleColor} {evt.vehicleType}
                    </td>

                    {/* Confidence */}
                    <td className="py-1.5 px-2.5 text-right text-gray-700">
                      {evt.confidence.toFixed(1)}%
                    </td>

                    {/* Speed */}
                    <td className="py-1.5 px-2.5 text-right font-medium text-gray-800">
                      {evt.speed}{' '}
                      <span className="text-[10px] text-gray-400 font-normal">km/h</span>
                    </td>

                    {/* Direction */}
                    <td className="py-1.5 px-2.5 text-gray-600 font-sans text-[11px]">
                      {evt.direction}
                    </td>

                    {/* Status */}
                    <td className="py-1.5 px-2.5 font-sans">
                      {isAlert ? (
                        <span className="inline-flex items-center space-x-1 text-[11px] bg-red-50 text-red-700 px-1.5 py-0.5 rounded font-semibold border border-red-200">
                          <AlertTriangle className="w-3 h-3 text-red-600" />
                          <span>{evt.status}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 text-[11px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-medium border border-emerald-200">
                          <CheckCircle className="w-3 h-3 text-emerald-600" />
                          <span>Normal</span>
                        </span>
                      )}
                    </td>

                    {/* Violation Flag */}
                    <td className="py-1.5 px-2.5 font-sans text-[11px]">
                      {hasViolation ? (
                        <span className="text-red-700 font-semibold bg-red-50 px-1.5 py-0.5 rounded border border-red-200">
                          {evt.violationFlag}
                        </span>
                      ) : (
                        <span className="text-emerald-700 text-[11px]">None</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
