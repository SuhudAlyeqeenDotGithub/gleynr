"use client";

import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCheck,
  ChevronRight,
  CircleSlash,
  LockKeyhole,
  Mail,
  Search,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import type { SiteRecord } from "@/lib/sites/types";
import {
  getDefaultPermissions,
  tabPermissionSettings,
} from "@/lib/schemaAndTypes/zod/accessAndPermission/defaultSettings";
import type { Permission, Tab, User } from "@/lib/schemaAndTypes/zod/user";
import { resolveUserTabs } from "@/lib/users/permissions";
import type { LocalUser } from "./users-page";

type WizardProps = {
  users: LocalUser[];
  sites: SiteRecord[];
  initialUser: User | null;
  onCancel: () => void;
  onInvite: (user: User) => void;
  onSave: (user: User) => void;
};

type Step = "details" | "access" | "permissions" | "review" | "invite";
type RecordRef = { id: string; name: string; detail: string };
type RecordFilter = "All records" | "Configured" | "Not configured";
type BulkChoice = "keep" | "allow" | "deny";

const steps: { value: Step; label: string }[] = [
  { value: "details", label: "User details" },
  { value: "access", label: "Tab access" },
  { value: "permissions", label: "Permissions" },
  { value: "review", label: "Review" },
  { value: "invite", label: "Invite" },
];

const makeDraft = (user: User | null): User => ({
  id: user?.id ?? "",
  email: user?.email ?? "",
  uid: user?.uid,
  username: user?.username,
  status: user?.status ?? "Active",
  accountType: user?.accountType ?? "User",
  accessAndPermissions: { tabAccess: resolveUserTabs(user ?? undefined) },
  createdAt: user?.createdAt ?? new Date(),
  invitationStatus: user?.invitationStatus ?? "Not invited",
});

const getRecords = (
  tabKey: string,
  users: LocalUser[],
  sites: SiteRecord[],
  draftId: string,
): RecordRef[] => {
  if (tabKey === "sites")
    return sites.map((site) => ({ id: site.id, name: site.name, detail: site.location }));
  if (tabKey === "users")
    return users
      .filter((user) => user.id !== draftId)
      .map((user) => ({
        id: user.id,
        name: user.username || user.email.split("@")[0],
        detail: user.email,
      }));
  return [];
};

