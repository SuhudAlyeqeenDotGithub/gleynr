import { Layers, Network, Sparkles, Sprout } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const PLAN_ICONS: Record<string, LucideIcon> = {
  "Gleynr Free": Sprout,
  "Gleynr Essential": Layers,
  "Gleynr Connect": Network,
  "Gleynr Custom": Sparkles,
};

export const getPlanIcon = (name: string) => PLAN_ICONS[name] ?? Layers;
