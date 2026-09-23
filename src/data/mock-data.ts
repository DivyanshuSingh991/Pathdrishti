import { Camera, Vehicle, DetectionEvent, Alert, Violation, CityZone, ODMatrixData } from '../types';

export const LUCKNOW_CENTER = {
  lat: 26.8467,
  lng: 80.9462,
  zoom: 13,
};

export const MOCK_CAMERAS: Camera[] = [
  {
    id: 'CAM-01',
    name: 'CAM-01, Hazratganj Chowk',
    locationName: 'Hazratganj Chauraha, Central Lucknow',
    zone: 'Hazratganj',
    lat: 26.8500,
    lng: 80.9430,
    status: 'active',
    speedLimit: 40,
    directionLabel: 'North-South Arterial'
  },
  {
    id: 'CAM-02',
    name: 'CAM-02, Charbagh Junction',
    locationName: 'Charbagh Railway Station Gate 1',
    zone: 'Alambagh',
    lat: 26.8322,
    lng: 80.9190,
    status: 'active',
    speedLimit: 50,
    directionLabel: 'Southwest Hub'
  },
  {
    id: 'CAM-03',
    name: 'CAM-03, Gomti Nagar Polytech',
    locationName: 'Lohia Path / Polytechnic Connector',
    zone: 'Gomti Nagar',
    lat: 26.8520,
    lng: 80.9850,
    status: 'active',
    speedLimit: 60,
    directionLabel: 'East-West Expressway'
  },
  {
    id: 'CAM-04',
    name: 'CAM-04, Indira Nagar Gate',
    locationName: 'Faizabad Road Intersection',
    zone: 'Gomti Nagar',
    lat: 26.8790,
    lng: 80.9820,
    status: 'active',
    speedLimit: 50,
    directionLabel: 'Northeast Entry'
  },
  {
    id: 'CAM-05',
    name: 'CAM-05, Alambagh Bus Terminal',
    locationName: 'Kanpur Road Interchange',
    zone: 'Alambagh',
    lat: 26.8180,
    lng: 80.9020,
    status: 'active',
    speedLimit: 40,
    directionLabel: 'South Arterial'
  },
  {
    id: 'CAM-06',
    name: 'CAM-06, Shaheed Path Ring',
    locationName: 'Shaheed Path & Sultanpur Road Flyover',
    zone: 'Gomti Nagar',
    lat: 26.7980,
    lng: 80.9980,
    status: 'active',
    speedLimit: 80,
    directionLabel: 'Outer Ring Expressway'
  },
  {
    id: 'CAM-07',
    name: 'CAM-07, Chowk Heritage Gate',
    locationName: 'Bada Imambara Heritage Corridor',
    zone: 'Chowk',
    lat: 26.8680,
    lng: 80.9020,
    status: 'active',
    speedLimit: 30,
    directionLabel: 'Old City Corridor'
  },
  {
    id: 'CAM-08',
    name: 'CAM-08, Polytechnic Chauraha',
    locationName: 'Munshi Pulia / Ring Road Crossing',
    zone: 'Gomti Nagar',
    lat: 26.8650,
    lng: 80.9920,
    status: 'active',
    speedLimit: 50,
    directionLabel: 'North Eastern Ring'
  },
  {
    id: 'CAM-09',
    name: 'CAM-09, Aminabad Entry',
    locationName: 'Kaiserbagh - Aminabad Market Gate',
    zone: 'Hazratganj',
    lat: 26.8450,
    lng: 80.9250,
    status: 'active',
    speedLimit: 30,
    directionLabel: 'Commercial Zone West'
  },
  {
    id: 'CAM-10',
    name: 'CAM-10, Vidhan Sabha Marg',
    locationName: 'Burlington Crossing / Secretariat Corridor',
    zone: 'Hazratganj',
    lat: 26.8430,
    lng: 80.9340,
    status: 'inactive', // offline for optical sensor maintenance
    speedLimit: 40,
    directionLabel: 'Central Secretariat Arterial'
  },
  {
    id: 'CAM-11',
    name: 'CAM-11, Shaheed Path Medanta',
    locationName: 'Sector 8 Arjunganj / Medanta Intersection',
    zone: 'Gomti Nagar',
    lat: 26.8120,
    lng: 80.9760,
    status: 'active',
    speedLimit: 80,
    directionLabel: 'Outer Ring Eastbound'
  },
  {
    id: 'CAM-12',
    name: 'CAM-12, 1090 Riverfront Crossing',
    locationName: 'Women Power Line 1090 Chauraha',
    zone: 'Gomti Nagar',
    lat: 26.8550,
    lng: 80.9620,
    status: 'inactive', // offline under network maintenance
    speedLimit: 50,
    directionLabel: 'Riverfront - Lohia Path Connector'
  }
];

