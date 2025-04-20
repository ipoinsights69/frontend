import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import useIPOData from '@/lib/hooks/useIPOData';

const IPOCompareWidget: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIPOs, setSelectedIPOs] = useState<string[]>([]);
  const router = useRouter();
  
  const { results, loading } = useIPOData.useSearchIPOs(searchTerm);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const toggleIPOSelection = (ipoId: string) => {
    if (selectedIPOs.includes(ipoId)) {
      setSelectedIPOs(selectedIPOs.filter(id => id !== ipoId));
    } else {
      // Limit to max 3 selections
      if (selectedIPOs.length < 3) {
        setSelectedIPOs([...selectedIPOs, ipoId]);
      }
    }
  };
  
  const handleCompare = () => {
    if (selectedIPOs.length > 1) {
      router.push(`/compare?ids=${selectedIPOs.join(',')}`);
    }
  };

  return (
    <div className="text-white">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold mb-2">Compare IPOs</h3>
          <p className="text-indigo-100">Select up to 3 IPOs to compare side by side</p>
        </div>
        <button
          onClick={handleCompare}
          disabled={selectedIPOs.length < 2}
          className={`mt-4 md:mt-0 px-6 py-2 rounded-md ${
            selectedIPOs.length < 2
              ? 'bg-indigo-300 cursor-not-allowed'
              : 'bg-white text-indigo-600 hover:bg-indigo-50'
          } transition font-medium`}
        >
          Compare {selectedIPOs.length > 0 ? `(${selectedIPOs.length})` : ''}
        </button>
      </div>
      
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search for IPOs to compare..."
          className="w-full bg-indigo-600/50 border border-indigo-400 rounded-md px-4 py-3 text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-white"
          value={searchTerm}
          onChange={handleSearch}
        />
        {loading && (
          <div className="absolute right-3 top-3">
            <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
          </div>
        )}
      </div>
      
      {searchTerm && results.length > 0 && (
        <div className="bg-indigo-600/50 border border-indigo-400 rounded-md p-3 mb-4 max-h-60 overflow-y-auto">
          {results.slice(0, 5).map(ipo => (
            <div
              key={ipo.ipo_id}
              className={`flex items-center p-2 rounded-md cursor-pointer mb-1 ${
                selectedIPOs.includes(ipo.ipo_id)
                  ? 'bg-indigo-700/70'
                  : 'hover:bg-indigo-700/50'
              }`}
              onClick={() => toggleIPOSelection(ipo.ipo_id)}
            >
              <div className={`w-5 h-5 mr-3 flex-shrink-0 border rounded-sm ${
                selectedIPOs.includes(ipo.ipo_id)
                  ? 'bg-white border-white flex items-center justify-center'
                  : 'border-indigo-300'
              }`}>
                {selectedIPOs.includes(ipo.ipo_id) && (
                  <svg className="w-3 h-3 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{ipo.company_name || ipo.ipo_name}</p>
                <p className="text-xs text-indigo-200">
                  {ipo.year} • {ipo.status} • {ipo.issue_price}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {searchTerm && results.length === 0 && !loading && (
        <div className="text-center py-4">
          <p className="text-indigo-200">No IPOs found matching "{searchTerm}"</p>
        </div>
      )}
      
      {selectedIPOs.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm uppercase tracking-wide mb-2 text-indigo-200">Selected for comparison</h4>
          <div className="flex flex-wrap gap-2">
            {selectedIPOs.map(ipoId => {
              const ipo = results.find(r => r.ipo_id === ipoId);
              return (
                <div
                  key={ipoId}
                  className="bg-indigo-700/70 px-3 py-1.5 rounded-full flex items-center"
                >
                  <span className="text-sm mr-2">{ipo?.company_name || ipo?.ipo_name || ipoId}</span>
                  <button
                    className="text-indigo-300 hover:text-white"
                    onClick={() => toggleIPOSelection(ipoId)}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default IPOCompareWidget; 