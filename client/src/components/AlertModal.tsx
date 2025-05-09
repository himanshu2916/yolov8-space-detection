import { FC, useEffect } from "react";
import { SafetyAlert } from "@/types/detection";

interface AlertModalProps {
  alert: SafetyAlert;
  onClose: () => void;
}

const AlertModal: FC<AlertModalProps> = ({ alert, onClose }) => {
  // Auto-close the alert after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 10000);
    
    return () => clearTimeout(timer);
  }, [onClose]);

  const getAlertColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'warning':
        return 'border-safety-orange';
      case 'error':
      case 'danger':
        return 'border-safety-red';
      case 'info':
        return 'border-blue-500';
      case 'success':
        return 'border-safety-green';
      default:
        return 'border-safety-yellow';
    }
  };

  const getAlertIcon = (type: string) => {
    if (type.toLowerCase().includes('fire')) return 'ri-fire-fill';
    if (type.toLowerCase().includes('oxygen')) return 'ri-flask-fill';
    if (type.toLowerCase().includes('tool')) return 'ri-tools-fill';
    return 'ri-alert-fill';
  };

  const borderColor = getAlertColor(alert.level);
  const iconClass = getAlertIcon(alert.type);

  return (
    <div 
      className={`fixed bottom-4 right-4 max-w-xs w-full bg-white rounded-lg shadow-lg border-l-4 ${borderColor} z-40 animate-in slide-in-from-right duration-300`}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <i className={`${iconClass} text-safety-red text-xl`}></i>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-slate-900">Safety Alert</h3>
            <div className="mt-1 text-xs text-slate-600">
              <p>{alert.message}</p>
            </div>
            <div className="mt-2 flex space-x-2">
              <button 
                className="text-xs text-safety-red hover:text-red-800 font-medium"
                onClick={onClose}
              >
                View Details
              </button>
              <button 
                className="text-xs text-slate-500 hover:text-slate-700"
                onClick={onClose}
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertModal;