export const MOCK_VEHICLES: Vehicle[] = [
  // Blacklisted vehicles (4)
  {
    plate: 'UP32-KL-5544',
    vehicleType: 'car',
    color: 'Silver',
    model: 'Hyundai Creta',
    isBlacklisted: true,
    blacklistReason: 'Stolen vehicle database - FIR #2024/981 Hazratganj PS'
  },
  {
    plate: 'UP32-LK-9027',
    vehicleType: 'car',
    color: 'Dark Grey',
    model: 'Mahindra Scorpio',
    isBlacklisted: true,
    blacklistReason: 'Wanted in armed robbery case - Crime Branch Lookout Notice'
  },
  {
    plate: 'UP32-ZZ-0007',
    vehicleType: 'car',
    color: 'Black',
    model: 'Toyota Fortuner',
    isBlacklisted: true,
    blacklistReason: 'Illegal tinted glass & 18 pending unpaid e-challans (Impound Order)'
  },
  {
    plate: 'DL01-AB-9921',
    vehicleType: 'truck',
    color: 'Red & Yellow',
    model: 'Tata Heavy Carrier',
    isBlacklisted: true,
    blacklistReason: 'Interstate contraband suspect - Commercial Tax Evasion lookout'
  },

  // Cloned suspect vehicles (2)
  {
    plate: 'UP32-EX-4091',
    vehicleType: 'car',
    color: 'White',
    model: 'Honda City',
    isClonedSuspect: true,
    clonedNote: 'Simultaneous plate sightings on White Sedan (CAM-01) and Red Hatchback (CAM-06)'
  },
  {
    plate: 'UP32-BN-8822',
    vehicleType: 'auto',
    color: 'Green & Yellow',
    model: 'Bajaj RE Auto',
    isClonedSuspect: true,
    clonedNote: 'Plate registered to Black SUV but observed affixed to commercial auto-rickshaw'
  },

  // Near-miss similarity test plate (demonstrating USP OCR altered plate detection)
  {
    plate: 'UP32-LK-9021',
    vehicleType: 'car',
    color: 'Grey',
    model: 'Mahindra Scorpio',
    nearMissMatch: {
      targetPlate: 'UP32-LK-9027',
      similarityPct: 94.2,
      reason: 'Digit "1" modified with black tape to resemble "7" matching Wanted vehicle UP32-LK-9027'
    }
  },

  // Normal vehicles with multi-hop trajectories & violations
  { plate: 'UP32-AB-1234', vehicleType: 'car', color: 'White', model: 'Maruti Swift' },
  { plate: 'UP32-TR-9900', vehicleType: 'car', color: 'Blue', model: 'Kia Seltos' },
  { plate: 'UP32-CD-5678', vehicleType: 'bike', color: 'Black', model: 'Royal Enfield Classic 350' },
  { plate: 'UP32-EF-9012', vehicleType: 'auto', color: 'Green & Yellow', model: 'Tuk-Tuk 3W' },
  { plate: 'UP32-GH-3456', vehicleType: 'truck', color: 'Blue', model: 'Eicher Pro' },
  { plate: 'UP32-JK-7890', vehicleType: 'car', color: 'Silver', model: 'Tata Nexon' },
  { plate: 'UP32-MN-2345', vehicleType: 'car', color: 'Red', model: 'Volkswagen Virtus' },
  { plate: 'UP32-PQ-6789', vehicleType: 'bike', color: 'Red', model: 'Honda Activa 6G' },
  { plate: 'UP32-RS-0123', vehicleType: 'auto', color: 'Yellow', model: 'Piaggio Ape' },
  { plate: 'UP32-TU-4567', vehicleType: 'truck', color: 'White', model: 'Tata Ace' },
  { plate: 'UP32-VW-8901', vehicleType: 'car', color: 'Grey', model: 'Hyundai i20' },
  { plate: 'UP32-XY-2345', vehicleType: 'car', color: 'Black', model: 'Mahindra Thar' },
  { plate: 'UP32-ZA-6789', vehicleType: 'bike', color: 'Blue', model: 'Yamaha FZ' },
  { plate: 'UP32-BC-0123', vehicleType: 'car', color: 'White', model: 'Maruti Baleno' },
  { plate: 'UP32-DE-4567', vehicleType: 'truck', color: 'Brown', model: 'Ashok Leyland' },
  { plate: 'UP32-FG-8901', vehicleType: 'auto', color: 'Green & Yellow', model: 'Bajaj Compact' },
  { plate: 'UP32-HI-2345', vehicleType: 'bike', color: 'Black', model: 'TVS Apache' },
  { plate: 'UP32-JK-6789', vehicleType: 'car', color: 'Silver', model: 'Skoda Slavia' },
  { plate: 'UP32-LM-0123', vehicleType: 'car', color: 'Red', model: 'Honda Elevate' },
  { plate: 'UP32-NO-4567', vehicleType: 'bike', color: 'Grey', model: 'Hero Splendor Plus' },
  { plate: 'UP32-QR-8901', vehicleType: 'car', color: 'Blue', model: 'Tata Punch' },
  { plate: 'UP32-ST-2345', vehicleType: 'auto', color: 'Green & Yellow', model: 'Mahindra Alfa' },
  { plate: 'UP32-UV-6789', vehicleType: 'truck', color: 'Orange', model: 'BharatBenz 1617' },
  { plate: 'UP32-WX-0123', vehicleType: 'car', color: 'White', model: 'Toyota Innova Hycross' },
  { plate: 'UP32-YZ-4567', vehicleType: 'bike', color: 'White', model: 'KTM Duke 250' },
  { plate: 'UP32-AA-8901', vehicleType: 'car', color: 'Brown', model: 'Maruti Ertiga' },
  { plate: 'UP32-BB-2345', vehicleType: 'car', color: 'Silver', model: 'MG Hector' },
  { plate: 'UP32-CC-6789', vehicleType: 'auto', color: 'Yellow', model: 'Atul Gemini' }
];

