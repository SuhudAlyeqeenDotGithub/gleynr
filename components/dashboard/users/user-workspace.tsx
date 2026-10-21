"use client";

import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowLeft,
  Clock3,
  KeyRound,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Trash2,
  UserRound,
} from "lucide-react";
import type { SiteRecord } from "@/lib/sites/types";
import type { User } from "@/lib/schemaAndTypes/zod/user";
import { tabPermissionSettings } from "@/lib/schemaAndTypes/zod/accessAndPermission/defaultSettings";
import { resolveUserTabs } from "@/lib/users/permissions";
import Tabs from "@/components/dashboard/shared/tabs";

type WorkspaceSection = "profile" | "access" | "actions";
type UserWorkspaceProps = {
  user: User;
  sites: SiteRecord[];
  onBack: () => void;
  onEditPermissions: () => void;
  onUpdate: (user: User) => void;
  onDelete: () => void;
  notify: (text: string) => void;
};

const sections: { value: WorkspaceSection; label: string; icon: LucideIcon }[] =
  [
    { value: "profile", label: "Profile", icon: UserRound },
    { value: "access", label: "Access & permissions", icon: ShieldCheck },
    { value: "actions", label: "Account actions", icon: KeyRound },
  ];

const UserWorkspace = ({
  user,
  sites,
  onBack,
  onEditPermissions,
  onUpdate,
  onDelete,
  notify,
}: UserWorkspaceProps) => {
  const [section, setSection] = useState<WorkspaceSection>("profile");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const protectedAccount = user.accountType === "Organization";
  const tabs = resolveUserTabs(user);
  const effectiveTabs = protectedAccount
    ? tabs
    : tabs.filter((tab) => tab.hasAccess);
  const accountEnabled = user.status === "Active";
  const activeSiteCount =
    tabs.find((tab) => tab.tab === "sites")?.recordLevelPermissions.length ?? 0;

  const changeStatus = (status: User["status"]) => {
    if (protectedAccount) return;
    onUpdate({ ...user, status });
    notify(
      status === "Inactive"
        ? "User access has been blocked."
        : "User access has been restored.",
    );
  };

  return (
    <div className="page-content user-workspace">
      <div className="user-workspace-head">
        <button className="button secondary" onClick={onBack}>
          <ArrowLeft size={15} /> All users
        </button>
        <div className="user-workspace-title">
          <span
            className={`user-avatar large ${user.accountType.toLowerCase()}`}
            aria-hidden="true"
          >
            {(user.username || user.email).slice(0, 1).toUpperCase()}
          </span>
          <div>
            <div className="eyebrow">Member workspace</div>
            <h1>{user.username || user.email.split("@")[0]}</h1>
            <p>
              <Mail size={13} /> {user.email}
            </p>
          </div>
        </div>
      </div>

      {protectedAccount && (
        <div className="org-protection-banner">
          <LockKeyhole size={17} />
          <div>
            <strong>Protected Organization account</strong>
            <span>
              This account always has unrestricted access and cannot be
              deactivated or deleted.
            </span>
          </div>
        </div>
      )}

      <Tabs
        tabs={sections}
        value={section}
        onChange={setSection}
        label="User management sections"
      />
      <div className="user-workspace-body">
        {section === "profile" && (
          <section className="panel user-profile-panel">
            <div className="panel-head">
              <div>
                <h2>Profile</h2>
                <p>Account identity and current membership state.</p>
              </div>
              <span
                className={`account-label ${user.accountType.toLowerCase()}`}
              >
                {user.accountType}
              </span>
            </div>
            <dl className="user-profile-grid">
              <div>
                <dt>Email address</dt>
                <dd>{user.email}</dd>
              </div>
              <div>
                <dt>Username</dt>
                <dd>{user.username || "Not set yet"}</dd>
              </div>
              <div>
                <dt>Account status</dt>
                <dd>
                  <span className={`user-state ${user.status.toLowerCase()}`}>
                    <i />
                    {user.status}
                    {user.status === "Inactive" ? " · access blocked" : ""}
                  </span>
                </dd>
              </div>
              <div>
                <dt>Invitation status</dt>
                <dd>
                  <span
                    className={`invitation-label ${user.invitationStatus.toLowerCase().replace(" ", "-")}`}
                  >
                    {user.invitationStatus}
                  </span>
                  {!user.uid && (
                    <small className="profile-note">
                      No authenticated account yet
                    </small>
                  )}
                </dd>
              </div>
              <div>
                <dt>Created</dt>
                <dd>
                  {user.createdAt.toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </dd>
              </div>
              <div>
                <dt>Authenticated UID</dt>
                <dd>{user.uid || "Assigned after sign-in"}</dd>
              </div>
            </dl>
            {user.invitationStatus === "Pending" && (
              <div className="inline-notice">
                <Clock3 size={15} /> This account can be managed before the
                invite is accepted.
              </div>
            )}
          </section>
        )}
        {section === "access" && (
          <section className="panel access-summary-panel">
            <div className="panel-head">
              <div>
                <h2>Access &amp; permissions</h2>
                <p>
                  Effective access is resolved from the central permission
                  definitions.
                </p>
              </div>
              <button
                className="button primary"
                onClick={onEditPermissions}
                disabled={protectedAccount}
              >
                <ShieldCheck size={15} /> Configure access
              </button>
            </div>
            {protectedAccount ? (
              <div className="unrestricted-summary">
                <ShieldCheck size={20} />
                <div>
                  <strong>Unrestricted organisation access</strong>
                  <p>
                    All current and future tabs and permission actions are
                    available to this account.
                  </p>
                </div>
              </div>
            ) : (
              <>
                {!effectiveTabs.length && accountEnabled ? (
                  <div className="users-empty compact">
                    <LockKeyhole size={19} />
                    <strong>No tab access granted</strong>
                    <p>This member cannot open any organisation sections.</p>
                  </div>
                ) : (
                  <div className="effective-access-list">
                    {tabs.map((tab) => {
                      const definition = Object.values(
                        tabPermissionSettings,
                      ).find((item) => item.tab === tab.tab);
                      const granted = tab.standalonePermissions.filter(
                        (permission) => permission.hasAccess,
                      ).length;
                      const records = tab.recordLevelPermissions.length;
                      const isEffective = accountEnabled && tab.hasAccess;
                      const summary = !accountEnabled
                        ? `Account inactive · ${records} saved records retained`
                        : tab.hasAccess
                          ? `${granted} standalone grants · ${records} configured records`
                          : `Tab denied · ${records} saved records retained`;
                      return (
                        <div
                          className={`effective-access-row ${isEffective ? "" : "denied"}`}
                          key={tab.tab}
                        >
                          <span className="access-check">
                            {isEffective ? (
                              <ShieldCheck size={15} />
                            ) : (
                              <LockKeyhole size={15} />
                            )}
                          </span>
                          <div>
                            <strong>
                              {definition?.displayText ??
                                tab.displayText ??
                                tab.tab}
                            </strong>
                            <small>{summary}</small>
                          </div>
                          <span
                            className={`user-state ${isEffective ? "active" : "inactive"}`}
                          >
                            <i />
                            {!accountEnabled
                              ? "Blocked"
                              : tab.hasAccess
                                ? "Granted"
                                : "Denied"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
                {!accountEnabled && (
                  <div className="inline-notice protected-note">
                    <LockKeyhole size={15} /> This account is inactive. All
                    application access is blocked until it is reactivated.
                  </div>
                )}
                <div className="access-footnote">
                  {activeSiteCount} site records have explicit permission
                  settings. Unconfigured records remain denied.
                </div>
              </>
            )}
            <div className="workspace-related-records" aria-hidden="true">
              {sites.length} sites available for record-level permissions
            </div>
          </section>
        )}
        {section === "actions" && (
          <section className="panel account-actions-panel">
            <div className="panel-head">
              <div>
                <h2>Account actions</h2>
                <p>
                  Sensitive actions are simulated locally in this prototype.
                </p>
              </div>
            </div>
            {protectedAccount && (
              <div className="inline-notice protected-note">
                <LockKeyhole size={15} /> Actions that could remove essential
                organisation access are unavailable.
              </div>
            )}
            {user.invitationStatus === "Pending" && (
              <div className="account-action-row">
                <div>
                  <strong>Resend invitation</strong>
                  <p>Simulate preparing another invitation for this address.</p>
                </div>
                <button
                  className="button secondary"
                  onClick={() => {
                    onUpdate({ ...user, invitationStatus: "Pending" });
                    notify(
                      `Invitation prepared for ${user.email}. No email was sent.`,
                    );
                  }}
                >
                  Resend invite
                </button>
              </div>
            )}
            {user.invitationStatus === "Accepted" &&
              user.accountType !== "Service" && (
                <div className="account-action-row">
                  <div>
                    <strong>Password reset request</strong>
                    <p>
                      Request a password reset through Firebase Authentication
                      in the future.
                    </p>
                  </div>
                  <button
                    className="button secondary"
                    onClick={() =>
                      notify(
                        `Password reset request simulated for ${user.email}.`,
                      )
                    }
                  >
                    <KeyRound size={14} /> Simulate request
                  </button>
                </div>
              )}
            <div className="account-action-row">
              <div>
                <strong>
                  {user.status === "Active"
                    ? "Deactivate account"
                    : "Reactivate account"}
                </strong>
                <p>
                  {user.status === "Active"
                    ? "Block this account from accessing the organisation."
                    : "Restore this account's access without changing its permissions."}
                </p>
              </div>
              <button
                className={`button ${user.status === "Active" ? "danger" : "secondary"}`}
                disabled={protectedAccount}
                onClick={() =>
                  changeStatus(user.status === "Active" ? "Inactive" : "Active")
                }
              >
                {user.status === "Active" ? "Deactivate" : "Reactivate"}
              </button>
            </div>
            <div className="account-action-row delete-action">
              <div>
                <strong>Delete user</strong>
                <p>Permanently remove this record and its saved permissions.</p>
              </div>
              <button
                className="button danger"
                disabled={protectedAccount}
                onClick={() => setConfirmDelete(true)}
              >
                <Trash2 size={14} /> Delete user
              </button>
            </div>
            {confirmDelete && (
              <div className="users-confirm-backdrop" role="presentation">
                <section
                  className="users-confirm"
                  role="alertdialog"
                  aria-modal="true"
                  aria-labelledby="delete-user-title"
                >
                  <span className="confirm-icon">
                    <Trash2 size={18} />
                  </span>
                  <h2 id="delete-user-title">
                    Delete {user.username || user.email}?
                  </h2>
                  <p>
                    This permanently removes the local user record and
                    permission configuration. This cannot be undone.
                  </p>
                  <div className="modal-actions">
                    <button
                      className="button secondary"
                      onClick={() => setConfirmDelete(false)}
                    >
                      Keep user
                    </button>
                    <button className="button danger" onClick={onDelete}>
                      Delete permanently
                    </button>
                  </div>
                </section>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
};

export default UserWorkspace;
