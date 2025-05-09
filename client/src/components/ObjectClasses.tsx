import { FC } from "react";

interface ObjectClassesProps {
  enabledClasses: {
    "Toolbox": boolean;
    "Oxygen Tank": boolean;
    "Fire Extinguisher": boolean;
    "Other": boolean;
  };
  onChange: (enabledClasses: Record<string, boolean>) => void;
}

const ObjectClasses: FC<ObjectClassesProps> = ({ enabledClasses, onChange }) => {
  const handleClassToggle = (className: keyof typeof enabledClasses) => {
    onChange({
      ...enabledClasses,
      [className]: !enabledClasses[className]
    });
  };

  return (
    <div className="mb-6">
      <h3 className="text-xs uppercase text-slate-400 mb-2 font-medium">Object Classes</h3>
      <div className="space-y-2">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="class-toolbox"
            className="h-4 w-4 rounded bg-slate-700 border-slate-500"
            checked={enabledClasses["Toolbox"]}
            onChange={() => handleClassToggle("Toolbox")}
          />
          <label htmlFor="class-toolbox" className="ml-2 text-sm flex items-center">
            <span className="h-3 w-3 inline-block bg-blue-400 rounded-full mr-2"></span>
            Toolbox
          </label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="class-oxygen"
            className="h-4 w-4 rounded bg-slate-700 border-slate-500"
            checked={enabledClasses["Oxygen Tank"]}
            onChange={() => handleClassToggle("Oxygen Tank")}
          />
          <label htmlFor="class-oxygen" className="ml-2 text-sm flex items-center">
            <span className="h-3 w-3 inline-block bg-green-400 rounded-full mr-2"></span>
            Oxygen Tank
          </label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="class-fire"
            className="h-4 w-4 rounded bg-slate-700 border-slate-500"
            checked={enabledClasses["Fire Extinguisher"]}
            onChange={() => handleClassToggle("Fire Extinguisher")}
          />
          <label htmlFor="class-fire" className="ml-2 text-sm flex items-center">
            <span className="h-3 w-3 inline-block bg-red-400 rounded-full mr-2"></span>
            Fire Extinguisher
          </label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="class-other"
            className="h-4 w-4 rounded bg-slate-700 border-slate-500"
            checked={enabledClasses["Other"]}
            onChange={() => handleClassToggle("Other")}
          />
          <label htmlFor="class-other" className="ml-2 text-sm flex items-center">
            <span className="h-3 w-3 inline-block bg-yellow-400 rounded-full mr-2"></span>
            Other Objects
          </label>
        </div>
      </div>
    </div>
  );
};

export default ObjectClasses;