// Helper to look up vehicle info
export const getVehicleByPlate = (plate: string): Vehicle | undefined => {
  return MOCK_VEHICLES.find(v => v.plate.toUpperCase() === plate.toUpperCase());
};

export const getCameraById = (id: string): Camera | undefined => {
  return MOCK_CAMERAS.find(c => c.id === id);
};

// 4 City Zones
export const MOCK_CITY_ZONES: CityZone[] = [
  {
    id: 'zone-1',
    name: 'Hazratganj Central',
    lat: 26.8480,
    lng: 80.9380,
    radiusMeters: 1600,
    congestionLevel: 'high',
    vehicleCount: 1420,
    avgSpeed: 24.8
  },
  {
    id: 'zone-2',
    name: 'Gomti Nagar Sector',
    lat: 26.8580,
    lng: 80.9880,
    radiusMeters: 2200,
    congestionLevel: 'medium',
    vehicleCount: 2180,
    avgSpeed: 46.2
  },
  {
    id: 'zone-3',
    name: 'Alambagh & Station Hub',
    lat: 26.8250,
    lng: 80.9120,
    radiusMeters: 1800,
    congestionLevel: 'high',
    vehicleCount: 1890,
    avgSpeed: 28.5
  },
  {
    id: 'zone-4',
    name: 'Chowk Old Heritage',
    lat: 26.8650,
    lng: 80.9080,
    radiusMeters: 1500,
    congestionLevel: 'low',
    vehicleCount: 890,
    avgSpeed: 31.0
  }
];

