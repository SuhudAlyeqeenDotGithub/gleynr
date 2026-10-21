import { getDefaultPermissions, tabPermissionSettings } from "@/lib/schemaAndTypes/zod/accessAndPermission/defaultSettings";
import type { Permission, Tab, User } from "@/lib/schemaAndTypes/zod/user";

type TabSeed = {
  access: boolean;
  standalone?: Record<string, boolean>;
  records?: Record<string, Record<string, boolean>>;
};

const makeTab = (key: string, seed: TabSeed): Tab => {
  const definition = tabPermissionSettings[key];
  const applyValues = (names: string[], values: Record<string, boolean> = {}) =>
    getDefaultPermissions(names).map((permission): Permission => ({
      ...permission,
      hasAccess: values[permission.permission] ?? false,
    }));

  return {
    tab: key as Tab["tab"],
    displayText: definition.displayText,
    hasAccess: seed.access,
    standalonePermissions: applyValues(
      definition.standalonePermissions,
      seed.standalone,
    ),
    recordLevelPermissions: Object.entries(seed.records ?? {}).map(
      ([recordId, values]) => ({
        recordId,
        permissions: applyValues(definition.recordLevelPermissions, values),
      }),
    ),
  };
};

const makeUser = (
  input: Pick<User, "id" | "username" | "status" | "accountType" | "createdAt" | "invitationStatus"> & {
    email: string;
    uid?: string;
    tabs: Record<string, TabSeed>;
  },
): User & { email: string } => ({
  id: input.id,
  email: input.email,
  uid: input.uid,
  username: input.username,
  status: input.status,
  accountType: input.accountType,
  createdAt: input.createdAt,
  invitationStatus: input.invitationStatus,
  accessAndPermissions: {
    tabAccess: Object.entries(input.tabs).map(([key, seed]) => makeTab(key, seed)),
  },
});

export const createSeedUsers = (): Array<User & { email: string }> => [
  makeUser({
    id: "usr-organization",
    email: "admin@northstar.example",
    username: "Northstar Admin",
    uid: "auth-org-001",
    status: "Active",
    accountType: "Organization",
    createdAt: new Date("2024-02-12T09:00:00Z"),
    invitationStatus: "Accepted",
    tabs: {},
  }),
  makeUser({
    id: "usr-maya",
    email: "maya.chen@northstar.example",
    username: "Maya Chen",
    uid: "auth-user-018",
    status: "Active",
    accountType: "User",
    createdAt: new Date("2024-06-18T10:20:00Z"),
    invitationStatus: "Accepted",
    tabs: {
      sites: {
        access: true,
        standalone: { "View Site Tokens": true, "Create Sites": false },
        records: {
          "site-northstar": {
            "View Overview": true,
            "View Floors and Areas": true,
            "Manage Floors and Areas": true,
            "Manage Imports": true,
          },
        },
      },
      users: {
        access: true,
        standalone: { "Create Users": true },
        records: {
          "usr-jamie": { "View User": true, "Manage User": true },
        },
      },
    },
  }),
  makeUser({
    id: "usr-jamie",
    email: "jamie.patel@northstar.example",
    username: "Jamie Patel",
    uid: "auth-user-026",
    status: "Active",
    accountType: "User",
    createdAt: new Date("2025-01-09T14:15:00Z"),
    invitationStatus: "Accepted",
    tabs: {
      sites: {
        access: true,
        standalone: { "View Site Tokens": true },
        records: { "site-harbour": { "View Overview": true } },
      },
      users: { access: false },
    },
  }),
  makeUser({
    id: "usr-oliver",
    email: "oliver.reed@northstar.example",
    username: "Oliver Reed",
    status: "Inactive",
    accountType: "User",
    createdAt: new Date("2025-03-27T08:45:00Z"),
    invitationStatus: "Accepted",
    tabs: {
      sites: {
        access: true,
        standalone: { "View Site Tokens": true },
        records: {
          "site-northstar": {
            "View Overview": true,
            "Delete Site": false,
          },
        },
      },
      users: { access: false },
    },
  }),
  makeUser({
    id: "usr-priya",
    email: "priya.nair@northstar.example",
    username: "Priya Nair",
    status: "Active",
    accountType: "User",
    createdAt: new Date("2026-09-15T11:30:00Z"),
    invitationStatus: "Pending",
    tabs: { sites: { access: true, standalone: { "View Site Tokens": true } } },
  }),
  makeUser({
    id: "usr-automation",
    email: "events@northstar.example",
    username: "Event ingestion",
    uid: "auth-service-004",
    status: "Active",
    accountType: "Service",
    createdAt: new Date("2026-10-02T07:05:00Z"),
    invitationStatus: "Accepted",
    tabs: { sites: { access: true, standalone: { "View Site Tokens": true } } },
  }),
];