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
  { label: "Overview", icon: LayoutDashboard, href: "/main/overview" },
  { label: "Sites", icon: Building2, href: "/main/sites" },
  { label: "Data imports", icon: FileUp, href: "/main/data-imports" },
  {
    label: "Users & permissions",
    icon: Users,
    href: "/main/users-permissions",
  },
];

export const SETTINGS_NAVIGATION: NavigationItem[] = [
  {
    label: "Analytics settings",
    icon: BarChart3,
    href: "/main/analytics-settings",
  },
  { label: "Organisation", icon: Globe2, href: "/main/organisation" },
  { label: "My account", icon: ShieldCheck, href: "/main/my-account" },
];

export const BILLING_NAVIGATION: NavigationItem[] = [
  { label: "Overview", icon: WalletCards, href: "/main/billing-overview" },
  {
    label: "Plans & subscription",
    icon: Package,
    href: "/main/plans-subscription",
  },
  {
    label: "Usage & bills",
    icon: Gauge,
    href: "/main/usage-entitlements",
  },
  {
    label: "Payment methods",
    icon: CreditCard,
    href: "/main/payment-methods",
  },
  { label: "Invoices", icon: Database, href: "/main/billing-history" },
];

export const ALL_NAVIGATION = [
  ...WORKSPACE_NAVIGATION,
  ...SETTINGS_NAVIGATION,
  ...BILLING_NAVIGATION,
];

export const getNavigationItemByHref = (href: string) =>
  ALL_NAVIGATION.find((item) => item.href === href);

export const getNavigationHref = (label: string) =>
  ALL_NAVIGATION.find((item) => item.label === label)?.href;

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
  "Usage & bills": {
    icon: Gauge,
    title: "Usage & bills",
    description: "Monitor usage, estimated costs and previous bills.",
    action: "View bills",
  },
  "Payment methods": {
    icon: CreditCard,
    title: "Payment methods",
    description: "Manage cards and payment methods for your workspace.",
    action: "Add method",
  },
  Invoices: {
    icon: Database,
    title: "Invoices",
    description: "Review invoices and payment history.",
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
