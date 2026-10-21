export type TabPermissionSettings = {
  tab: string;
  displayText: string;
  standalonePermissions: string[];
  recordLevelPermissions: string[];
  recordSource?: "sites" | "users";
};

export const tabPermissionSettings: Record<string, TabPermissionSettings> = {
  sites: {
    tab: "sites",
    displayText: "sites",
    standalonePermissions: [
      "Purchase Site Tokens",
      "View Site Tokens",
      "Create Sites",
    ],
    recordSource: "sites",
    recordLevelPermissions: [
      "View Overview",
      "View Floors and Areas",
      "Manage Floors and Areas",
      "Manage Imports",
      "Manage Site Settings",
      "Delete Site",
    ],
  },
  users: {
    tab: "users",
    displayText: "users",
    standalonePermissions: ["Create Users"],
    recordSource: "users",
    recordLevelPermissions: ["View User", "Manage User", "Delete User"],
  },
};



export const getDefaultPermissions = (permissions: string[]) => {
  return permissions.map((permission) => ({
    permission,
    hasAccess: false,
  }));
};
