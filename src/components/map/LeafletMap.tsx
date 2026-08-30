import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Camera, DetectionEvent, CityZone, Vehicle } from '../../types';
import { LUCKNOW_CENTER, getCameraById } from '../../data/mock-data';

interface LeafletMapProps {
  viewMode?: 'live' | 'heatmap' | 'od';
  cameras: Camera[];
  detections?: DetectionEvent[];
  selectedDetection?: DetectionEvent | null;
  onSelectDetection?: (detection: DetectionEvent) => void;
  // Specific trajectory mode for search page
  trajectoryEvents?: DetectionEvent[];
  cityZones?: CityZone[];
  height?: string;
  focusVehiclePlate?: string | null;
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
  focusVehiclePlate
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

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

    // Add clean CartoDB Positron / OSM tiles for monochrome control-room aesthetic
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd',
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

  // Update map contents whenever props change
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

      trajectoryEvents.forEach((evt, idx) => {
        const cam = getCameraById(evt.cameraId);
        if (!cam) return;
        latLngs.push([cam.lat, cam.lng]);

        const isViolation = !!evt.violationFlag;
        const isAlert = evt.status !== 'Normal';
        const badgeColor = isAlert || isViolation ? '#dc2626' : '#16a34a';

        const stopIcon = L.divIcon({
          className: 'custom-trajectory-marker',
          html: `
            <div style="
              width: 28px;
              height: 28px;
              border-radius: 50%;
              background: ${badgeColor};
              color: #ffffff;
              border: 2px solid #ffffff;
              box-shadow: 0 2px 4px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: bold;
              font-size: 12px;
              font-family: monospace;
              transform: translate(-14px, -14px);
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
        map.fitBounds(pathLine.getBounds(), { padding: [40, 40] });
      } else if (latLngs.length === 1) {
        map.setView(latLngs[0], 14);
      }
      return;
    }

    // 4. LIVE MAP MODE (Default)
    // Draw 8-10 fixed cameras (blue dots)
    cameras.forEach(cam => {
      const camIcon = L.divIcon({
        className: 'custom-cam-marker',
        html: `
          <div style="
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: #378ADD;
            border: 2px solid #ffffff;
            box-shadow: 0 1px 3px rgba(0,0,0,0.4);
            transform: translate(-8px, -8px);
          "></div>
        `,
        iconSize: [0, 0]
      });

      const camMarker = L.marker([cam.lat, cam.lng], { icon: camIcon });
      camMarker.bindPopup(`
        <div style="font-family: sans-serif; font-size: 12px; line-height: 1.4; min-width: 170px;">
          <div style="font-weight: bold; font-size: 13px; color: #111827; margin-bottom: 2px;">${cam.name}</div>
          <div style="color: #4b5563; font-size: 11px; margin-bottom: 4px;">${cam.locationName}</div>
          <div><strong>Status:</strong> <span style="color: ${cam.status === 'active' ? '#16a34a' : '#dc2626'}; font-weight: 600;">${cam.status === 'active' ? 'Active' : 'Offline'}</span></div>
          <div><strong>Speed limit:</strong> ${cam.speedLimit} km/h</div>
          <div><strong>Zone:</strong> ${cam.zone}</div>
        </div>
      `);
      camMarker.addTo(layerGroup);
    });

    // Draw active vehicle detections (latest 15-20 detections or focused vehicle)
    const displayDetections = focusVehiclePlate
      ? detections.filter(d => d.plateText.toUpperCase() === focusVehiclePlate.toUpperCase())
      : detections.slice(-14);

    // Trajectory lines for selected vehicle if multiple sightings exist
    const vehicleSightings: { [plate: string]: [number, number][] } = {};

    displayDetections.forEach(evt => {
      const cam = getCameraById(evt.cameraId);
      if (!cam) return;

      if (!vehicleSightings[evt.plateText]) {
        vehicleSightings[evt.plateText] = [];
      }
      vehicleSightings[evt.plateText].push([cam.lat, cam.lng]);

      const isDanger = evt.status !== 'Normal' || !!evt.violationFlag;
      const markerColor = isDanger ? '#dc2626' : '#16a34a';

      const isSelected = selectedDetection?.id === evt.id;

      const vehicleIcon = L.divIcon({
        className: 'custom-vehicle-marker',
        html: `
          <div style="
            width: ${isSelected ? '22px' : '18px'};
            height: ${isSelected ? '22px' : '18px'};
            border-radius: 4px;
            background: ${markerColor};
            border: 2px solid ${isSelected ? '#111827' : '#ffffff'};
            box-shadow: 0 2px 5px rgba(0,0,0,0.35);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ffffff;
            font-size: 10px;
            font-weight: bold;
            transform: translate(-50%, -50%);
          ">
            ${evt.vehicleType === 'bike' ? '🏍' : evt.vehicleType === 'truck' ? '🚚' : evt.vehicleType === 'auto' ? '🛺' : '🚗'}
          </div>
        `,
        iconSize: [0, 0]
      });

      const vMarker = L.marker([cam.lat, cam.lng], { icon: vehicleIcon });

      vMarker.on('click', () => {
        if (onSelectDetection) {
          onSelectDetection(evt);
        }
      });

      vMarker.bindPopup(`
        <div style="font-family: sans-serif; font-size: 12px; line-height: 1.4; min-width: 200px; color: #111827;">
          <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px; margin-bottom: 4px;">
            <span style="font-family: monospace; font-weight: bold; font-size: 13px;">${evt.plateText}</span>
            <span style="font-size: 10px; background: ${isDanger ? '#fee2e2' : '#dcfce7'}; color: ${isDanger ? '#dc2626' : '#16a34a'}; padding: 1px 4px; border-radius: 2px; font-weight: bold;">${evt.status}</span>
          </div>
          <div><strong>Camera:</strong> ${cam.name}</div>
          <div><strong>Timestamp:</strong> ${evt.timestamp}</div>
          <div><strong>Lat / Long:</strong> ${cam.lat.toFixed(4)}, ${cam.lng.toFixed(4)}</div>
          <div><strong>Vehicle:</strong> ${evt.vehicleColor} ${evt.vehicleType}</div>
          <div><strong>Confidence:</strong> ${evt.confidence}%</div>
          <div><strong>Speed:</strong> ${evt.speed} km/h (Limit: ${cam.speedLimit} km/h)</div>
          <div><strong>Direction:</strong> ${evt.direction}</div>
          ${evt.violationFlag ? `<div style="color: #dc2626; margin-top: 4px; font-weight: 600;"><strong>Violations:</strong> ${evt.violationFlag}</div>` : '<div style="color: #16a34a; margin-top: 4px;">No active violations</div>'}
        </div>
      `);

      vMarker.addTo(layerGroup);
    });

    // Draw dashed lines for vehicles with multiple sightings
    Object.entries(vehicleSightings).forEach(([plate, coords]) => {
      if (coords.length > 1) {
        L.polyline(coords, {
          color: plate === selectedDetection?.plateText ? '#111827' : '#378ADD',
          weight: 2.5,
          opacity: 0.8,
          dashArray: '5, 5'
        }).addTo(layerGroup);
      }
    });

  }, [viewMode, cameras, detections, selectedDetection, trajectoryEvents, cityZones, focusVehiclePlate, onSelectDetection]);

  return (
    <div className="relative w-full border border-gray-200 rounded bg-white overflow-hidden" style={{ height }}>
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Map Legend Overlay */}
      <div className="absolute bottom-2 left-2 bg-white/95 border border-gray-200 text-[11px] p-2 rounded shadow-sm z-[1000] flex flex-wrap items-center gap-3 backdrop-blur-xs">
        <div className="flex items-center space-x-1.5">
          <span className="w-3 h-3 rounded-full bg-[#378ADD] border border-white inline-block"></span>
          <span className="text-gray-700">Fixed ANPR camera</span>
        </div>
        {viewMode === 'live' && (
          <>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-xs bg-[#16a34a] border border-white inline-block"></span>
              <span className="text-gray-700">Normal detection</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-xs bg-[#dc2626] border border-white inline-block"></span>
              <span className="text-gray-700">Alert / Blacklist / Violation</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-4 border-b-2 border-dashed border-[#378ADD] inline-block"></span>
              <span className="text-gray-700">Trajectory vector</span>
            </div>
          </>
        )}
        {viewMode === 'heatmap' && (
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
        )}
      </div>
    </div>
  );
};
