"use client";

import { useMemo, useState } from "react";
import type { User, UserType } from "@/lib/schemaAndTypes/zod/user";
import { createSeedUsers } from "./seed";

export const USER_TOKEN_DEFINITIONS: Record<
  UserType,
  { included: number; monthlyPrice: number; label: string }
> = {
  "Internal User": { included: 10, monthlyPrice: 2, label: "Internal user" },
  "External User": { included: 2, monthlyPrice: 3, label: "External user" },
};

export type UserTokenSummary = {
  type: UserType;
  included: number;
  purchased: number;
  capacity: number;
  used: number;
  remaining: number;
  monthlyPrice: number;
};

export type UserTokenPurchase = {
  id: string;
  reference: string;
  type: UserType;
  quantity: number;
  pricePerToken: number;
  total: number;
  purchasedAt: Date;
};

export type AddUserResult = "added" | "duplicate" | "capacity";

export const useUsersStore = () => {
  const [users, setUsers] = useState<User[]>(createSeedUsers);
  const [purchasedTokens, setPurchasedTokens] = useState<
    Record<UserType, number>
  >({
    "Internal User": 0,
    "External User": 0,
  });
  const [purchaseHistory, setPurchaseHistory] = useState<UserTokenPurchase[]>(
    [],
  );

  const tokenSummaries = useMemo(() => {
    const types: UserType[] = ["Internal User", "External User"];
    return types.map((type): UserTokenSummary => {
      const definition = USER_TOKEN_DEFINITIONS[type];
      const used = users.filter((user) => user.accountType === type).length;
      const purchased = purchasedTokens[type];
      const capacity = definition.included + purchased;
      return {
        type,
        included: definition.included,
        purchased,
        capacity,
        used,
        remaining: Math.max(0, capacity - used),
        monthlyPrice: definition.monthlyPrice,
      };
    });
  }, [users, purchasedTokens]);

  const getTokenSummary = (type: UserType) =>
    tokenSummaries.find((summary) => summary.type === type)!;

  const addUser = (user: User): AddUserResult => {
    if (
      users.some(
        (item) => item.email.toLowerCase() === user.email.toLowerCase(),
      )
    )
      return "duplicate";
    if (
      user.accountType !== "Organization" &&
      getTokenSummary(user.accountType).remaining < 1
    )
      return "capacity";
    setUsers((current) => [user, ...current]);
    return "added";
  };

  const updateUser = (updated: User) =>
    setUsers((current) =>
      current.map((user) => (user.id === updated.id ? updated : user)),
    );

  const deleteUser = (id: string) => {
    const target = users.find((user) => user.id === id);
    if (!target || target.accountType === "Organization") return false;
    setUsers((current) => current.filter((user) => user.id !== id));
    return true;
  };

  const purchaseTokens = (type: UserType, quantity: number): boolean => {
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 100)
      return false;
    const pricePerToken = USER_TOKEN_DEFINITIONS[type].monthlyPrice;
    const purchasedAt = new Date();
    const id = `ut-${purchasedAt.getTime()}-${Math.random().toString(36).slice(2, 7)}`;
    const purchase: UserTokenPurchase = {
      id,
      reference: `UT-${purchasedAt.getTime().toString(36).toUpperCase()}`,
      type,
      quantity,
      pricePerToken,
      total: pricePerToken * quantity,
      purchasedAt,
    };
    setPurchasedTokens((current) => ({
      ...current,
      [type]: current[type] + quantity,
    }));
    setPurchaseHistory((current) => [purchase, ...current]);
    return true;
  };

  return {
    users,
    tokenSummaries,
    purchaseHistory,
    getTokenSummary,
    addUser,
    updateUser,
    deleteUser,
    purchaseTokens,
  };
};

export type UsersStore = ReturnType<typeof useUsersStore>;
