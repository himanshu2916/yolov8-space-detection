import { FC } from "react";
import { DetectionSettings } from "@/types/detection";

interface DetectionSettingsProps {
  settings: DetectionSettings;
  onChange: (settings: Partial<DetectionSettings>) => void;
}

const DetectionSettingsComponent: FC<DetectionSettingsProps> = ({ settings, onChange }) => {
  const handleDetectionSpeedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ detectionSpeed: e.target.value as DetectionSettings["detectionSpeed"] });
  };

  const handleCheckboxChange = (field: keyof Pick<DetectionSettings, "showLabels" | "showConfidence">) => {
    onChange({ [field]: !settings[field] });
  };

  return (
    <div className="mb-6">
      <h3 className="text-xs uppercase text-slate-400 mb-2 font-medium">Detection Settings</h3>
      <div className="space-y-3">
        <div>
          <label className="block text-sm mb-1">Detection Speed</label>
          <select
            value={settings.detectionSpeed}
            onChange={handleDetectionSpeedChange}
            className="w-full bg-slate-700 border border-slate-600 rounded-md py-1.5 px-2 text-sm"
          >
            <option>Balanced</option>
            <option>Fast</option>
            <option>Precision</option>
          </select>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="show-labels"
            className="h-4 w-4 rounded bg-slate-700 border-slate-500"
            checked={settings.showLabels}
            onChange={() => handleCheckboxChange("showLabels")}
          />
          <label htmlFor="show-labels" className="ml-2 text-sm">
            Show Labels
          </label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="show-confidence"
            className="h-4 w-4 rounded bg-slate-700 border-slate-500"
            checked={settings.showConfidence}
            onChange={() => handleCheckboxChange("showConfidence")}
          />
          <label htmlFor="show-confidence" className="ml-2 text-sm">
            Show Confidence
          </label>
        </div>
      </div>
    </div>
  );
};

export default DetectionSettingsComponent;
