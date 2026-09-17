import React, { useState } from 'react';
import { DetectionEvent, Camera } from '../../types';
import { getCameraCaptureForDetection } from '../../utils/cameraImages';
import {
  Camera as CameraIcon,
  Maximize2,
  Minimize2,
  Eye,
  EyeOff,
  Sparkles,
  Download,
  ShieldAlert,
  AlertTriangle,
  Radio,
  CheckCircle2,
  Layers,
  ZoomIn
} from 'lucide-react';

interface CameraCaptureViewProps {
  detection: DetectionEvent;
  camera?: Camera;
  showControls?: boolean;
  className?: string;
}

export const CameraCaptureView: React.FC<CameraCaptureViewProps> = ({
  detection,
  camera,
  showControls = true,
  className = ''
}) => {
  const [showAiBoxes, setShowAiBoxes] = useState<boolean>(true);
  const [isHighContrast, setIsHighContrast] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showPlateCrop, setShowPlateCrop] = useState<boolean>(true);

  const captureInfo = getCameraCaptureForDetection(detection);
  const isAlert = detection.status !== 'Normal' || Boolean(detection.violationFlag);
  const isSpeeding = camera && detection.speed > camera.speedLimit;

  // Render the HSRP license plate optical crop
  const renderPlateCrop = () => {
    return (
      <div className="bg-slate-900 border border-slate-700/80 rounded p-2 text-white shadow-md">
        <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1 font-mono">
          <span className="flex items-center gap-1 font-semibold text-cyan-400">
            <ZoomIn className="w-3 h-3" />
            OPTICAL OCR CROP (ANPR)
          </span>
          <span>Conf: {(detection.confidence ?? 98.4).toFixed(1)}%</span>
        </div>

        {/* Realistic Indian High Security Registration Plate (HSRP) Graphic */}
        <div className="relative inline-flex items-center bg-white border-2 border-slate-900 rounded px-2.5 py-1 text-black font-mono font-black tracking-widest text-sm shadow-inner select-none">
          {/* IND Blue Strip with Ashoka Chakra emblem */}
          <div className="flex flex-col items-center justify-center mr-2 pr-1.5 border-r border-slate-300">
            <span className="text-[7px] font-bold text-blue-900 tracking-tighter leading-none">IND</span>
            <div className="w-2.5 h-2.5 rounded-full border border-blue-900 flex items-center justify-center my-0.5">
              <div className="w-1 h-1 bg-blue-900 rounded-full" />
            </div>
          </div>

          {/* Registration Number Text */}
          <span className="text-base text-black font-extrabold tracking-wider font-mono">
            {detection.plateText}
          </span>
        </div>

        {/* Optical Telemetry Breakdown */}
        <div className="grid grid-cols-2 gap-1.5 mt-1.5 text-[9px] font-mono text-slate-300 border-t border-slate-800 pt-1.5">
          <div>
            <span className="text-slate-500">Plate Standard:</span> HSRP IND
          </div>
          <div>
            <span className="text-slate-500">OCR Engine:</span> BEL-ANPR v4.2
          </div>
          <div>
            <span className="text-slate-500">Contrast Ratio:</span> 94.8 dB
          </div>
          <div>
            <span className="text-slate-500">Tilt Correction:</span> -1.4° Adj.
          </div>
        </div>
      </div>
    );
  };

  const mainCaptureFrame = (
    <div className={`relative overflow-hidden rounded-lg bg-black group select-none ${className}`}>
      {/* CCTV Camera Snapshot Image */}
      <img
        src={captureInfo.imageUrl}
        alt={`CCTV Snapshot of ${detection.plateText}`}
        className={`w-full h-auto object-cover aspect-video transition-all duration-300 ${
          isHighContrast ? 'contrast-200 grayscale brightness-90' : ''
        }`}
      />

      {/* Surveillance Scanlines / Vignette Effect */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/60 via-transparent to-black/40" />

      {/* Top HUD Overlay: Live Camera Node Info & REC status */}
      <div className="absolute top-2 left-2 right-2 flex items-center justify-between text-white text-[11px] font-mono font-medium drop-shadow-md pointer-events-none">
        <div className="flex items-center space-x-2 bg-black/65 px-2 py-0.5 rounded backdrop-blur-xs border border-white/10">
          <div className="flex items-center space-x-1.5 text-red-500 font-bold">
            <Radio className="w-3 h-3 animate-pulse text-red-500" />
            <span className="text-[10px] tracking-wider">CCTV CAPTURE</span>
          </div>
          <span className="text-white/40">|</span>
          <span className="text-cyan-300 font-bold">{detection.cameraId}</span>
          <span className="text-white/70 hidden sm:inline">
            ({camera?.name.split(',')[1]?.trim() || camera?.zone || 'Junction Sensor'})
          </span>
        </div>

        <div className="flex items-center space-x-1.5 bg-black/65 px-2 py-0.5 rounded backdrop-blur-xs border border-white/10 text-[10px]">
          <span className="text-emerald-400">4K UHD</span>
          <span className="text-white/40">•</span>
          <span className="text-slate-300">60 FPS</span>
        </div>
      </div>

      {/* Bottom HUD Overlay: Telemetry & Timestamp */}
      <div className="absolute bottom-2 left-2 right-2 flex flex-col sm:flex-row sm:items-end justify-between text-white text-[10px] font-mono drop-shadow-md pointer-events-none gap-1">
        <div className="bg-black/75 px-2 py-1 rounded backdrop-blur-xs border border-white/10 space-y-0.5 max-w-fit">
          <div className="flex items-center space-x-2">
            <span className="text-amber-300 font-bold">
              {detection.dateTime || `2026-08-30 ${detection.timestamp}`} IST
            </span>
            <span className="text-white/40">•</span>
            <span className="text-slate-300">{captureInfo.lane}</span>
          </div>
          <div className="text-[9px] text-slate-300 flex items-center space-x-2">
            <span>
              GPS: {camera ? `${camera.lat.toFixed(4)}°N, ${camera.lng.toFixed(4)}°E` : '26.8500°N, 80.9430°E'}
            </span>
            <span className="text-white/40">•</span>
            <span>SHUTTER: {captureInfo.shutterSpeed}</span>
          </div>
        </div>

        {/* Speed & Direction pill */}
        <div
          className={`px-2 py-1 rounded backdrop-blur-xs border flex items-center space-x-1.5 text-[11px] font-bold ${
            isSpeeding
              ? 'bg-red-950/85 border-red-500 text-red-200'
              : 'bg-black/75 border-white/10 text-emerald-300'
          }`}
        >
          <span>{detection.speed} km/h</span>
          <span className="text-[9px] font-normal text-white/70">({detection.direction})</span>
          {isSpeeding && (
            <span className="bg-red-600 text-white text-[9px] px-1 rounded uppercase tracking-wider font-extrabold animate-pulse">
              Speed Violation
            </span>
          )}
        </div>
      </div>

      {/* AI Computer Vision Bounding Boxes */}
      {showAiBoxes && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Vehicle Detection Bounding Box */}
          <div
            className={`absolute border-2 transition-all ${
              isAlert ? 'border-red-500 bg-red-500/10' : 'border-emerald-400 bg-emerald-400/10'
            }`}
            style={{
              left: `${captureInfo.vehicleBox.x}%`,
              top: `${captureInfo.vehicleBox.y}%`,
              width: `${captureInfo.vehicleBox.width}%`,
              height: `${captureInfo.vehicleBox.height}%`
            }}
          >
            {/* Corner Bracket Accents */}
            <div className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-white" />
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-white" />
            <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-white" />
            <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-white" />

            {/* Label */}
            <div
              className={`absolute -top-5 left-0 px-1.5 py-0.5 text-[9px] font-mono font-bold text-white whitespace-nowrap rounded-t ${
                isAlert ? 'bg-red-600' : 'bg-emerald-600'
              }`}
            >
              {captureInfo.vehicleBox.label} ({captureInfo.vehicleBox.confidence}%)
            </div>
          </div>

          {/* License Plate Bounding Box */}
          <div
            className={`absolute border-2 ${
              detection.reIdAnalysis?.isReIdMatch
                ? 'border-amber-400 bg-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.8)]'
                : 'border-cyan-400 bg-cyan-400/25 shadow-[0_0_8px_rgba(6,182,212,0.8)]'
            }`}
            style={{
              left: `${captureInfo.plateBox.x}%`,
              top: `${captureInfo.plateBox.y}%`,
              width: `${captureInfo.plateBox.width}%`,
              height: `${captureInfo.plateBox.height}%`
            }}
          >
            <div
              className={`absolute -bottom-4.5 left-0 px-1 py-0.5 text-[8px] font-mono font-extrabold rounded-b whitespace-nowrap shadow ${
                detection.reIdAnalysis?.isReIdMatch
                  ? 'bg-amber-400 text-black'
                  : 'bg-cyan-400 text-black'
              }`}
            >
              {detection.reIdAnalysis?.isReIdMatch
                ? `OCR [OBSCURED]: ${detection.plateText.slice(0, 4)}-??-???? (${detection.confidence.toFixed(1)}%)`
                : captureInfo.plateBox.label}
            </div>
          </div>

          {/* If AI Re-ID: Realistic Mud & Glare Occlusion over Plate */}
          {detection.reIdAnalysis?.isReIdMatch && (
            <div
              className="absolute z-20 backdrop-blur-[5px] bg-amber-950/70 border border-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.8)] flex flex-col items-center justify-center p-0.5 rounded overflow-hidden pointer-events-none"
              style={{
                left: `${captureInfo.plateBox.x}%`,
                top: `${captureInfo.plateBox.y}%`,
                width: `${Math.max(captureInfo.plateBox.width, 8)}%`,
                height: `${Math.max(captureInfo.plateBox.height, 4.5)}%`
              }}
            >
              <div className="text-[7px] font-mono text-amber-200 font-black tracking-wider filter blur-[0.6px] line-through select-none">
                UP32·??·????
              </div>
              <div className="text-[6px] font-mono text-white bg-red-600 px-0.5 rounded font-black uppercase tracking-tighter">
                MUD/GLARE
              </div>
            </div>
          )}
        </div>
      )}

      {/* Floating Status Watermark */}
      {isAlert && (
        <div className="absolute top-10 right-2 px-2 py-0.5 rounded bg-red-600/90 text-white font-mono font-black text-[10px] tracking-wider uppercase border border-red-400 shadow-lg flex items-center space-x-1 animate-pulse">
          <ShieldAlert className="w-3 h-3" />
          <span>{detection.violationFlag || detection.status}</span>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-2">
      {/* CCTV Frame */}
      {mainCaptureFrame}

      {/* Optical Toolbar Controls */}
      {showControls && (
        <div className="flex flex-wrap items-center justify-between gap-1.5 text-xs pt-1">
          <div className="flex items-center space-x-1">
            <button
              type="button"
              onClick={() => setShowAiBoxes(!showAiBoxes)}
              className={`px-2 py-1 rounded text-[11px] font-medium border flex items-center space-x-1 transition-colors ${
                showAiBoxes
                  ? 'bg-blue-50 text-[#378ADD] border-blue-200'
                  : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
              }`}
              title="Toggle computer vision classification and OCR bounding boxes"
            >
              <Sparkles className="w-3 h-3" />
              <span>{showAiBoxes ? 'Hide AI Boxes' : 'Show AI Boxes'}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsHighContrast(!isHighContrast)}
              className={`px-2 py-1 rounded text-[11px] font-medium border flex items-center space-x-1 transition-colors ${
                isHighContrast
                  ? 'bg-purple-50 text-purple-700 border-purple-200'
                  : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
              }`}
              title="Enhance image contrast for optical OCR plate verification"
            >
              <Layers className="w-3 h-3" />
              <span>{isHighContrast ? 'Standard Color' : 'IR / Contrast Filter'}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowPlateCrop(!showPlateCrop)}
              className={`px-2 py-1 rounded text-[11px] font-medium border flex items-center space-x-1 transition-colors ${
                showPlateCrop
                  ? 'bg-cyan-50 text-cyan-800 border-cyan-200'
                  : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
              }`}
              title="Toggle license plate optical crop card"
            >
              <ZoomIn className="w-3 h-3" />
              <span>Plate Crop</span>
            </button>
          </div>

          <div className="flex items-center space-x-1">
            <button
              type="button"
              onClick={() => setIsFullscreen(true)}
              className="p-1 text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded transition-colors"
              title="View camera snapshot in full screen"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Optical License Plate Crop */}
      {showPlateCrop && renderPlateCrop()}

      {/* Fullscreen Surveillance Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex flex-col justify-center items-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="w-full max-w-5xl bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-800 bg-slate-900/80">
              <div className="flex items-center space-x-2">
                <CameraIcon className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  ANPR Evidence Capture — {detection.cameraId} ({detection.plateText})
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsFullscreen(false)}
                className="p-1 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Image Body */}
            <div className="p-4 flex flex-col md:flex-row gap-4 items-center">
              <div className="flex-1 w-full">{mainCaptureFrame}</div>
              <div className="w-full md:w-80 space-y-3">
                {renderPlateCrop()}

                <div className="bg-slate-900 border border-slate-800 rounded p-3 text-white text-xs space-y-2 font-mono">
                  <div className="text-[10px] text-slate-400 uppercase font-bold border-b border-slate-800 pb-1">
                    SURVEILLANCE EVIDENCE METRICS
                  </div>
                  <div className="space-y-1 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Target Plate:</span>
                      <span className="font-bold text-white">{detection.plateText}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Camera Node:</span>
                      <span className="text-cyan-400">{detection.cameraId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Timestamp:</span>
                      <span className="text-amber-300">{detection.timestamp} IST</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Vehicle Type:</span>
                      <span className="capitalize">{detection.vehicleColor} {detection.vehicleType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Speed:</span>
                      <span className={isSpeeding ? 'text-red-400 font-bold' : 'text-emerald-400'}>
                        {detection.speed} km/h
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">ANPR Confidence:</span>
                      <span className="text-white font-bold">{detection.confidence.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>

                <a
                  href={captureInfo.imageUrl}
                  download={`ANPR_Evidence_${detection.cameraId}_${detection.plateText}.jpg`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2 px-3 bg-[#378ADD] hover:bg-blue-600 text-white rounded text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors font-sans shadow-md"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download High-Res Snapshot</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
