import React, { useState } from 'react';
import { DetectionEvent } from '../../types';
import { getCameraById } from '../../data/mock-data';
import {
  Camera as CameraIcon,
  Bot,
  Sparkles,
  Eye,
  Crosshair,
  ShieldCheck,
  X,
  ScanLine,
  ChevronRight,
  Maximize2
} from 'lucide-react';

import { getCameraCaptureForDetection } from '../../utils/cameraImages';

interface TrajectoryCaptureGalleryProps {
  events: DetectionEvent[];
  plate: string;
}

export const TrajectoryCaptureGallery: React.FC<TrajectoryCaptureGalleryProps> = ({
  events
}) => {
  const [selectedInspectionEvent, setSelectedInspectionEvent] = useState<DetectionEvent | null>(null);

  if (!events || events.length === 0) {
    return null;
  }

  // Consistent, authentic single vehicle photograph per vehicle identity from JS_1 dataset
  const getConsistentVehicleImage = (evt: DetectionEvent) => {
    const plate = evt.plateText.toUpperCase();
    const type = evt.vehicleType;
    const color = evt.vehicleColor.toLowerCase();

    // 1. Blacklisted Stolen Hyundai Creta / Silver SUV (UP32-KL-5544)
    if (plate.includes('KL-5544') || (type === 'car' && (color.includes('silver') || color.includes('grey')) && !plate.includes('LK-90'))) {
      return '/captures/creta_silver_cam01.jpg';
    }

    // 2. Near-miss / Wanted Dark Grey Scorpio (UP32-LK-9021 / UP32-LK-9027)
    if (plate.includes('LK-9021') || plate.includes('LK-9027')) {
      return '/captures/scorpio_grey_cam07.jpg';
    }

    // 3. Cloned Plate suspect / White Sedan (UP32-EX-4091) -> Always same White Honda City
    if (plate.includes('EX-4091')) {
      return '/captures/honda_city_white_cam04.jpg';
    }

    // 4. White car / Swift / Honda City (UP32-AB-1234)
    if (color.includes('white') || plate.includes('AB-1234')) {
      return '/captures/honda_city_white_cam04.jpg';
    }

    // 5. Blue car / SUV (UP32-TR-9900)
    if (color.includes('blue') || plate.includes('TR-9900')) {
      return '/captures/seltos_blue_cam06.jpg';
    }

    // 6. Black / Dark SUV (UP32-ZZ-0007)
    if (color.includes('black') || plate.includes('ZZ-0007')) {
      return '/captures/fortuner_black_cam03.jpg';
    }

    // 7. Auto-rickshaw (UP32-BN-8822)
    if (type === 'auto' || plate.includes('BN-8822')) {
      return '/captures/auto_rickshaw_cam09.jpg';
    }

    // Fallback through JS_1 camera images helper
    const capture = getCameraCaptureForDetection(evt);
    return capture?.imageUrl || '/captures/creta_silver_cam01.jpg';
  };

  // Simulates realistic camera angle / crop variations of the EXACT SAME physical car
  const getCameraPerspectiveStyle = (idx: number) => {
    const perspectives = [
      { objectPosition: 'center 45%', transform: 'scale(1.02)' },
      { objectPosition: '40% 50%', transform: 'scale(1.08)' },
      { objectPosition: '60% 40%', transform: 'scale(1.05)' },
      { objectPosition: '50% 55%', transform: 'scale(1.12)' }
    ];
    return perspectives[idx % perspectives.length];
  };

  const reIdCount = events.filter(e => e.reIdAnalysis?.isReIdMatch).length;

  return (
    <div className="bg-white border border-gray-200 rounded p-3 space-y-2.5 shadow-xs">
      {/* Mini Header Bar */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
        <div className="flex items-center space-x-2">
          <CameraIcon className="w-3.5 h-3.5 text-[#378ADD]" />
          <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">
            Trajectory Camera Capture Frames ({events.length})
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {reIdCount > 0 ? (
            <span className="text-[10px] font-mono bg-purple-100 text-purple-900 px-2 py-0.5 rounded font-bold flex items-center space-x-1 border border-purple-200">
              <Bot className="w-3 h-3 text-purple-700" />
              <span>{reIdCount} AI Re-ID Match</span>
            </span>
          ) : (
            <span className="text-[10px] font-mono text-gray-700 bg-gray-100 px-2 py-0.5 rounded border border-gray-200 font-semibold">
              ● Captured Frame Audit
            </span>
          )}
          <span className="text-[10px] text-gray-400 italic hidden sm:inline">
            Click frame for forensic audit
          </span>
        </div>
      </div>

      {/* Sleek, Single-Row Horizontal Reel for Camera Frames */}
      <div className="flex gap-2.5 overflow-x-auto pb-2 pt-0.5 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {events.map((evt, idx) => {
          const cam = getCameraById(evt.cameraId);
          const hasReId = !!evt.reIdAnalysis?.isReIdMatch;
          const isViolation = !!evt.violationFlag;
          const isDanger = evt.status !== 'Normal' || isViolation;
          const vehiclePhoto = getConsistentVehicleImage(evt);
          const perspectiveStyle = getCameraPerspectiveStyle(idx);

          return (
            <div
              key={evt.id}
              onClick={() => setSelectedInspectionEvent(evt)}
              className={`min-w-[155px] max-w-[170px] shrink-0 rounded border transition-all cursor-pointer flex flex-col justify-between overflow-hidden group hover:shadow-md ${
                hasReId
                  ? 'border-purple-300 bg-purple-50/20 hover:border-purple-500 ring-1 ring-purple-200'
                  : isDanger
                  ? 'border-red-200 hover:border-red-400 bg-white'
                  : 'border-gray-200 hover:border-blue-400 bg-white'
              }`}
            >
              {/* Card Header: Stop # & Camera */}
              <div className="px-2 py-0.5 bg-gray-900 text-white flex items-center justify-between text-[10px] font-mono">
                <div className="flex items-center space-x-1 truncate">
                  <span
                    className={`w-3.5 h-3.5 rounded-full text-[9px] font-bold flex items-center justify-center ${
                      hasReId
                        ? 'bg-purple-500 text-white'
                        : isDanger
                        ? 'bg-red-500 text-white'
                        : 'bg-[#378ADD] text-white'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <span className="font-semibold text-gray-200 truncate text-[10px]">
                    {cam?.id || evt.cameraId}
                  </span>
                </div>
                <span className="text-[9px] text-gray-400 shrink-0">{evt.timestamp.split(' ')[0]}</span>
              </div>

              {/* Realistic CCTV Viewport with Photo & ANPR Overlays */}
              <div className="relative bg-[#0d131f] overflow-hidden h-24 border-y border-gray-800">
                {/* Real Vehicle Image (Consistent same car across stops) */}
                <img
                  src={vehiclePhoto}
                  alt={`${evt.plateText} at ${cam?.name}`}
                  className="w-full h-full object-cover filter brightness-90 contrast-110 group-hover:scale-105 transition-transform duration-300"
                  style={perspectiveStyle}
                  loading="lazy"
                />

                {/* CCTV Surveillance Lighting / Vignette Overlay */}
                <div
                  className={`absolute inset-0 pointer-events-none ${
                    hasReId
                      ? 'bg-gradient-to-t from-black/90 via-purple-950/25 to-black/60'
                      : 'bg-gradient-to-t from-black/85 via-transparent to-black/60'
                  }`}
                />

                {/* CCTV Top Status Overlay */}
                <div className="absolute top-0.5 left-1 text-[8px] font-mono text-gray-300 font-semibold flex items-center space-x-1 drop-shadow-md z-10 bg-black/60 px-1 py-0.2 rounded">
                  <span>FRAME #{idx + 1}</span>
                </div>

                <div className="absolute top-0.5 right-1 text-[8px] font-mono text-white/90 font-bold bg-black/50 px-1 rounded drop-shadow-md z-10">
                  {evt.speed}k
                </div>

                {/* AI Target Detection Crosshair Bounding Box */}
                <div
                  className={`absolute inset-x-2 inset-y-3 border pointer-events-none rounded-xs flex items-center justify-center ${
                    hasReId ? 'border-purple-400/90 shadow-[0_0_8px_rgba(168,85,247,0.4)]' : 'border-emerald-400/70'
                  }`}
                >
                  <span
                    className={`absolute -top-1 -left-1 w-1.5 h-1.5 border-t-2 border-l-2 ${
                      hasReId ? 'border-purple-400' : 'border-emerald-400'
                    }`}
                  ></span>
                  <span
                    className={`absolute -top-1 -right-1 w-1.5 h-1.5 border-t-2 border-r-2 ${
                      hasReId ? 'border-purple-400' : 'border-emerald-400'
                    }`}
                  ></span>
                  <span
                    className={`absolute -bottom-1 -left-1 w-1.5 h-1.5 border-b-2 border-l-2 ${
                      hasReId ? 'border-purple-400' : 'border-emerald-400'
                    }`}
                  ></span>
                  <span
                    className={`absolute -bottom-1 -right-1 w-1.5 h-1.5 border-b-2 border-r-2 ${
                      hasReId ? 'border-purple-400' : 'border-emerald-400'
                    }`}
                  ></span>

                  {/* If Re-ID: Body Landmark Scanner Tag */}
                  {hasReId && (
                    <span className="absolute top-0.5 left-0.5 text-[7px] font-mono font-bold bg-purple-900/90 text-purple-200 px-1 py-0.2 rounded border border-purple-400/60">
                      BODY RE-ID {evt.reIdAnalysis?.confidence}%
                    </span>
                  )}
                </div>

                {/* Simulated Mud / Glare / Motion Blur Occlusion directly over the vehicle plate area */}
                {hasReId && (
                  <div
                    className="absolute bottom-5 left-1/2 -translate-x-1/2 w-14 h-4.5 rounded backdrop-blur-[4px] bg-amber-950/60 border border-amber-500/80 shadow-[0_0_10px_rgba(245,158,11,0.6)] flex items-center justify-center overflow-hidden z-10"
                    title="License plate unreadable due to mud spray and glare occlusion"
                  >
                    <div className="text-[6.5px] font-mono text-amber-200 font-bold tracking-tighter filter blur-[0.6px] select-none line-through">
                      UP32·??·????
                    </div>
                    {/* Simulated mud and dirt texture */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-amber-900/80 via-yellow-800/40 to-amber-950/90 mix-blend-color-burn pointer-events-none"></div>
                    <span className="absolute -top-0.5 -right-0.5 text-[6px] bg-red-600 text-white font-black px-0.5 rounded-2xs">
                      BLUR
                    </span>
                  </div>
                )}

                {/* Bottom Number Plate Cutout Box */}
                <div className="absolute bottom-0.5 left-0.5 right-0.5 bg-black/90 border border-gray-700/80 rounded px-1 py-0.2 flex items-center justify-between text-[8px] backdrop-blur-xs z-10">
                  {hasReId ? (
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center space-x-0.5 truncate">
                        <span className="text-[6px] bg-amber-500 text-black font-extrabold px-0.5 rounded-2xs">
                          MUD/BLUR
                        </span>
                        <span className="font-mono font-bold text-gray-400 tracking-tight text-[8px] line-through">
                          UP32-??-????
                        </span>
                      </div>
                      <span className="font-mono text-[7.5px] font-bold text-purple-300">
                        Re-ID {evt.reIdAnalysis?.confidence}%
                      </span>
                    </div>
                  ) : (
                    <>
                      <span className="font-mono font-bold text-white tracking-wider truncate text-[9px]">
                        {evt.plateText}
                      </span>

                      <span className="font-mono text-[8px] font-bold text-emerald-400">
                        {evt.confidence}%
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Card Footer: Status Pill (Exact Uniform Height) */}
              <div className="p-1 bg-gray-50 flex items-center justify-between text-[9px]">
                {hasReId ? (
                  <span className="inline-flex items-center space-x-0.5 text-purple-900 bg-purple-100 font-bold px-1 py-0.2 rounded text-[8px] border border-purple-200">
                    <Sparkles className="w-2 h-2 text-purple-700 animate-pulse" />
                    <span>AI Re-ID Verified ({evt.reIdAnalysis?.confidence}%)</span>
                  </span>
                ) : (
                  <span className="text-gray-600 truncate text-[8px] font-medium">
                    {cam?.name.split(',')[0] || cam?.name || 'Optical'}
                  </span>
                )}

                <ChevronRight className="w-2.5 h-2.5 text-gray-400 group-hover:text-gray-700 group-hover:translate-x-0.5 transition-all shrink-0" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Deep Inspection Forensic Modal (Opens on Click) */}
      {selectedInspectionEvent && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-[2000] animate-fadeIn">
          <div className="bg-white rounded-lg shadow-2xl max-w-xl w-full overflow-hidden border border-gray-300 text-gray-900 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-3 bg-gray-900 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CameraIcon className="w-4 h-4 text-[#378ADD]" />
                <h4 className="text-xs font-bold font-mono">
                  Optical Sighting Audit · {selectedInspectionEvent.cameraId} · {selectedInspectionEvent.plateText}
                </h4>
              </div>
              <button
                onClick={() => setSelectedInspectionEvent(null)}
                className="text-gray-400 hover:text-white p-1 rounded transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 overflow-y-auto space-y-3.5 text-xs">
              {/* CCTV Big Realistic Frame View */}
              <div className="bg-[#0b101b] rounded-lg overflow-hidden text-white relative border border-gray-800 flex flex-col">
                <div className="relative h-60 w-full overflow-hidden bg-black">
                  <img
                    src={getConsistentVehicleImage(selectedInspectionEvent)}
                    alt={`${selectedInspectionEvent.plateText} surveillance`}
                    className="w-full h-full object-cover filter brightness-95 contrast-105"
                    style={getCameraPerspectiveStyle(
                      events.findIndex(e => e.id === selectedInspectionEvent.id)
                    )}
                  />

                  {/* Top-left Capture overlay */}
                  <div className="absolute top-2 left-3 text-[10px] font-mono text-gray-200 font-bold flex items-center space-x-1.5 bg-black/70 px-2 py-0.5 rounded backdrop-blur-xs border border-gray-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                    <span>CCTV CAPTURE ARCHIVE · {selectedInspectionEvent.cameraId}</span>
                  </div>

                  <div className="absolute top-2 right-3 text-[10px] font-mono text-gray-300 bg-black/60 px-2 py-0.5 rounded backdrop-blur-xs">
                    {selectedInspectionEvent.timestamp} IST
                  </div>

                  {/* AI Vehicle Bounding Box Overlay */}
                  <div
                    className={`absolute inset-x-12 inset-y-8 border-2 rounded flex items-center justify-center pointer-events-none ${
                      selectedInspectionEvent.reIdAnalysis?.isReIdMatch
                        ? 'border-purple-400/90 shadow-[0_0_15px_rgba(168,85,247,0.5)]'
                        : 'border-emerald-400/80'
                    }`}
                  >
                    <span
                      className={`absolute top-2 left-2 text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                        selectedInspectionEvent.reIdAnalysis?.isReIdMatch
                          ? 'bg-purple-950/95 text-purple-200 border-purple-400 font-bold'
                          : 'bg-emerald-950/90 text-emerald-300 border-emerald-500/60'
                      }`}
                    >
                      TARGET #892 · {selectedInspectionEvent.vehicleColor.toUpperCase()} {selectedInspectionEvent.vehicleType.toUpperCase()}
                      {selectedInspectionEvent.reIdAnalysis?.isReIdMatch && ` · RE-ID ${selectedInspectionEvent.reIdAnalysis.confidence}%`}
                    </span>

                    {/* If Re-ID: Landmark Sub-Bounding Boxes on car body */}
                    {selectedInspectionEvent.reIdAnalysis?.isReIdMatch && (
                      <>
                        {/* 1. Roofline landmark */}
                        <div className="absolute top-3 right-6 border border-purple-400/70 bg-purple-500/20 px-1 py-0.5 text-[8px] font-mono text-purple-200 rounded">
                          Roof Rails & Silhouette (98.9%)
                        </div>

                        {/* 2. Paint signature landmark */}
                        <div className="absolute top-1/2 left-4 border border-purple-400/70 bg-purple-500/20 px-1 py-0.5 text-[8px] font-mono text-purple-200 rounded">
                          Metallic Paint Chroma (97.4%)
                        </div>

                        {/* 3. Wheel Rim profile */}
                        <div className="absolute bottom-2 left-6 border border-purple-400/70 bg-purple-500/20 px-1 py-0.5 text-[8px] font-mono text-purple-200 rounded">
                          Alloy Spokes (96.1%)
                        </div>
                      </>
                    )}
                  </div>

                  {/* Physical Mud / Glare / Occlusion Filter over License Plate in Modal */}
                  {selectedInspectionEvent.reIdAnalysis?.isReIdMatch && (
                    <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-32 h-10 rounded-md backdrop-blur-[6px] bg-amber-950/70 border-2 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.8)] flex flex-col items-center justify-center p-1 z-20">
                      <div className="text-[10px] font-mono text-amber-200 font-black tracking-wider filter blur-[0.8px] line-through select-none">
                        UP32·??·????
                      </div>
                      <div className="text-[8px] font-mono text-white bg-red-600/90 px-1 rounded font-bold uppercase tracking-wider mt-0.5 shadow">
                        ⚠️ OCR Obscured (Mud/Glare)
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Cutout Banner */}
                <div className="p-2.5 bg-black/95 border-t border-gray-800 flex items-center justify-between font-mono">
                  {selectedInspectionEvent.reIdAnalysis?.isReIdMatch ? (
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center space-x-2">
                        <span className="bg-amber-500 text-black text-xs font-bold px-1.5 py-0.5 rounded-xs">
                          OCR OBSCURED
                        </span>
                        <span className="text-sm font-bold tracking-widest text-gray-400 line-through">
                          UP32-??-????
                        </span>
                        <span className="text-xs text-purple-300 font-semibold">
                          ➔ Resolved: <strong className="text-white">{selectedInspectionEvent.plateText}</strong>
                        </span>
                      </div>
                      <div className="text-xs text-purple-400 font-bold">
                        AI Re-ID Confidence: <strong>{selectedInspectionEvent.reIdAnalysis.confidence}%</strong>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center space-x-2">
                        <span className="bg-yellow-400 text-black text-xs font-bold px-1.5 py-0.5 rounded-xs">IND</span>
                        <span className="text-sm font-bold tracking-widest text-white">{selectedInspectionEvent.plateText}</span>
                      </div>
                      <div className="text-xs text-emerald-400">
                        Confidence: <strong>{selectedInspectionEvent.confidence}%</strong> · Speed: <strong>{selectedInspectionEvent.speed} km/h</strong>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Re-ID Detailed Breakdown if active */}
              {selectedInspectionEvent.reIdAnalysis?.isReIdMatch ? (
                <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-3.5 space-y-2.5">
                  <div className="flex items-center justify-between border-b border-purple-200 pb-2">
                    <div className="flex items-center space-x-1.5 text-purple-950 font-bold text-xs">
                      <Bot className="w-4 h-4 text-purple-700" />
                      <span>AI Vehicle Re-ID Verification Report</span>
                    </div>
                    <span className="bg-purple-700 text-white font-mono text-[11px] font-bold px-2 py-0.5 rounded">
                      {selectedInspectionEvent.reIdAnalysis.confidence}% Similarity Match
                    </span>
                  </div>

                  <div>
                    <strong className="text-purple-950 text-[11px] block mb-0.5">Why Re-ID was used:</strong>
                    <p className="text-purple-900 leading-relaxed bg-white p-2 rounded border border-purple-200 font-sans text-xs">
                      {selectedInspectionEvent.reIdAnalysis.triggerReason}
                    </p>
                  </div>

                  <div>
                    <strong className="text-purple-950 text-[11px] block mb-1">Extracted Feature Embeddings:</strong>
                    <div className="space-y-1.5">
                      {selectedInspectionEvent.reIdAnalysis.matchedFeatures.map((feat, idx) => (
                        <div key={idx} className="bg-white p-2 rounded border border-purple-200 space-y-1">
                          <div className="flex items-center justify-between text-xs font-semibold text-gray-900">
                            <span>{feat.feature}</span>
                            <span className="font-mono text-purple-700 font-bold">{feat.similarityPct}%</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-purple-600 h-1.5 rounded-full"
                              style={{ width: `${feat.similarityPct}%` }}
                            />
                          </div>
                          <div className="text-[10px] text-gray-500">
                            {feat.description}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-purple-100/80 p-2.5 rounded border border-purple-300 text-[11px] text-purple-950 font-sans leading-relaxed">
                    <strong>AI Verdict:</strong> {selectedInspectionEvent.reIdAnalysis.aiExplanation}
                  </div>
                </div>
              ) : (
                <div className="bg-emerald-50 border border-emerald-200 rounded p-3 text-emerald-900 flex items-start space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-xs">Standard Optical License Plate Recognition</strong>
                    <p className="text-[11px] text-emerald-800 mt-0.5">
                      Plate characters were clearly resolved by optical OCR sensor ({selectedInspectionEvent.confidence}% confidence). Fallback AI Visual Re-ID was not required at this camera node.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-2.5 bg-gray-50 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setSelectedInspectionEvent(null)}
                className="px-3.5 py-1 bg-gray-900 hover:bg-gray-800 text-white rounded text-xs font-semibold transition-colors"
              >
                Close audit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
