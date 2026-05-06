import { useMemo, useState, type ComponentType, type FormEvent } from "react";
import { createRoot } from "react-dom/client";
import {
  Archive,
  BarChart3,
  CheckCircle2,
  FileText,
  Inbox,
  LogOut,
  Megaphone,
  ShieldCheck,
  UsersRound
} from "lucide-react";
import "./styles.css";

const STORAGE_KEY = "commsflow-state-v1";

type Route = "/login" | "/dashboard" | "/customers" | "/templates" | "/campaigns" | "/inbox" | "/archive";
type Username = "comms_manager" | "compliance_reviewer";
type UserRole = "Comms Manager" | "Compliance Reviewer";
type TemplateStatus = "Draft" | "Pending Approval" | "Approved";
type CampaignStatus = "Sent";
type Channel = "Email" | "SMS" | "Portal" | "Print";

type Permission = "create_template" | "submit_template" | "approve_template" | "send_campaign";

type Account = {
  password: string;
  role: UserRole;
  home: Route;
  permissions: Permission[];
};

type ActiveUser = {
  username: Username;
  role: UserRole;
  permissions: Permission[];
};

type Customer = {
  id: string;
  name: string;
  policy: string;
  channel: Channel;
};

type CommunicationTemplate = {
  id: string;
  name: string;
  status: TemplateStatus;
  version: number;
  owner: UserRole;
};

type Campaign = {
  id: string;
  name: string;
  template: string;
  status: CampaignStatus;
  recipients: number;
};

type ArchiveRecord = {
  id: string;
  campaign: string;
  customer: string;
  policy: string;
  channel: Channel;
  status: CampaignStatus;
};

type AppState = {
  user: ActiveUser | null;
  templates: CommunicationTemplate[];
  campaigns: Campaign[];
  archive: ArchiveRecord[];
  audit: string[];
};

type UpdateState = (updater: AppState | ((current: AppState) => AppState)) => void;
type Navigate = (nextPath: Route) => void;
type IconComponent = ComponentType<{ size?: number }>;

const permissionLabels: Record<Permission, string> = {
  create_template: "Create templates",
  submit_template: "Submit for approval",
  approve_template: "Approve regulated notices",
  send_campaign: "Send campaigns"
};

const users: Record<Username, Account> = {
  comms_manager: {
    password: "commsflow123",
    role: "Comms Manager",
    home: "/dashboard",
    permissions: ["create_template", "submit_template", "send_campaign"]
  },
  compliance_reviewer: {
    password: "commsflow123",
    role: "Compliance Reviewer",
    home: "/templates",
    permissions: ["approve_template"]
  }
};

const customers: Customer[] = [
  { id: "cust-001", name: "Avery Brooks", policy: "POL-10491", channel: "Email" },
  { id: "cust-002", name: "Maya Chen", policy: "POL-20488", channel: "SMS" },
  { id: "cust-003", name: "Nora Singh", policy: "POL-33810", channel: "Portal" },
  { id: "cust-004", name: "Elliot Ward", policy: "POL-44821", channel: "Print" }
];

const defaultState: AppState = {
  user: null,
  templates: [],
  campaigns: [],
  archive: [],
  audit: [
    "System seeded customer communication preferences",
    "Compliance rules loaded for regulated notices"
  ]
};

function slugify(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function routeFromPath(pathname: string): Route {
  const route = pathname === "/" ? "/dashboard" : pathname;
  const validRoutes: Route[] = ["/login", "/dashboard", "/customers", "/templates", "/campaigns", "/inbox", "/archive"];
  return validRoutes.includes(route as Route) ? route as Route : "/dashboard";
}

function loadState(): AppState {
  try {
    const storedState = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}") as Partial<AppState>;
    return {
      ...defaultState,
      ...storedState,
      templates: storedState.templates ?? [],
      campaigns: storedState.campaigns ?? [],
      archive: storedState.archive ?? [],
      audit: storedState.audit ?? defaultState.audit
    };
  } catch {
    return defaultState;
  }
}

function saveState(nextState: AppState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
}

