import {
  BarChart3,
  Building2,
  CreditCard,
  Database,
  FileUp,
  Gauge,
  Globe2,
  LayoutDashboard,
  Package,
  ShieldCheck,
  Users,
  WalletCards,
} from "lucide-react";
import type { NavigationItem, PageDefinition, Site } from "./types";

export const WORKSPACE_NAVIGATION: NavigationItem[] = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Sites", icon: Building2 },
  { label: "Data imports", icon: FileUp },
  { label: "Users & permissions", icon: Users },
];

export const SETTINGS_NAVIGATION: NavigationItem[] = [
  { label: "Analytics settings", icon: BarChart3 },
  { label: "Organisation", icon: Globe2 },
  { label: "My account", icon: ShieldCheck },
];

export const BILLING_NAVIGATION: NavigationItem[] = [
  { label: "Overview", icon: WalletCards },
  { label: "Plans & subscription", icon: Package },
  { label: "Usage & entitlements", icon: Gauge },
  { label: "Payment methods", icon: CreditCard },
  { label: "Billing history", icon: Database },
];

export const SEEDED_SITES: Site[] = [
  {
    id: 1,
    name: "Northstar HQ",
    location: "London, UK",
    status: "Active",
    visits: 48290,
    floors: 8,
  },
  {
    id: 2,
    name: "Harbour Exchange",
    location: "Singapore, SG",
    status: "Active",
    visits: 31640,
    floors: 5,
  },
  {
    id: 3,
    name: "Riverside Campus",
    location: "Austin, US",
    status: "Paused",
    visits: 18420,
    floors: 3,
  },
];

export const GENERIC_PAGE_CONFIG: Record<string, PageDefinition> = {
  "Data imports": {
    icon: FileUp,
    title: "Data imports",
    description: "Upload, validate, and monitor your event data.",
    action: "New import",
  },
  "Users & permissions": {
    icon: Users,
    title: "Users & permissions",
    description: "Control access to sites and workspace actions.",
    action: "Invite user",
  },
  "Analytics settings": {
    icon: BarChart3,
    title: "Analytics settings",
    description: "Configure how events become meaningful visits.",
    action: "Save changes",
  },
  Organisation: {
    icon: Globe2,
    title: "Organisation settings",
    description: "Manage workspace details and preferences.",
    action: "Save changes",
  },
  "My account": {
    icon: ShieldCheck,
    title: "My account",
    description: "Your profile, security, and notification preferences.",
    action: "Update profile",
  },
  Overview: {
    icon: WalletCards,
    title: "Billing overview",
    description: "Keep your subscription and payment details up to date.",
    action: "Upgrade plan",
  },
  "Plans & subscription": {
    icon: Package,
    title: "Plans & subscription",
    description: "Choose the right plan for your organisation.",
    action: "Change plan",
  },
  "Usage & entitlements": {
    icon: Gauge,
    title: "Usage & entitlements",
    description: "Monitor your usage across the current billing period.",
    action: "View limits",
  },
  "Payment methods": {
    icon: CreditCard,
    title: "Payment methods",
    description: "Manage cards and payment methods for your workspace.",
    action: "Add method",
  },
  "Billing history": {
    icon: Database,
    title: "Billing history & invoices",
    description: "Download invoices and review past charges.",
    action: "Export history",
  },
};

export const COMMAND_ITEMS = [
  "Overview",
  "Sites",
  "Data imports",
  "Users & permissions",
  "Plans & subscription",
];
