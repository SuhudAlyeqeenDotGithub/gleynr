import type { Dispatch, SetStateAction } from "react";
import type { LucideIcon } from "lucide-react";

export type SiteStatus = "Active" | "Paused";

export type Site = {
  id: number;
  name: string;
  location: string;
  status: SiteStatus;
  visits: number;
  floors: number;
};

export type ModalType = "site" | "import" | "user" | "plan" | "invoice" | null;

export type NavigationItem = {
  label: string;
  icon: LucideIcon;
  href: string;
};

export type PageDefinition = {
  icon: LucideIcon;
  title: string;
  description: string;
  action: string;
};

export type StateSetter<T> = Dispatch<SetStateAction<T>>;
