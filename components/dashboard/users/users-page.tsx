"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  Clock3,
  Plus,
  Search,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { SiteRecord } from "@/lib/sites/types";
import type { User, UserType } from "@/lib/schemaAndTypes/zod/user";
import type { UsersStore } from "@/lib/users/use-users-store";
import UserPermissionWizard from "./user-permission-wizard";
import UserWorkspace from "./user-workspace";
import UserTokenPurchaseDialog from "./user-token-purchase-dialog";
import UserTokenSummaryPanel from "./user-token-summary";
import UserTokenHistory from "./user-token-history";

export type LocalUser = User;
type UserFilter = "All" | "Organization" | UserType;
type StatusFilter = "All" | "Active" | "Inactive";
type InvitationFilter = "All" | "Pending" | "Accepted" | "Not invited";

type UsersPageProps = {
  sites: SiteRecord[];
  userStore: UsersStore;
  notify: (text: string) => void;
};

type UsersMetricProps = {
  icon: LucideIcon;
  label: string;
  value: number;
  note: string;
};

const UsersMetric = ({ icon: Icon, label, value, note }: UsersMetricProps) => (
  <div className="metric-card">
    <div className="metric-head">
      <span>{label}</span>
      <span className="metric-icon">
        <Icon size={16} />
      </span>
    </div>
    <div className="metric-value">{value}</div>
    <div className="users-metric-note">{note}</div>
  </div>
);

const displayName = (user: User) =>
  user.username?.trim() || user.email.split("@")[0];
const accountClass = (type: User["accountType"]) =>
  type.toLowerCase().replaceAll(" ", "-");