// Origin-Destination trip matrix between 4 zones
export const MOCK_OD_MATRIX: ODMatrixData = {
  zones: ['Hazratganj', 'Gomti Nagar', 'Alambagh', 'Chowk'],
  matrix: {
    'Hazratganj': {
      'Hazratganj': null,
      'Gomti Nagar': 1420,
      'Alambagh': 980,
      'Chowk': 640
    },
    'Gomti Nagar': {
      'Hazratganj': 1380,
      'Gomti Nagar': null,
      'Alambagh': 820,
      'Chowk': 410
    },
    'Alambagh': {
      'Hazratganj': 1050,
      'Gomti Nagar': 760,
      'Alambagh': null,
      'Chowk': 530
    },
    'Chowk': {
      'Hazratganj': 710,
      'Gomti Nagar': 390,
      'Alambagh': 480,
      'Chowk': null
    }
  }
};

// Initial alerts (11 alerts covering all 4 alert types)
export const INITIAL_MOCK_ALERTS: Alert[] = [
  {
    id: 'ALT-101',
    plate: 'UP32-KL-5544',
    alertType: 'blacklist_match',
    cameraId: 'CAM-01',
    timestamp: '14:28:15',
    confidence: 97.8,
    reviewed: false,
    details: 'Flagged on Stolen Vehicle DB (FIR #2024/981). Detected heading North towards Hazratganj.',
    severity: 'critical'
  },
  {
    id: 'ALT-102',
    plate: 'UP32-LK-9027',
    alertType: 'blacklist_match',
    cameraId: 'CAM-07',
    timestamp: '13:52:04',
    confidence: 96.4,
    reviewed: false,
    details: 'Wanted in armed robbery. Sighted at Chowk Heritage Gate.',
    severity: 'critical'
  },
  {
    id: 'ALT-103',
    plate: 'UP32-EX-4091',
    alertType: 'cloned_plate',
    cameraId: 'CAM-06',
    timestamp: '14:15:30',
    confidence: 98.2,
    reviewed: false,
    details: 'Cloned plate: Same plate logged on White Sedan at CAM-01 and Red Hatchback at CAM-06 within 4 minutes.',
    severity: 'critical'
  },
  {
    id: 'ALT-104',
    plate: 'UP32-BN-8822',
    alertType: 'cloned_plate',
    cameraId: 'CAM-05',
    timestamp: '12:40:19',
    confidence: 95.1,
    reviewed: false,
    details: 'Mismatched vehicle class: Plate registered to Private SUV observed on commercial Auto-rickshaw.',
    severity: 'high'
  },
  {
    id: 'ALT-105',
    plate: 'UP32-ZZ-0007',
    alertType: 'route_anomaly',
    cameraId: 'CAM-09',
    timestamp: '11:18:42',
    confidence: 94.0,
    reviewed: false,
    details: 'Erratic zigzag pattern across 3 adjacent restricted alleys within 8 minutes.',
    severity: 'medium'
  },
  {
    id: 'ALT-106',
    plate: 'DL01-AB-9921',
    alertType: 'route_anomaly',
    cameraId: 'CAM-02',
    timestamp: '10:05:11',
    confidence: 98.6,
    reviewed: false,
    details: 'Heavy commercial carrier entering pedestrian-only zone during peak hours.',
    severity: 'high'
  },
  {
    id: 'ALT-107',
    plate: 'UP32-XY-2345',
    alertType: 'loitering',
    cameraId: 'CAM-07',
    timestamp: '09:44:55',
    confidence: 92.5,
    reviewed: false,
    details: 'Vehicle circled heritage monument 4 times in 25 minutes without parking.',
    severity: 'medium'
  },
  {
    id: 'ALT-108',
    plate: 'UP32-CD-5678',
    alertType: 'loitering',
    cameraId: 'CAM-01',
    timestamp: '08:30:12',
    confidence: 93.8,
    reviewed: false,
    details: 'Stationary in active VIP transit corridor for > 35 minutes.',
    severity: 'medium'
  },
  {
    id: 'ALT-109',
    plate: 'UP32-ZZ-0007',
    alertType: 'blacklist_match',
    cameraId: 'CAM-03',
    timestamp: '07:15:00',
    confidence: 98.9,
    reviewed: false,
    details: 'Impound warrant active: 18 unpaid challans. Sighted at Gomti Nagar expressway ramp.',
    severity: 'high'
  },
  {
    id: 'ALT-110',
    plate: 'UP32-LK-9021',
    alertType: 'cloned_plate',
    cameraId: 'CAM-04',
    timestamp: '15:10:20',
    confidence: 94.2,
    reviewed: false,
    details: 'Near-miss OCR anomaly: Plate UP32-LK-9021 shows 94% visual similarity to wanted plate UP32-LK-9027.',
    severity: 'high'
  },
  {
    id: 'ALT-111',
    plate: 'UP32-TR-9900',
    alertType: 'route_anomaly',
    cameraId: 'CAM-08',
    timestamp: '15:45:10',
    confidence: 96.1,
    reviewed: false,
    details: 'High-speed lane jumping across 3 toll lanes on Ring Road.',
    severity: 'medium'
  }
];

