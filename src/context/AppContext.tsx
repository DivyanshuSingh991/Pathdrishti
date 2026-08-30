import React, { createContext, useContext, useState, useMemo } from 'react';
import {
  Camera,
  Vehicle,
  DetectionEvent,
  Alert,
  Violation,
  CityZone,
  ODMatrixData
} from '../types';
import {
  MOCK_CAMERAS,
  MOCK_VEHICLES,
  MOCK_DETECTION_EVENTS,
  INITIAL_MOCK_ALERTS,
  INITIAL_MOCK_VIOLATIONS,
  MOCK_CITY_ZONES,
  MOCK_OD_MATRIX,
  getVehicleByPlate
} from '../data/mock-data';

interface AppContextType {
  cameras: Camera[];
  vehicles: Vehicle[];
  detections: DetectionEvent[];
  alerts: Alert[];
  violations: Violation[];
  cityZones: CityZone[];
  odMatrix: ODMatrixData;
  selectedPlate: string | null;
  setSelectedPlate: (plate: string | null) => void;
  selectedDetection: DetectionEvent | null;
  setSelectedDetection: (detection: DetectionEvent | null) => void;
  markAlertReviewed: (alertId: string) => void;
  markViolationReviewed: (violationId: string) => void;
  markAllAlertsReviewed: () => void;
  markAllViolationsReviewed: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  stats: {
    totalVehiclesTracked: number;
    activeCamerasCount: number;
    totalCamerasCount: number;
    avgCitySpeed: number;
    activeAlertsCount: number;
    activeViolationsCount: number;
    totalDetectionsToday: number;
    blacklistMatchesCount: number;
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alerts, setAlerts] = useState<Alert[]>(INITIAL_MOCK_ALERTS);
  const [violations, setViolations] = useState<Violation[]>(INITIAL_MOCK_VIOLATIONS);
  
  // Default selected vehicle is the blacklisted stolen car with multi-camera trajectory
  const [selectedPlate, setSelectedPlate] = useState<string | null>('UP32-KL-5544');
  
  // Default selected detection is the recent alert detection
  const initialDetection = MOCK_DETECTION_EVENTS.find(e => e.plateText === 'UP32-KL-5544' && e.cameraId === 'CAM-01') 
    || MOCK_DETECTION_EVENTS[MOCK_DETECTION_EVENTS.length - 1];
  const [selectedDetection, setSelectedDetection] = useState<DetectionEvent | null>(initialDetection);

  const [searchQuery, setSearchQuery] = useState<string>('');

  const markAlertReviewed = (alertId: string) => {
    setAlerts(prev =>
      prev.map(a => (a.id === alertId ? { ...a, reviewed: !a.reviewed } : a))
    );
  };

  const markViolationReviewed = (violationId: string) => {
    setViolations(prev =>
      prev.map(v => (v.id === violationId ? { ...v, reviewed: !v.reviewed } : v))
    );
  };

  const markAllAlertsReviewed = () => {
    setAlerts(prev => prev.map(a => ({ ...a, reviewed: true })));
  };

  const markAllViolationsReviewed = () => {
    setViolations(prev => prev.map(v => ({ ...v, reviewed: true })));
  };

  const stats = useMemo(() => {
    const activeCameras = MOCK_CAMERAS.filter(c => c.status === 'active').length;
    const totalCams = MOCK_CAMERAS.length;
    
    // Distinct plates tracked today
    const distinctPlates = new Set(MOCK_DETECTION_EVENTS.map(d => d.plateText)).size;
    
    // Average speed
    const totalSpeed = MOCK_DETECTION_EVENTS.reduce((acc, curr) => acc + curr.speed, 0);
    const avgSpeed = parseFloat((totalSpeed / MOCK_DETECTION_EVENTS.length).toFixed(1));

    // Active (unreviewed) alerts and violations
    const activeAlerts = alerts.filter(a => !a.reviewed).length;
    const activeVio = violations.filter(v => !v.reviewed).length;
    
    // Blacklist detections count
    const blacklistDetections = MOCK_DETECTION_EVENTS.filter(d => d.status === 'Blacklist match').length;

    return {
      totalVehiclesTracked: distinctPlates,
      activeCamerasCount: activeCameras,
      totalCamerasCount: totalCams,
      avgCitySpeed: avgSpeed,
      activeAlertsCount: activeAlerts,
      activeViolationsCount: activeVio,
      totalDetectionsToday: MOCK_DETECTION_EVENTS.length,
      blacklistMatchesCount: blacklistDetections
    };
  }, [alerts, violations]);

  return (
    <AppContext.Provider
      value={{
        cameras: MOCK_CAMERAS,
        vehicles: MOCK_VEHICLES,
        detections: MOCK_DETECTION_EVENTS,
        alerts,
        violations,
        cityZones: MOCK_CITY_ZONES,
        odMatrix: MOCK_OD_MATRIX,
        selectedPlate,
        setSelectedPlate,
        selectedDetection,
        setSelectedDetection,
        markAlertReviewed,
        markViolationReviewed,
        markAllAlertsReviewed,
        markAllViolationsReviewed,
        searchQuery,
        setSearchQuery,
        stats
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
