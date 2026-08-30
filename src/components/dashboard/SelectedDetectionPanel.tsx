import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DetectionEvent } from '../../types';
import { useApp } from '../../context/AppContext';
import { getCameraById, getVehicleByPlate } from '../../data/mock-data';
import {
  Car,
  Camera,
  Clock,
  Compass,
  Gauge,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  Info
} from 'lucide-react';

interface SelectedDetectionPanelProps {
  detection: DetectionEvent | null;
}

export const SelectedDetectionPanel: React.FC<SelectedDetectionPanelProps> = ({
  detection
}) => {
  const navigate = useNavigate();
  const { stats, setSelectedPlate } = useApp();

  if (!detection) {
    return (
      <div className="bg-white border border-gray-200 rounded p-4 text-xs text-gray-500 flex flex-col items-center justify-center min-h-[300px]">
        <Info className="w-6 h-6 text-gray-400 mb-2" />
        <p>Select any vehicle detection from the map or table to inspect details.</p>
      </div>
    );
  }

  const camera = getCameraById(detection.cameraId);
  const vehicle = getVehicleByPlate(detection.plateText);
  const isDanger = detection.status !== 'Normal' || !!detection.violationFlag;
  const isOverspeeding = camera && detection.speed > camera.speedLimit;

  const handleInspectTrajectory = () => {
    setSelectedPlate(detection.plateText);
    navigate(`/search?plate=${encodeURIComponent(detection.plateText)}`);
  };

  return (
    <div className="space-y-3">
      {/* Selected Vehicle Card */}
      <div className="bg-white border border-gray-200 rounded p-3.5 space-y-3">
        {/* Card Header */}
        <div className="flex items-start justify-between border-b border-gray-200 pb-2.5">
          <div>
            <div className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">
              Selected detection event
            </div>
            <div className="flex items-center space-x-2 mt-0.5">
              <span className="text-base font-bold font-mono text-gray-900 bg-gray-100 px-2 py-0.5 rounded border border-gray-300">
                {detection.plateText}
              </span>
              <span className="text-xs text-gray-600 capitalize">
                {detection.vehicleColor} {detection.vehicleType}
              </span>
            </div>
          </div>

          {/* Status Badge */}
          <div>
            {isDanger ? (
              <span className="inline-flex items-center space-x-1 text-xs bg-red-100 text-red-800 px-2 py-1 rounded font-bold border border-red-200">
                <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                <span>{detection.status}</span>
              </span>
            ) : (
              <span className="inline-flex items-center space-x-1 text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded font-medium border border-emerald-200">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Normal</span>
              </span>
            )}
          </div>
        </div>

        {/* Special Warnings if Blacklisted / Cloned / Near-miss */}
        {vehicle?.isBlacklisted && (
          <div className="p-2 bg-red-50 border border-red-200 rounded text-xs text-red-900">
            <div className="font-bold flex items-center space-x-1">
              <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
              <span>National blacklist registry hit</span>
            </div>
            <p className="text-[11px] text-red-700 mt-0.5">{vehicle.blacklistReason}</p>
          </div>
        )}

        {vehicle?.isClonedSuspect && (
          <div className="p-2 bg-amber-50 border border-amber-200 rounded text-xs text-amber-900">
            <div className="font-bold flex items-center space-x-1">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>Suspect plate cloning detected</span>
            </div>
            <p className="text-[11px] text-amber-800 mt-0.5">{vehicle.clonedNote}</p>
          </div>
        )}

        {vehicle?.nearMissMatch && (
          <div className="p-2 bg-purple-50 border border-purple-200 rounded text-xs text-purple-900">
            <div className="font-bold">OCR Altered Plate Indicator</div>
            <p className="text-[11px] text-purple-800 mt-0.5">
              {vehicle.nearMissMatch.similarityPct}% optical match to {vehicle.nearMissMatch.targetPlate}.
            </p>
          </div>
        )}

        {/* Key Attributes Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2 bg-gray-50 border border-gray-100 rounded">
            <span className="text-[10px] text-gray-500 block">Camera location</span>
            <span className="font-semibold text-gray-900 truncate block">
              {camera ? camera.name : detection.cameraId}
            </span>
          </div>

          <div className="p-2 bg-gray-50 border border-gray-100 rounded">
            <span className="text-[10px] text-gray-500 block">Timestamp</span>
            <span className="font-mono font-medium text-gray-800">
              {detection.timestamp} IST
            </span>
          </div>

          <div className="p-2 bg-gray-50 border border-gray-100 rounded">
            <span className="text-[10px] text-gray-500 block">Geo-coordinates</span>
            <span className="font-mono text-gray-700 text-[11px]">
              {camera ? `${camera.lat.toFixed(4)}, ${camera.lng.toFixed(4)}` : 'N/A'}
            </span>
          </div>

          <div className="p-2 bg-gray-50 border border-gray-100 rounded">
            <span className="text-[10px] text-gray-500 block">ANPR confidence</span>
            <span className="font-mono font-bold text-gray-900">
              {detection.confidence.toFixed(1)}%
            </span>
          </div>

          <div className="p-2 bg-gray-50 border border-gray-100 rounded">
            <span className="text-[10px] text-gray-500 block">Speed & Limit</span>
            <span className={`font-mono font-bold ${isOverspeeding ? 'text-red-700' : 'text-gray-900'}`}>
              {detection.speed} km/h{' '}
              <span className="text-[10px] font-normal text-gray-500">
                (Limit: {camera?.speedLimit} km/h)
              </span>
            </span>
          </div>

          <div className="p-2 bg-gray-50 border border-gray-100 rounded">
            <span className="text-[10px] text-gray-500 block">Heading vector</span>
            <span className="font-medium text-gray-800">
              {detection.direction}
            </span>
          </div>
        </div>

        {/* Violations Line */}
        <div className="pt-2 border-t border-gray-200">
          <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 font-semibold">
            Rule violations
          </div>
          {detection.violationFlag ? (
            <div className="text-xs font-semibold text-red-700 bg-red-50 p-2 rounded border border-red-200">
              {detection.violationFlag}
            </div>
          ) : (
            <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded border border-gray-200 flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>No violations recorded at this capture</span>
            </div>
          )}
        </div>

        {/* Action button to Trajectory */}
        <button
          onClick={handleInspectTrajectory}
          className="w-full mt-2 py-2 px-3 bg-[#378ADD] hover:bg-blue-600 text-white rounded text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors shadow-xs"
        >
          <span>View full multi-camera trajectory</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Small "Today" Summary Block */}
      <div className="bg-white border border-gray-200 rounded p-3 text-xs space-y-2">
        <div className="text-[11px] font-bold text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-1">
          Today's surveillance summary
        </div>
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div className="flex justify-between border-b border-gray-100 pb-1">
            <span className="text-gray-500">Total detections:</span>
            <span className="font-mono font-bold text-gray-900">{stats.totalDetectionsToday}</span>
          </div>
          <div className="flex justify-between border-b border-gray-100 pb-1">
            <span className="text-gray-500">Blacklist hits:</span>
            <span className="font-mono font-bold text-red-700">{stats.blacklistMatchesCount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Rule violations:</span>
            <span className="font-mono font-bold text-red-700">{stats.activeViolationsCount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Avg city speed:</span>
            <span className="font-mono font-bold text-gray-900">{stats.avgCitySpeed} km/h</span>
          </div>
        </div>
      </div>
    </div>
  );
};
