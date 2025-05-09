import { FC } from "react";
import { DetectionSettings, InputMode, Stats } from "@/types/detection";
import DetectionSettingsComponent from "./DetectionSettings";
import ObjectClasses from "./ObjectClasses";
import { jsPDF } from "jspdf";

interface SidebarProps {
  inputMode: InputMode;
  onInputModeChange: (mode: InputMode) => void;
  detectionSettings: DetectionSettings;
  onDetectionSettingsChange: (settings: Partial<DetectionSettings>) => void;
  stats?: Stats;
  sessionId: string;
  isDetectionPaused: boolean;
}

const Sidebar: FC<SidebarProps> = ({
  inputMode,
  onInputModeChange,
  detectionSettings,
  onDetectionSettingsChange,
  stats,
  sessionId,
  isDetectionPaused
}) => {
  const handleInputModeToggle = (mode: InputMode) => {
    onInputModeChange(mode);
  };

  const generateReport = () => {
    if (!stats) return;

    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Space Station Object Detection Report", 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Session ID: ${sessionId}`, 20, 35);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 42);
    
    doc.setFontSize(16);
    doc.text("Detection Statistics", 20, 55);
    
    doc.setFontSize(12);
    doc.text(`Total Objects Detected: ${stats.totalObjects}`, 25, 65);
    doc.text(`Processed Frames: ${stats.processedFrames}`, 25, 72);
    doc.text(`Average Confidence: ${(stats.avgConfidence * 100).toFixed(1)}%`, 25, 79);
    doc.text(`Average Processing Time: ${stats.processingTime}ms`, 25, 86);
    
    // Object counts table
    doc.setFontSize(16);
    doc.text("Object Counts", 20, 100);
    
    doc.setFontSize(12);
    let y = 110;
    Object.entries(stats.objectCounts).forEach(([className, count]) => {
      doc.text(`${className}: ${count}`, 25, y);
      y += 7;
    });
    
    // Safety alerts
    if (stats.safetyAlerts.length > 0) {
      doc.setFontSize(16);
      doc.text("Safety Alerts", 20, y + 10);
      
      doc.setFontSize(12);
      y += 20;
      stats.safetyAlerts.forEach(alert => {
        doc.text(`${alert.level.toUpperCase()}: ${alert.message}`, 25, y);
        y += 7;
      });
    }
    
    doc.save(`space-station-detection-report-${sessionId}.pdf`);
  };

  return (
    <aside className="bg-slate-800 text-white w-64 flex-shrink-0 flex flex-col h-full overflow-y-auto">
      <div className="p-4 border-b border-slate-700">
        <h2 className="font-medium text-lg mb-2">Controls</h2>
        
        {/* Input Source Section */}
        <div className="mb-6">
          <h3 className="text-xs uppercase text-slate-400 mb-2 font-medium">Input Source</h3>
          <div className="flex bg-slate-700 rounded-md p-1">
            <button 
              onClick={() => handleInputModeToggle("webcam")}
              className={`flex-1 py-2 px-3 rounded-md ${
                inputMode === "webcam" 
                  ? "bg-blue-600 text-white" 
                  : "text-slate-300 hover:bg-slate-600"
              } text-sm font-medium transition`}
            >
              Webcam
            </button>
            <button 
              onClick={() => handleInputModeToggle("upload")}
              className={`flex-1 py-2 px-3 rounded-md ${
                inputMode === "upload" 
                  ? "bg-blue-600 text-white" 
                  : "text-slate-300 hover:bg-slate-600"
              } text-sm font-medium transition`}
            >
              Upload
            </button>
          </div>
        </div>

        {/* Detection Settings */}
        <DetectionSettingsComponent 
          settings={detectionSettings}
          onChange={onDetectionSettingsChange}
        />

        {/* Object Classes */}
        <ObjectClasses 
          enabledClasses={detectionSettings.enabledClasses}
          onChange={(enabledClasses) => onDetectionSettingsChange({ enabledClasses })}
        />
      </div>

      {/* Stats Summary */}
      <div className="p-4 border-b border-slate-700">
        <h3 className="text-xs uppercase text-slate-400 mb-2 font-medium">Current Session</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Processed Frames:</span>
            <span className="font-mono">{stats?.processedFrames.toLocaleString() || "-"}</span>
          </div>
          <div className="flex justify-between">
            <span>Objects Detected:</span>
            <span className="font-mono">{stats?.totalObjects || "-"}</span>
          </div>
          <div className="flex justify-between">
            <span>Avg. Confidence:</span>
            <span className="font-mono">{stats ? `${(stats.avgConfidence * 100).toFixed(1)}%` : "-"}</span>
          </div>
          <div className="flex justify-between">
            <span>Processing Time:</span>
            <span className="font-mono">{stats ? `${stats.processingTime}ms` : "-"}</span>
          </div>
        </div>
      </div>

      <div className="p-4 mt-auto">
        <button 
          onClick={generateReport}
          disabled={!stats}
          className={`w-full ${
            stats 
              ? "bg-blue-600 hover:bg-blue-700" 
              : "bg-slate-600 cursor-not-allowed"
          } text-white py-2 px-4 rounded-md flex items-center justify-center space-x-2 transition`}
        >
          <i className="ri-file-chart-line"></i>
          <span>Generate Report</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
