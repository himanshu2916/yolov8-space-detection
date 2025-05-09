export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Detection {
  className: string;
  confidence: number;
  box: BoundingBox;
}

export interface DetectionResponse {
  detections: Detection[];
  processedImage?: string;
  processingTime?: number;
  sessionId: string;
}

export interface DetectionHistoryItem {
  className: string;
  timestamp: string;
  action: string;
}

export interface SafetyAlert {
  type: string;
  message: string;
  level: string;
}

export interface Stats {
  objectCounts: Record<string, number>;
  totalObjects: number;
  avgConfidence: number;
  processedFrames: number;
  processingTime: number;
  detectionHistory: DetectionHistoryItem[];
  safetyAlerts: SafetyAlert[];
}

export type InputMode = "webcam" | "upload";

export interface DetectionSettings {
  detectionSpeed: "Balanced" | "Fast" | "Precision";
  showLabels: boolean;
  showConfidence: boolean;
  enabledClasses: {
    "Toolbox": boolean;
    "Oxygen Tank": boolean;
    "Fire Extinguisher": boolean;
    "Other": boolean;
  };
}

export interface Settings {
  modelVersion: string;
  apiEndpoint: string;
  videoResolution: string;
  enableAudioAlerts: boolean;
  autoDetectObjects: boolean;
}
