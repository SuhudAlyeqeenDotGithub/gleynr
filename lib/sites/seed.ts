import type { Area, GenderGroup } from "@/lib/schemaAndTypes/zod/area";
import type { Event } from "@/lib/schemaAndTypes/zod/event";
import type { Floor } from "@/lib/schemaAndTypes/zod/floor";
import type { SiteRecord, TokenTransaction } from "./types";
import { LOCATION_PRESETS, TOKEN_PRICE } from "./constants";

const AREA_BLUEPRINTS: {
  name: string;
  type: string;
  genderGroup: GenderGroup;
}[] = [
  { name: "Gents washroom", type: "Washroom", genderGroup: "Gents" },
  { name: "Ladies washroom", type: "Washroom", genderGroup: "Ladies" },
  { name: "Accessible washroom", type: "Washroom", genderGroup: "Accessible" },
  { name: "Kitchen", type: "Kitchen", genderGroup: "Unisex" },
];

const EVENTS_PER_AREA = 18;
const BASE_TIME = Date.UTC(2026, 9, 1, 7, 0, 0);

const buildEvents = (areaId: string, seed: number): Event[] => {
  let state = seed;
  const next = () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
  return Array.from({ length: EVENTS_PER_AREA }, (_, index) => ({
    timestamp: new Date(
      BASE_TIME + index * 47 * 60_000 + Math.floor(next() * 20) * 60_000,
    ),
    type: index % 2 === 0 ? "entry" : "exit",
    areaId,
  }));
};

const buildFloors = (prefix: string, names: string[]): Floor[] =>
  names.map((name, floorIndex) => {
    const areas: Area[] = AREA_BLUEPRINTS.map((blueprint, areaIndex) => {
      const id = `${prefix}-a${floorIndex + 1}${areaIndex + 1}`;
      return {
        id,
        ...blueprint,
        events: buildEvents(id, (floorIndex + 1) * 97 + areaIndex * 13 + 7),
      };
    });
    return { id: `${prefix}-f${floorIndex + 1}`, name, areas };
  });

const location = (label: string) => {
  const preset = LOCATION_PRESETS.find((item) => item.label === label);
  return { location: label, coordinates: preset!.coordinates };
};

export const createSeedSites = (): SiteRecord[] => [
  {
    id: "site-northstar",
    name: "Northstar HQ",
    ...location("London, UK"),
    status: "Active",
    floors: buildFloors("ns", [
      "Ground floor",
      "Level 1",
      "Level 2",
      "Level 3",
    ]),
  },
  {
    id: "site-harbour",
    name: "Harbour Exchange",
    ...location("Singapore, SG"),
    status: "Active",
    floors: buildFloors("hx", ["Level 1", "Level 2", "Level 3"]),
  },
  {
    id: "site-riverside",
    name: "Riverside Campus",
    ...location("Austin, US"),
    status: "Paused",
    floors: buildFloors("rc", ["Ground floor", "Level 1"]),
  },
];

export const createSeedTransactions = (): TokenTransaction[] => [
  {
    id: "txn-1001",
    reference: "GLY-1001",
    quantity: 3,
    pricePerToken: TOKEN_PRICE,
    total: 3 * TOKEN_PRICE,
    purchasedAt: new Date(Date.UTC(2026, 7, 12, 9, 30)),
  },
  {
    id: "txn-1002",
    reference: "GLY-1002",
    quantity: 2,
    pricePerToken: TOKEN_PRICE,
    total: 2 * TOKEN_PRICE,
    purchasedAt: new Date(Date.UTC(2026, 8, 20, 14, 5)),
  },
];
