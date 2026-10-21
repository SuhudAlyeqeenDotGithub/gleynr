"use client";

import { useCallback, useMemo, useState } from "react";
import type { AreaFormValues } from "@/lib/schemaAndTypes/zod/area";
import type { SiteLevelEvent } from "@/lib/schemaAndTypes/zod/event";
import type { Floor } from "@/lib/schemaAndTypes/zod/floor";
import { TOKEN_PRICE } from "./constants";
import { createSeedSites, createSeedTransactions } from "./seed";
import { makeId, summariseTokens } from "./selectors";
import type {
  ImportRecord,
  LocationPreset,
  SiteRecord,
  SiteStatus,
  TokenTransaction,
} from "./types";
import { LOCATION_PRESETS } from "./constants";

type State = {
  sites: SiteRecord[];
  transactions: TokenTransaction[];
  imports: ImportRecord[];
};

export type CreateSiteResult =
  | { ok: true; site: SiteRecord }
  | { ok: false; reason: "no-tokens" };

export type SiteSettingsInput = {
  name: string;
  location: string;
  status: SiteStatus;
};

const findPreset = (label: string): LocationPreset =>
  LOCATION_PRESETS.find((item) => item.label === label) ?? LOCATION_PRESETS[0];

const mapFloors = (
  site: SiteRecord,
  fn: (floors: Floor[]) => Floor[],
): SiteRecord => ({ ...site, floors: fn(site.floors) });

export const useSitesStore = () => {
  const [state, setState] = useState<State>(() => ({
    sites: createSeedSites(),
    transactions: createSeedTransactions(),
    imports: [],
  }));

  const tokens = useMemo(
    () => summariseTokens(state.transactions, state.sites),
    [state.transactions, state.sites],
  );

  const patchSite = useCallback(
    (siteId: string, fn: (site: SiteRecord) => SiteRecord) =>
      setState((prev) => ({
        ...prev,
        sites: prev.sites.map((site) => (site.id === siteId ? fn(site) : site)),
      })),
    [],
  );

  const purchaseTokens = (quantity: number): TokenTransaction => {
    const transaction: TokenTransaction = {
      id: makeId("txn"),
      reference: `GLY-${Math.floor(1000 + Math.random() * 9000)}`,
      quantity,
      pricePerToken: TOKEN_PRICE,
      total: quantity * TOKEN_PRICE,
      purchasedAt: new Date(),
    };
    setState((prev) => ({
      ...prev,
      transactions: [transaction, ...prev.transactions],
    }));
    return transaction;
  };

  const createSite = (values: {
    name: string;
    location: string;
  }): CreateSiteResult => {
    if (tokens.available < 1) return { ok: false, reason: "no-tokens" };
    const preset = findPreset(values.location);
    const site: SiteRecord = {
      id: makeId("site"),
      name: values.name.trim(),
      location: preset.label,
      coordinates: preset.coordinates,
      status: "Active",
      floors: [],
    };
    // The token is consumed by the site itself: used = sites.length.
    setState((prev) =>
      summariseTokens(prev.transactions, prev.sites).available < 1
        ? prev
        : { ...prev, sites: [...prev.sites, site] },
    );
    return { ok: true, site };
  };

  const updateSite = (siteId: string, values: SiteSettingsInput) => {
    const preset = findPreset(values.location);
    patchSite(siteId, (site) => ({
      ...site,
      name: values.name.trim(),
      status: values.status,
      location: preset.label,
      coordinates: preset.coordinates,
    }));
  };

  const addFloor = (siteId: string, name: string) =>
    patchSite(siteId, (site) =>
      mapFloors(site, (floors) => [
        ...floors,
        { id: makeId("floor"), name: name.trim(), areas: [] },
      ]),
    );

  const updateFloor = (siteId: string, floorId: string, name: string) =>
    patchSite(siteId, (site) =>
      mapFloors(site, (floors) =>
        floors.map((floor) =>
          floor.id === floorId ? { ...floor, name: name.trim() } : floor,
        ),
      ),
    );

  const deleteFloor = (siteId: string, floorId: string) =>
    patchSite(siteId, (site) =>
      mapFloors(site, (floors) =>
        floors.filter((floor) => floor.id !== floorId),
      ),
    );

  const addArea = (siteId: string, floorId: string, values: AreaFormValues) =>
    patchSite(siteId, (site) =>
      mapFloors(site, (floors) =>
        floors.map((floor) =>
          floor.id === floorId
            ? {
                ...floor,
                areas: [
                  ...floor.areas,
                  {
                    id: makeId("area"),
                    ...values,
                    name: values.name.trim(),
                    events: [],
                  },
                ],
              }
            : floor,
        ),
      ),
    );

  const updateArea = (
    siteId: string,
    floorId: string,
    areaId: string,
    values: AreaFormValues,
  ) =>
    patchSite(siteId, (site) =>
      mapFloors(site, (floors) =>
        floors.map((floor) =>
          floor.id === floorId
            ? {
                ...floor,
                areas: floor.areas.map((area) =>
                  area.id === areaId
                    ? { ...area, ...values, name: values.name.trim() }
                    : area,
                ),
              }
            : floor,
        ),
      ),
    );

  const deleteArea = (siteId: string, floorId: string, areaId: string) =>
    patchSite(siteId, (site) =>
      mapFloors(site, (floors) =>
        floors.map((floor) =>
          floor.id === floorId
            ? {
                ...floor,
                areas: floor.areas.filter((area) => area.id !== areaId),
              }
            : floor,
        ),
      ),
    );

  const importEvents = (
    siteId: string,
    events: SiteLevelEvent[],
    meta: Omit<ImportRecord, "id" | "siteId" | "rows" | "importedAt">,
  ) => {
    patchSite(siteId, (site) =>
      mapFloors(site, (floors) =>
        floors.map((floor) => ({
          ...floor,
          areas: floor.areas.map((area) => {
            const added = events
              .filter((event) => event.areaId === area.id)
              .map(({ timestamp, type, areaId }) => ({
                timestamp,
                type,
                areaId,
              }));
            return added.length
              ? { ...area, events: [...area.events, ...added] }
              : area;
          }),
        })),
      ),
    );
    setState((prev) => ({
      ...prev,
      imports: [
        {
          ...meta,
          id: makeId("imp"),
          siteId,
          rows: events.length,
          importedAt: new Date(),
        },
        ...prev.imports,
      ],
    }));
  };

  return {
    sites: state.sites,
    transactions: state.transactions,
    imports: state.imports,
    tokens,
    purchaseTokens,
    createSite,
    updateSite,
    addFloor,
    updateFloor,
    deleteFloor,
    addArea,
    updateArea,
    deleteArea,
    importEvents,
  };
};

export type SitesStore = ReturnType<typeof useSitesStore>;
