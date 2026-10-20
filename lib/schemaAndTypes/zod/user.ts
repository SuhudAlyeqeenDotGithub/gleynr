import {z} from "zod"

// permission schema and type
export const permissionSchema = z.object({
        permission: z.string(),
        hasAccess: z.boolean()
})

export type Permission = z.infer<typeof permissionSchema>

// tab schema and type
export const tabSchema = z.object({
    id: z.string(),
    displayName: z.string(),
      permissions: z.array(permissionSchema),
})
export type Tab = z.infer<typeof tabSchema>


// record permission schema and type
export const recordPermissionSchema = z.object({
    sites: z.array(permissionSchema)
})
export type RecordPermission = z.infer<typeof recordPermissionSchema>


// user access and permissions schema and type
export const userAccessAndPermissionsSchema = z.object({
    tabs: z.array(tabSchema),
    records: z.array(recordPermissionSchema),

})
export type UserAccessAndPermissions = z.infer<typeof userAccessAndPermissionsSchema>


// user schema and type
export const userSchema = z.object({
    id: z.string(),
    uid: z.string(),
    username: z.string(),
    status: z.enum(["Active", "Inactive"]),
    accountType: z.enum(["Service", "User", "Organization"]),
    accessAndPermissions: userAccessAndPermissionsSchema,
    createdAt: z.date(),
    invitationStatus: z.string(),
})
export type User = z.infer<typeof userSchema>