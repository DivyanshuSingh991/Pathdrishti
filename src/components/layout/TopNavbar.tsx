import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Shield, Clock, HardDrive, Radio, AlertTriangle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const TopNavbar: React.FC = () => {
  const navigate = useNavigate();
  const { searchQuery, setSearchQuery, setSelectedPlate, vehicles, stats } = useApp();
  const [currentTime, setCurrentTime] = useState<string>('');
  const [showSearchResults, setShowSearchResults] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-IN', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      setCurrentTime(timeString);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const filteredVehicles = searchQuery.trim()
    ? vehicles.filter(v =>
        v.plate.toLowerCase().includes(searchQuery.toLowerCase().trim())
      ).slice(0, 6)
    : [];

  const handleSelectPlate = (plate: string) => {
    setSelectedPlate(plate);
    setSearchQuery(plate);
    setShowSearchResults(false);
    navigate(`/search?plate=${encodeURIComponent(plate)}`);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSelectedPlate(searchQuery.trim().toUpperCase());
      setShowSearchResults(false);
      navigate(`/search?plate=${encodeURIComponent(searchQuery.trim().toUpperCase())}`);
    }
  };

  return (
    <header className="h-14 bg-white border-b border-gray-200 px-4 flex items-center justify-between z-30 sticky top-0">
      {/* Left: Product title & context */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gray-900 text-white flex items-center justify-center font-bold text-xs rounded tracking-wider">
            PD
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-sm tracking-tight text-gray-900">
                PATHDRISHTI <span className="font-normal text-gray-500 text-xs">/ पथदृष्टि</span>
              </span>
            </div>
            <p className="text-[11px] text-gray-500 hidden sm:block leading-none">
              City-wide ANPR surveillance grid · Lucknow Command Center
            </p>
          </div>
        </div>
      </div>

      {/* Middle: Global Plate Search */}
      <div className="relative max-w-md w-full mx-4 hidden md:block">
        <form onSubmit={handleFormSubmit}>
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              id="global-plate-search-input"
              type="text"
              placeholder="Search registration plate (e.g. UP32-KL-5544)..."
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setShowSearchResults(true);
              }}
              onFocus={() => setShowSearchResults(true)}
              className="w-full pl-8 pr-4 py-1.5 text-xs bg-gray-50 border border-gray-300 rounded focus:bg-white focus:outline-none focus:border-[#378ADD] text-gray-900 font-mono"
            />
          </div>
        </form>

        {/* Search Autocomplete Dropdown */}
        {showSearchResults && filteredVehicles.length > 0 && (
          <div
            className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 shadow-md rounded overflow-hidden z-50 text-xs"
            onMouseLeave={() => setShowSearchResults(false)}
          >
            <div className="px-2 py-1 bg-gray-50 text-[10px] text-gray-500 font-medium uppercase tracking-wider border-b border-gray-200">
              Matching registration plates
            </div>
            {filteredVehicles.map(v => (
              <button
                key={v.plate}
                onClick={() => handleSelectPlate(v.plate)}
                className="w-full text-left px-3 py-2 hover:bg-blue-50 flex items-center justify-between border-b border-gray-100 last:border-0"
              >
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-bold text-gray-900">{v.plate}</span>
                  <span className="text-gray-500 text-[11px]">
                    {v.color} {v.vehicleType}
                  </span>
                </div>
                {v.isBlacklisted ? (
                  <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-medium">
                    Blacklist
                  </span>
                ) : v.isClonedSuspect ? (
                  <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-medium">
                    Cloned suspect
                  </span>
                ) : (
                  <span className="text-[10px] text-gray-400">Regular</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right: Operational Status, Live Clock, On-prem Badge */}
      <div className="flex items-center space-x-3 text-xs">
        {/* Active alerts counter badge */}
        {stats.activeAlertsCount > 0 && (
          <button
            onClick={() => navigate('/alerts')}
            className="flex items-center space-x-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 px-2 py-1 rounded transition-colors text-[11px] font-medium"
            title="Active security alerts"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-red-600 animate-pulse" />
            <span>{stats.activeAlertsCount} active alerts</span>
          </button>
        )}

        {/* Live Clock with IST */}
        <div className="hidden lg:flex items-center space-x-1.5 bg-gray-50 border border-gray-200 px-2.5 py-1 rounded text-gray-700 font-mono text-[11px]">
          <Clock className="w-3.5 h-3.5 text-gray-500" />
          <span>{currentTime || '12:00:00'} IST</span>
        </div>

        {/* Security / On-Prem status badge */}
        <div className="flex items-center space-x-1.5 bg-gray-100 border border-gray-200 px-2.5 py-1 rounded text-gray-700 text-[11px]">
          <Shield className="w-3.5 h-3.5 text-gray-600" />
          <span className="font-medium hidden sm:inline">On-prem · Encrypted</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" title="System operational" />
        </div>
      </div>
    </header>
  );
};
