import { z } from "zod";
import { tabPermissionSettings } from "./accessAndPermission/defaultSettings";

// permission schema and type
export const permissionObject = z.object({
  permission: z.string(),
  hasAccess: z.boolean(),
});

export type Permission = z.infer<typeof permissionObject>;

export const recordPermissionSchema = z.object({
  recordId: z.string(),
  permissions: z.array(permissionObject),
});

export type RecordPermission = z.infer<typeof recordPermissionSchema>;

// tab schema and type
export const tabSchema = z.object({
  displayText: z.string().optional(),
  tab: z.enum(Object.keys(tabPermissionSettings)),
  hasAccess: z.boolean(),
  recordLevelPermissions: z.array(recordPermissionSchema),
  standalonePermissions: z.array(permissionObject),
});
export type Tab = z.infer<typeof tabSchema>;

// user schema and type
export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  uid: z.string().nullable().optional(),
  username: z.string().nullable().optional(),
  status: z.enum(["Active", "Inactive"]),
  accountType: z.enum(["Service", "User", "Organization"]),
  accessAndPermissions: z.object({
    tabAccess: z.array(tabSchema),
  }),
  createdAt: z.date(),
  invitationStatus: z.enum(["Not invited", "Pending", "Accepted"]),
});
export type User = z.infer<typeof userSchema>;
