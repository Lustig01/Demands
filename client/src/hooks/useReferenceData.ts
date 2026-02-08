import { useState, useEffect } from 'react';
import {
  fetchBases,
  fetchEnvironments,
  fetchNetworks,
  fetchCenters,
  fetchBranches,
  fetchSections,
  fetchLocations,
  fetchServices,
  fetchResources,
  fetchProjectKinds,
  fetchEmergencyOptions,
} from '../api/apiService';
import type { ReferenceItem, BranchItem, SectionItem, LocationItem, ResourceItem } from '../api/types';

let globalFetchPromise: Promise<
  [
    ReferenceItem[],
    ReferenceItem[],
    ReferenceItem[],
    ReferenceItem[],
    BranchItem[],
    SectionItem[],
    LocationItem[],
    ReferenceItem[],
    ResourceItem[],
    ReferenceItem[],
    ReferenceItem[]
  ]
> | null = null;

interface ReferenceData {
  bases: ReferenceItem[];
  environments: ReferenceItem[];
  networks: ReferenceItem[];
  centers: ReferenceItem[];
  branches: BranchItem[];
  sections: SectionItem[];
  locations: LocationItem[];
  services: ReferenceItem[];
  resources: ResourceItem[];
  projectKinds: ReferenceItem[];
  emergencyOptions: ReferenceItem[];
  isLoading: boolean;
  error: string | null;
}

export function useReferenceData(): ReferenceData {
  const [bases, setBases] = useState<ReferenceItem[]>([]);
  const [environments, setEnvironments] = useState<ReferenceItem[]>([]);
  const [networks, setNetworks] = useState<ReferenceItem[]>([]);
  const [centers, setCenters] = useState<ReferenceItem[]>([]);
  const [branches, setBranches] = useState<BranchItem[]>([]);
  const [sections, setSections] = useState<SectionItem[]>([]);
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [services, setServices] = useState<ReferenceItem[]>([]);
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [projectKinds, setProjectKinds] = useState<ReferenceItem[]>([]);
  const [emergencyOptions, setEmergencyOptions] = useState<ReferenceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (globalFetchPromise) {
        try {
          const [b, e, n, c, br, sec, loc, s, r, pk, eo] = await globalFetchPromise;
          if (!cancelled) {
            setBases(b);
            setEnvironments(e);
            setNetworks(n);
            setCenters(c);
            setBranches(br);
            setSections(sec);
            setLocations(loc);
            setServices(s);
            setResources(r);
            setProjectKinds(pk);
            setEmergencyOptions(eo);
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
        fetchSections(),
        fetchLocations(),
        fetchServices(),
        fetchResources(),
        fetchProjectKinds(),
        fetchEmergencyOptions(),
      ]);

      try {
        const [b, e, n, c, br, sec, loc, s, r, pk, eo] = await globalFetchPromise;
        if (!cancelled) {
          setBases(b);
          setEnvironments(e);
          setNetworks(n);
          setCenters(c);
          setBranches(br);
          setSections(sec);
          setLocations(loc);
          setServices(s);
          setResources(r);
          setProjectKinds(pk);
          setEmergencyOptions(eo);
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

  return { bases, environments, networks, centers, branches, sections, locations, services, resources, projectKinds, emergencyOptions, isLoading, error };
}
