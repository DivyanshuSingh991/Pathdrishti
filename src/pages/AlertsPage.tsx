import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getCameraById } from '../data/mock-data';
import { Alert, Violation } from '../types';
import {
  AlertTriangle,
  ShieldAlert,
  CheckCircle,
  Filter,
  Search,
  CheckCheck,
  ArrowUpRight,
  EyeOff,
  RefreshCw,
  SlidersHorizontal
} from 'lucide-react';

// Combined item representation for unified control room alert/violation stream
type FeedItem =
  | {
      kind: 'alert';
      data: Alert;
      timestamp: string;
      id: string;
      plate: string;
      reviewed: boolean;
    }
  | {
      kind: 'violation';
      data: Violation;
      timestamp: string;
      id: string;
      plate: string;
      reviewed: boolean;
    };

export const AlertsPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    alerts,
    violations,
    markAlertReviewed,
    markViolationReviewed,
    markAllAlertsReviewed,
    markAllViolationsReviewed,
    setSelectedPlate
  } = useApp();

  const [filterType, setFilterType] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'unreviewed' | 'all' | 'reviewed'>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Combine alerts and violations into a unified feed
  const combinedFeed: FeedItem[] = [
    ...alerts.map(a => ({
      kind: 'alert' as const,
      data: a,
      timestamp: a.timestamp,
      id: a.id,
      plate: a.plate,
      reviewed: a.reviewed
    })),
    ...violations.map(v => ({
      kind: 'violation' as const,
      data: v,
      timestamp: v.timestamp,
      id: v.id,
      plate: v.plate,
      reviewed: v.reviewed
    }))
  ].sort((a, b) => b.timestamp.localeCompare(a.timestamp));

  // Apply filters
  const filteredFeed = combinedFeed.filter(item => {
    // 1. Status filter
    if (statusFilter === 'unreviewed' && item.reviewed) return false;
    if (statusFilter === 'reviewed' && !item.reviewed) return false;

    // 2. Search term
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchesPlate = item.plate.toLowerCase().includes(q);
      const cam =
        item.kind === 'alert'
          ? getCameraById(item.data.cameraId)
          : getCameraById(item.data.cameraId);
      const matchesCam =
        cam?.name.toLowerCase().includes(q) ||
        (item.kind === 'alert' ? item.data.cameraId : item.data.cameraId)
          .toLowerCase()
          .includes(q);

      if (!matchesPlate && !matchesCam) return false;
    }

    // 3. Type filter
    if (filterType === 'all') return true;

    if (filterType === 'blacklist') {
      return item.kind === 'alert' && item.data.alertType === 'blacklist_match';
    }
    if (filterType === 'cloned_plate') {
      return item.kind === 'alert' && item.data.alertType === 'cloned_plate';
    }
    if (filterType === 'anomaly') {
      return item.kind === 'alert' && item.data.alertType === 'route_anomaly';
    }
    if (filterType === 'loitering') {
      return item.kind === 'alert' && item.data.alertType === 'loitering';
    }
    if (filterType === 'traffic_violations') {
      // Grouping all 4 violation types under one filter option
      return item.kind === 'violation';
    }

    return true;
  });

  const unreviewedCount = combinedFeed.filter(i => !i.reviewed).length;

  const handleMarkAllReviewed = () => {
    markAllAlertsReviewed();
    markAllViolationsReviewed();
  };

  const handleRowInspect = (plate: string) => {
    setSelectedPlate(plate);
    navigate(`/search?plate=${encodeURIComponent(plate)}`);
  };

  // Helper to render type badge (in red/amber tones only, never green)
  const renderBadge = (item: FeedItem) => {
    if (item.kind === 'alert') {
      const type = item.data.alertType;
      switch (type) {
        case 'blacklist_match':
          return (
            <span className="text-[11px] font-bold bg-red-100 text-red-900 border border-red-300 px-2 py-0.5 rounded uppercase tracking-tight inline-flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
              <span>Blacklist match</span>
            </span>
          );
        case 'cloned_plate':
          return (
            <span className="text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded uppercase tracking-tight inline-flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
              <span>Cloned plate suspect</span>
            </span>
          );
        case 'route_anomaly':
          return (
            <span className="text-[11px] font-semibold bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded uppercase tracking-tight inline-flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
              <span>Route anomaly</span>
            </span>
          );
        case 'loitering':
          return (
            <span className="text-[11px] font-semibold bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded uppercase tracking-tight inline-flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
              <span>Loitering behavior</span>
            </span>
          );
      }
    } else {
      const type = item.data.violationType;
      switch (type) {
        case 'overspeeding':
          return (
            <span className="text-[11px] font-bold bg-red-100 text-red-900 border border-red-300 px-2 py-0.5 rounded uppercase tracking-tight inline-flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
              <span>Overspeeding</span>
            </span>
          );
        case 'red_light_jump':
          return (
            <span className="text-[11px] font-bold bg-red-100 text-red-900 border border-red-300 px-2 py-0.5 rounded uppercase tracking-tight inline-flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
              <span>Red-light jump</span>
            </span>
          );
        case 'wrong_way':
          return (
            <span className="text-[11px] font-bold bg-red-100 text-red-900 border border-red-300 px-2 py-0.5 rounded uppercase tracking-tight inline-flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
              <span>Wrong-way driving</span>
            </span>
          );
        case 'no_entry_zone':
          return (
            <span className="text-[11px] font-semibold bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded uppercase tracking-tight inline-flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
              <span>No-entry zone</span>
            </span>
          );
      }
    }
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      {/* Top Header & Metrics */}
      <div className="bg-white border border-gray-200 rounded p-4 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-2 border-b border-gray-200">
          <div>
            <div className="flex items-center space-x-2">
              <ShieldAlert className="w-5 h-5 text-red-600" />
              <h2 className="text-base font-bold text-gray-900">
                Security alerts & traffic violation dispatch
              </h2>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Unified real-time feed of automated ANPR rule breaches, criminal blacklist matches, and spatial anomalies
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs bg-red-50 text-red-800 border border-red-200 px-2.5 py-1 rounded font-mono font-bold">
              {unreviewedCount} pending review
            </span>
            {unreviewedCount > 0 && (
              <button
                onClick={handleMarkAllReviewed}
                id="btn-mark-all-reviewed"
                className="px-3 py-1 bg-gray-900 hover:bg-gray-800 text-white rounded text-xs font-medium flex items-center space-x-1 transition-colors"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark all reviewed</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
          {/* Filter Dropdown */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center space-x-1 text-xs text-gray-600">
              <Filter className="w-3.5 h-3.5 text-gray-500" />
              <span className="font-medium">Filter by category:</span>
            </div>

            <select
              id="alerts-filter-dropdown"
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
              className="text-xs py-1.5 px-3 bg-gray-50 border border-gray-300 rounded text-gray-900 font-medium focus:outline-none focus:border-[#378ADD]"
            >
              <option value="all">All security & traffic items</option>
              <option value="blacklist">Blacklist match only</option>
              <option value="cloned_plate">Cloned plate suspect only</option>
              <option value="anomaly">Route anomaly only</option>
              <option value="loitering">Loitering behavior only</option>
              <option value="traffic_violations">Traffic violations (Speed, Signal, Wrong-way, No-entry)</option>
            </select>
          </div>

          {/* Status Tabs and Quick Search */}
          <div className="flex items-center space-x-2">
            <div className="flex bg-gray-100 p-0.5 rounded text-xs border border-gray-200">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-2.5 py-1 rounded font-medium transition-all ${
                  statusFilter === 'all'
                    ? 'bg-white text-gray-900 shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                All ({combinedFeed.length})
              </button>
              <button
                onClick={() => setStatusFilter('unreviewed')}
                className={`px-2.5 py-1 rounded font-medium transition-all ${
                  statusFilter === 'unreviewed'
                    ? 'bg-white text-gray-900 shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Unreviewed ({unreviewedCount})
              </button>
              <button
                onClick={() => setStatusFilter('reviewed')}
                className={`px-2.5 py-1 rounded font-medium transition-all ${
                  statusFilter === 'reviewed'
                    ? 'bg-white text-gray-900 shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Reviewed ({combinedFeed.length - unreviewedCount})
              </button>
            </div>

            {/* Quick Filter Search */}
            <div className="relative">
              <Search className="w-3 h-3 text-gray-400 absolute left-2 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search plate/camera..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="text-xs pl-6 pr-2 py-1 bg-gray-50 border border-gray-300 rounded text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#378ADD] w-36 font-mono"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Alerts and Violations Feed Table / Cards */}
      <div className="bg-white border border-gray-200 rounded overflow-hidden">
        {filteredFeed.length === 0 ? (
          <div className="p-12 text-center text-gray-400 text-xs font-sans">
            <CheckCircle className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="font-medium text-gray-600">No alerts or violations match current filter.</p>
            <p className="text-[11px] text-gray-400 mt-1">Try switching to "All" or resetting filter options.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-200 text-[11px]">
                  <th className="py-2.5 px-3">Type badge</th>
                  <th className="py-2.5 px-3">Plate number</th>
                  <th className="py-2.5 px-3">Camera & location</th>
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Measured / Confidence</th>
                  <th className="py-2.5 px-3">Incident details / Remarks</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredFeed.map(item => {
                  const cam =
                    item.kind === 'alert'
                      ? getCameraById(item.data.cameraId)
                      : getCameraById(item.data.cameraId);

                  return (
                    <tr
                      key={item.id}
                      className={`transition-colors ${
                        item.reviewed
                          ? 'opacity-40 bg-gray-50/80 grayscale-30'
                          : 'hover:bg-red-50/30'
                      }`}
                    >
                      {/* 1. Type Badge (Red / Amber tones only, never green) */}
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        {renderBadge(item)}
                      </td>

                      {/* 2. Plate Number */}
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <button
                          onClick={() => handleRowInspect(item.plate)}
                          className="font-mono font-bold text-gray-900 bg-gray-100 hover:bg-blue-100 hover:text-blue-700 px-2 py-0.5 rounded border border-gray-300 inline-flex items-center space-x-1 text-xs transition-colors"
                          title="Inspect vehicle trajectory"
                        >
                          <span>{item.plate}</span>
                          <ArrowUpRight className="w-3 h-3 text-gray-400" />
                        </button>
                      </td>

                      {/* 3. Camera & Location */}
                      <td className="py-2.5 px-3 text-gray-800 whitespace-nowrap">
                        <div className="font-semibold">{cam?.name || (item.kind === 'alert' ? item.data.cameraId : item.data.cameraId)}</div>
                        <div className="text-[11px] text-gray-500">{cam?.locationName}</div>
                      </td>

                      {/* 4. Timestamp */}
                      <td className="py-2.5 px-3 text-gray-700 font-mono whitespace-nowrap">
                        {item.timestamp} IST
                      </td>

                      {/* 5. Confidence or Measured Value */}
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        {item.kind === 'alert' ? (
                          <span className="font-mono text-gray-800">
                            Confidence: <strong>{item.data.confidence}%</strong>
                          </span>
                        ) : (
                          <div className="font-mono text-xs">
                            <span className="text-red-700 font-bold block">
                              {item.data.measuredValue}
                            </span>
                            <span className="text-[10px] text-gray-400 block">
                              Limit: {item.data.thresholdValue}
                            </span>
                          </div>
                        )}
                      </td>

                      {/* 6. Incident Details */}
                      <td className="py-2.5 px-3 text-gray-700 max-w-xs text-[11px] leading-relaxed">
                        {item.kind === 'alert' ? (
                          <span>{item.data.details}</span>
                        ) : (
                          <span className="text-gray-800">
                            Automatic e-challan log generated (₹{item.data.fineAmount?.toLocaleString('en-IN') || 1000}) for {item.data.violationType.replace(/_/g, ' ')}.
                          </span>
                        )}
                      </td>

                      {/* 7. Action Button: Mark reviewed */}
                      <td className="py-2.5 px-3 text-right whitespace-nowrap">
                        <button
                          onClick={() => {
                            if (item.kind === 'alert') {
                              markAlertReviewed(item.id);
                            } else {
                              markViolationReviewed(item.id);
                            }
                          }}
                          className={`px-2.5 py-1 rounded text-xs font-semibold inline-flex items-center space-x-1 transition-all border ${
                            item.reviewed
                              ? 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200'
                              : 'bg-white hover:bg-gray-100 text-gray-900 border-gray-300 shadow-xs'
                          }`}
                          title={item.reviewed ? 'Mark unreviewed' : 'Mark reviewed'}
                        >
                          <CheckCircle className={`w-3.5 h-3.5 ${item.reviewed ? 'text-gray-400' : 'text-gray-700'}`} />
                          <span>{item.reviewed ? 'Reviewed' : 'Mark reviewed'}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