// Initial traffic rule violations (9 violations covering major infractions: Red light, Wrong way, No-entry zone)
export const INITIAL_MOCK_VIOLATIONS: Violation[] = [
  {
    id: 'VIO-201',
    plate: 'UP32-TR-9900',
    cameraId: 'CAM-06',
    violationType: 'wrong_way',
    measuredValue: 'Reverse vector 180° on entry ramp',
    thresholdValue: 'One-Way Ramp Northbound',
    timestamp: '14:32:00',
    reviewed: false,
    fineAmount: 5000
  },
  {
    id: 'VIO-202',
    plate: 'UP32-KL-5544', // Blacklisted vehicle also has violation
    cameraId: 'CAM-01',
    violationType: 'red_light_jump',
    measuredValue: 'Signal Phase 0 (Red + 3.4s)',
    thresholdValue: 'Stop Line Stop',
    timestamp: '14:28:15',
    reviewed: false,
    fineAmount: 1000
  },
  {
    id: 'VIO-203',
    plate: 'UP32-LK-9027', // Blacklisted vehicle also has violation
    cameraId: 'CAM-07',
    violationType: 'red_light_jump',
    measuredValue: 'Signal Phase 0 (Red + 4.2s)',
    thresholdValue: 'Stop Line Stop',
    timestamp: '13:52:04',
    reviewed: false,
    fineAmount: 1000
  },
  {
    id: 'VIO-204',
    plate: 'UP32-CD-5678',
    cameraId: 'CAM-09',
    violationType: 'wrong_way',
    measuredValue: 'Reverse vector 180°',
    thresholdValue: 'One-Way Westbound',
    timestamp: '12:10:45',
    reviewed: false,
    fineAmount: 5000
  },
  {
    id: 'VIO-205',
    plate: 'DL01-AB-9921',
    cameraId: 'CAM-01',
    violationType: 'no_entry_zone',
    measuredValue: 'Heavy Commercial HGV (Class 4)',
    thresholdValue: 'No Heavy Vehicles 08:00-20:00',
    timestamp: '10:05:11',
    reviewed: false,
    fineAmount: 2000
  },
  {
    id: 'VIO-206',
    plate: 'UP32-MN-2345',
    cameraId: 'CAM-03',
    violationType: 'red_light_jump',
    measuredValue: 'Signal Phase 0 (Red + 1.9s)',
    thresholdValue: 'Stop Line Stop',
    timestamp: '11:42:19',
    reviewed: false,
    fineAmount: 1000
  },
  {
    id: 'VIO-207',
    plate: 'UP32-PQ-6789',
    cameraId: 'CAM-02',
    violationType: 'red_light_jump',
    measuredValue: 'Signal Phase 0 (Red + 2.8s)',
    thresholdValue: 'Stop Line Stop',
    timestamp: '09:14:33',
    reviewed: false,
    fineAmount: 1000
  },
  {
    id: 'VIO-208',
    plate: 'UP32-GH-3456',
    cameraId: 'CAM-07',
    violationType: 'no_entry_zone',
    measuredValue: 'Medium Goods Truck',
    thresholdValue: 'Heritage Zone Light Only',
    timestamp: '08:50:22',
    reviewed: false,
    fineAmount: 2000
  },
  {
    id: 'VIO-209',
    plate: 'UP32-ZZ-0007',
    cameraId: 'CAM-04',
    violationType: 'wrong_way',
    measuredValue: 'Wrong Carriageway Heading East',
    thresholdValue: 'Divided Highway Westbound',
    timestamp: '07:22:15',
    reviewed: false,
    fineAmount: 5000
  }
];