const UsersPage = ({ sites, userStore, notify }: UsersPageProps) => {
  const {
    users,
    tokenSummaries,
    purchaseHistory,
    addUser,
    updateUser,
    deleteUser,
  } = userStore;
  const [search, setSearch] = useState("");
  const [accountFilter, setAccountFilter] = useState<UserFilter>("All");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [invitationFilter, setInvitationFilter] =
    useState<InvitationFilter>("All");
  const [openUserId, setOpenUserId] = useState<string | null>(null);
  const [wizardUserId, setWizardUserId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [purchaseType, setPurchaseType] = useState<UserType | null>(null);

  const purchaseDialog = purchaseType && (
    <UserTokenPurchaseDialog
      type={purchaseType}
      summary={userStore.getTokenSummary(purchaseType)}
      onClose={() => setPurchaseType(null)}
      onConfirm={(type, quantity) => {
        const purchased = userStore.purchaseTokens(type, quantity);
        if (purchased)
          notify(
            `${quantity} ${type.toLowerCase()} token${quantity === 1 ? "" : "s"} added to capacity.`,
          );
        return purchased;
      }}
    />
  );

  const selectedUser = users.find((user) => user.id === openUserId);
  const editingUser = users.find((user) => user.id === wizardUserId);
  const visibleUsers = useMemo(() => {
    const query = search.trim().toLowerCase();
    return users.filter((user) => {
      const matchesQuery =
        !query ||
        user.email.toLowerCase().includes(query) ||
        (user.username ?? "").toLowerCase().includes(query);
      return (
        matchesQuery &&
        (accountFilter === "All" || user.accountType === accountFilter) &&
        (statusFilter === "All" || user.status === statusFilter) &&
        (invitationFilter === "All" ||
          user.invitationStatus === invitationFilter)
      );
    });
  }, [users, search, accountFilter, statusFilter, invitationFilter]);

  const beginCreate = () => {
    setOpenUserId(null);
    setWizardUserId(null);
    setCreating(true);
  };

  if (creating || editingUser) {
    return (
      <>
        <UserPermissionWizard
          users={users}
          sites={sites}
          tokenSummaries={tokenSummaries}
          initialUser={creating ? null : editingUser!}
          onPurchaseTokens={setPurchaseType}
          onCancel={() => {
            setCreating(false);
            setWizardUserId(null);
          }}
          onInvite={(user) => {
            const result = addUser(user);
            if (result !== "added") return result;
            setCreating(false);
            setOpenUserId(user.id);
            notify(`Invitation prepared for ${user.email}. No email was sent.`);
            return result;
          }}
          onSave={(user) => {
            updateUser(user);
            setCreating(false);
            setWizardUserId(null);
            setOpenUserId(user.id);
            notify(`Permissions updated for ${user.email}.`);
          }}
        />
        {purchaseDialog}
      </>
    );
  }

  if (selectedUser) {
    return (
      <>
        <UserWorkspace
          user={selectedUser}
          sites={sites}
          onBack={() => setOpenUserId(null)}
          onEditPermissions={() => setWizardUserId(selectedUser.id)}
          onUpdate={updateUser}
          onDelete={() => {
            if (!deleteUser(selectedUser.id)) return;
            setOpenUserId(null);
            notify(`${selectedUser.email} was removed from this workspace.`);
          }}
          notify={notify}
        />
        {purchaseDialog}
      </>
    );
  }

  const pendingCount = users.filter(
    (user) => user.invitationStatus === "Pending",
  ).length;
  const activeCount = users.filter((user) => user.status === "Active").length;
  const inactiveCount = users.filter(
    (user) => user.status === "Inactive",
  ).length;
  const internalCount = users.filter(
    (user) => user.accountType === "Internal User",
  ).length;
  const externalCount = users.filter(
    (user) => user.accountType === "External User",
  ).length;

  return (
    <div className="page-content users-page">
      <div className="page-intro">
        <div>
          <div className="eyebrow">
            <UsersRound size={14} /> Workspace
          </div>
          <h1>Users &amp; permissions</h1>
          <p>Manage who can access your organisation and what they can do.</p>
        </div>
        <button className="button primary" onClick={beginCreate}>
          <Plus size={16} /> Add user
        </button>
      </div>

      <UserTokenSummaryPanel
        summaries={tokenSummaries}
        onPurchase={setPurchaseType}
      />
      <UserTokenHistory purchases={purchaseHistory} />

      <div className="metrics-grid users-metrics">
        <UsersMetric
          icon={UsersRound}
          label="Total users"
          value={users.length}
          note={`${internalCount} internal · ${externalCount} external`}
        />
        <UsersMetric
          icon={Activity}
          label="Active users"
          value={activeCount}
          note="Access enabled"
        />
        <UsersMetric
          icon={ShieldCheck}
          label="Inactive users"
          value={inactiveCount}
          note="Access blocked"
        />
        <UsersMetric
          icon={Clock3}
          label="Pending invitations"
          value={pendingCount}
          note="Awaiting acceptance"
        />
      </div>

      <section className="panel users-list-panel">
        <div className="panel-head users-list-heading">
          <div>
            <h2>Organisation members</h2>
            <p>
              {visibleUsers.length} of {users.length} accounts
            </p>
          </div>
        </div>
        <div className="users-toolbar">
          <label className="search-input users-search">
            <Search size={15} aria-hidden="true" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search name or email"
              aria-label="Search by username or email"
            />
          </label>
          <label className="users-filter">
            <span>Account type</span>
            <select
              value={accountFilter}
              onChange={(event) =>
                setAccountFilter(event.target.value as UserFilter)
              }
            >
              <option>All</option>
              <option>Organization</option>
              <option>Internal User</option>
              <option>External User</option>
            </select>
          </label>
          <label className="users-filter">
            <span>Status</span>
            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as StatusFilter)
              }
            >
              <option>All</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </label>
          <label className="users-filter">
            <span>Invitation</span>
            <select
              value={invitationFilter}
              onChange={(event) =>
                setInvitationFilter(event.target.value as InvitationFilter)
              }
            >
              <option>All</option>
              <option>Pending</option>
              <option>Accepted</option>
              <option>Not invited</option>
            </select>
          </label>
        </div>

        {tokenSummaries.some((summary) => summary.remaining === 0) && (
          <div className="user-capacity-notices">
            {tokenSummaries
              .filter((summary) => summary.remaining === 0)
              .map((summary) => (
                <div className="callout warning" key={summary.type}>
                  <span>
                    No {summary.type.toLowerCase()} tokens remain. Purchase more
                    capacity to invite another account.
                  </span>
                  <button
                    className="button secondary"
                    onClick={() => setPurchaseType(summary.type)}
                  >
                    Purchase tokens
                  </button>
                </div>
              ))}
          </div>
        )}

        {visibleUsers.length ? (
          <div className="users-table-scroll">
            <div
              className="users-table"
              role="table"
              aria-label="Organisation members"
            >
              <div className="users-row users-table-head" role="row">
                <span role="columnheader">Member</span>
                <span role="columnheader">Account type</span>
                <span role="columnheader">Status</span>
                <span role="columnheader">Invitation</span>
                <span role="columnheader">Created</span>
                <span role="columnheader">
                  <span className="sr-only">Actions</span>
                </span>
              </div>
              {visibleUsers.map((user) => (
                <div className="users-row" role="row" key={user.id}>
                  <div className="user-identity" role="cell">
                    <span
                      className={`user-avatar ${accountClass(user.accountType)}`}
                      aria-hidden="true"
                    >
                      {displayName(user).slice(0, 1).toUpperCase()}
                    </span>
                    <span className="user-identity-copy">
                      <strong>{displayName(user)}</strong>
                      <small>{user.email}</small>
                    </span>
                  </div>
                  <span role="cell">
                    <span
                      className={`account-label ${accountClass(user.accountType)}`}
                    >
                      {user.accountType}
                    </span>
                  </span>
                  <span role="cell">
                    <span className={`user-state ${user.status.toLowerCase()}`}>
                      <i />
                      {user.status}
                    </span>
                  </span>
                  <span role="cell">
                    <span
                      className={`invitation-label ${user.invitationStatus.toLowerCase().replace(" ", "-")}`}
                    >
                      {user.invitationStatus}
                    </span>
                  </span>
                  <span className="user-created" role="cell">
                    {user.createdAt.toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <span className="users-row-action" role="cell">
                    <button
                      className="button secondary"
                      onClick={() => setOpenUserId(user.id)}
                    >
                      Manage
                    </button>
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="users-empty">
            <div className="empty-icon">
              <UsersRound size={21} />
            </div>
            <strong>
              {users.length ? "No members match these filters" : "No users yet"}
            </strong>
            <p>
              {users.length
                ? "Adjust your search or filters to see more members."
                : "Add a user to start building your organisation workspace."}
            </p>
            {!users.length && (
              <button className="button primary" onClick={beginCreate}>
                <Plus size={15} /> Add user
              </button>
            )}
          </div>
        )}
      </section>
      {purchaseDialog}
    </div>
  );
};

export default UsersPage;