function App() {
  const [state, setState] = useState<AppState>(loadState);
  const [path, setPath] = useState<Route>(routeFromPath(window.location.pathname));

  function updateState(updater: AppState | ((current: AppState) => AppState)): void {
    setState((current) => {
      const next = typeof updater === "function" ? updater(current) : updater;
      saveState(next);
      return next;
    });
  }

  function navigate(nextPath: Route): void {
    window.history.pushState({}, "", nextPath);
    setPath(nextPath);
  }

  function logout(): void {
    updateState((current) => ({ ...current, user: null }));
    navigate("/login");
  }

  if (!state.user && path !== "/login") {
    return <LoginPage state={state} updateState={updateState} navigate={navigate} />;
  }

  return (
    <main className="app-shell" data-testid="app-shell">
      {state.user ? <Topbar user={state.user} navigate={navigate} logout={logout} /> : null}
      {path === "/login" ? <LoginPage state={state} updateState={updateState} navigate={navigate} /> : null}
      {path === "/dashboard" ? <Dashboard state={state} navigate={navigate} /> : null}
      {path === "/customers" ? <CustomersPage /> : null}
      {path === "/templates" ? <TemplatesPage state={state} updateState={updateState} /> : null}
      {path === "/campaigns" ? <CampaignsPage state={state} updateState={updateState} /> : null}
      {path === "/inbox" ? <InboxPage /> : null}
      {path === "/archive" ? <ArchivePage state={state} /> : null}
    </main>
  );
}

function Topbar({ user, navigate, logout }: { user: ActiveUser; navigate: Navigate; logout: () => void }) {
  const links: Array<[Route, string, IconComponent, string]> = [
    ["/dashboard", "Dashboard", BarChart3, "nav-dashboard"],
    ["/customers", "Customers", UsersRound, "nav-customers"],
    ["/templates", "Templates", FileText, "nav-templates"],
    ["/campaigns", "Campaigns", Megaphone, "nav-campaigns"],
    ["/inbox", "Inbox", Inbox, "nav-inbox"],
    ["/archive", "Archive", Archive, "nav-archive"]
  ];

  return (
    <nav className="topbar" aria-label="Primary navigation">
      <button className="brand" data-testid="brand-link" type="button" onClick={() => navigate("/dashboard")}>CommsFlow</button>
      <div className="nav-links">
        {links.map(([href, label, Icon, testId]) => (
          <button key={href} data-testid={testId} type="button" onClick={() => navigate(href)}>
            <Icon size={17} /> {label}
          </button>
        ))}
      </div>
      <div className="user-block">
        <span data-testid="current-user">{user.role}</span>
        <span className="permission-count" data-testid="current-permissions">{user.permissions.length} permissions</span>
        <button data-testid="logout-button" type="button" onClick={logout}><LogOut size={17} /> Logout</button>
      </div>
    </nav>
  );
}

function LoginPage({ state, updateState, navigate }: { state: AppState; updateState: UpdateState; navigate: Navigate }) {
  const [username, setUsername] = useState("comms_manager");
  const [password, setPassword] = useState("commsflow123");
  const [error, setError] = useState("");

  function login(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const account = users[username as Username];
    if (!account || account.password !== password) {
      setError("Invalid credentials or inactive account.");
      return;
    }

    const nextUser: ActiveUser = { username: username as Username, role: account.role, permissions: account.permissions };
    updateState({ ...state, user: nextUser, audit: [`${account.role} signed in`, ...state.audit] });
    navigate(account.home);
  }

  return (
    <section className="auth-layout" data-testid="login-page">
      <div className="auth-copy">
        <p className="eyebrow">Regulated communications</p>
        <h1>CommsFlow</h1>
        <p className="summary">Create, approve, send, and archive critical customer communications in one controlled workflow.</p>
      </div>
      <form className="panel form" data-testid="login-form" onSubmit={login}>
        <h2>Sign in</h2>
        <label>
          Username
          <input data-testid="username-input" value={username} onChange={(event) => setUsername(event.target.value)} />
        </label>
        <label>
          Password
          <input data-testid="password-input" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </label>
        {error ? <p className="error" data-testid="login-error">{error}</p> : null}
        <button className="primary-action" data-testid="login-submit" type="submit">Sign in</button>
        <div className="demo-users" aria-label="Demo users">
          <span>comms_manager</span>
          <span>compliance_reviewer</span>
          <span>password: commsflow123</span>
        </div>
      </form>
    </section>
  );
}

