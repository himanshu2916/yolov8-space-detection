import { FC } from "react";
import { Stats } from "@/types/detection";

interface DashboardProps {
  stats?: Stats;
}

const Dashboard: FC<DashboardProps> = ({ stats }) => {
  // Default values when no stats are available
  const objectCounts = stats?.objectCounts || {
    "Toolbox": 0,
    "Oxygen Tank": 0,
    "Fire Extinguisher": 0,
    "Other": 0
  };
  
  const detectionHistory = stats?.detectionHistory || [];
  const safetyAlerts = stats?.safetyAlerts || [];
  
  // Helper to get trend icon/text
  const getTrend = (className: string) => {
    // Simulate trends for now
    const trends: Record<string, { icon: string, text: string, color: string }> = {
      "Toolbox": { icon: "ri-arrow-up-s-line", text: "1", color: "text-green-600" },
      "Oxygen Tank": { icon: "ri-subtract-line", text: "0", color: "text-slate-500" },
      "Fire Extinguisher": { icon: "ri-arrow-down-s-line", text: "1", color: "text-red-600" },
      "Other": { icon: "ri-arrow-up-s-line", text: "2", color: "text-green-600" }
    };
    
    return trends[className] || { icon: "ri-subtract-line", text: "0", color: "text-slate-500" };
  };
  
  return (
    <div className="h-64 p-4 pt-0 flex space-x-4 overflow-x-auto scrollbar-hide">
      {/* Object Statistics Card */}
      <div className="bg-white rounded-lg shadow-md w-72 flex-shrink-0 flex flex-col">
        <div className="px-4 py-3 border-b border-slate-200">
          <h3 className="font-medium">Object Statistics</h3>
        </div>
        <div className="p-4 flex-1 flex flex-col justify-center">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-50 p-2 rounded-md flex flex-col">
              <span className="text-xs text-slate-500">Toolboxes</span>
              <div className="flex items-end justify-between mt-1">
                <span className="text-2xl font-medium">{objectCounts["Toolbox"]}</span>
                <span className={`text-xs ${getTrend("Toolbox").color} flex items-center`}>
                  <i className={getTrend("Toolbox").icon}></i>
                  {getTrend("Toolbox").text}
                </span>
              </div>
            </div>
            <div className="bg-green-50 p-2 rounded-md flex flex-col">
              <span className="text-xs text-slate-500">Oxygen Tanks</span>
              <div className="flex items-end justify-between mt-1">
                <span className="text-2xl font-medium">{objectCounts["Oxygen Tank"]}</span>
                <span className={`text-xs ${getTrend("Oxygen Tank").color} flex items-center`}>
                  <i className={getTrend("Oxygen Tank").icon}></i>
                  {getTrend("Oxygen Tank").text}
                </span>
              </div>
            </div>
            <div className="bg-red-50 p-2 rounded-md flex flex-col">
              <span className="text-xs text-slate-500">Fire Extinguishers</span>
              <div className="flex items-end justify-between mt-1">
                <span className="text-2xl font-medium">{objectCounts["Fire Extinguisher"]}</span>
                <span className={`text-xs ${getTrend("Fire Extinguisher").color} flex items-center`}>
                  <i className={getTrend("Fire Extinguisher").icon}></i>
                  {getTrend("Fire Extinguisher").text}
                </span>
              </div>
            </div>
            <div className="bg-yellow-50 p-2 rounded-md flex flex-col">
              <span className="text-xs text-slate-500">Other Objects</span>
              <div className="flex items-end justify-between mt-1">
                <span className="text-2xl font-medium">{objectCounts["Other"] || 0}</span>
                <span className={`text-xs ${getTrend("Other").color} flex items-center`}>
                  <i className={getTrend("Other").icon}></i>
                  {getTrend("Other").text}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Safety Status Card removed */}

      {/* Detection History Card */}
      <div className="bg-white rounded-lg shadow-md w-72 flex-shrink-0 flex flex-col">
        <div className="px-4 py-3 border-b border-slate-200">
          <h3 className="font-medium">Detection History</h3>
        </div>
        <div className="p-2 flex-1 overflow-y-auto scrollbar-hide">
          {detectionHistory.length > 0 ? (
            <div className="text-xs space-y-2">
              {detectionHistory.map((item, index) => (
                <div key={index} className="p-2 hover:bg-slate-50 rounded-md">
                  <div className="flex justify-between items-start">
                    <span className="font-medium">{item.className}</span>
                    <span className="text-slate-500">
                      {new Date(item.timestamp).toLocaleTimeString(undefined, {
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </span>
                  </div>
                  <div className="flex items-center mt-1">
                    <span className={`inline-block h-2 w-2 rounded-full ${
                      item.action === "Added to inventory" ? "bg-green-500" :
                      item.action === "Removed from view" ? "bg-red-500" : "bg-yellow-500"
                    } mr-1`}></span>
                    <span className="text-slate-600">{item.action}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-sm text-slate-500">No detection history yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Confidence Distribution Card */}
      <div className="bg-white rounded-lg shadow-md w-72 flex-shrink-0 flex flex-col">
        <div className="px-4 py-3 border-b border-slate-200">
          <h3 className="font-medium">Confidence Distribution</h3>
        </div>
        <div className="p-4 flex-1 flex items-center justify-center">
          {/* Simple confidence visualization */}
          <div className="w-full space-y-3">
            {Object.entries(objectCounts).length > 0 ? (
              Object.entries(objectCounts).map(([className, _]) => {
                // Generate mock confidence values
                const confidenceMap: Record<string, number> = {
                  "Fire Extinguisher": 0.92,
                  "Oxygen Tank": 0.88,
                  "Toolbox": 0.95,
                  "Other": 0.76
                };
                
                const confidence = confidenceMap[className] || 0.8;
                const colorMap: Record<string, string> = {
                  "Toolbox": "bg-blue-500",
                  "Oxygen Tank": "bg-green-500",
                  "Fire Extinguisher": "bg-red-500",
                  "Other": "bg-yellow-500"
                };
                
                return (
                  <div key={className}>
                    <div className="flex justify-between text-xs mb-1">
                      <span>{className}</span>
                      <span>{(confidence * 100).toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className={`${colorMap[className] || "bg-blue-500"} h-2 rounded-full`} 
                        style={{ width: `${confidence * 100}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center text-sm text-slate-500">
                No confidence data available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
