import type { GenderGroup } from "@/lib/schemaAndTypes/zod/area";
import type { ImportFormat, ImportLevel, LocationPreset } from "./types";

export const TOKEN_PRICE = 49;
export const MAX_TOKEN_QUANTITY = 25;

export const AREA_TYPES = [
  "Washroom",
  "Lobby",
  "Meeting room",
  "Open office",
  "Kitchen",
  "Prayer room",
  "Corridor",
  "Other",
];

export const GENDER_GROUPS: GenderGroup[] = [
  "Gents",
  "Ladies",
  "Unisex",
  "Accessible",
  "Other",
  "Unknown",
];

export const LOCATION_PRESETS: LocationPreset[] = [
  { label: "London, UK", coordinates: { lat: 51.51, lng: -0.12 } },
  { label: "Berlin, DE", coordinates: { lat: 52.52, lng: 13.4 } },
  { label: "Dubai, AE", coordinates: { lat: 25.2, lng: 55.27 } },
  { label: "Mumbai, IN", coordinates: { lat: 19.08, lng: 72.88 } },
  { label: "Singapore, SG", coordinates: { lat: 1.35, lng: 103.82 } },
  { label: "Tokyo, JP", coordinates: { lat: 35.68, lng: 139.69 } },
  { label: "Sydney, AU", coordinates: { lat: -33.87, lng: 151.21 } },
  { label: "Cape Town, ZA", coordinates: { lat: -33.92, lng: 18.42 } },
  { label: "São Paulo, BR", coordinates: { lat: -23.55, lng: -46.63 } },
  { label: "New York, US", coordinates: { lat: 40.71, lng: -74.0 } },
  { label: "Austin, US", coordinates: { lat: 30.27, lng: -97.74 } },
  { label: "Toronto, CA", coordinates: { lat: 43.65, lng: -79.38 } },
];

export const IMPORT_LEVELS: {
  value: ImportLevel;
  label: string;
  description: string;
  required: string[];
  optional: string[];
}[] = [
  {
    value: "site",
    label: "Site level",
    description: "Events for any floor or area in this site.",
    required: ["timestamp", "type", "floorId", "areaId"],
    optional: ["siteId"],
  },
  {
    value: "floor",
    label: "Floor level",
    description: "Events for areas on one selected floor.",
    required: ["timestamp", "type", "areaId"],
    optional: [],
  },
  {
    value: "area",
    label: "Area level",
    description: "Events for one selected area.",
    required: ["timestamp", "type"],
    optional: [],
  },
];

export const IMPORT_FORMATS: { value: ImportFormat; label: string }[] = [
  { value: "csv", label: "CSV" },
  { value: "json", label: "JSON" },
];

export const IMPORT_MAX_VISIBLE_ISSUES = 25;
