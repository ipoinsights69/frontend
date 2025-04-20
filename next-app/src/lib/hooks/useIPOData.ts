'use client';

import { useState, useEffect } from 'react';
import ipoDataService from '../client/ipoDataService';
import {
  IPOSummary,
  IPODetailedData,
  IPOStats,
  YearCount,
  IPOYearlyStats // Added import
} from '../server/ipoDataService';

// Hook for getting all IPO summaries
export const useAllIPOs = () => {
  const [ipos, setIpos] = useState<IPOSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await ipoDataService.getAllIPOsSummary();
        setIpos(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch IPO data'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { ipos, loading, error };
};

// Hook for getting IPO details by ID
export const useIPODetails = (ipoId: string) => {
  const [ipo, setIpo] = useState<IPODetailedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await ipoDataService.getIPODetailById(ipoId);
        setIpo(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error(`Failed to fetch IPO details for ${ipoId}`));
      } finally {
        setLoading(false);
      }
    };

    if (ipoId) {
      fetchData();
    }
  }, [ipoId]);

  return { ipo, loading, error };
};

// Hook for getting IPOs by status
export const useIPOsByStatus = (status: string) => {
  const [ipos, setIpos] = useState<IPOSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await ipoDataService.getIPOsByStatus(status);
        setIpos(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error(`Failed to fetch ${status} IPOs`));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [status]);

  return { ipos, loading, error };
};

// Hook for getting upcoming IPOs
export const useUpcomingIPOs = () => {
  const { ipos, loading, error } = useIPOsByStatus('upcoming');
  return { upcomingIpos: ipos, loading, error };
};

// Hook for getting open IPOs
export const useOpenIPOs = () => {
  const { ipos, loading, error } = useIPOsByStatus('open');
  return { openIpos: ipos, loading, error };
};

// Hook for getting best performing IPOs
export const useBestPerformingIPOs = () => {
  const [ipos, setIpos] = useState<Partial<IPOSummary>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await ipoDataService.getBestPerformingIPOs();
        setIpos(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch best performing IPOs'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { bestPerformingIpos: ipos, loading, error };
};

// Hook for getting worst performing IPOs
export const useWorstPerformingIPOs = () => {
  const [ipos, setIpos] = useState<Partial<IPOSummary>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await ipoDataService.getWorstPerformingIPOs();
        setIpos(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch worst performing IPOs'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { worstPerformingIpos: ipos, loading, error };
};

// Hook for getting IPO stats
export const useIPOStats = () => {
  const [stats, setStats] = useState<IPOStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await ipoDataService.getIPOStats();
        setStats(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch IPO statistics'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { stats, loading, error };
};

// Hook for getting IPO years
export const useIPOYears = () => {
  const [years, setYears] = useState<YearCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await ipoDataService.getIPOYears();
        setYears(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch IPO years'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { years, loading, error };
};

// Hook for searching IPOs
export const useSearchIPOs = (query: string) => {
  const [results, setResults] = useState<IPOSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      try {
        setLoading(true);
        const data = await ipoDataService.searchIPOs(query);
        setResults(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to search IPOs'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query]);

  return { results, loading, error };
};

// Hook for filtering IPOs
export const useFilterIPOs = (filters: {
  status?: string;
  year?: number;
  minIssuePrice?: number;
  maxIssuePrice?: number;
  minSubscription?: number;
  minListingGains?: number;
  maxListingGains?: number;
}) => {
  const [filteredResults, setFilteredResults] = useState<IPOSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await ipoDataService.filterIPOs(filters);
        setFilteredResults(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to filter IPOs'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters]);

  return { filteredResults, loading, error };
};

// Hook for getting IPO stats by year
export const useIPOYearlyStats = (year: number) => {
  const [yearlyStats, setYearlyStats] = useState<IPOYearlyStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (isNaN(year) || year <= 0) {
         setError(new Error('Invalid year provided'));
         setLoading(false);
         return;
      }
      try {
        setLoading(true);
        const data = await ipoDataService.getIPOStatsByYear(year);
        setYearlyStats(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error(`Failed to fetch stats for year ${year}`));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [year]);

  return { yearlyStats, loading, error };
};


// Export all hooks as a single object for convenience
const useIPOData = {
  useAllIPOs,
  useIPODetails,
  useIPOsByStatus,
  useUpcomingIPOs,
  useOpenIPOs,
  useBestPerformingIPOs,
  useWorstPerformingIPOs,
  useIPOStats,
  useIPOYears,
  useSearchIPOs,
  useFilterIPOs,
  useIPOYearlyStats // Add the new hook to the export
};

export default useIPOData;
