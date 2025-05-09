import { FC } from "react";
import { Detection, DetectionResponse, Stats } from "@/types/detection";
import WebcamDisplay from "./WebcamDisplay";
import Dashboard from "./Dashboard";

interface MainContentProps {
  inputMode: "webcam" | "upload";
  detectionResults: DetectionResponse | null;
  detectionImage: string | null;
  isDetecting: boolean;
  isDetectionPaused: boolean;
  onToggleDetectionPause: () => void;
  onDetect: (imageData: string) => void;
  showLabels: boolean;
  showConfidence: boolean;
  stats?: Stats;
}

const MainContent: FC<MainContentProps> = ({
  inputMode,
  detectionResults,
  detectionImage,
  isDetecting,
  isDetectionPaused,
  onToggleDetectionPause,
  onDetect,
  showLabels,
  showConfidence,
  stats
}) => {
  return (
    <main className="flex-1 flex flex-col overflow-hidden">
      {/* Detection Viewport */}
      <div className="flex-1 p-4 flex flex-col">
        <div className="bg-white rounded-lg shadow-md flex-1 flex flex-col overflow-hidden">
          <div className="border-b border-slate-200 px-4 py-3 flex justify-between items-center">
            <h2 className="font-medium text-lg">Detection Viewport</h2>
            <div className="flex space-x-2">
              <button className="text-slate-500 hover:text-blue-600 p-1.5 rounded-md hover:bg-slate-100 transition">
                <i className="ri-fullscreen-line text-lg"></i>
              </button>
              <button className="text-slate-500 hover:text-blue-600 p-1.5 rounded-md hover:bg-slate-100 transition">
                <i className="ri-camera-line text-lg"></i>
              </button>
              <button className="text-slate-500 hover:text-blue-600 p-1.5 rounded-md hover:bg-slate-100 transition">
                <i className="ri-download-line text-lg"></i>
              </button>
            </div>
          </div>
          
          <WebcamDisplay 
            inputMode={inputMode}
            detectionResults={detectionResults?.detections || []}
            detectionImage={detectionImage}
            onDetect={onDetect}
            showLabels={showLabels}
            showConfidence={showConfidence}
            isDetecting={isDetecting}
            isDetectionPaused={isDetectionPaused}
          />
          
          {/* Camera controls */}
          <div className="p-3 border-t border-slate-200 flex justify-between items-center bg-slate-50">
            <div className="flex items-center space-x-2">
              <button 
                onClick={onToggleDetectionPause}
                className="flex items-center space-x-1 text-sm py-1.5 px-3 bg-slate-200 hover:bg-slate-300 rounded-md transition"
              >
                {isDetectionPaused ? (
                  <>
                    <i className="ri-play-mini-fill"></i>
                    <span>Resume</span>
                  </>
                ) : (
                  <>
                    <i className="ri-pause-mini-fill"></i>
                    <span>Pause</span>
                  </>
                )}
              </button>
              <button className="text-slate-500 p-1.5 rounded-md hover:bg-slate-200 transition">
                <i className="ri-settings-3-line"></i>
              </button>
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-xs text-slate-500">Processing Speed:</span>
              <span className="text-xs font-medium">
                {detectionResults?.processingTime 
                  ? `${(1000 / detectionResults.processingTime).toFixed(1)} FPS` 
                  : "- FPS"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard */}
      <Dashboard stats={stats} />
    </main>
  );
};

export default MainContent;
