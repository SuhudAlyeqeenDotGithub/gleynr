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
import type { SiteRecord } from "@/lib/sites/types";
import type { User } from "@/lib/schemaAndTypes/zod/user";
import { createSeedUsers } from "@/lib/users/seed";
import MetricCard from "@/components/dashboard/overview/metric-card";
import UserPermissionWizard from "./user-permission-wizard";
import UserWorkspace from "./user-workspace";

export type LocalUser = User;
type UserFilter = "All" | "Organization" | "User" | "Service";
type StatusFilter = "All" | "Active" | "Inactive";
type InvitationFilter = "All" | "Pending" | "Accepted" | "Not invited";

type UsersPageProps = {
  sites: SiteRecord[];
  notify: (text: string) => void;
};

const displayName = (user: User) =>
  user.username?.trim() || user.email.split("@")[0];

const UsersPage = ({ sites, notify }: UsersPageProps) => {
  const [users, setUsers] = useState<User[]>(createSeedUsers);
  const [search, setSearch] = useState("");
  const [accountFilter, setAccountFilter] = useState<UserFilter>("All");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [invitationFilter, setInvitationFilter] =
    useState<InvitationFilter>("All");
  const [openUserId, setOpenUserId] = useState<string | null>(null);
  const [wizardUserId, setWizardUserId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

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

  const updateUser = (updated: User) =>
    setUsers((current) =>
      current.map((user) => (user.id === updated.id ? updated : user)),
    );

  const beginCreate = () => {
    setOpenUserId(null);
    setWizardUserId(null);
    setCreating(true);
  };

  if (creating || editingUser) {
    return (
      <UserPermissionWizard
        users={users}
        sites={sites}
        initialUser={creating ? null : editingUser!}
        onCancel={() => {
          setCreating(false);
          setWizardUserId(null);
        }}
        onInvite={(user) => {
          setUsers((current) => [user, ...current]);
          setCreating(false);
          setOpenUserId(user.id);
          notify(`Invitation prepared for ${user.email}. No email was sent.`);
        }}
        onSave={(user) => {
          updateUser(user);
          setCreating(false);
          setWizardUserId(null);
          setOpenUserId(user.id);
          notify(`Permissions updated for ${user.email}.`);
        }}
      />
    );
  }

  if (selectedUser) {
    return (
      <UserWorkspace
        user={selectedUser}
        sites={sites}
        onBack={() => setOpenUserId(null)}
        onEditPermissions={() => setWizardUserId(selectedUser.id)}
        onUpdate={updateUser}
        onDelete={() => {
          setUsers((current) => current.filter((user) => user.id !== selectedUser.id));
          setOpenUserId(null);
          notify(`${selectedUser.email} was removed from this workspace.`);
        }}
        notify={notify}
      />
    );
  }

  const pendingCount = users.filter(
    (user) => user.invitationStatus === "Pending",
  ).length;
  const activeCount = users.filter((user) => user.status === "Active").length;
  const inactiveCount = users.filter((user) => user.status === "Inactive").length;

  return (
    <div className="page-content users-page">
      <div className="page-intro">
        <div>
          <div className="eyebrow"><UsersRound size={14} /> Workspace</div>
          <h1>Users &amp; permissions</h1>
          <p>Manage who can access your organisation and what they can do.</p>
        </div>
        <button className="button primary" onClick={beginCreate}>
          <Plus size={16} /> Add user
        </button>
      </div>

      <div className="metrics-grid users-metrics">
        <MetricCard icon={UsersRound} label="Total users" value={users.length} delta="Across this organisation" />
        <MetricCard icon={Activity} label="Active users" value={activeCount} delta="Access enabled" />
        <MetricCard icon={ShieldCheck} label="Inactive users" value={inactiveCount} delta="Access blocked" />
        <MetricCard icon={Clock3} label="Pending invitations" value={pendingCount} delta="Awaiting acceptance" />
      </div>

      <section className="panel users-list-panel">
        <div className="panel-head users-list-heading">
          <div>
            <h2>Organisation members</h2>
            <p>{visibleUsers.length} of {users.length} accounts</p>
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
            <select value={accountFilter} onChange={(event) => setAccountFilter(event.target.value as UserFilter)}>
              <option>All</option><option>Organization</option><option>User</option><option>Service</option>
            </select>
          </label>
          <label className="users-filter">
            <span>Status</span>
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}>
              <option>All</option><option>Active</option><option>Inactive</option>
            </select>
          </label>
          <label className="users-filter">
            <span>Invitation</span>
            <select value={invitationFilter} onChange={(event) => setInvitationFilter(event.target.value as InvitationFilter)}>
              <option>All</option><option>Pending</option><option>Accepted</option><option>Not invited</option>
            </select>
          </label>
        </div>

        {visibleUsers.length ? (
          <div className="users-table-scroll">
            <div className="users-table" role="table" aria-label="Organisation members">
              <div className="users-row users-table-head" role="row">
                <span role="columnheader">Member</span>
                <span role="columnheader">Account type</span>
                <span role="columnheader">Status</span>
                <span role="columnheader">Invitation</span>
                <span role="columnheader">Created</span>
                <span role="columnheader"><span className="sr-only">Actions</span></span>
              </div>
              {visibleUsers.map((user) => (
                <div className="users-row" role="row" key={user.id}>
                  <div className="user-identity" role="cell">
                    <span className={`user-avatar ${user.accountType.toLowerCase()}`} aria-hidden="true">
                      {displayName(user).slice(0, 1).toUpperCase()}
                    </span>
                    <span className="user-identity-copy">
                      <strong>{displayName(user)}</strong>
                      <small>{user.email}</small>
                    </span>
                  </div>
                  <span role="cell"><span className={`account-label ${user.accountType.toLowerCase()}`}>{user.accountType}</span></span>
                  <span role="cell"><span className={`user-state ${user.status.toLowerCase()}`}><i />{user.status}</span></span>
                  <span role="cell"><span className={`invitation-label ${user.invitationStatus.toLowerCase().replace(" ", "-")}`}>{user.invitationStatus}</span></span>
                  <span className="user-created" role="cell">{user.createdAt.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
                  <span className="users-row-action" role="cell">
                    <button className="button secondary" onClick={() => setOpenUserId(user.id)}>Manage</button>
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="users-empty">
            <div className="empty-icon"><UsersRound size={21} /></div>
            <strong>{users.length ? "No members match these filters" : "No users yet"}</strong>
            <p>{users.length ? "Adjust your search or filters to see more members." : "Add a user to start building your organisation workspace."}</p>
            {!users.length && <button className="button primary" onClick={beginCreate}><Plus size={15} /> Add user</button>}
          </div>
        )}
      </section>
    </div>
  );
};

export default UsersPage;