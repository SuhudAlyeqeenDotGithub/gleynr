import {
  getDefaultPermissions,
  tabPermissionSettings,
} from "@/lib/schemaAndTypes/zod/accessAndPermission/defaultSettings";
import type { Permission, Tab, User } from "@/lib/schemaAndTypes/zod/user";

const mergePermissions = (
  definitions: string[],
  saved: Permission[] = [],
): Permission[] => {
  const savedByName = new Map(
    saved.map((permission) => [permission.permission, permission.hasAccess]),
  );
  return getDefaultPermissions(definitions).map((permission) => ({
    ...permission,
    hasAccess: savedByName.get(permission.permission) ?? false,
  }));
};

export const resolveUserTabs = (user?: User): Tab[] =>
  Object.values(tabPermissionSettings).map((definition) => {
    const saved = user?.accessAndPermissions.tabAccess.find(
      (tab) => tab.tab === definition.tab,
    );
    const isOrganization = user?.accountType === "Organization";
    return {
      tab: definition.tab as Tab["tab"],
      displayText: definition.displayText,
      hasAccess: isOrganization || (saved?.hasAccess ?? false),
      standalonePermissions: mergePermissions(
        definition.standalonePermissions,
        saved?.standalonePermissions,
      ),
      recordLevelPermissions: (saved?.recordLevelPermissions ?? []).map(
        (record) => ({
          recordId: record.recordId,
          permissions: mergePermissions(
            definition.recordLevelPermissions,
            record.permissions,
          ),
        }),
      ),
    };
  });

export const resolveTabPermissions = (tab: Tab) => ({
  ...tab,
  standalonePermissions: tab.hasAccess
    ? tab.standalonePermissions
    : tab.standalonePermissions.map((permission) => ({
        ...permission,
        hasAccess: false,
      })),
  recordLevelPermissions: tab.hasAccess
    ? tab.recordLevelPermissions
    : tab.recordLevelPermissions.map((record) => ({
        ...record,
        permissions: record.permissions.map((permission) => ({
          ...permission,
          hasAccess: false,
        })),
      })),
});

export const permissionValue = (
  permissions: Permission[],
  name: string,
): boolean =>
  permissions.find((permission) => permission.permission === name)?.hasAccess ??
  false;

export const canAccessTab = (user: User, tabKey: string): boolean =>
  user.accountType === "Organization" ||
  (user.status === "Active" &&
    (resolveUserTabs(user).find((tab) => tab.tab === tabKey)?.hasAccess ??
      false));

export const canUseStandalonePermission = (
  user: User,
  tabKey: string,
  permissionName: string,
): boolean =>
  user.accountType === "Organization" ||
  (canAccessTab(user, tabKey) &&
    permissionValue(
      resolveUserTabs(user).find((tab) => tab.tab === tabKey)
        ?.standalonePermissions ?? [],
      permissionName,
    ));

export const canUseRecordPermission = (
  user: User,
  tabKey: string,
  recordId: string,
  permissionName: string,
): boolean => {
  if (user.accountType === "Organization") return true;
  if (!canAccessTab(user, tabKey)) return false;
  const record = resolveUserTabs(user)
    .find((tab) => tab.tab === tabKey)
    ?.recordLevelPermissions.find((item) => item.recordId === recordId);
  return permissionValue(record?.permissions ?? [], permissionName);
};
