import { FC, useEffect, useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const Landing: FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    
    // Add CSS animation for stars
    const style = document.createElement('style');
    style.textContent = `
      @keyframes twinkle {
        0%, 100% { opacity: 0.2; }
        50% { opacity: 1; }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-between overflow-hidden relative">
      {/* Background with stars effect */}
      <div 
        className="absolute inset-0 z-0 bg-[#030014]"
        style={{
          backgroundImage: `
            radial-gradient(circle at 15% 50%, rgba(25, 55, 109, 0.7) 0%, transparent 25%),
            radial-gradient(circle at 85% 30%, rgba(59, 37, 110, 0.6) 0%, transparent 30%)
          `,
          backgroundSize: 'cover'
        }}
      >
        {/* Animated stars */}
        <div className="stars-container">
          {Array.from({ length: 100 }).map((_, i) => {
            const size = Math.random() * 2;
            const animationDuration = 10 + Math.random() * 20;
            const top = Math.random() * 100;
            const left = Math.random() * 100;
            const opacity = Math.random() * 0.8 + 0.2;
            
            return (
              <div
                key={i}
                className="absolute rounded-full bg-white"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  top: `${top}%`,
                  left: `${left}%`,
                  opacity,
                  animation: `twinkle ${animationDuration}s ease-in-out infinite`
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-blue-600 bg-opacity-90 backdrop-blur-sm text-white py-3 px-6 flex items-center justify-between border-b border-blue-700">
        <div className="flex items-center space-x-2">
          <i className="ri-space-ship-fill text-2xl text-white"></i>
          <h1 className="text-xl font-semibold">ASTRO-DETECT</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-10 flex-1 flex flex-col md:flex-row items-center justify-center relative z-10">
        <div className={`md:w-1/2 text-center md:text-left mb-8 md:mb-0 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            <div className="space-y-2">
              <div className="overflow-hidden">
                <span className={`inline-block transition-transform duration-1000 delay-300 ${isLoaded ? 'translate-y-0' : 'translate-y-full'}`}>
                  Advanced
                </span>
              </div>
              <div className="overflow-hidden">
                <span className={`inline-block bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 transition-transform duration-1000 delay-500 ${isLoaded ? 'translate-y-0' : 'translate-y-full'}`}>
                  Space Station
                </span>
              </div>
              <div className="overflow-hidden">
                <span className={`inline-block transition-transform duration-1000 delay-700 ${isLoaded ? 'translate-y-0' : 'translate-y-full'}`}>
                  Object Detection
                </span>
              </div>
            </div>
          </h1>
          <p className={`text-lg text-slate-300 mb-8 max-w-xl transition-all duration-1000 delay-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
            AI-powered YOLOv8 detection system for space environments. 
            Identify and track critical equipment in real-time for enhanced operational safety.
          </p>
          <div className={`transition-all duration-1000 delay-1300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
            <Link href="/detect">
              <Button className="bg-blue-600 hover:bg-blue-500 text-white py-3 px-8 rounded-md text-lg shadow-lg hover:shadow-blue-500/30 transition-all duration-300 transform hover:-translate-y-1">
                Launch Detection System
              </Button>
            </Link>
          </div>
        </div>
        
        <div className={`md:w-1/2 flex justify-center transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <div className="relative w-full max-w-md">
            {/* Decorative elements */}
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-500 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-500 rounded-full filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: "1s"}}></div>
            
            <div className="bg-slate-800 bg-opacity-50 backdrop-blur-sm border border-slate-700 rounded-lg p-6 relative z-10 space-y-4">
              <div className="text-lg font-semibold text-white mb-2">System Capabilities</div>
              <ul className="space-y-3 text-slate-300">
                <li className={`flex items-start transition-all duration-300 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`} style={{transitionDelay: '800ms'}}>
                  <i className="ri-check-line text-blue-400 mr-2 mt-1"></i>
                  <span>Advanced computer vision technology</span>
                </li>
                <li className={`flex items-start transition-all duration-300 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`} style={{transitionDelay: '1000ms'}}>
                  <i className="ri-check-line text-blue-400 mr-2 mt-1"></i>
                  <span>Detects critical equipment: Toolboxes, Oxygen Tanks, Fire Extinguishers</span>
                </li>
                <li className={`flex items-start transition-all duration-300 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`} style={{transitionDelay: '1200ms'}}>
                  <i className="ri-check-line text-blue-400 mr-2 mt-1"></i>
                  <span>Real-time detection via webcam or uploaded images</span>
                </li>
                <li className={`flex items-start transition-all duration-300 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`} style={{transitionDelay: '1400ms'}}>
                  <i className="ri-check-line text-blue-400 mr-2 mt-1"></i>
                  <span>Performance metrics with detailed statistics</span>
                </li>
                <li className={`flex items-start transition-all duration-300 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`} style={{transitionDelay: '1600ms'}}>
                  <i className="ri-check-line text-blue-400 mr-2 mt-1"></i>
                  <span>Optimized for varying lighting and occlusion conditions</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Feature Section */}
      <div className={`bg-slate-900 bg-opacity-60 backdrop-blur-sm py-16 relative z-10 transition-all duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-10 text-center">Advanced AI Technology</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-800 bg-opacity-50 p-6 rounded-lg transform transition-all duration-500 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/10">
                <div className="text-blue-400 text-3xl mb-4 flex justify-center">
                  <i className="ri-ai-generate"></i>
                </div>
                <h3 className="text-lg font-semibold text-white mb-3 text-center">Advanced Detection</h3>
                <p className="text-slate-300 text-sm">
                  High-precision object detection powered by YOLOv8, capable of identifying critical equipment in challenging environments.
                </p>
              </div>
              <div className="bg-slate-800 bg-opacity-50 p-6 rounded-lg transform transition-all duration-500 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/10">
                <div className="text-purple-400 text-3xl mb-4 flex justify-center">
                  <i className="ri-eye-line"></i>
                </div>
                <h3 className="text-lg font-semibold text-white mb-3 text-center">Real-time Monitoring</h3>
                <p className="text-slate-300 text-sm">
                  Continuous monitoring through webcam feed or image uploads ensures consistent equipment tracking and safety verification.
                </p>
              </div>
              <div className="bg-slate-800 bg-opacity-50 p-6 rounded-lg transform transition-all duration-500 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/10">
                <div className="text-cyan-400 text-3xl mb-4 flex justify-center">
                  <i className="ri-dashboard-3-line"></i>
                </div>
                <h3 className="text-lg font-semibold text-white mb-3 text-center">Detailed Analytics</h3>
                <p className="text-slate-300 text-sm">
                  Comprehensive metrics and statistics help optimize detection accuracy and monitor system performance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 bg-opacity-80 backdrop-blur-sm text-slate-400 text-sm p-4 text-center border-t border-slate-800 relative z-10">
        <p>ASTRO-DETECT • Advanced Space Station Object Detection System</p>
      </footer>

      {/* CSS for star twinkling animation added via useEffect */}
    </div>
  );
};

export default Landing;