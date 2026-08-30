import React from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowRight, Activity, MapPin } from 'lucide-react';

export const ODMatrixTable: React.FC = () => {
  const { odMatrix, cityZones } = useApp();

  return (
    <div className="bg-white border border-gray-200 rounded p-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-3 border-b border-gray-200">
        <div>
          <h3 className="text-sm font-bold text-gray-900">
            Origin-destination (OD) trip matrix
          </h3>
          <p className="text-xs text-gray-500">
            Daily vehicular trips between major city sectors (calculated from ANPR multi-camera re-identifications)
          </p>
        </div>
        <div className="mt-2 sm:mt-0 flex items-center space-x-2 text-xs text-gray-600 bg-gray-50 px-2.5 py-1 border border-gray-200 rounded">
          <Activity className="w-3.5 h-3.5 text-[#378ADD]" />
          <span>Sector re-identification rate: <strong>91.4%</strong></span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="bg-gray-100/80 text-gray-700 font-semibold border-b border-gray-300">
              <th className="p-2.5 border-r border-gray-200 font-medium">
                <span className="text-[11px] text-gray-500 uppercase tracking-wider block">Origin ↓ / Dest →</span>
              </th>
              {odMatrix.zones.map(zone => (
                <th key={zone} className="p-2.5 text-center border-r border-gray-200 last:border-r-0 font-medium">
                  {zone}
                </th>
              ))}
              <th className="p-2.5 text-right font-medium text-gray-900 bg-gray-100">
                Total outbound
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {odMatrix.zones.map(origin => {
              let originTotal = 0;
              return (
                <tr key={origin} className="hover:bg-gray-50 transition-colors">
                  <td className="p-2.5 font-bold text-gray-900 bg-gray-50/70 border-r border-gray-200 flex items-center space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#378ADD]" />
                    <span>{origin}</span>
                  </td>
                  {odMatrix.zones.map(dest => {
                    const count = odMatrix.matrix[origin]?.[dest];
                    if (count) originTotal += count;
                    const isDiagonal = origin === dest;
                    
                    return (
                      <td
                        key={dest}
                        className={`p-2.5 text-center font-mono border-r border-gray-200 last:border-r-0 ${
                          isDiagonal
                            ? 'text-gray-300 bg-gray-50'
                            : count && count > 1000
                            ? 'text-gray-900 font-bold bg-blue-50/40'
                            : 'text-gray-700'
                        }`}
                      >
                        {isDiagonal ? '—' : count ? count.toLocaleString('en-IN') : '0'}
                      </td>
                    );
                  })}
                  <td className="p-2.5 text-right font-mono font-bold text-gray-900 bg-gray-50/50">
                    {originTotal.toLocaleString('en-IN')}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="bg-gray-100 font-bold border-t-2 border-gray-300 text-gray-900">
              <td className="p-2.5 border-r border-gray-200">Total inbound</td>
              {odMatrix.zones.map(dest => {
                const totalInbound = odMatrix.zones.reduce((sum, origin) => {
                  const val = odMatrix.matrix[origin]?.[dest];
                  return sum + (val || 0);
                }, 0);
                return (
                  <td key={dest} className="p-2.5 text-center font-mono border-r border-gray-200 last:border-r-0">
                    {totalInbound.toLocaleString('en-IN')}
                  </td>
                );
              })}
              <td className="p-2.5 text-right font-mono text-[#378ADD]">
                {Object.values(odMatrix.matrix)
                  .flatMap(row => Object.values(row))
                  .filter((v): v is number => typeof v === 'number')
                  .reduce((a, b) => a + b, 0)
                  .toLocaleString('en-IN')}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Sector insights */}
      <div className="mt-4 pt-3 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <div className="p-2.5 bg-gray-50 border border-gray-200 rounded">
          <div className="text-gray-500 text-[11px]">Primary corridor</div>
          <div className="font-semibold text-gray-900 flex items-center space-x-1 mt-0.5">
            <span>Hazratganj</span>
            <ArrowRight className="w-3 h-3 text-[#378ADD]" />
            <span>Gomti Nagar</span>
          </div>
          <div className="text-[11px] text-gray-600 mt-1">1,420 trips/day (Peak: 09:00 - 11:30)</div>
        </div>

        <div className="p-2.5 bg-gray-50 border border-gray-200 rounded">
          <div className="text-gray-500 text-[11px]">Transit hub flow</div>
          <div className="font-semibold text-gray-900 flex items-center space-x-1 mt-0.5">
            <span>Alambagh</span>
            <ArrowRight className="w-3 h-3 text-[#378ADD]" />
            <span>Hazratganj</span>
          </div>
          <div className="text-[11px] text-gray-600 mt-1">1,050 trips/day (Commercial buses + private)</div>
        </div>

        <div className="p-2.5 bg-gray-50 border border-gray-200 rounded">
          <div className="text-gray-500 text-[11px]">Average inter-zone transit time</div>
          <div className="font-semibold text-gray-900 mt-0.5 font-mono">18.4 minutes</div>
          <div className="text-[11px] text-emerald-700 mt-1">-3.2 min compared to manual corridors</div>
        </div>
      </div>
    </div>
  );
};
