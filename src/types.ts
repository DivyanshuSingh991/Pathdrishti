export type VehicleType = 'car' | 'truck' | 'bike' | 'auto';

export type AlertType = 'blacklist_match' | 'cloned_plate' | 'route_anomaly' | 'loitering';

export type ViolationType = 'overspeeding' | 'red_light_jump' | 'wrong_way' | 'no_entry_zone';

export interface Camera {
  id: string;
  name: string;
  locationName: string;
  zone: string;
  lat: number;
  lng: number;
  status: 'active' | 'inactive';
  speedLimit: number;
  directionLabel: string;
}

export interface Vehicle {
  plate: string;
  vehicleType: VehicleType;
  color: string;
  model?: string;
  isBlacklisted?: boolean;
  blacklistReason?: string;
  isClonedSuspect?: boolean;
  clonedNote?: string;
  nearMissMatch?: {
    targetPlate: string;
    similarityPct: number;
    reason: string;
  };
}

export interface ReIdFeature {
  feature: string;
  similarityPct: number;
  description: string;
}

export interface ReIdAnalysis {
  isReIdMatch: boolean;
  confidence: number;
  triggerReason: string;
  matchedFeatures: ReIdFeature[];
  anchorCameraId?: string;
  visualFingerprint: string;
  aiExplanation: string;
}

export interface CaptureFrameDetails {
  laneNumber: number;
  ambientLighting: 'Daylight' | 'Overcast' | 'Dusk' | 'Night IR';
  cameraAngle: string;
  vehicleCropUrl?: string;
  plateCropUrl?: string;
}

export interface DetectionEvent {
  id: string;
  plateText: string;
  cameraId: string;
  timestamp: string; // e.g. "14:22:15"
  dateTime: string;
  confidence: number; // 85 - 99
  speed: number; // km/h
  direction: 'Northbound' | 'Southbound' | 'Eastbound' | 'Westbound';
  vehicleType: VehicleType;
  vehicleColor: string;
  status: 'Normal' | 'Blacklist match' | 'Cloned plate suspect' | 'Route anomaly';
  violationFlag?: string;
  reIdAnalysis?: ReIdAnalysis;
  captureDetails?: CaptureFrameDetails;
}

export interface Alert {
  id: string;
  plate: string;
  alertType: AlertType;
  cameraId: string;
  timestamp: string;
  confidence: number;
  reviewed: boolean;
  details: string;
  severity: 'critical' | 'high' | 'medium';
}

export interface Violation {
  id: string;
  plate: string;
  cameraId: string;
  violationType: ViolationType;
  measuredValue: string;
  thresholdValue: string;
  timestamp: string;
  reviewed: boolean;
  fineAmount?: number;
}

export interface CityZone {
  id: string;
  name: string;
  lat: number;
  lng: number;
  radiusMeters: number;
  congestionLevel: 'low' | 'medium' | 'high';
  vehicleCount: number;
  avgSpeed: number;
}

export interface ODMatrixData {
  zones: string[];
  matrix: {
    [origin: string]: {
      [destination: string]: number | null;
    };
  };
}
