import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Camera, DetectionEvent, CityZone, Vehicle } from '../../types';
import { LUCKNOW_CENTER, getCameraById } from '../../data/mock-data';
import { Camera as CameraIcon, CheckCircle2, AlertOctagon, Layers } from 'lucide-react';

interface LeafletMapProps {
  viewMode?: 'live' | 'heatmap' | 'od';
  cameras: Camera[];
  detections?: DetectionEvent[];
  selectedDetection?: DetectionEvent | null;
  onSelectDetection?: (detection: DetectionEvent) => void;
  // Specific trajectory mode for search page (UNTOUCHED)
  trajectoryEvents?: DetectionEvent[];
  cityZones?: CityZone[];
  height?: string;
  focusVehiclePlate?: string | null;
  focusedCameraId?: string | null;
  focusedEventId?: string | null;
}

export const LeafletMap: React.FC<LeafletMapProps> = ({
  viewMode = 'live',
  cameras,
  detections = [],
  selectedDetection,
  onSelectDetection,
  trajectoryEvents,
  cityZones = [],
  height = '440px',
  focusVehiclePlate,
  focusedCameraId,
  focusedEventId
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});

  // Filter state for live camera view
  const [cameraFilter, setCameraFilter] = useState<'all' | 'working' | 'offline'>('all');

  const workingCameras = cameras.filter(c => c.status === 'active');
  const offlineCameras = cameras.filter(c => c.status === 'inactive');

  // Initialize map once
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [LUCKNOW_CENTER.lat, LUCKNOW_CENTER.lng],
      zoom: LUCKNOW_CENTER.zoom,
      zoomControl: true,
      attributionControl: false
    });

    // OpenStreetMap standard free tiles (no API key required)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      subdomains: ['a', 'b', 'c'],
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    const layerGroup = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;
    layerGroupRef.current = layerGroup;

    // Handle container resize observer
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    resizeObserver.observe(mapContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      map.remove();
      mapInstanceRef.current = null;
      layerGroupRef.current = null;
    };
  }, []);

  // Smoothly center on focused camera when clicked from timeline/gallery
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (focusedCameraId || focusedEventId) {
      const targetCam =
        cameras.find(c => c.id === focusedCameraId) ||
        (focusedEventId && trajectoryEvents?.find(e => e.id === focusedEventId)
          ? getCameraById(trajectoryEvents.find(e => e.id === focusedEventId)!.cameraId)
          : null);

      if (targetCam) {
        map.flyTo([targetCam.lat, targetCam.lng], 15, {
          animate: true,
          duration: 0.9
        });

        // Open popup for marker if present
        const key = focusedEventId || focusedCameraId;
        if (key && markersRef.current[key]) {
          setTimeout(() => {
            markersRef.current[key]?.openPopup();
          }, 350);
        }
      }
    }
  }, [focusedCameraId, focusedEventId, cameras, trajectoryEvents]);

  // Update map contents whenever props or filter change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();

    // 1. HEATMAP MODE: Show zone congestion circles
    if (viewMode === 'heatmap') {
      cityZones.forEach(zone => {
        const color =
          zone.congestionLevel === 'high'
            ? '#dc2626'
            : zone.congestionLevel === 'medium'
            ? '#d97706'
            : '#16a34a';

        const circle = L.circle([zone.lat, zone.lng], {
          color: color,
          fillColor: color,
          fillOpacity: 0.28,
          weight: 2,
          radius: zone.radiusMeters
        });

        circle.bindPopup(`
          <div style="font-family: sans-serif; font-size: 12px; line-height: 1.4; color: #111827; min-width: 170px;">
            <div style="font-weight: bold; font-size: 13px; margin-bottom: 4px;">${zone.name}</div>
            <div><strong>Congestion:</strong> <span style="color: ${color}; font-weight: bold; text-transform: uppercase;">${zone.congestionLevel}</span></div>
            <div><strong>Active volume:</strong> ${zone.vehicleCount} vehicles/hr</div>
            <div><strong>Avg speed:</strong> ${zone.avgSpeed} km/h</div>
          </div>
        `);

        // Zone center label icon
        const zoneLabelIcon = L.divIcon({
          className: 'zone-label',
          html: `<div style="background: rgba(17, 24, 39, 0.85); color: #fff; font-size: 11px; padding: 2px 6px; border-radius: 3px; font-weight: 600; text-align: center; white-space: nowrap; border: 1px solid rgba(255,255,255,0.3); transform: translate(-50%, -50%);">${zone.name}<br/><span style="font-size: 9px; font-weight: normal; color: #cbd5e1;">${zone.avgSpeed} km/h</span></div>`,
          iconSize: [0, 0]
        });

        L.marker([zone.lat, zone.lng], { icon: zoneLabelIcon }).addTo(layerGroup);
        circle.addTo(layerGroup);
      });

      // Fit map to show all zones
      map.setView([LUCKNOW_CENTER.lat, LUCKNOW_CENTER.lng], 12);
      return;
    }

    // 2. OD MATRIX VIEW (on map preview)
    if (viewMode === 'od') {
      cityZones.forEach((originZone, i) => {
        // Draw origin circle
        L.circleMarker([originZone.lat, originZone.lng], {
          radius: 12,
          color: '#378ADD',
          fillColor: '#ffffff',
          fillOpacity: 0.9,
          weight: 3
        }).bindTooltip(`Zone: ${originZone.name}`, { permanent: false }).addTo(layerGroup);

        // Draw connecting OD flow lines to other zones
        cityZones.forEach((destZone, j) => {
          if (i < j) {
            L.polyline(
              [
                [originZone.lat, originZone.lng],
                [destZone.lat, destZone.lng]
              ],
              {
                color: '#378ADD',
                weight: 2,
                opacity: 0.6,
                dashArray: '6, 6'
              }
            ).bindPopup(`
              <div style="font-family: sans-serif; font-size: 12px;">
                <strong>Corridor:</strong> ${originZone.name} ↔ ${destZone.name}<br/>
                <strong>Inter-zone volume:</strong> ~${Math.floor(1000 + (i + j) * 240)} trips/day
              </div>
            `).addTo(layerGroup);
          }
        });
      });
      return;
    }

    // 3. SEARCH / TRAJECTORY MODE (Sequential numbered stops)
    if (trajectoryEvents && trajectoryEvents.length > 0) {
      const latLngs: [number, number][] = [];
      markersRef.current = {};

      trajectoryEvents.forEach((evt, idx) => {
        const cam = getCameraById(evt.cameraId);
        if (!cam) return;
        latLngs.push([cam.lat, cam.lng]);

        const isViolation = !!evt.violationFlag;
        const isAlert = evt.status !== 'Normal';
        const badgeColor = isAlert || isViolation ? '#dc2626' : '#16a34a';
        const isFocused = evt.id === focusedEventId || cam.id === focusedCameraId;

        const stopIcon = L.divIcon({
          className: 'custom-trajectory-marker',
          html: `
            <div style="
              width: ${isFocused ? '34px' : '28px'};
              height: ${isFocused ? '34px' : '28px'};
              border-radius: 50%;
              background: ${badgeColor};
              color: #ffffff;
              border: ${isFocused ? '3px solid #378ADD' : '2px solid #ffffff'};
              box-shadow: ${isFocused ? '0 0 0 4px rgba(55, 138, 221, 0.45), 0 3px 8px rgba(0,0,0,0.4)' : '0 2px 4px rgba(0,0,0,0.3)'};
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: bold;
              font-size: ${isFocused ? '14px' : '12px'};
              font-family: monospace;
              transform: translate(-50%, -50%);
              transition: all 0.2s ease;
            ">
              ${idx + 1}
            </div>
          `,
          iconSize: [0, 0]
        });

        const marker = L.marker([cam.lat, cam.lng], { icon: stopIcon });
        marker.bindPopup(`
          <div style="font-family: sans-serif; font-size: 12px; line-height: 1.4; min-width: 190px;">
            <div style="font-weight: bold; font-size: 13px; color: #111827; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px; margin-bottom: 4px;">
              Stop #${idx + 1}: ${evt.plateText}
            </div>
            <div><strong>Camera:</strong> ${cam.name}</div>
            <div><strong>Time:</strong> ${evt.timestamp}</div>
            <div><strong>Speed:</strong> ${evt.speed} km/h (Limit: ${cam.speedLimit} km/h)</div>
            <div><strong>Confidence:</strong> ${evt.confidence}%</div>
            <div><strong>Status:</strong> <span style="color: ${isAlert ? '#dc2626' : '#16a34a'}; font-weight: bold;">${evt.status}</span></div>
            ${evt.violationFlag ? `<div style="color: #dc2626; margin-top: 3px;"><strong>Violation:</strong> ${evt.violationFlag}</div>` : ''}
          </div>
        `);
        marker.addTo(layerGroup);
        markersRef.current[evt.id] = marker;
        markersRef.current[cam.id] = marker;
      });

      // Draw dashed trajectory polyline
      if (latLngs.length > 1) {
        const pathLine = L.polyline(latLngs, {
          color: '#378ADD',
          weight: 3.5,
          opacity: 0.85,
          dashArray: '7, 7'
        });
        pathLine.addTo(layerGroup);
        if (!focusedCameraId && !focusedEventId) {
          map.fitBounds(pathLine.getBounds(), { padding: [40, 40] });
        }
      } else if (latLngs.length === 1 && !focusedCameraId && !focusedEventId) {
        map.setView(latLngs[0], 14);
      }
      return;
    }

    // 4. LIVE MAP MODE: SHOW ANPR CAMERA LOCATIONS & WORKING/NOT WORKING STATUS
    // Filter cameras based on active tab
    const displayCameras = cameras.filter(cam => {
      if (cameraFilter === 'working') return cam.status === 'active';
      if (cameraFilter === 'offline') return cam.status === 'inactive';
      return true;
    });

    displayCameras.forEach(cam => {
      const isWorking = cam.status === 'active';
      const camDetectionsCount = detections.filter(d => d.cameraId === cam.id).length;

      // Optional coverage radius circle
      const coverageCircle = L.circle([cam.lat, cam.lng], {
        radius: 350,
        color: isWorking ? '#16a34a' : '#dc2626',
        fillColor: isWorking ? '#22c55e' : '#ef4444',
        fillOpacity: isWorking ? 0.08 : 0.15,
        weight: 1,
        dashArray: isWorking ? undefined : '4, 4'
      });
      coverageCircle.addTo(layerGroup);

      // Camera Pin HTML Icon with Working / Not Working Visuals
      const camIconHtml = isWorking
        ? `
          <div style="cursor: pointer; display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -50%);">
            <div style="
              position: relative;
              width: 32px;
              height: 32px;
              border-radius: 50%;
              background: #15803d;
              border: 2px solid #ffffff;
              box-shadow: 0 3px 6px rgba(0,0,0,0.35);
              display: flex;
              align-items: center;
              justify-content: center;
              color: #ffffff;
            ">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path>
                <circle cx="12" cy="13" r="3"></circle>
              </svg>
              <span style="
                position: absolute;
                top: -2px;
                right: -2px;
                width: 9px;
                height: 9px;
                border-radius: 50%;
                background: #22c55e;
                border: 1.5px solid #ffffff;
              "></span>
            </div>
            <div style="
              margin-top: 3px;
              background: rgba(17, 24, 39, 0.92);
              color: #ffffff;
              font-family: monospace;
              font-size: 10px;
              font-weight: bold;
              padding: 1px 5px;
              border-radius: 3px;
              border: 1px solid rgba(255, 255, 255, 0.25);
              white-space: nowrap;
              box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            ">
              ${cam.id}
            </div>
          </div>
        `
        : `
          <div style="cursor: pointer; display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -50%);">
            <div style="
              position: relative;
              width: 32px;
              height: 32px;
              border-radius: 50%;
              background: #dc2626;
              border: 2px solid #ffffff;
              box-shadow: 0 3px 8px rgba(220,38,38,0.5);
              display: flex;
              align-items: center;
              justify-content: center;
              color: #ffffff;
            ">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M1 1l22 22"></path>
                <path d="M21 15V9a2 2 0 0 0-2-2h-3l-2.5-3h-3.8"></path>
                <path d="M7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16"></path>
                <circle cx="12" cy="13" r="3"></circle>
              </svg>
              <span style="
                position: absolute;
                top: -2px;
                right: -2px;
                width: 9px;
                height: 9px;
                border-radius: 50%;
                background: #f87171;
                border: 1.5px solid #ffffff;
              "></span>
            </div>
            <div style="
              margin-top: 3px;
              background: #dc2626;
              color: #ffffff;
              font-family: monospace;
              font-size: 10px;
              font-weight: bold;
              padding: 1px 5px;
              border-radius: 3px;
              border: 1px solid #ffffff;
              white-space: nowrap;
              box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            ">
              ${cam.id} [OFFLINE]
            </div>
          </div>
        `;

      const camIcon = L.divIcon({
        className: 'custom-anpr-node-marker',
        html: camIconHtml,
        iconSize: [0, 0]
      });

      const camMarker = L.marker([cam.lat, cam.lng], { icon: camIcon });

      // Rich Informative Popup
      const popupHtml = `
        <div style="font-family: sans-serif; font-size: 12px; line-height: 1.45; min-width: 220px; color: #111827;">
          <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px; margin-bottom: 6px;">
            <div style="font-weight: bold; font-size: 13px; color: #111827;">
              ${cam.name}
            </div>
            <span style="
              font-size: 10px;
              font-weight: bold;
              padding: 2px 6px;
              border-radius: 3px;
              text-transform: uppercase;
              ${isWorking ? 'background: #dcfce7; color: #15803d;' : 'background: #fee2e2; color: #dc2626;'}
            ">
              ${isWorking ? '● Working (Online)' : '● Not Working (Offline)'}
            </span>
          </div>

          <div style="color: #4b5563; font-size: 11px; margin-bottom: 6px;">
            📍 ${cam.locationName}
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px; background: #f9fafb; padding: 6px; border-radius: 4px; border: 1px solid #f3f4f6; margin-bottom: 6px;">
            <div>
              <span style="color: #6b7280; font-size: 10px; display: block;">City Zone:</span>
              <strong style="color: #1f2937;">${cam.zone}</strong>
            </div>
            <div>
              <span style="color: #6b7280; font-size: 10px; display: block;">Speed Limit:</span>
              <strong style="color: #1f2937;">${cam.speedLimit} km/h</strong>
            </div>
            <div style="grid-column: span 2; margin-top: 2px;">
              <span style="color: #6b7280; font-size: 10px; display: block;">Direction / Corridor:</span>
              <strong style="color: #1f2937;">${cam.directionLabel}</strong>
            </div>
          </div>

          <div style="border-top: 1px solid #f3f4f6; padding-top: 5px; font-size: 11px;">
            ${
              isWorking
                ? `
                  <div style="color: #15803d; font-weight: 600; display: flex; align-items: center; justify-content: space-between;">
                    <span>Optical ANPR Stream:</span>
                    <span>1080p @ 30 FPS</span>
                  </div>
                  <div style="color: #374151; margin-top: 2px;">
                    Detections today: <strong>${camDetectionsCount > 0 ? camDetectionsCount : 24} vehicles scanned</strong>
                  </div>
                `
                : `
                  <div style="color: #dc2626; font-weight: 600;">
                    ⚠️ Sensor Disconnect / Scheduled Maintenance
                  </div>
                  <div style="color: #6b7280; font-size: 10px; margin-top: 2px;">
                    Maintenance Ticket #LKO-ANPR-${cam.id.replace('CAM-', '90')} Dispatch Active
                  </div>
                `
            }
          </div>
        </div>
      `;

      camMarker.bindPopup(popupHtml);
      camMarker.addTo(layerGroup);
    });

  }, [viewMode, cameras, detections, selectedDetection, trajectoryEvents, cityZones, focusVehiclePlate, onSelectDetection, cameraFilter]);

  return (
    <div className="relative w-full border border-gray-200 rounded bg-white overflow-hidden" style={{ height }}>
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Live Map Top-Right Camera Fleet Status & Filter Overlay */}
      {viewMode === 'live' && !trajectoryEvents && (
        <div className="absolute top-2 right-2 bg-white/95 border border-gray-200 p-1.5 rounded-md shadow-sm z-[1000] flex items-center space-x-1.5 backdrop-blur-xs text-xs">
          <div className="flex items-center space-x-1 px-1.5 py-0.5 text-gray-500 font-medium text-[11px] border-r border-gray-200">
            <CameraIcon className="w-3.5 h-3.5 text-gray-700" />
            <span>ANPR Grid:</span>
          </div>

          <button
            onClick={() => setCameraFilter('all')}
            className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
              cameraFilter === 'all'
                ? 'bg-gray-900 text-white shadow-xs'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            All ({cameras.length})
          </button>

          <button
            onClick={() => setCameraFilter('working')}
            className={`px-2 py-0.5 rounded text-[11px] font-semibold flex items-center space-x-1 transition-all ${
              cameraFilter === 'working'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
            <span>Working ({workingCameras.length})</span>
          </button>

          <button
            onClick={() => setCameraFilter('offline')}
            className={`px-2 py-0.5 rounded text-[11px] font-semibold flex items-center space-x-1 transition-all ${
              cameraFilter === 'offline'
                ? 'bg-red-700 text-white shadow-xs'
                : 'text-red-700 bg-red-50 hover:bg-red-100'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block"></span>
            <span>Not Working ({offlineCameras.length})</span>
          </button>
        </div>
      )}

      {/* Map Legend Overlay */}
      <div className="absolute bottom-2 left-2 bg-white/95 border border-gray-200 text-[11px] p-2 rounded shadow-sm z-[1000] flex flex-wrap items-center gap-3 backdrop-blur-xs">
        {viewMode === 'live' && !trajectoryEvents ? (
          <>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-full bg-[#15803d] border border-white inline-block"></span>
              <span className="text-gray-700 font-medium">Working ANPR Camera ({workingCameras.length})</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-full bg-[#dc2626] border border-white inline-block"></span>
              <span className="text-gray-700 font-medium">Not Working / Offline ({offlineCameras.length})</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3.5 h-3.5 rounded-full border border-gray-400 border-dashed inline-block"></span>
              <span className="text-gray-500">Coverage radius</span>
            </div>
          </>
        ) : trajectoryEvents && trajectoryEvents.length > 0 ? (
          <>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-full bg-[#16a34a] border border-white inline-block"></span>
              <span className="text-gray-700 font-medium">Normal waypoint stop</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-full bg-[#dc2626] border border-white inline-block"></span>
              <span className="text-gray-700 font-medium">Violation / Alert stop</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-4 border-b-2 border-dashed border-[#378ADD] inline-block"></span>
              <span className="text-gray-700">Trajectory vector</span>
            </div>
          </>
        ) : viewMode === 'heatmap' ? (
          <>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block"></span>
              <span className="text-gray-700">High congestion</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
              <span className="text-gray-700">Medium</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block"></span>
              <span className="text-gray-700">Low</span>
            </div>
          </>
        ) : (
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-[#378ADD] border border-white inline-block"></span>
            <span className="text-gray-700 font-medium">Zone origin & flow corridor</span>
          </div>
        )}
      </div>
    </div>
  );
};