function Dashboard({ state, navigate }: { state: AppState; navigate: Navigate }) {
  const pendingTemplates = state.templates.filter((template) => template.status === "Pending Approval").length;
  const approvedTemplates = state.templates.filter((template) => template.status === "Approved").length;
  const sentCampaigns = state.campaigns.filter((campaign) => campaign.status === "Sent").length;

  return (
    <section className="workspace" data-testid="dashboard-page">
      <PageHeader eyebrow="Command center" title="Dashboard" text="A live view of communications awaiting approval, outbound activity, and audit evidence." />
      <div className="metric-grid">
        <Metric testId="metric-pending-templates" label="Pending templates" value={pendingTemplates} />
        <Metric testId="metric-approved-templates" label="Approved templates" value={approvedTemplates} />
        <Metric testId="metric-sent-campaigns" label="Sent campaigns" value={sentCampaigns} />
        <Metric testId="metric-archive-records" label="Archive records" value={state.archive.length} />
      </div>
      <div className="two-column">
        <section className="panel" data-testid="compliance-alerts">
          <h2>Compliance alerts</h2>
          <p className="muted">Policy renewal notices require reviewer approval before customer delivery.</p>
          <button data-testid="dashboard-open-templates" type="button" onClick={() => navigate("/templates")}>Review templates</button>
        </section>
        {state.user ? <AccessProfile user={state.user} /> : null}
      </div>
      <div className="two-column dashboard-lower">
        <AuditTrail audit={state.audit} />
        <section className="panel" data-testid="demo-workflow">
          <h2>Demo workflow</h2>
          <p className="muted">Create a template, submit it for approval, approve it as reviewer, then send a multi-channel campaign and verify archive evidence.</p>
        </section>
      </div>
    </section>
  );
}

function AccessProfile({ user }: { user: ActiveUser }) {
  return (
    <section className="panel" data-testid="access-profile">
      <h2>Access profile</h2>
      <p className="muted" data-testid="access-role">{user.role}</p>
      <div className="permission-list" data-testid="permission-list">
        {user.permissions.map((permission) => (
          <span key={permission}>{permissionLabels[permission]}</span>
        ))}
      </div>
    </section>
  );
}