// Generate 250 realistic plate-read events
export const generate250DetectionEvents = (): DetectionEvent[] => {
  const events: DetectionEvent[] = [];

  // 1. Structured sequential trail for UP32-AB-1234 (Normal car, multi-stop trail)
  const trailNormal = [
    { camId: 'CAM-02', time: '08:12:30', speed: 42, dir: 'Northbound' as const, conf: 98.4 },
    { camId: 'CAM-05', time: '08:45:10', speed: 38, dir: 'Northbound' as const, conf: 99.1 },
    { camId: 'CAM-01', time: '09:20:44', speed: 36, dir: 'Eastbound' as const, conf: 97.9 },
    { camId: 'CAM-03', time: '09:55:12', speed: 58, dir: 'Eastbound' as const, conf: 98.7 },
    { camId: 'CAM-08', time: '10:30:00', speed: 48, dir: 'Northbound' as const, conf: 99.0 }
  ];
  trailNormal.forEach((step, idx) => {
    events.push({
      id: `EVT-SEQ1-0${idx + 1}`,
      plateText: 'UP32-AB-1234',
      cameraId: step.camId,
      timestamp: step.time,
      dateTime: `2026-08-30 ${step.time}`,
      confidence: step.conf,
      speed: step.speed,
      direction: step.dir,
      vehicleType: 'car',
      vehicleColor: 'White',
      status: 'Normal'
    });
  });

  // 2. Structured sequential trail for UP32-KL-5544 (Blacklisted Stolen Vehicle)
  const trailBlacklist = [
    {
      camId: 'CAM-07',
      time: '13:10:00',
      speed: 32,
      dir: 'Eastbound' as const,
      conf: 96.8,
      vio: undefined,
      lane: 1,
      light: 'Daylight' as const,
      angle: 'Frontal 15° Angle'
    },
    {
      camId: 'CAM-09',
      time: '13:40:22',
      speed: 28,
      dir: 'Eastbound' as const,
      conf: 97.4,
      vio: undefined,
      lane: 2,
      light: 'Daylight' as const,
      angle: 'Rear High-Mount 25°'
    },
    {
      camId: 'CAM-01',
      time: '14:28:15',
      speed: 42,
      dir: 'Northbound' as const,
      conf: 97.8,
      vio: 'Red-light jump — Stop line breach (Phase 0)',
      lane: 1,
      light: 'Daylight' as const,
      angle: 'Overhead Gantry 30°'
    },
    {
      camId: 'CAM-04',
      time: '15:02:40',
      speed: 54,
      dir: 'Northeast' as const,
      conf: 52.4, // Low optical OCR due to obscured plate
      vio: undefined,
      lane: 3,
      light: 'Dusk' as const,
      angle: 'Side-Angle 40°',
      reId: {
        isReIdMatch: true,
        confidence: 97.6,
        triggerReason: 'License plate partially obscured by dried road mud & severe optical glare (Optical OCR dropped to 52.4%). Visual Re-ID triggered automatically.',
        anchorCameraId: 'CAM-01',
        visualFingerprint: 'EMB-512D-VEC#9942A',
        aiExplanation: 'Vehicle Re-ID model matched 512-dimensional visual embedding vector against anchor capture at CAM-01. Confirmed same physical stolen Hyundai Creta with 97.6% feature similarity despite unreadable plate.',
        matchedFeatures: [
          { feature: 'Body Silhouette & Geometry', similarityPct: 98.9, description: '2023 Hyundai Creta roofline curvature, shark-fin antenna & silver roof rails' },
          { feature: 'Chroma & Paint Signature', similarityPct: 97.4, description: 'Typhoon Silver metallic reflectance spectrum calibrated for dusk lighting' },
          { feature: 'Distinctive Visual Markers', similarityPct: 96.1, description: 'Scuff mark on lower rear bumper & dual-tone alloy rim spoke profile' },
          { feature: 'Spatial-Temporal Motion Feasibility', similarityPct: 99.4, description: '34 min transit elapsed from CAM-01 (7.8 km corridor @ 54 km/h avg speed)' }
        ]
      }
    }
  ];
  trailBlacklist.forEach((step, idx) => {
    events.push({
      id: `EVT-SEQ2-0${idx + 1}`,
      plateText: 'UP32-KL-5544',
      cameraId: step.camId,
      timestamp: step.time,
      dateTime: `2026-08-30 ${step.time}`,
      confidence: step.conf,
      speed: step.speed,
      direction: step.dir === 'Northeast' ? 'Northbound' : step.dir,
      vehicleType: 'car',
      vehicleColor: 'Silver',
      status: 'Blacklist match',
      violationFlag: step.vio,
      reIdAnalysis: step.reId,
      captureDetails: {
        laneNumber: step.lane,
        ambientLighting: step.light,
        cameraAngle: step.angle
      }
    });
  });

  // 3. Structured sequential trail for UP32-EX-4091 (White Sedan)
  const trailCloned = [
    {
      camId: 'CAM-01',
      time: '14:11:00',
      speed: 35,
      dir: 'Northbound' as const,
      conf: 97.9,
      col: 'White',
      type: 'car' as const,
      status: 'Cloned plate suspect' as const,
      lane: 1,
      light: 'Daylight' as const,
      angle: 'Overhead Gantry'
    },
    {
      camId: 'CAM-06',
      time: '14:15:30',
      speed: 84,
      dir: 'Southbound' as const,
      conf: 44.2,
      col: 'White',
      type: 'car' as const,
      status: 'Cloned plate suspect' as const,
      lane: 2,
      light: 'Daylight' as const,
      angle: 'Expressway Tower',
      reId: {
        isReIdMatch: true,
        confidence: 98.4,
        triggerReason: 'Heavy road-spray & mud splatter on rear plate caused OCR unreadability (44.2% confidence). AI Vehicle Re-ID triggered to identify vehicle.',
        anchorCameraId: 'CAM-01',
        visualFingerprint: 'REID-HONDA-WHITE#8841',
        aiExplanation: '512D visual embedding vector matched anchor capture at CAM-01 with 98.4% confidence. Confirmed same physical White Honda City.',
        matchedFeatures: [
          { feature: 'White Sedan Silhouette', similarityPct: 98.9, description: 'Honda City 3-box sedan roofline, antenna & door handles' },
          { feature: 'Taffeta White Paint Chroma', similarityPct: 97.8, description: 'Clear white metallic spectral reflectance profile' },
          { feature: 'Rear Spoiler & Alloy Design', similarityPct: 96.5, description: 'Diamond cut multi-spoke alloy wheels & LED tail lamp signature' }
        ]
      }
    },
    {
      camId: 'CAM-03',
      time: '14:50:12',
      speed: 62,
      dir: 'Eastbound' as const,
      conf: 99.0,
      col: 'White',
      type: 'car' as const,
      status: 'Cloned plate suspect' as const,
      lane: 2,
      light: 'Daylight' as const,
      angle: 'Frontal 20°'
    },
    {
      camId: 'CAM-08',
      time: '15:25:00',
      speed: 49,
      dir: 'Northbound' as const,
      conf: 98.5,
      col: 'White',
      type: 'car' as const,
      status: 'Cloned plate suspect' as const,
      lane: 1,
      light: 'Dusk' as const,
      angle: 'Ring Road Gantry'
    }
  ];
  trailCloned.forEach((step, idx) => {
    events.push({
      id: `EVT-SEQ3-0${idx + 1}`,
      plateText: 'UP32-EX-4091',
      cameraId: step.camId,
      timestamp: step.time,
      dateTime: `2026-08-30 ${step.time}`,
      confidence: step.conf,
      speed: step.speed,
      direction: step.dir,
      vehicleType: step.type,
      vehicleColor: step.col,
      status: step.status,
      reIdAnalysis: step.reId,
      captureDetails: {
        laneNumber: step.lane,
        ambientLighting: step.light,
        cameraAngle: step.angle
      }
    });
  });

  // 4. Structured sequential trail for UP32-TR-9900 (Traffic Rule Violator)
  const trailViolator = [
    { camId: 'CAM-05', time: '13:30:15', speed: 44, dir: 'Northbound' as const, conf: 98.0 },
    { camId: 'CAM-02', time: '13:58:00', speed: 51, dir: 'Northbound' as const, conf: 97.5 },
    { camId: 'CAM-06', time: '14:32:00', speed: 68, dir: 'Eastbound' as const, conf: 99.2, vio: 'Wrong-way entry — Ramp contraflow violation' },
    { camId: 'CAM-08', time: '15:45:10', speed: 64, dir: 'Northbound' as const, conf: 96.1, vio: 'Lane jumping / Route anomaly' }
  ];
  trailViolator.forEach((step, idx) => {
    events.push({
      id: `EVT-SEQ4-0${idx + 1}`,
      plateText: 'UP32-TR-9900',
      cameraId: step.camId,
      timestamp: step.time,
      dateTime: `2026-08-30 ${step.time}`,
      confidence: step.conf,
      speed: step.speed,
      direction: step.dir,
      vehicleType: 'car',
      vehicleColor: 'Blue',
      status: step.vio ? 'Route anomaly' : 'Normal',
      violationFlag: step.vio
    });
  });

  // 5. Populate remaining detections across day (06:00 to 18:00) to reach 250 total
  const remainingCount = 250 - events.length;
  const directions: Array<'Northbound' | 'Southbound' | 'Eastbound' | 'Westbound'> = [
    'Northbound', 'Southbound', 'Eastbound', 'Westbound'
  ];

  for (let i = 0; i < remainingCount; i++) {
    const vehicle = MOCK_VEHICLES[i % MOCK_VEHICLES.length];
    const camera = MOCK_CAMERAS[i % (MOCK_CAMERAS.length - 1)]; // active cameras primarily
    
    // Spread hours realistically between 06:00 and 17:59
    const totalMinutes = 360 + Math.floor((i / remainingCount) * 700) + (i % 11);
    const hours = Math.floor(totalMinutes / 60) % 24;
    const mins = totalMinutes % 60;
    const secs = (i * 17) % 60;
    const timeStr = `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    
    // Determine speed relative to camera limit
    const baseSpeed = camera.speedLimit;
    const speedVariation = ((i * 7) % 25) - 10;
    const speed = Math.max(18, baseSpeed + speedVariation);

    // Check status
    let status: 'Normal' | 'Blacklist match' | 'Cloned plate suspect' | 'Route anomaly' = 'Normal';
    let violationFlag: string | undefined = undefined;

    if (vehicle.isBlacklisted) {
      status = 'Blacklist match';
    } else if (vehicle.isClonedSuspect) {
      status = 'Cloned plate suspect';
    } else if (speed > camera.speedLimit + 15) {
      status = 'Route anomaly';
      violationFlag = `Overspeeding — ${speed} km/h in ${camera.speedLimit} zone`;
    }

    const confidence = parseFloat((86.5 + ((i * 3.7) % 13.0)).toFixed(1));

    events.push({
      id: `EVT-GEN-${String(i + 1).padStart(3, '0')}`,
      plateText: vehicle.plate,
      cameraId: camera.id,
      timestamp: timeStr,
      dateTime: `2026-08-30 ${timeStr}`,
      confidence,
      speed,
      direction: directions[i % directions.length],
      vehicleType: vehicle.vehicleType,
      vehicleColor: vehicle.color,
      status,
      violationFlag
    });
  }

  // Sort all events by timestamp ascending
  return events.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
};

export const MOCK_DETECTION_EVENTS = generate250DetectionEvents();
