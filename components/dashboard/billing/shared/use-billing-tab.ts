"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

// Keeps the active tab in the URL (?tab=) so views are linkable and survive reloads.
export const useBillingTab = <T extends string>(
  values: readonly T[],
  fallback: T,
) => {
  const router = useRouter();
  const pathname = usePathname();
  const requested = useSearchParams().get("tab");
  const tab = values.includes(requested as T) ? (requested as T) : fallback;
  const setTab = (next: T) =>
    router.replace(`${pathname}?tab=${next}`, { scroll: false });
  return [tab, setTab] as const;
};
