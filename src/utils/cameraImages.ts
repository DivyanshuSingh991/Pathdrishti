import { DetectionEvent } from '../types';

export interface BoundingBox {
  x: number; // percentage from left
  y: number; // percentage from top
  width: number; // percentage width
  height: number; // percentage height
  label: string;
  confidence: number;
}

export interface CameraCaptureInfo {
  imageUrl: string;
  lane: string;
  shutterSpeed: string;
  resolution: string;
  frameRate: string;
  exposure: string;
  vehicleBox: BoundingBox;
  plateBox: BoundingBox;
}

// Preset mapping for our high-resolution real Lucknow CCTV surveillance camera captures
export const PRESET_CAPTURES: Record<string, CameraCaptureInfo> = {
  // 1. Blacklisted Stolen Hyundai Creta (Silver) at CAM-01 Hazratganj
  'UP32-KL-5544': {
    imageUrl: '/captures/creta_silver_cam01.jpg',
    lane: 'LANE 02 (Northbound Inbound)',
    shutterSpeed: '1/2000s',
    resolution: '4K (3840x2160) @ 60fps',
    frameRate: '60 FPS',
    exposure: 'F2.8 ISO 320 AUTO',
    vehicleBox: {
      x: 37,
      y: 42,
      width: 29,
      height: 33,
      label: 'VEHICLE: SUV (Hyundai Creta) [Silver]',
      confidence: 98.7
    },
    plateBox: {
      x: 39,
      y: 65.5,
      width: 5.5,
      height: 3.5,
      label: 'OCR: UP32-KL-5544',
      confidence: 97.8
    }
  },

  // 2. Wanted Scorpio (Dark Grey) at CAM-07 Chowk Heritage
  'UP32-LK-9027': {
    imageUrl: '/captures/scorpio_grey_cam07.jpg',
    lane: 'LANE 01 (Heritage Gate Ingress)',
    shutterSpeed: '1/1600s',
    resolution: '4K (3840x2160) @ 60fps',
    frameRate: '60 FPS',
    exposure: 'F2.8 ISO 250 AUTO',
    vehicleBox: {
      x: 37,
      y: 49,
      width: 26,
      height: 35,
      label: 'VEHICLE: SUV (Mahindra Scorpio) [Dark Grey]',
      confidence: 98.9
    },
    plateBox: {
      x: 39.8,
      y: 73.5,
      width: 4.8,
      height: 3.2,
      label: 'OCR: UP32-LK-9027',
      confidence: 98.4
    }
  },

  // 3. Near-miss altered plate Scorpio
  'UP32-LK-9021': {
    imageUrl: '/captures/scorpio_grey_cam07.jpg',
    lane: 'LANE 01 (Heritage Corridor)',
    shutterSpeed: '1/1600s',
    resolution: '4K (3840x2160) @ 60fps',
    frameRate: '60 FPS',
    exposure: 'F2.8 ISO 250 AUTO',
    vehicleBox: {
      x: 37,
      y: 49,
      width: 26,
      height: 35,
      label: 'VEHICLE: SUV (Mahindra Scorpio) [Grey]',
      confidence: 98.1
    },
    plateBox: {
      x: 39.8,
      y: 73.5,
      width: 4.8,
      height: 3.2,
      label: 'OCR [ANOMALY]: UP32-LK-9021 (94.2% ~ Wanted 9027)',
      confidence: 94.2
    }
  },

  // 4. Impound Warrant Toyota Fortuner (Black) at CAM-03 Gomti Nagar Expressway
  'UP32-ZZ-0007': {
    imageUrl: '/captures/fortuner_black_cam03.jpg',
    lane: 'EXPRESSWAY LANE 03',
    shutterSpeed: '1/2500s',
    resolution: '4K (3840x2160) @ 60fps',
    frameRate: '60 FPS',
    exposure: 'F4.0 ISO 200 AUTO',
    vehicleBox: {
      x: 46,
      y: 52,
      width: 24,
      height: 25,
      label: 'VEHICLE: SUV (Toyota Fortuner) [Black]',
      confidence: 99.1
    },
    plateBox: {
      x: 64.2,
      y: 65,
      width: 3.2,
      height: 3.0,
      label: 'OCR: UP32-ZZ-0007',
      confidence: 98.9
    }
  },

  // 5. Overspeeding Kia Seltos (Blue) at CAM-06 Shaheed Path Ring
  'UP32-TR-9900': {
    imageUrl: '/captures/seltos_blue_cam06.jpg',
    lane: 'FAST LANE 01 (Outer Ring Elevated)',
    shutterSpeed: '1/3000s',
    resolution: '4K (3840x2160) @ 60fps',
    frameRate: '60 FPS',
    exposure: 'F3.5 ISO 160 AUTO',
    vehicleBox: {
      x: 38.5,
      y: 46.5,
      width: 20.5,
      height: 27,
      label: 'VEHICLE: Compact SUV (Kia Seltos) [Blue]',
      confidence: 98.5
    },
    plateBox: {
      x: 41.2,
      y: 66.2,
      width: 4.2,
      height: 2.6,
      label: 'OCR: UP32-TR-9900',
      confidence: 96.1
    }
  },

  // 6. Cloned Suspect Auto-rickshaw at CAM-09 Aminabad Entry
  'UP32-BN-8822': {
    imageUrl: '/captures/auto_rickshaw_cam09.jpg',
    lane: 'MARKET ACCESS LANE 01',
    shutterSpeed: '1/1200s',
    resolution: '4K (3840x2160) @ 60fps',
    frameRate: '60 FPS',
    exposure: 'F2.4 ISO 200 AUTO',
    vehicleBox: {
      x: 44.5,
      y: 41,
      width: 29.5,
      height: 50,
      label: 'VEHICLE: 3W Auto-Rickshaw [Green & Yellow]',
      confidence: 97.4
    },
    plateBox: {
      x: 68.8,
      y: 65.8,
      width: 3.8,
      height: 3.6,
      label: 'OCR [MISMATCH]: UP32-BN-8822 (Registered to SUV)',
      confidence: 97.2
    }
  },

  // 7. Cloned Suspect White Honda City at CAM-04 Indira Nagar
  'UP32-EX-4091': {
    imageUrl: '/captures/honda_city_white_cam04.jpg',
    lane: 'LANE 02 (Interchange Connector)',
    shutterSpeed: '1/2000s',
    resolution: '4K (3840x2160) @ 60fps',
    frameRate: '60 FPS',
    exposure: 'F2.8 ISO 300 AUTO',
    vehicleBox: {
      x: 33,
      y: 38,
      width: 38.5,
      height: 41,
      label: 'VEHICLE: Sedan (Honda City) [White]',
      confidence: 98.8
    },
    plateBox: {
      x: 37,
      y: 65,
      width: 7.8,
      height: 4.6,
      label: 'OCR: UP32-EX-4091',
      confidence: 97.9
    }
  },

  // 8. Normal Multi-Stop Swift / White sedan
  'UP32-AB-1234': {
    imageUrl: '/captures/honda_city_white_cam04.jpg',
    lane: 'LANE 01 (City Transit Arterial)',
    shutterSpeed: '1/2000s',
    resolution: '4K (3840x2160) @ 60fps',
    frameRate: '60 FPS',
    exposure: 'F2.8 ISO 280 AUTO',
    vehicleBox: {
      x: 33,
      y: 38,
      width: 38.5,
      height: 41,
      label: 'VEHICLE: Car [White]',
      confidence: 98.4
    },
    plateBox: {
      x: 37,
      y: 65,
      width: 7.8,
      height: 4.6,
      label: 'OCR: UP32-AB-1234',
      confidence: 98.4
    }
  }
};

