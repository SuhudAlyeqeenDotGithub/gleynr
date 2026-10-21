import { FileUp, LayoutDashboard, Layers, Settings } from "lucide-react";
import type { TabItem } from "../../shared/tabs";

export type WorkspaceTab = "overview" | "floors" | "import" | "settings";

export const WORKSPACE_TABS: TabItem<WorkspaceTab>[] = [
  { value: "overview", label: "Overview", icon: LayoutDashboard },
  { value: "floors", label: "Floors & Areas", icon: Layers },
  { value: "import", label: "Import Data", icon: FileUp },
  { value: "settings", label: "Settings", icon: Settings },
];
