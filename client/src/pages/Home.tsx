import { useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import MainContent from "@/components/MainContent";
import SettingsModal from "@/components/SettingsModal";
import AlertModal from "@/components/AlertModal";
import { DetectionSettings, InputMode, Settings, SafetyAlert } from "@/types/detection";
import { useDetection } from "@/hooks/useDetection";

export default function Home() {
  // App state
  const [inputMode, setInputMode] = useState<InputMode>("webcam");
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [currentAlert, setCurrentAlert] = useState<SafetyAlert | null>(null);
  
  // Detection settings
  const [detectionSettings, setDetectionSettings] = useState<DetectionSettings>({
    detectionSpeed: "Balanced",
    showLabels: true,
    showConfidence: true,
    enabledClasses: {
      "Toolbox": true,
      "Oxygen Tank": true,
      "Fire Extinguisher": true,
      "Other": true
    }
  });
  
  // App settings
  const [settings, setSettings] = useState<Settings>({
    modelVersion: "YOLOv8n (Default)",
    apiEndpoint: "http://localhost:8000",
    videoResolution: "720p",
    enableAudioAlerts: false,
    autoDetectObjects: true
  });

  // Initialize detection system
  const detection = useDetection({
    inputMode,
    settings: detectionSettings
  });

  // Toggle settings modal
  const toggleSettingsModal = () => {
    setIsSettingsModalOpen(!isSettingsModalOpen);
  };

  // Handle settings change
  const handleSettingsChange = (newSettings: Settings) => {
    setSettings(newSettings);
    setIsSettingsModalOpen(false);
  };

  // Handle detection settings change
  const handleDetectionSettingsChange = (newSettings: Partial<DetectionSettings>) => {
    setDetectionSettings(prev => ({
      ...prev,
      ...newSettings
    }));
  };

  // Show safety alert
  const showSafetyAlert = (alert: SafetyAlert) => {
    setCurrentAlert(alert);
    setShowAlertModal(true);
  };

  // Safety alerts are disabled
  // Previously: if (detection.stats?.safetyAlerts?.length && !showAlertModal && !currentAlert) {
  //   showSafetyAlert(detection.stats.safetyAlerts[0]);
  // }

  return (
    <div className="bg-slate-100 text-slate-800 h-screen flex flex-col">
      <Header 
        onSettingsClick={toggleSettingsModal} 
        isModelReady={true}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          inputMode={inputMode}
          onInputModeChange={setInputMode}
          detectionSettings={detectionSettings}
          onDetectionSettingsChange={handleDetectionSettingsChange}
          stats={detection.stats}
          sessionId={detection.sessionId || ""}
          isDetectionPaused={detection.isDetectionPaused}
        />
        
        <MainContent 
          inputMode={inputMode}
          detectionResults={detection.detectionResults}
          detectionImage={detection.detectionImage}
          isDetecting={detection.isDetecting}
          isDetectionPaused={detection.isDetectionPaused}
          onToggleDetectionPause={detection.toggleDetectionPause}
          onDetect={detection.detectObjects}
          showLabels={detectionSettings.showLabels}
          showConfidence={detectionSettings.showConfidence}
          stats={detection.stats}
        />
      </div>
      
      {isSettingsModalOpen && (
        <SettingsModal 
          isOpen={isSettingsModalOpen}
          onClose={() => setIsSettingsModalOpen(false)}
          settings={settings}
          onSave={handleSettingsChange}
        />
      )}
      
      {showAlertModal && currentAlert && (
        <AlertModal 
          alert={currentAlert}
          onClose={() => {
            setShowAlertModal(false);
            setCurrentAlert(null);
          }}
        />
      )}
    </div>
  );
}