const UserPermissionWizard = ({
  users,
  sites,
  initialUser,
  onCancel,
  onInvite,
  onSave,
}: WizardProps) => {
  const [draft, setDraft] = useState<User>(() => makeDraft(initialUser));
  const [step, setStep] = useState<Step>("details");
  const [emailError, setEmailError] = useState("");
  const [selectedTabKey, setSelectedTabKey] = useState("");
  const [recordSearch, setRecordSearch] = useState("");
  const [recordFilter, setRecordFilter] = useState<RecordFilter>("All records");
  const [selectedRecords, setSelectedRecords] = useState<string[]>([]);
  const [editingRecordId, setEditingRecordId] = useState<string | null>(null);
  const [recordDraft, setRecordDraft] = useState<Permission[]>([]);
  const [bulkDraft, setBulkDraft] = useState<Record<string, BulkChoice>>({});
  const editing = initialUser !== null;
  const centralTabs = Object.values(tabPermissionSettings);
  const grantedTabs = draft.accessAndPermissions.tabAccess.filter((tab) => tab.hasAccess);
  const deniedTabs = draft.accessAndPermissions.tabAccess.filter((tab) => !tab.hasAccess);
  const activeTab = draft.accessAndPermissions.tabAccess.find(
    (tab) => tab.tab === selectedTabKey,
  );
  const activeDefinition = centralTabs.find((tab) => tab.tab === selectedTabKey);
  const recordList = useMemo(
    () => getRecords(selectedTabKey, users, sites, draft.id),
    [selectedTabKey, users, sites, draft.id],
  );
  const visibleRecords = recordList.filter((record) => {
    const configured = Boolean(
      activeTab?.recordLevelPermissions.some((item) => item.recordId === record.id),
    );
    const query = recordSearch.trim().toLowerCase();
    return (
      (!query || `${record.name} ${record.detail}`.toLowerCase().includes(query)) &&
      (recordFilter === "All records" ||
        (recordFilter === "Configured" ? configured : !configured))
    );
  });
  const currentStepIndex = steps.findIndex((item) => item.value === step);

  const updateTab = (key: string, update: (tab: Tab) => Tab) =>
    setDraft((current) => ({
      ...current,
      accessAndPermissions: {
        tabAccess: current.accessAndPermissions.tabAccess.map((tab) =>
          tab.tab === key ? update(tab) : tab,
        ),
      },
    }));

  const toggleTabAccess = (tab: Tab) => {
    const nextAccess = !tab.hasAccess;
    updateTab(tab.tab, (current) => ({ ...current, hasAccess: nextAccess }));
    if (nextAccess) setSelectedTabKey(tab.tab);
  };

  const updateStandalone = (tab: Tab, permission: Permission) =>
    updateTab(tab.tab, (current) => ({
      ...current,
      standalonePermissions: current.standalonePermissions.map((item) =>
        item.permission === permission.permission ? permission : item,
      ),
    }));

  const beginRecordEdit = (recordId: string) => {
    if (!activeTab || !activeDefinition) return;
    const saved = activeTab.recordLevelPermissions.find(
      (record) => record.recordId === recordId,
    );
    const savedValues = new Map(
      (saved?.permissions ?? []).map((item) => [item.permission, item.hasAccess]),
    );
    setRecordDraft(
      getDefaultPermissions(activeDefinition.recordLevelPermissions).map((item) => ({
        ...item,
        hasAccess: savedValues.get(item.permission) ?? false,
      })),
    );
    setEditingRecordId(recordId);
  };

  const saveRecord = () => {
    if (!activeTab || !editingRecordId) return;
    updateTab(activeTab.tab, (current) => {
      const otherRecords = current.recordLevelPermissions.filter(
        (record) => record.recordId !== editingRecordId,
      );
      return {
        ...current,
        recordLevelPermissions: [
          ...otherRecords,
          { recordId: editingRecordId, permissions: recordDraft },
        ],
      };
    });
    setEditingRecordId(null);
  };

  const removeRecordConfiguration = () => {
    if (!activeTab || !editingRecordId) return;
    updateTab(activeTab.tab, (current) => ({
      ...current,
      recordLevelPermissions: current.recordLevelPermissions.filter(
        (record) => record.recordId !== editingRecordId,
      ),
    }));
    setEditingRecordId(null);
  };

  const applyBulkPermissions = () => {
    if (!activeTab || !activeDefinition || !selectedRecords.length) return;
    updateTab(activeTab.tab, (current) => {
      const recordMap = new Map(
        current.recordLevelPermissions.map((record) => [record.recordId, record]),
      );
      for (const recordId of selectedRecords) {
        const existing = recordMap.get(recordId);
        const currentPermissions = new Map(
          (existing?.permissions ?? []).map((item) => [item.permission, item.hasAccess]),
        );
        const permissions = getDefaultPermissions(
          activeDefinition.recordLevelPermissions,
        ).map((permission) => ({
          ...permission,
          hasAccess:
            bulkDraft[permission.permission] === "allow"
              ? true
              : bulkDraft[permission.permission] === "deny"
                ? false
                : currentPermissions.get(permission.permission) ?? false,
        }));
        recordMap.set(recordId, { recordId, permissions });
      }
      return { ...current, recordLevelPermissions: [...recordMap.values()] };
    });
    setSelectedRecords([]);
  };

  const validateDetails = () => {
    const email = draft.email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Enter a valid email address.");
      return false;
    }
    if (
      users.some(
        (user) =>
          user.id !== initialUser?.id &&
          user.email.trim().toLowerCase() === email.toLowerCase(),
      )
    ) {
      setEmailError("A user record already exists for this email address.");
      return false;
    }
    if (draft.accountType === "Organization" && !editing) {
      setEmailError("The organisation account already exists and is protected.");
      return false;
    }
    setEmailError("");
    setDraft((current) => ({ ...current, email }));
    return true;
  };

  const advance = () => {
    if (step === "details" && !validateDetails()) return;
    if (step === "access") {
      setSelectedTabKey(grantedTabs[0]?.tab ?? "");
    }
    const index = steps.findIndex((item) => item.value === step);
    setStep(steps[Math.min(index + 1, steps.length - 1)].value);
  };

  const complete = () => {
    const savedUser: User = {
      ...draft,
      id: draft.id || `usr-${Date.now()}`,
      email: draft.email.trim(),
      uid: draft.uid || undefined,
      username: draft.username || undefined,
      status: editing ? draft.status : "Active",
      invitationStatus: editing ? draft.invitationStatus : "Pending",
      createdAt: editing ? draft.createdAt : new Date(),
    };
    if (editing) onSave(savedUser);
    else onInvite(savedUser);
  };

  const title = editing ? "Configure user access" : "Add a user";

  return (
    <div className="page-content users-page user-wizard-page">
      <div className="wizard-topline">
        <button className="button secondary" onClick={onCancel}><ArrowLeft size={15} /> Cancel</button>
        <span className="wizard-local-note"><ShieldCheck size={14} /> Changes stay local until you finish</span>
      </div>
      <div className="wizard-heading">
        <div className="eyebrow"><UsersRound size={14} /> Workspace access</div>
        <h1>{title}</h1>
        <p>{editing ? `Update settings for ${draft.email}.` : "Create an organisation user record and prepare an invitation."}</p>
      </div>
      <nav className="wizard-steps" aria-label="User setup steps">
        {steps.map((item, index) => (
          <button
            key={item.value}
            className={`wizard-step ${item.value === step ? "current" : ""} ${index < currentStepIndex ? "complete" : ""}`}
            disabled={index > currentStepIndex}
            onClick={() => index < currentStepIndex && setStep(item.value)}
            aria-current={item.value === step ? "step" : undefined}
          >
            <span>{index < currentStepIndex ? <Check size={13} /> : index + 1}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <section className="panel wizard-panel">
        {step === "details" && (
          <div className="wizard-content narrow">
            <div className="section-heading"><span className="permission-icon"><Mail size={17} /></span><div><h2>User details</h2><p>The email identifies the account that will be allowed to access Gleynr.</p></div></div>
            <label className="wizard-field">
              <span>Email address <b aria-hidden="true">*</b></span>
              <input type="email" autoComplete="email" value={draft.email} onChange={(event) => { setDraft((current) => ({ ...current, email: event.target.value })); setEmailError(""); }} placeholder="person@company.com" aria-invalid={Boolean(emailError)} aria-describedby={emailError ? "user-email-error" : "user-email-help"} />
              <small id="user-email-help">This is the permitted sign-in address. Authentication is not created in this prototype.</small>
              {emailError && <span className="field-error" id="user-email-error" role="alert">{emailError}</span>}
            </label>
            <label className="wizard-field">
              <span>Account type <b aria-hidden="true">*</b></span>
              <select value={draft.accountType} disabled={editing} onChange={(event) => setDraft((current) => ({ ...current, accountType: event.target.value as User["accountType"] }))}>
                <option value="User">User · standard member</option>
                <option value="Service">Service · reserved for future use</option>
                <option value="Organization" disabled={users.some((user) => user.accountType === "Organization")}>Organization · unrestricted administrator</option>
              </select>
              {draft.accountType === "Organization" && <small className="field-note">Organization accounts always have unrestricted access and cannot be deactivated or deleted.</small>}
            </label>
            {editing && <div className="inline-notice"><LockKeyhole size={15} /> Account type is fixed after the record is created.</div>}
          </div>
        )}

        {step === "access" && (
          <div className="wizard-content">
            <div className="section-heading"><span className="permission-icon"><ShieldCheck size={17} /></span><div><h2>Configure tab access</h2><p>Only granted tabs can be opened for permission configuration.</p></div></div>
            <div className="tab-access-groups">
              <section className="tab-access-group">
                <div className="group-title"><h3>Granted tabs</h3><span>{grantedTabs.length}</span></div>
                {grantedTabs.length ? grantedTabs.map((tab) => (
                  <div className="tab-access-row" key={tab.tab}>
                    <span className="tab-access-state granted"><Check size={14} /></span>
                    <div><strong>{activeLabel(tab)}</strong><small>Access enabled</small></div>
                    <button className="button secondary" onClick={() => { setSelectedTabKey(tab.tab); setStep("permissions"); }}>Configure <ChevronRight size={14} /></button>
                    <button className="icon-button access-toggle" aria-label={`Revoke ${activeLabel(tab)} access`} onClick={() => toggleTabAccess(tab)}><CircleSlash size={16} /></button>
                  </div>
                )) : <p className="group-empty">No tabs are currently granted.</p>}
              </section>
              <section className="tab-access-group">
                <div className="group-title"><h3>Denied tabs</h3><span>{deniedTabs.length}</span></div>
                {deniedTabs.length ? deniedTabs.map((tab) => (
                  <div className="tab-access-row denied-row" key={tab.tab}>
                    <span className="tab-access-state denied"><CircleSlash size={14} /></span>
                    <div><strong>{activeLabel(tab)}</strong><small>Permission settings stay saved, but are inactive</small></div>
                    <button className="button secondary" onClick={() => toggleTabAccess(tab)}>Grant access</button>
                  </div>
                )) : <p className="group-empty">All configured tabs are granted.</p>}
              </section>
            </div>
            {draft.accountType === "Organization" && <div className="inline-notice protected-note"><LockKeyhole size={15} /> The Organization account is unrestricted. Its access is not configurable here.</div>}
          </div>
        )}

        {step === "permissions" && (
          <div className="wizard-content">
            <div className="section-heading"><span className="permission-icon"><ShieldCheck size={17} /></span><div><h2>Configure permissions</h2><p>Permission controls are available only for granted tabs.</p></div></div>
            {!grantedTabs.length ? (
              <div className="users-empty compact"><LockKeyhole size={18} /><strong>No granted tabs to configure</strong><p>Go back to grant access to at least one tab.</p><button className="button secondary" onClick={() => setStep("access")}>Review tab access</button></div>
            ) : (
              <div className="permission-workspace">
                <nav className="permission-tab-list" aria-label="Granted tabs">
                  {grantedTabs.map((tab) => <button key={tab.tab} className={tab.tab === selectedTabKey ? "selected" : ""} onClick={() => { setSelectedTabKey(tab.tab); setSelectedRecords([]); setEditingRecordId(null); }}><span className="permission-tab-dot" />{activeLabel(tab)}<ChevronRight size={14} /></button>)}
                </nav>
                <div className="permission-tab-content">
                  {activeTab && activeDefinition && (
                    <>
                      <div className="permission-tab-title"><h3>{activeLabel(activeTab)} permissions</h3><span className="user-state active"><i />Tab access granted</span></div>
                      {activeDefinition.standalonePermissions.length > 0 && (
                        <section className="permission-section">
                          <div className="permission-section-heading"><div><h4>Standalone Permissions</h4><p>Actions that are not scoped to a specific record.</p></div><span>{activeDefinition.standalonePermissions.length} actions</span></div>
                          <div className="standalone-list">
                            {activeTab.standalonePermissions.map((permission) => (
                              <label className="permission-toggle-row" key={permission.permission}>
                                <span><strong>{permission.permission}</strong></span>
                                <span className="permission-switch-copy">{permission.hasAccess ? "Allowed" : "Denied"}</span>
                                <input type="checkbox" checked={permission.hasAccess} onChange={(event) => updateStandalone(activeTab, { ...permission, hasAccess: event.target.checked })} aria-label={`${permission.hasAccess ? "Revoke" : "Grant"} ${permission.permission}`} />
                              </label>
                            ))}
                          </div>
                        </section>
                      )}
                      {activeDefinition.recordLevelPermissions.length > 0 && (
                        <section className="permission-section record-permission-section">
                          <div className="permission-section-heading"><div><h4>Record-Level Permissions</h4><p>Choose records first, then configure the actions available for each.</p></div><span>{activeDefinition.recordLevelPermissions.length} actions</span></div>
                          <div className="record-toolbar">
                            <label className="search-input record-search"><Search size={14} /><input value={recordSearch} onChange={(event) => setRecordSearch(event.target.value)} placeholder="Find a record" aria-label="Search records" /></label>
                            <select value={recordFilter} onChange={(event) => setRecordFilter(event.target.value as RecordFilter)} aria-label="Filter record permissions"><option>All records</option><option>Configured</option><option>Not configured</option></select>
                          </div>
                          <div className="record-select-all">
                            <label><input type="checkbox" checked={visibleRecords.length > 0 && visibleRecords.every((record) => selectedRecords.includes(record.id))} onChange={(event) => setSelectedRecords((current) => event.target.checked ? [...new Set([...current, ...visibleRecords.map((record) => record.id)])] : current.filter((id) => !visibleRecords.some((record) => record.id === id)))} /> Select all visible</label>
                            <span>{selectedRecords.length} selected</span>
                          </div>
                          {selectedRecords.length > 0 && (
                            <div className="bulk-permission-editor">
                              <div><strong>Apply to {selectedRecords.length} selected {selectedRecords.length === 1 ? "record" : "records"}</strong><small>Unchanged actions retain each record&apos;s current setting.</small></div>
                              <div className="bulk-permission-options">
                                {activeDefinition.recordLevelPermissions.map((permission) => <label key={permission}>{permission}<select value={bulkDraft[permission] ?? "keep"} onChange={(event) => setBulkDraft((current) => ({ ...current, [permission]: event.target.value as BulkChoice }))} aria-label={`Bulk choice for ${permission}`}><option value="keep">Keep current</option><option value="allow">Allow</option><option value="deny">Deny</option></select></label>)}
                              </div>
                              <button className="button primary" onClick={applyBulkPermissions}><CheckCheck size={14} /> Apply choices to selected</button>
                            </div>
                          )}
                          <div className="record-permission-list">
                            {visibleRecords.map((record) => {
                              const configured = activeTab.recordLevelPermissions.some((item) => item.recordId === record.id);
                              const checked = selectedRecords.includes(record.id);
                              return <div className={`record-permission-row ${checked ? "selected" : ""}`} key={record.id}>
                                <input type="checkbox" checked={checked} onChange={(event) => setSelectedRecords((current) => event.target.checked ? [...current, record.id] : current.filter((id) => id !== record.id))} aria-label={`Select ${record.name}`} />
                                <div className="record-copy"><strong>{record.name}</strong><small>{record.detail}</small></div>
                                <span className={`record-config-state ${configured ? "configured" : "not-configured"}`}>{configured ? "Configured" : "Not configured"}</span>
                                <button className="button secondary" onClick={() => beginRecordEdit(record.id)}>{configured ? "Edit" : "Configure"}</button>
                              </div>;
                            })}
                            {!visibleRecords.length && <div className="record-empty">No records match this search or filter.</div>}
                          </div>
                          {editingRecordId && (
                            <RecordEditor
                              record={recordList.find((record) => record.id === editingRecordId)}
                              permissions={recordDraft}
                              hasSavedConfiguration={activeTab.recordLevelPermissions.some((record) => record.recordId === editingRecordId)}
                              onChange={setRecordDraft}
                              onSave={saveRecord}
                              onRemove={removeRecordConfiguration}
                              onCancel={() => setEditingRecordId(null)}
                            />
                          )}
                        </section>
                      )}
                      {!activeDefinition.standalonePermissions.length && !activeDefinition.recordLevelPermissions.length && <div className="permission-empty"><ShieldCheck size={18} /><strong>No permission actions are defined for this tab</strong><p>Tab access remains available; no additional configuration is needed.</p></div>}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {step === "review" && (
          <div className="wizard-content narrow">
            <div className="section-heading"><span className="permission-icon"><CheckCheck size={17} /></span><div><h2>Review access</h2><p>Check the account details and permission summary before continuing.</p></div></div>
            <div className="review-identity"><span className={`user-avatar ${draft.accountType.toLowerCase()}`}><span>{(draft.username || draft.email || "U").slice(0, 1).toUpperCase()}</span></span><div><strong>{draft.email || "Email address not set"}</strong><small>{draft.accountType} account</small></div><span className="invitation-label">{editing ? draft.invitationStatus : "Invite pending"}</span></div>
            <div className="review-tabs">
              {draft.accessAndPermissions.tabAccess.map((tab) => {
                const standaloneGranted = tab.standalonePermissions.filter((permission) => permission.hasAccess).length;
                const configuredRecords = tab.recordLevelPermissions.length;
                const recordGrants = tab.recordLevelPermissions.reduce((count, record) => count + record.permissions.filter((permission) => permission.hasAccess).length, 0);
                return <div className={`review-tab-row ${tab.hasAccess ? "" : "denied"}`} key={tab.tab}><div><strong>{activeLabel(tab)}</strong><small>{tab.hasAccess ? `${standaloneGranted} standalone grants · ${configuredRecords} configured records · ${recordGrants} record grants` : "Tab access denied; saved dependent settings are inactive"}</small></div><span className={`user-state ${tab.hasAccess ? "active" : "inactive"}`}><i />{tab.hasAccess ? "Granted" : "Denied"}</span></div>;
              })}
            </div>
            <div className="inline-notice"><LockKeyhole size={15} /> Denied tab access overrides its standalone and record-level permissions. Saved choices are retained if access is restored later.</div>
          </div>
        )}

        {step === "invite" && (
          <div className="wizard-content invite-complete">
            <span className="invite-icon"><Mail size={22} /></span>
            <div className="eyebrow">Final step</div>
            <h2>{editing ? "Save permission changes" : "Prepare invitation"}</h2>
            <p>{editing ? `Save the updated access configuration for ${draft.email}.` : `An invitation for ${draft.email} will be marked pending. No email will be sent from this prototype.`}</p>
            <div className="invite-summary"><span>Account</span><strong>{draft.accountType}</strong><span>Granted tabs</span><strong>{grantedTabs.length} of {centralTabs.length}</strong><span>Invitation</span><strong>{editing ? draft.invitationStatus : "Pending"}</strong></div>
          </div>
        )}

        <div className="wizard-footer">
          <div>{step !== "details" && <button className="button secondary" onClick={() => setStep(steps[Math.max(currentStepIndex - 1, 0)].value)}><ArrowLeft size={14} /> Back</button>}</div>
          {step === "invite" ? <button className="button primary" onClick={complete}><Check size={15} />{editing ? "Save changes" : "Invite user"}</button> : <button className="button primary" onClick={advance}>Continue <ArrowRight size={14} /></button>}
        </div>
      </section>
    </div>
  );

  function activeLabel(tab: Tab) {
    return tab.displayText || centralTabs.find((definition) => definition.tab === tab.tab)?.displayText || tab.tab;
  }
};

type RecordEditorProps = {
  record?: RecordRef;
  permissions: Permission[];
  hasSavedConfiguration: boolean;
  onChange: (permissions: Permission[]) => void;
  onSave: () => void;
  onRemove: () => void;
  onCancel: () => void;
};

const RecordEditor = ({
  record,
  permissions,
  hasSavedConfiguration,
  onChange,
  onSave,
  onRemove,
  onCancel,
}: RecordEditorProps) => (
  <div className="record-editor" role="region" aria-label={`${record?.name ?? "Record"} permissions`}>
    <div className="record-editor-head"><div><span className="eyebrow">Record permissions</span><h4>{record?.name ?? "Selected record"}</h4><small>{record?.detail}</small></div><button className="icon-button" onClick={onCancel} aria-label="Close record permissions">×</button></div>
    <div className="record-editor-actions">
      {permissions.map((permission) => <label className="permission-toggle-row" key={permission.permission}><span><strong>{permission.permission}</strong></span><span className="permission-switch-copy">{permission.hasAccess ? "Allowed" : "Denied"}</span><input type="checkbox" aria-label={`${permission.hasAccess ? "Revoke" : "Grant"} ${permission.permission}`} checked={permission.hasAccess} onChange={(event) => onChange(permissions.map((item) => item.permission === permission.permission ? { ...item, hasAccess: event.target.checked } : item))} /></label>)}
    </div>
    <div className="record-editor-footer"><div>{hasSavedConfiguration && <button className="button danger subtle-danger" onClick={onRemove}><CircleSlash size={13} /> Remove saved configuration</button>}</div><div><button className="button secondary" onClick={onCancel}>Cancel</button><button className="button primary" onClick={onSave}>Save record</button></div></div>
  </div>
);

export default UserPermissionWizard;