/**
 * Returns comprehensive CCTV capture info and high-res image for any detection
 */
export const getCameraCaptureForDetection = (detection: DetectionEvent): CameraCaptureInfo => {
  // If explicitly mapped by plate
  if (PRESET_CAPTURES[detection.plateText]) {
    return PRESET_CAPTURES[detection.plateText];
  }

  // Fallback map based on vehicle type and color for general fleet
  if (detection.vehicleType === 'auto') {
    return {
      ...PRESET_CAPTURES['UP32-BN-8822'],
      vehicleBox: {
        ...PRESET_CAPTURES['UP32-BN-8822'].vehicleBox,
        label: `VEHICLE: 3W Auto-Rickshaw [${detection.vehicleColor}]`,
        confidence: detection.confidence
      },
      plateBox: {
        ...PRESET_CAPTURES['UP32-BN-8822'].plateBox,
        label: `OCR: ${detection.plateText}`,
        confidence: detection.confidence
      }
    };
  }

  if (detection.vehicleColor.toLowerCase().includes('black') || detection.vehicleColor.toLowerCase().includes('dark')) {
    return {
      ...PRESET_CAPTURES['UP32-ZZ-0007'],
      vehicleBox: {
        ...PRESET_CAPTURES['UP32-ZZ-0007'].vehicleBox,
        label: `VEHICLE: ${detection.vehicleType.toUpperCase()} [${detection.vehicleColor}]`,
        confidence: detection.confidence
      },
      plateBox: {
        ...PRESET_CAPTURES['UP32-ZZ-0007'].plateBox,
        label: `OCR: ${detection.plateText}`,
        confidence: detection.confidence
      }
    };
  }

  if (detection.vehicleColor.toLowerCase().includes('blue') || detection.speed > 55) {
    return {
      ...PRESET_CAPTURES['UP32-TR-9900'],
      vehicleBox: {
        ...PRESET_CAPTURES['UP32-TR-9900'].vehicleBox,
        label: `VEHICLE: ${detection.vehicleType.toUpperCase()} [${detection.vehicleColor}]`,
        confidence: detection.confidence
      },
      plateBox: {
        ...PRESET_CAPTURES['UP32-TR-9900'].plateBox,
        label: `OCR: ${detection.plateText}`,
        confidence: detection.confidence
      }
    };
  }

  if (detection.vehicleColor.toLowerCase().includes('grey') || detection.vehicleColor.toLowerCase().includes('silver')) {
    return {
      ...PRESET_CAPTURES['UP32-KL-5544'],
      vehicleBox: {
        ...PRESET_CAPTURES['UP32-KL-5544'].vehicleBox,
        label: `VEHICLE: ${detection.vehicleType.toUpperCase()} [${detection.vehicleColor}]`,
        confidence: detection.confidence
      },
      plateBox: {
        ...PRESET_CAPTURES['UP32-KL-5544'].plateBox,
        label: `OCR: ${detection.plateText}`,
        confidence: detection.confidence
      }
    };
  }

  // Default white / light car
  return {
    ...PRESET_CAPTURES['UP32-EX-4091'],
    vehicleBox: {
      ...PRESET_CAPTURES['UP32-EX-4091'].vehicleBox,
      label: `VEHICLE: ${detection.vehicleType.toUpperCase()} [${detection.vehicleColor}]`,
      confidence: detection.confidence
    },
    plateBox: {
      ...PRESET_CAPTURES['UP32-EX-4091'].plateBox,
      label: `OCR: ${detection.plateText}`,
      confidence: detection.confidence
    }
  };
};