function Metric({ testId, label, value }: { testId: string; label: string; value: number }) {
  return (
    <article className="metric" data-testid={testId}>
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

function CustomersPage() {
  return (
    <section className="workspace" data-testid="customers-page">
      <PageHeader eyebrow="Consumer" title="Customers" text="Communication preferences drive channel selection for regulated notices." />
      <div className="table panel">
        <div className="table-row table-head"><span>Name</span><span>Policy</span><span>Preferred channel</span></div>
        {customers.map((customer) => (
          <div className="table-row" data-testid={`customer-row-${customer.id}`} key={customer.id}>
            <span>{customer.name}</span><span>{customer.policy}</span><span>{customer.channel}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function TemplatesPage({ state, updateState }: { state: AppState; updateState: UpdateState }) {
  const [name, setName] = useState("Policy Renewal Notice");
  const canCreateTemplate = state.user?.permissions.includes("create_template") ?? false;
  const canSubmitTemplate = state.user?.permissions.includes("submit_template") ?? false;
  const canApproveTemplate = state.user?.permissions.includes("approve_template") ?? false;

  function createTemplate(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const id = slugify(name);
    if (!state.user || state.templates.some((template) => template.id === id)) {
      return;
    }
    const template: CommunicationTemplate = { id, name, status: "Draft", version: 1, owner: state.user.role };
    updateState((current) => ({
      ...current,
      templates: [template, ...current.templates],
      audit: [`Template ${name} created as draft`, ...current.audit]
    }));
  }

  function setTemplateStatus(template: CommunicationTemplate, status: TemplateStatus): void {
    updateState((current) => ({
      ...current,
      templates: current.templates.map((item) => item.id === template.id ? { ...item, status } : item),
      audit: [`Template ${template.name} moved to ${status}`, ...current.audit]
    }));
  }

  return (
    <section className="workspace" data-testid="templates-page">
      <PageHeader eyebrow="Composer" title="Templates" text="Draft notices, submit them for review, and capture compliance approval." />
      {canCreateTemplate ? (
        <form className="panel inline-form" data-testid="template-form" onSubmit={createTemplate}>
          <label>
            Template name
            <input data-testid="template-name-input" value={name} onChange={(event) => setName(event.target.value)} />
          </label>
          <button className="primary-action" data-testid="template-create-button" type="submit">Create template</button>
        </form>
      ) : (
        <section className="panel permission-note" data-testid="template-permission-note">
          <h2>Template creation restricted</h2>
          <p className="muted">Only Comms Managers can create and submit new customer communication templates.</p>
        </section>
      )}
      <div className="card-grid" data-testid="template-list">
        {state.templates.map((template) => (
          <article className="panel record-card" data-testid={`template-card-${template.id}`} key={template.id}>
            <div>
              <p className="eyebrow">Version {template.version}</p>
              <h2>{template.name}</h2>
              <p className="muted">Owner: {template.owner}</p>
            </div>
            <details data-testid={`template-details-${template.id}`}>
              <summary>Template details</summary>
              <dl>
                <div><dt>Document type</dt><dd>Policy renewal notice</dd></div>
                <div><dt>Approval policy</dt><dd>Compliance approval required before send</dd></div>
                <div><dt>Channels</dt><dd>Email, SMS, Portal, Print</dd></div>
              </dl>
            </details>
            <StatusBadge status={template.status} testId={`template-status-${template.id}`} />
            {canSubmitTemplate && template.status === "Draft" ? (
              <button data-testid={`submit-template-${template.id}`} type="button" onClick={() => setTemplateStatus(template, "Pending Approval")}>Submit for approval</button>
            ) : null}
            {canApproveTemplate && template.status === "Pending Approval" ? (
              <button className="primary-action" data-testid={`approve-template-${template.id}`} type="button" onClick={() => setTemplateStatus(template, "Approved")}>Approve template</button>
            ) : null}
            {!canApproveTemplate && template.status === "Pending Approval" ? (
              <p className="permission-note-inline" data-testid={`manager-approval-blocked-${template.id}`}>Approval is restricted to Compliance Reviewers.</p>
            ) : null}
          </article>
        ))}
        {!state.templates.length ? (
          <section className="panel empty-state" data-testid="templates-empty-state">
            No communication templates exist yet.
          </section>
        ) : null}
      </div>
    </section>
  );
}

function CampaignsPage({ state, updateState }: { state: AppState; updateState: UpdateState }) {
  const canSendCampaign = state.user?.permissions.includes("send_campaign") ?? false;
  const approvedTemplates = state.templates.filter((template) => template.status === "Approved");
  const [name, setName] = useState("Policy Renewal May 2026");
  const [templateId, setTemplateId] = useState(approvedTemplates[0]?.id ?? "");
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>(customers.map((customer) => customer.id));

  function toggleCustomer(customerId: string): void {
    setSelectedCustomers((current) => current.includes(customerId) ? current.filter((id) => id !== customerId) : [...current, customerId]);
  }

  function sendCampaign(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const template = approvedTemplates.find((item) => item.id === templateId);
    if (!template || selectedCustomers.length === 0) {
      return;
    }
    const id = slugify(name);
    const recipients = customers.filter((customer) => selectedCustomers.includes(customer.id));
    const campaign: Campaign = { id, name, template: template.name, status: "Sent", recipients: recipients.length };
    const archiveRecords: ArchiveRecord[] = recipients.map((customer) => ({
      id: `${id}-${customer.id}`,
      campaign: name,
      customer: customer.name,
      policy: customer.policy,
      channel: customer.channel,
      status: "Sent"
    }));
    updateState((current) => ({
      ...current,
      campaigns: [campaign, ...current.campaigns.filter((item) => item.id !== id)],
      archive: [...archiveRecords, ...current.archive.filter((item) => !item.id.startsWith(`${id}-`))],
      audit: [`Campaign ${name} sent to ${recipients.length} customers`, ...current.audit]
    }));
  }

  return (
    <section className="workspace" data-testid="campaigns-page">
      <PageHeader eyebrow="Send" title="Campaigns" text="Select an approved template and deliver it through each customer's preferred channel." />
      <form className="panel form-wide" data-testid="campaign-form" onSubmit={sendCampaign}>
        <label>
          Campaign name
          <input data-testid="campaign-name-input" value={name} onChange={(event) => setName(event.target.value)} />
        </label>
        <label>
          Approved template
          <select data-testid="campaign-template-select" value={templateId} onChange={(event) => setTemplateId(event.target.value)}>
            <option value="">Select approved template</option>
            {approvedTemplates.map((template) => <option key={template.id} value={template.id}>{template.name}</option>)}
          </select>
        </label>
        <div className="recipient-list" data-testid="recipient-list">
          {customers.map((customer) => (
            <label className="checkbox-row" key={customer.id}>
              <input data-testid={`customer-checkbox-${customer.id}`} type="checkbox" checked={selectedCustomers.includes(customer.id)} onChange={() => toggleCustomer(customer.id)} />
              <span>{customer.name}</span>
              <strong>{customer.channel}</strong>
            </label>
          ))}
        </div>
        {!approvedTemplates.length ? <p className="error" data-testid="campaign-no-template-warning">An approved template is required before a campaign can be sent.</p> : null}
        {!canSendCampaign ? <p className="error" data-testid="campaign-permission-warning">Only Comms Managers can send campaigns.</p> : null}
        <button className="primary-action" data-testid="campaign-send-button" disabled={!templateId || !canSendCampaign} type="submit">Send campaign</button>
      </form>
      <CampaignList campaigns={state.campaigns} />
    </section>
  );
}

function CampaignList({ campaigns }: { campaigns: Campaign[] }) {
  return (
    <div className="card-grid" data-testid="campaign-list">
      {campaigns.map((campaign) => (
        <article className="panel record-card" data-testid={`campaign-card-${campaign.id}`} key={campaign.id}>
          <h2>{campaign.name}</h2>
          <p className="muted">Template: {campaign.template}</p>
          <p className="muted">Recipients: {campaign.recipients}</p>
          <details data-testid={`campaign-details-${campaign.id}`}>
            <summary>Campaign details</summary>
            <dl>
              <div><dt>Delivery mode</dt><dd>Customer preference based routing</dd></div>
              <div><dt>Evidence</dt><dd>Archive records and audit trail generated on send</dd></div>
            </dl>
          </details>
          <StatusBadge status={campaign.status} testId={`campaign-status-${campaign.id}`} />
        </article>
      ))}
      {!campaigns.length ? (
        <section className="panel empty-state" data-testid="campaigns-empty-state">
          No campaigns have been sent yet.
        </section>
      ) : null}
    </div>
  );
}

function InboxPage() {
  return (
    <section className="workspace" data-testid="inbox-page">
      <PageHeader eyebrow="Receive" title="Inbox" text="Incoming customer responses and document intake will live here in the next iteration." />
      <section className="panel empty-state">No inbound messages require action.</section>
    </section>
  );
}

function ArchivePage({ state }: { state: AppState }) {
  const [search, setSearch] = useState("");
  const filteredArchive = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return state.archive;
    }
    return state.archive.filter((record) => [record.customer, record.policy, record.campaign, record.channel, record.status].some((value) => value.toLowerCase().includes(query)));
  }, [search, state.archive]);
  const recordsByChannel = useMemo(() => {
    return filteredArchive.reduce<Partial<Record<Channel, number>>>((summary, record) => ({ ...summary, [record.channel]: (summary[record.channel] ?? 0) + 1 }), {});
  }, [filteredArchive]);

  return (
    <section className="workspace" data-testid="archive-page">
      <PageHeader eyebrow="Archive" title="Communication archive" text="Searchable evidence of what was sent, to whom, through which channel, and why." />
      <label className="archive-search">
        Search archive
        <input data-testid="archive-search-input" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Customer, policy, campaign, channel" />
      </label>
      <div className="channel-summary" data-testid="channel-summary">
        {Object.entries(recordsByChannel).map(([channel, count]) => <span key={channel}>{channel}: {count}</span>)}
      </div>
      <div className="table panel" data-testid="archive-records">
        <div className="table-row table-head"><span>Customer</span><span>Policy</span><span>Campaign</span><span>Channel</span><span>Status</span></div>
        {!state.archive.length ? <div className="table-row archive-empty" data-testid="archive-initial-empty-state"><span>No communication evidence has been archived yet.</span></div> : null}
        {filteredArchive.map((record) => (
          <div className="table-row" data-testid={`archive-record-${slugify(record.customer)}`} key={record.id}>
            <span>{record.customer}</span><span>{record.policy}</span><span>{record.campaign}</span><span>{record.channel}</span><span>{record.status}</span>
          </div>
        ))}
        {state.archive.length > 0 && !filteredArchive.length ? <div className="table-row archive-empty" data-testid="archive-empty-state"><span>No archive records match the current search.</span></div> : null}
      </div>
    </section>
  );
}

function AuditTrail({ audit }: { audit: string[] }) {
  return (
    <section className="panel" data-testid="audit-trail">
      <h2>Audit trail</h2>
      <ol>
        {audit.slice(0, 6).map((entry, index) => <li key={`${entry}-${index}`}>{entry}</li>)}
      </ol>
    </section>
  );
}

function PageHeader({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return (
    <header className="page-header">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p className="summary">{text}</p>
    </header>
  );
}

function StatusBadge({ status, testId }: { status: TemplateStatus | CampaignStatus; testId: string }) {
  return <span className={`status-badge status-${slugify(status)}`} data-testid={testId}><ShieldCheck size={16} /> {status}</span>;
}

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element was not found.");
}

createRoot(rootElement).render(<App />);

