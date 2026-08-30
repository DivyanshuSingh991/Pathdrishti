import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Search,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Camera,
  Layers,
  Activity,
  Cpu
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { stats } = useApp();

  const navItems = [
    {
      to: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      to: '/search',
      label: 'Vehicle trajectory',
      icon: Search,
      badge: null
    },
    {
      to: '/alerts',
      label: 'Alerts & violations',
      icon: AlertTriangle,
      badge: stats.activeAlertsCount + stats.activeViolationsCount
    }
  ];

  return (
    <aside
      className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-200 z-20 select-none ${
        isCollapsed ? 'w-14' : 'w-56'
      }`}
    >
      {/* Navigation list */}
      <div className="flex-1 py-3 px-2 space-y-1">
        <div className="px-2 py-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
          {!isCollapsed && 'Navigation'}
        </div>

        {navItems.map(item => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center px-2.5 py-2 rounded text-xs font-medium transition-colors group relative ${
                  isActive
                    ? 'bg-[#378ADD] text-white'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`
              }
              title={isCollapsed ? item.label : undefined}
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'}`} />
                  {!isCollapsed && (
                    <span className="ml-2.5 flex-1 truncate">{item.label}</span>
                  )}
                  {item.badge !== null && item.badge > 0 && (
                    <span
                      className={`ml-auto text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                        isActive
                          ? 'bg-red-600 text-white'
                          : 'bg-red-100 text-red-700 border border-red-200'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* System info / Camera fleet health */}
      {!isCollapsed ? (
        <div className="p-3 border-t border-gray-200 bg-gray-50 text-[11px] space-y-2">
          <div className="flex items-center justify-between text-gray-600">
            <span className="flex items-center space-x-1.5">
              <Camera className="w-3.5 h-3.5 text-gray-500" />
              <span>Camera grid</span>
            </span>
            <span className="font-mono font-medium text-gray-900">
              {stats.activeCamerasCount}/{stats.totalCamerasCount} live
            </span>
          </div>

          <div className="flex items-center justify-between text-gray-600">
            <span className="flex items-center space-x-1.5">
              <Cpu className="w-3.5 h-3.5 text-gray-500" />
              <span>ANPR engine</span>
            </span>
            <span className="text-emerald-700 font-medium">Active (98.4%)</span>
          </div>

          <div className="pt-1 text-[10px] text-gray-400 border-t border-gray-200">
            Bharat Electronics Ltd · v2.4.1
          </div>
        </div>
      ) : (
        <div className="p-2 border-t border-gray-200 flex justify-center text-gray-400">
          <Activity className="w-4 h-4 text-emerald-600" />
        </div>
      )}

      {/* Collapse Toggle Button */}
      <div className="p-2 border-t border-gray-200 flex justify-end">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded text-xs"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <div className="flex items-center justify-between w-full px-2">
              <span className="text-[11px] text-gray-500">Collapse menu</span>
              <ChevronLeft className="w-4 h-4" />
            </div>
          )}
        </button>
      </div>
    </aside>
  );
};
