import { FC, useState } from "react";
import { Settings } from "@/types/detection";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: Settings;
  onSave: (settings: Settings) => void;
}

const SettingsModal: FC<SettingsModalProps> = ({ isOpen, onClose, settings, onSave }) => {
  const [formState, setFormState] = useState<Settings>(settings);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === "checkbox") {
      const checkbox = e.target as HTMLInputElement;
      setFormState({
        ...formState,
        [name]: checkbox.checked
      });
    } else {
      setFormState({
        ...formState,
        [name]: value
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formState);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
        <div className="flex justify-between items-center px-4 py-3 border-b border-slate-200">
          <h3 className="font-medium text-lg">Settings</h3>
          <button className="text-slate-400 hover:text-slate-600" onClick={onClose}>
            <i className="ri-close-line text-xl"></i>
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="modelVersion">Model Version</label>
                <select
                  id="modelVersion"
                  name="modelVersion"
                  value={formState.modelVersion}
                  onChange={handleInputChange}
                  className="w-full border border-slate-300 rounded-md py-1.5 px-2 text-sm"
                >
                  <option>YOLOv8n (Default)</option>
                  <option>YOLOv8s</option>
                  <option>YOLOv8m</option>
                  <option>YOLOv8l</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="apiEndpoint">API Endpoint</label>
                <input
                  type="text"
                  id="apiEndpoint"
                  name="apiEndpoint"
                  value={formState.apiEndpoint}
                  onChange={handleInputChange}
                  className="w-full border border-slate-300 rounded-md py-1.5 px-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="videoResolution">Video Resolution</label>
                <select
                  id="videoResolution"
                  name="videoResolution"
                  value={formState.videoResolution}
                  onChange={handleInputChange}
                  className="w-full border border-slate-300 rounded-md py-1.5 px-2 text-sm"
                >
                  <option>720p</option>
                  <option>1080p</option>
                  <option>480p</option>
                </select>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="enableAudioAlerts"
                  name="enableAudioAlerts"
                  checked={formState.enableAudioAlerts}
                  onChange={handleInputChange}
                  className="h-4 w-4 rounded border-slate-300"
                />
                <label htmlFor="enableAudioAlerts" className="ml-2 text-sm">Enable Audio Alerts</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="autoDetectObjects"
                  name="autoDetectObjects"
                  checked={formState.autoDetectObjects}
                  onChange={handleInputChange}
                  className="h-4 w-4 rounded border-slate-300"
                />
                <label htmlFor="autoDetectObjects" className="ml-2 text-sm">Auto-detect Objects</label>
              </div>
            </div>
          </div>
          <div className="px-4 py-3 bg-slate-50 rounded-b-lg flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="py-1.5 px-3 text-sm border border-slate-300 rounded-md hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-1.5 px-3 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsModal;
