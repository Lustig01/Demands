import { useState, useEffect } from 'react';
import {
  fetchBases,
  fetchEnvironments,
  fetchNetworks,
  fetchCenters,
  fetchBranches,
  fetchLocations,
  fetchServices,
  fetchResources,
} from '../api/apiService';
import type { ReferenceItem, BranchItem, LocationItem, ResourceItem } from '../api/types';

let globalFetchPromise: Promise<
  [
    ReferenceItem[],
    ReferenceItem[],
    ReferenceItem[],
    ReferenceItem[],
    BranchItem[],
    LocationItem[],
    ReferenceItem[],
    ResourceItem[]
  ]
> | null = null;

interface ReferenceData {
  bases: ReferenceItem[];
  environments: ReferenceItem[];
  networks: ReferenceItem[];
  centers: ReferenceItem[];
  branches: BranchItem[];
  locations: LocationItem[];
  services: ReferenceItem[];
  resources: ResourceItem[];
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
  const [services, setServices] = useState<ReferenceItem[]>([]);
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (globalFetchPromise) {
        try {
          const [b, e, n, c, br, loc, s, r] = await globalFetchPromise;
          if (!cancelled) {
            setBases(b);
            setEnvironments(e);
            setNetworks(n);
            setCenters(c);
            setBranches(br);
            setLocations(loc);
            setServices(s);
            setResources(r);
            setIsLoading(false);
          }
        } catch (err: any) {
          if (!cancelled) {
            setError(err.message ?? 'Failed to load reference data');
            setIsLoading(false);
          }
        }
        return;
      }

      globalFetchPromise = Promise.all([
        fetchBases(),
        fetchEnvironments(),
        fetchNetworks(),
        fetchCenters(),
        fetchBranches(),
        fetchLocations(),
        fetchServices(),
        fetchResources(),
      ]);

      try {
        const [b, e, n, c, br, loc, s, r] = await globalFetchPromise;
        if (!cancelled) {
          setBases(b);
          setEnvironments(e);
          setNetworks(n);
          setCenters(c);
          setBranches(br);
          setLocations(loc);
          setServices(s);
          setResources(r);
        }
      } catch (err: any) {
        globalFetchPromise = null; // Reset on error so we can retry
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

  return { bases, environments, networks, centers, branches, locations, services, resources, isLoading, error };
}
