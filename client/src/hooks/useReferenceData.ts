import { useState, useEffect } from 'react';
import {
  fetchBases,
  fetchEnvironments,
  fetchNetworks,
  fetchCenters,
  fetchBranches,
  fetchLocations,
} from '../api/apiService';
import type { ReferenceItem, BranchItem, LocationItem } from '../api/types';

interface ReferenceData {
  bases: ReferenceItem[];
  environments: ReferenceItem[];
  networks: ReferenceItem[];
  centers: ReferenceItem[];
  branches: BranchItem[];
  locations: LocationItem[];
  isLoading: boolean;
  error: string | null;
}

export function useReferenceData(): ReferenceData {
  const [bases, setBases] = useState<ReferenceItem[]>([]);
  const [environments, setEnvironments] = useState<ReferenceItem[]>([]);
  const [networks, setNetworks] = useState<ReferenceItem[]>([]);
  const [centers, setCenters] = useState<ReferenceItem[]>([]);
  const [branches, setBranches] = useState<BranchItem[]>([]);
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [b, e, n, c, br, loc] = await Promise.all([
          fetchBases(),
          fetchEnvironments(),
          fetchNetworks(),
          fetchCenters(),
          fetchBranches(),
          fetchLocations(),
        ]);
        if (!cancelled) {
          setBases(b);
          setEnvironments(e);
          setNetworks(n);
          setCenters(c);
          setBranches(br);
          setLocations(loc);
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err.message ?? 'Failed to load reference data');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  return { bases, environments, networks, centers, branches, locations, isLoading, error };
}
