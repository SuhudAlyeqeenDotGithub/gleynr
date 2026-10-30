"use client";

import { useState } from "react";
import { getPlan, getChangeKind, getEffectiveDate } from "./selectors";
import { createMockSubscriptions } from "./mock/subscriptions";
import type { SubscriptionRecord } from "./types";

export const useSubscriptionStore = () => {
  const [subscriptions, setSubscriptions] = useState<SubscriptionRecord[]>(
    createMockSubscriptions,
  );

  const current = subscriptions.find((item) => item.status === "Active");

  const changePlan = (planName: string) => {
    const target = getPlan(planName);
    if (!current || !target || target.name === current.plan) return;
    const kind = getChangeKind(current.plan, target.name);
    const effectiveDate = getEffectiveDate(current, kind);
    const now = new Date();

    if (kind === "downgrade" && effectiveDate > now) {
      setSubscriptions((items) =>
        items.map((item) =>
          item.id === current.id
            ? {
                ...item,
                scheduledChange: {
                  kind: "change",
                  planName: target.name,
                  effectiveDate,
                },
              }
            : item,
        ),
      );
      return;
    }

    const next: SubscriptionRecord = {
      id: `sub-${now.getTime()}`,
      organisationId: current.organisationId,
      planId: target.id,
      plan: target.name,
      type: target.type,
      billingInterval: "Monthly",
      startDate: now,
      status: "Active",
    };
    setSubscriptions((items) => [
      next,
      ...items.map((item) =>
        item.id === current.id
          ? {
              ...item,
              status:
                kind === "upgrade"
                  ? ("Upgraded" as const)
                  : ("Downgraded" as const),
              endDate: now,
              scheduledChange: undefined,
            }
          : item,
      ),
    ]);
  };

  const cancel = () => {
    if (!current) return;
    const effectiveDate = getEffectiveDate(current, "cancel");
    setSubscriptions((items) =>
      items.map((item) =>
        item.id === current.id
          ? {
              ...item,
              cancellationDate: new Date(),
              scheduledChange: { kind: "cancel", effectiveDate },
            }
          : item,
      ),
    );
  };

  const undoScheduledChange = () => {
    if (!current) return;
    setSubscriptions((items) =>
      items.map((item) =>
        item.id === current.id
          ? { ...item, cancellationDate: undefined, scheduledChange: undefined }
          : item,
      ),
    );
  };

  return { subscriptions, current, changePlan, cancel, undoScheduledChange };
};

export type SubscriptionStore = ReturnType<typeof useSubscriptionStore>;
