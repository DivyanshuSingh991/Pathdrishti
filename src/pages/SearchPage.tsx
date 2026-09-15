import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { LeafletMap } from '../components/map/LeafletMap';
import { TrajectoryCaptureGallery } from '../components/search/TrajectoryCaptureGallery';
import { getCameraById, getVehicleByPlate } from '../data/mock-data';
import {
  Search,
  MapPin,
  Clock,
  ShieldAlert,
  AlertTriangle,
  FileText,
  CheckCircle,
  ShieldCheck,
  Zap,
  Sparkles,
  Compass
} from 'lucide-react';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { detections, violations, cameras, selectedPlate, setSelectedPlate } = useApp();

  const queryPlateParam = searchParams.get('plate');
  const [inputPlate, setInputPlate] = useState<string>(
    queryPlateParam || selectedPlate || 'UP32-KL-5544'
  );
  const [activePlate, setActivePlate] = useState<string>(
    queryPlateParam || selectedPlate || 'UP32-KL-5544'
  );
  const [focusedCameraId, setFocusedCameraId] = useState<string | null>(null);
  const [focusedEventId, setFocusedEventId] = useState<string | null>(null);

  useEffect(() => {
    if (queryPlateParam) {
      setInputPlate(queryPlateParam);
      setActivePlate(queryPlateParam);
      setSelectedPlate(queryPlateParam);
      setFocusedCameraId(null);
      setFocusedEventId(null);
    }
  }, [queryPlateParam, setSelectedPlate]);

  const handleSearch = (plateToSearch: string) => {
    const clean = plateToSearch.trim().toUpperCase();
    if (!clean) return;
    setActivePlate(clean);
    setInputPlate(clean);
    setSelectedPlate(clean);
    setFocusedCameraId(null);
    setFocusedEventId(null);
    setSearchParams({ plate: clean });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(inputPlate);
  };

  // Find vehicle metadata
  const currentVehicle = getVehicleByPlate(activePlate) || {
    plate: activePlate,
    vehicleType: 'car' as const,
    color: 'Unknown',
    model: 'Vehicle record'
  };

  // Find chronological timeline of camera sightings
  const vehicleDetections = detections
    .filter(d => d.plateText.toUpperCase() === activePlate.toUpperCase())
    .sort((a, b) => a.timestamp.localeCompare(b.timestamp));

  // Find vehicle violations
  const vehicleViolations = violations.filter(
    v => v.plate.toUpperCase() === activePlate.toUpperCase()
  );

  // Calculate quick metrics for the dossier HUD
  const maxSpeed = vehicleDetections.length > 0
    ? Math.max(...vehicleDetections.map(d => d.speed))
    : 0;

  const avgSpeed = vehicleDetections.length > 0
    ? Math.round(vehicleDetections.reduce((acc, curr) => acc + curr.speed, 0) / vehicleDetections.length)
    : 0;

  // Quick preset test plates
  const demoPresets = [
    {
      plate: 'UP32-KL-5544',
      label: 'Wanted (Stolen)',
      dotColor: 'bg-red-500',
      badgeClass: 'bg-red-50 text-red-800 border-red-200'
    },
    {
      plate: 'UP32-EX-4091',
      label: 'Cloned Suspect',
      dotColor: 'bg-red-500',
      badgeClass: 'bg-red-50 text-red-900 border-red-300'
    },
    {
      plate: 'UP32-LK-9021',
      label: 'Altered OCR Plate',
      dotColor: 'bg-purple-500',
      badgeClass: 'bg-purple-50 text-purple-800 border-purple-200'
    },
    {
      plate: 'UP32-TR-9900',
      label: 'Overspeeding Violator',
      dotColor: 'bg-amber-500',
      badgeClass: 'bg-amber-50 text-amber-900 border-amber-300'
    },
    {
      plate: 'UP32-AB-1234',
      label: 'Normal Multi-Stop',
      dotColor: 'bg-emerald-500',
      badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200'
    }
  ];

  return (
    <div className="space-y-3.5 max-w-7xl mx-auto pb-6">
      {/* 1. TOP COMMAND BAR: Search Input & Target Quick Presets */}
      <div className="bg-white border border-gray-200 rounded-lg p-3.5 shadow-xs space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center space-x-2">
              <Compass className="w-4 h-4 text-[#378ADD] shrink-0" />
              <h1 className="text-sm font-bold text-gray-900 uppercase tracking-wide truncate">
                Vehicle Trajectory & Forensic Spatial Audit
              </h1>
            </div>
            <p className="text-[11px] text-gray-500 mt-0.5">
              Reconstruct spatial corridor travel vectors, camera timeline sightings, and AI Re-ID feature embeddings
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <span className="text-[10px] font-mono bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded border border-emerald-200 font-semibold flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>SHA-256 Telemetry Verified</span>
            </span>
          </div>
        </div>

        {/* Search Input Form */}
        <form onSubmit={handleFormSubmit} className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1 min-w-0">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="vehicle-trajectory-search-input"
              type="text"
              placeholder="Enter registration plate (e.g. UP32-KL-5544, UP32-EX-4091)..."
              value={inputPlate}
              onChange={e => setInputPlate(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-gray-50 border border-gray-300 rounded-md focus:bg-white focus:outline-none focus:border-[#378ADD] text-gray-900 font-mono font-bold"
            />
          </div>
          <button
            type="submit"
            id="vehicle-search-submit-btn"
            className="px-4 py-2 bg-[#378ADD] hover:bg-blue-600 text-white rounded-md text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors shadow-xs shrink-0"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search Plate</span>
          </button>
        </form>

        {/* Dedicated Responsive Presets Strip (Wraps cleanly at all zoom levels) */}
        <div className="pt-2 border-t border-gray-100 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider shrink-0">
            Presets:
          </span>
          <div className="flex flex-wrap items-center gap-1.5 min-w-0 flex-1">
            {demoPresets.map(preset => (
              <button
                key={preset.plate}
                type="button"
                onClick={() => handleSearch(preset.plate)}
                className={`px-2.5 py-1 rounded text-[11px] font-mono transition-all flex items-center space-x-1.5 border shrink-0 ${
                  activePlate === preset.plate
                    ? 'border-gray-900 bg-gray-900 text-white font-bold shadow-xs'
                    : `${preset.badgeClass} hover:opacity-85`
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${preset.dotColor} shrink-0`}></span>
                <span className="font-bold">{preset.plate}</span>
                <span className="font-sans text-[10px] opacity-85">({preset.label})</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. NEAR-MISS ALTERED OCR BANNER (If active for vehicle) */}
      {currentVehicle.nearMissMatch && (
        <div className="bg-gradient-to-r from-purple-50 via-purple-50/70 to-white border-2 border-purple-300 rounded-lg p-3 text-xs text-purple-950 flex items-start space-x-3 shadow-xs">
          <div className="p-2 bg-purple-200 rounded-md text-purple-900 shrink-0 mt-0.5">
            <Zap className="w-4 h-4 text-purple-700" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-xs text-purple-950 uppercase tracking-wide">
                  Optical Character Alteration Alert · High Similarity Match
                </span>
                <span className="bg-purple-700 text-white font-mono font-bold px-2 py-0.5 rounded text-[10px]">
                  {currentVehicle.nearMissMatch.similarityPct}% Match
                </span>
              </div>
            </div>
            <p className="mt-1 text-purple-900 leading-relaxed text-[11px]">
              Query plate <strong className="font-mono bg-white px-1.5 py-0.2 rounded border border-purple-200">{currentVehicle.plate}</strong> exhibits <strong>{currentVehicle.nearMissMatch.similarityPct}% visual similarity</strong> to Wanted vehicle <strong className="font-mono bg-white px-1.5 py-0.2 rounded border border-purple-200">{currentVehicle.nearMissMatch.targetPlate}</strong> (Wanted in Crime Branch Lookout Notice).
            </p>
            <div className="mt-1.5 text-[10px] text-purple-950 font-mono bg-white/90 p-1.5 rounded border border-purple-200">
              Forensic Observation: {currentVehicle.nearMissMatch.reason}
            </div>
          </div>
        </div>
      )}

      {/* 3. UNIFIED VEHICLE DOSSIER HUD */}
      <div className="bg-white border border-gray-200 rounded-lg p-3.5 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-center">
          {/* Left (5 cols): License Plate Graphic & Make/Model Details */}
          <div className="lg:col-span-5 flex items-center space-x-3">
            {/* Embossed Number Plate Badge */}
            <div className="bg-gradient-to-r from-gray-100 to-white border-2 border-gray-800 rounded px-2.5 py-1.5 shadow-sm flex items-center space-x-2 shrink-0">
              <div className="flex flex-col items-center justify-center pr-1 border-r border-gray-300">
                <span className="text-[7px] font-black text-blue-900 leading-none">IND</span>
                <div className="w-2.5 h-2.5 rounded-full border border-blue-900 flex items-center justify-center my-0.5">
                  <div className="w-1 h-1 rounded-full bg-blue-900"></div>
                </div>
              </div>
              <span className="font-mono text-base sm:text-lg font-black tracking-widest text-gray-900">
                {activePlate}
              </span>
            </div>

            {/* Vehicle Metadata */}
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-gray-900 truncate">
                {currentVehicle.color} {currentVehicle.model || currentVehicle.vehicleType}
              </div>
              <div className="text-[11px] text-gray-500 font-medium flex items-center space-x-1.5 mt-0.5">
                <span className="uppercase text-[10px] bg-gray-100 px-1.5 py-0.2 rounded border border-gray-200 font-mono">
                  {currentVehicle.vehicleType}
                </span>
                <span>·</span>
                <span>Regional Transport Office (UP-32)</span>
              </div>
            </div>
          </div>

          {/* Middle (3 cols): Registry Risk Status Badge */}
          <div className="lg:col-span-3">
            {currentVehicle.isBlacklisted ? (
              <div className="bg-red-50 border border-red-300 p-2 rounded-md">
                <div className="flex items-center space-x-1.5 text-red-900 font-bold text-xs">
                  <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
                  <span>Blacklist Registry Match</span>
                </div>
                <div className="text-[10px] text-red-700 mt-0.5 truncate" title={currentVehicle.blacklistReason}>
                  {currentVehicle.blacklistReason}
                </div>
              </div>
            ) : currentVehicle.isClonedSuspect ? (
              <div className="bg-red-50 border border-red-300 p-2 rounded-md">
                <div className="flex items-center space-x-1.5 text-red-900 font-bold text-xs">
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>Cloned Plate Suspect</span>
                </div>
                <div className="text-[10px] text-red-700 mt-0.5 truncate" title={currentVehicle.clonedNote}>
                  {currentVehicle.clonedNote}
                </div>
              </div>
            ) : (
              <div className="bg-emerald-50 border border-emerald-200 p-2 rounded-md">
                <div className="flex items-center space-x-1.5 text-emerald-900 font-bold text-xs">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Clean Registry Status</span>
                </div>
                <div className="text-[10px] text-emerald-700 mt-0.5">
                  No criminal watchlists active
                </div>
              </div>
            )}
          </div>

          {/* Right (4 cols): Quick Forensic Metric Tiles */}
          <div className="lg:col-span-4 grid grid-cols-4 gap-1.5 text-center">
            <div className="bg-gray-50 p-1.5 rounded border border-gray-200">
              <span className="text-[9px] text-gray-500 block uppercase font-medium">Stops</span>
              <span className="font-mono font-bold text-xs text-gray-900">{vehicleDetections.length}</span>
            </div>
            <div className="bg-gray-50 p-1.5 rounded border border-gray-200">
              <span className="text-[9px] text-gray-500 block uppercase font-medium">Avg Spd</span>
              <span className="font-mono font-bold text-xs text-gray-900">{avgSpeed} <span className="text-[9px] font-normal">km/h</span></span>
            </div>
            <div className="bg-gray-50 p-1.5 rounded border border-gray-200">
              <span className="text-[9px] text-gray-500 block uppercase font-medium">Max Spd</span>
              <span className="font-mono font-bold text-xs text-amber-800">{maxSpeed} <span className="text-[9px] font-normal">km/h</span></span>
            </div>
            <div className={`p-1.5 rounded border ${vehicleViolations.length > 0 ? 'bg-amber-50 border-amber-300 text-amber-900' : 'bg-gray-50 border-gray-200 text-gray-700'}`}>
              <span className="text-[9px] block uppercase font-medium">Violations</span>
              <span className="font-mono font-bold text-xs">{vehicleViolations.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. MAIN WORKSPACE: Trajectory Map & Evidentiary Gallery (Left) + Chronological Timeline (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-start">
        {/* Left Column (7 cols): Map + CCTV Evidentiary Frame Strip */}
        <div className="lg:col-span-7 flex flex-col space-y-2.5">
          {/* Map Header Bar */}
          <div className="bg-white border border-gray-200 rounded-lg p-2.5 flex items-center justify-between text-xs shrink-0">
            <div className="flex items-center space-x-1.5">
              <MapPin className="w-4 h-4 text-[#378ADD]" />
              <span className="font-bold text-gray-900">Spatial Route Reconstruction Map</span>
              <span className="text-[11px] font-mono text-gray-500">({vehicleDetections.length} waypoints)</span>
            </div>

            <div className="flex items-center space-x-2 text-[11px] text-gray-500 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
              <span>Sequential Vector Flow</span>
            </div>
          </div>

          {/* Leaflet Trajectory Map */}
          <div className="shrink-0">
            <LeafletMap
              cameras={cameras}
              trajectoryEvents={vehicleDetections}
              height="320px"
              focusedCameraId={focusedCameraId}
              focusedEventId={focusedEventId}
            />
          </div>

          {/* Compact Camera Capture Frames under Map (Single-Row Horizontal Reel) */}
          <div className="shrink-0">
            <TrajectoryCaptureGallery
              events={vehicleDetections}
              plate={activePlate}
            />
          </div>
        </div>

        {/* Right Column (5 cols): Chronological Sighting Feed */}
        {/* Fixed height matching Left Column (~525px) showing ~3-4 cards in view with smooth scroll */}
        <div className="lg:col-span-5 bg-white border border-gray-200 rounded-lg p-3.5 flex flex-col h-[525px] shadow-xs">
          {/* Pinned Top Header */}
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-200 shrink-0">
            <div>
              <div className="flex items-center space-x-1.5">
                <Clock className="w-3.5 h-3.5 text-[#378ADD]" />
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                  Chronological Sightings
                </h3>
              </div>
              <span className="text-[10px] text-gray-400">Click any card to center camera on map</span>
            </div>

            <span className="text-[11px] font-mono bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-semibold border border-gray-200">
              {vehicleDetections.length} recorded stops
            </span>
          </div>

          {/* Scrollable Sightings Cards Feed */}
          <div className="flex-1 overflow-y-auto pr-1.5 space-y-2.5 relative scrollbar-thin scrollbar-thumb-gray-300">
            {vehicleDetections.length === 0 ? (
              <div className="text-xs text-gray-400 py-16 text-center font-sans">
                No camera sightings recorded today for plate {activePlate}.
              </div>
            ) : (
              <div className="space-y-2.5 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
                {vehicleDetections.map((evt, idx) => {
                  const cam = getCameraById(evt.cameraId);
                  const isViolation = !!evt.violationFlag;
                  const isDanger = evt.status !== 'Normal' || isViolation;
                  const hasReId = !!evt.reIdAnalysis?.isReIdMatch;
                  const isFocused = evt.id === focusedEventId || (focusedCameraId === evt.cameraId && !focusedEventId);

                  return (
                    <div
                      key={evt.id}
                      onClick={() => {
                        setFocusedEventId(evt.id);
                        setFocusedCameraId(evt.cameraId);
                      }}
                      className="relative pl-8 text-xs group cursor-pointer"
                    >
                      {/* Step Number Dot */}
                      <div
                        className={`absolute left-0 top-0.5 w-7 h-7 rounded-full text-white font-mono font-bold text-[11px] flex items-center justify-center border-2 border-white shadow-xs transition-transform ${
                          isFocused ? 'scale-110 ring-2 ring-blue-500' : ''
                        } ${
                          hasReId ? 'bg-purple-700' : isDanger ? 'bg-red-600' : 'bg-[#378ADD]'
                        }`}
                      >
                        {idx + 1}
                      </div>

                      {/* Content Card with Interactive Focus State */}
                      <div
                        className={`p-2.5 rounded border transition-all ${
                          isFocused
                            ? 'bg-blue-50/95 border-[#378ADD] ring-2 ring-blue-300 shadow-sm'
                            : 'bg-gray-50 border-gray-200 group-hover:border-blue-300 group-hover:bg-white'
                        }`}
                      >
                        {/* Header: Camera ID & Timestamp */}
                        <div className="flex items-center justify-between text-gray-900 font-semibold">
                          <div className="flex items-center space-x-1.5 truncate">
                            <span className="font-mono text-xs text-[#378ADD]">{cam?.name || evt.cameraId}</span>
                            {isFocused && (
                              <span className="text-[9px] font-mono bg-[#378ADD] text-white px-1.5 py-0.2 rounded font-bold">
                                📍 In View
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] font-mono text-gray-600 shrink-0">{evt.timestamp} IST</span>
                        </div>

                        {/* Location */}
                        <div className="text-[11px] text-gray-500 mt-0.5 truncate">
                          {cam?.locationName}
                        </div>

                        {/* Speed & OCR Metrics */}
                        <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-gray-200 text-[11px]">
                          <div>
                            <span className="text-gray-400 block text-[10px]">Speed recorded:</span>
                            <span className={`font-mono font-semibold ${isViolation ? 'text-amber-800' : 'text-gray-800'}`}>
                              {evt.speed} km/h{' '}
                              <span className="text-[10px] text-gray-400 font-normal">
                                (Limit {cam?.speedLimit})
                              </span>
                            </span>
                          </div>

                          <div>
                            <span className="text-gray-400 block text-[10px]">ANPR Quality:</span>
                            <span className={`font-mono font-semibold ${hasReId && evt.confidence < 70 ? 'text-purple-700' : 'text-gray-800'}`}>
                              {hasReId && evt.confidence < 70 ? `${evt.confidence}% (Re-ID)` : `${evt.confidence}% OCR`}
                            </span>
                          </div>
                        </div>

                        {/* Violation Indicator */}
                        {evt.violationFlag && (
                          <div className="mt-2 text-[10px] font-semibold text-amber-900 bg-amber-50 p-1.5 rounded border border-amber-300 flex items-center space-x-1">
                            <span>⚠️</span>
                            <span>{evt.violationFlag}</span>
                          </div>
                        )}

                        {/* AI Re-ID Match Tag */}
                        {hasReId && (
                          <div className="mt-2 text-[10px] font-semibold text-purple-900 bg-purple-50 p-1 rounded border border-purple-200 flex items-center justify-between">
                            <span className="flex items-center space-x-1">
                              <Sparkles className="w-3 h-3 text-purple-600" />
                              <span>AI Re-ID Verified Match</span>
                            </span>
                            <span className="font-mono text-[9px] bg-purple-200 px-1 rounded">
                              {evt.reIdAnalysis?.confidence}%
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 5. TRAFFIC RULE VIOLATIONS & E-CHALLAN REGISTRY */}
      <div className="bg-white border border-gray-200 rounded-lg p-3.5 shadow-xs">
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-red-600" />
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              Traffic Rule Violation & E-Challan Record · {activePlate}
            </h3>
          </div>
          <span className="text-xs text-gray-500 font-mono">
            {vehicleViolations.length} recorded infraction(s)
          </span>
        </div>

        {vehicleViolations.length === 0 ? (
          <div className="py-3 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-md px-3 flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Clean Record: No traffic rule infractions logged for this vehicle today.</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-200 text-[11px]">
                  <th className="py-2 px-3">Violation ID</th>
                  <th className="py-2 px-3">Violation Type</th>
                  <th className="py-2 px-3">Camera Location</th>
                  <th className="py-2 px-3">Time</th>
                  <th className="py-2 px-3">Measured Value</th>
                  <th className="py-2 px-3">Threshold Limit</th>
                  <th className="py-2 px-3">E-Challan Penalty</th>
                  <th className="py-2 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-mono">
                {vehicleViolations.map(vio => {
                  const cam = getCameraById(vio.cameraId);
                  return (
                    <tr key={vio.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-2 px-3 font-semibold text-gray-900">{vio.id}</td>
                      <td className="py-2 px-3 font-sans">
                        <span
                          className={`text-[11px] font-bold px-2 py-0.5 rounded uppercase ${
                            vio.violationType === 'overspeeding'
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : 'bg-red-100 text-red-800 border border-red-200'
                          }`}
                        >
                          {vio.violationType.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="py-2 px-3 font-sans text-gray-800">
                        {cam?.name || vio.cameraId}
                      </td>
                      <td className="py-2 px-3 text-gray-700">{vio.timestamp} IST</td>
                      <td
                        className={`py-2 px-3 font-bold ${
                          vio.violationType === 'overspeeding' ? 'text-amber-800' : 'text-red-700'
                        }`}
                      >
                        {vio.measuredValue}
                      </td>
                      <td className="py-2 px-3 text-gray-600">{vio.thresholdValue}</td>
                      <td className="py-2 px-3 font-bold text-gray-900">
                        ₹{vio.fineAmount?.toLocaleString('en-IN') || 1000}
                      </td>
                      <td className="py-2 px-3 font-sans">
                        <span
                          className={`text-[11px] px-2 py-0.5 rounded font-semibold ${
                            vio.reviewed
                              ? 'bg-gray-100 text-gray-600'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {vio.reviewed ? 'Reviewed' : 'Pending dispatch'}
                        </span>
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
