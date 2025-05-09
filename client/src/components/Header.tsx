import { FC } from "react";

interface HeaderProps {
  onSettingsClick: () => void;
  isModelReady: boolean;
}

const Header: FC<HeaderProps> = ({ onSettingsClick, isModelReady }) => {
  return (
    <header className="bg-blue-600 text-white py-3 px-6 flex items-center justify-between border-b border-blue-700">
      <div className="flex items-center space-x-2">
        <i className="ri-space-ship-fill text-2xl text-white"></i>
        <h1 className="text-xl font-semibold">ASTRO-DETECT</h1>
      </div>
      <div className="flex items-center space-x-4">
        <button
          onClick={onSettingsClick}
          className="text-sm flex items-center space-x-1 hover:text-blue-300 transition"
        >
          <i className="ri-settings-3-line"></i>
          <span>Settings</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
