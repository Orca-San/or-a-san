const STORAGE_KEY = "orcasan.workspace.v2";
const LEGACY_STORAGE_KEY = "orcasan.current-budget.v1";
const CLOUD_CONFIG_KEY = "orcasan.cloud-config.v1";
const CLOUD_SESSION_KEY = "orcasan.cloud-session.v1";
const ADMIN_MODE_KEY = "orcasan.admin-mode.v1";
const DEFAULT_CLOUD_API_URL = "https://dtfvrjlmncrijniqskhv.supabase.co/rest/v1/";
const DEFAULT_CLOUD_PUBLISHABLE_KEY = "sb_publishable_qr_f9x2Os79RHQG0XhX_4Q_1uh14LGe";
const PUBLIC_APP_URL = "https://orcasan.vercel.app/";
const DEFAULT_BID_STATUS = "Identificada";
const BID_STATUSES = [
  "Identificada",
  "Em análise",
  "Aprovada",
  "Recusada",
  "Em orçamento",
  "Em revisão",
  "Proposta enviada",
  "Ganha",
  "Perdida",
  "Declinada",
];
const LEGACY_BID_STATUS_MAP = {
  Enviada: "Proposta enviada",
  Vencida: "Perdida",
  draft: "Identificada",
  pricing: "Em orçamento",
  review: "Em revisão",
  submitted: "Proposta enviada",
  won: "Ganha",
  lost: "Perdida",
  archived: "Declinada",
};
const ANALYSIS_AVAILABLE_STATUSES = ["Aprovada", "Em orçamento", "Em revisão", "Proposta enviada", "Ganha"];
const BUDGET_AVAILABLE_STATUSES = ["Aprovada", "Em orçamento", "Em revisão", "Proposta enviada", "Ganha", "Perdida"];
const BUDGET_WORK_STATUSES = ["Não iniciado", "Em andamento", "Aguardando informações", "Em revisão", "Finalizado"];
const BDI_COMPONENT_KEYS = [
  "admin",
  "insurance",
  "guarantees",
  "risk",
  "finance",
  "profit",
  "iss",
  "pisCofins",
  "cprb",
  "otherTaxes",
];
const COMPOSITION_INPUT_TYPES = ["material", "labor", "equipment", "service", "other"];
const COMPOSITION_INPUT_TYPE_LABELS = {
  material: "Material",
  labor: "Mão de obra",
  equipment: "Equipamento",
  service: "Serviço",
  other: "Outro",
};
const TECHNICAL_QUALIFICATION_FIELDS = [
  "acervo",
  "cat",
  "quantitativos",
  "atestados",
  "certificacoes",
  "creaCau",
  "equipeMinima",
  "observacoes",
];
const TECHNICAL_QUALIFICATION_LABELS = {
  acervo: "Acervo técnico",
  cat: "CAT",
  quantitativos: "Quantitativos mínimos",
  atestados: "Atestados",
  certificacoes: "Certificações",
  creaCau: "CREA/CAU",
  equipeMinima: "Equipe mínima",
  observacoes: "Observações",
};
const TECHNICAL_QUALIFICATION_REQUIREMENT_KEYS = TECHNICAL_QUALIFICATION_FIELDS.filter((field) => field !== "observacoes");
const REQUIRED_IMPORT_COLUMNS = ["description"];
const RECOMMENDED_IMPORT_COLUMNS = ["description", "unit", "quantity", "unitPrice"];
const IMPORT_FIELD_DEFINITIONS = [
  { key: "description", label: "Descrição", required: true, defaultText: "" },
  { key: "unit", label: "Unidade", required: false, recommended: true, defaultText: "un" },
  { key: "quantity", label: "Quantidade", required: false, recommended: true, defaultText: "1" },
  { key: "unitPrice", label: "Preço unitário", required: false, recommended: true, defaultText: "R$ 0,00" },
  { key: "code", label: "Item", required: false, recommended: false, defaultText: "item automático" },
  { key: "stage", label: "Grupo", required: false, recommended: false, defaultText: "Importado da planilha" },
];
const IMPORT_COLUMN_ALIASES = {
  description: ["descrição", "descricao", "descr", "desc", "serviço", "servico", "item", "objeto"],
  unit: ["unidade", "un", "und"],
  quantity: ["quantidade", "qtd", "qtde", "quant", "quantd"],
  unitPrice: [
    "preco_unitario",
    "preço unitário",
    "preco unitario",
    "valor unitário",
    "valor unitario",
    "vl unit",
    "vlr unit",
    "vl unitario",
    "vlr unitario",
    "unitario",
    "preço",
    "preco",
    "valor",
    "preço unitário sem bdi",
    "preco unitario sem bdi",
  ],
  code: ["item", "codigo", "código", "cod", "ref", "referência", "referencia"],
  stage: ["grupo", "etapa", "categoria", "fase"],
};
const IMPORT_ALIAS_WEIGHTS = {
  description: {
    item: 0.7,
    objeto: 0.84,
  },
  unitPrice: {
    preco: 0.82,
    valor: 0.78,
    unitario: 0.86,
  },
};

function defaultTechnicalQualification() {
  return {
    acervo: "",
    cat: "",
    quantitativos: "",
    atestados: "",
    certificacoes: "",
    creaCau: "",
    equipeMinima: "",
    observacoes: "",
  };
}

function defaultBid() {
  return {
    company: "Construtora Exemplo Saneamento Ltda.",
    companyDocument: "12.345.678/0001-90",
    title: "Implantação de rede coletora de esgoto - Setor Norte",
    agency: "Prefeitura Municipal de São Bento",
    editalNumber: "Concorrência 012/2026",
    location: "São Bento / SP",
    workType: "Rede coletora de esgoto",
    openingDate: "2026-05-14",
    estimatedValue: 0,
    sealedValue: false,
    proposalDeadline: "",
    modality: "",
    executionDays: 180,
    validityDays: 60,
    technicalOwner: "Eng. Responsável",
    technicalRegistry: "CREA 0000000000",
    status: DEFAULT_BID_STATUS,
    decision: "",
    rejectionReason: "",
    decisionDate: "",
    budgetStatus: "Não iniciado",
    budgetOwner: "",
    budgetStartDate: "",
    budgetDueDate: "",
    budgetProgress: 0,
    budgetProgressManual: false,
    technicalQualification: defaultTechnicalQualification(),
  };
}

function defaultBdi() {
  return {
    admin: 4.2,
    insurance: 0.4,
    guarantees: 0.4,
    risk: 1.25,
    finance: 1.1,
    profit: 7,
    iss: 3,
    pisCofins: 3.65,
    cprb: 0,
    otherTaxes: 0,
    enabledCharges: defaultBdiEnabledCharges(),
  };
}

function defaultBdiEnabledCharges() {
  return Object.fromEntries(BDI_COMPONENT_KEYS.map((key) => [key, true]));
}

function defaultItems() {
  return [
    {
      id: "item-01",
      stage: "Serviços preliminares",
      code: "01.01",
      description: "Mobilização, instalação de canteiro e placa de obra",
      unit: "vb",
      quantity: 1,
      unitPrice: 38500,
    },
    {
      id: "item-02",
      stage: "Movimento de terra",
      code: "02.03",
      description: "Escavação mecanizada de vala em solo de 1ª categoria",
      unit: "m³",
      quantity: 4280,
      unitPrice: 42.9,
    },
    {
      id: "item-03",
      stage: "Rede coletora",
      code: "03.02",
      description: "Assentamento de tubo PVC Ocre DN 200 mm para esgoto",
      unit: "m",
      quantity: 3120,
      unitPrice: 96.4,
    },
    {
      id: "item-04",
      stage: "Rede coletora",
      code: "03.05",
      description: "Fornecimento de tubo PVC Ocre DN 200 mm",
      unit: "m",
      quantity: 3120,
      unitPrice: 138.2,
    },
    {
      id: "item-05",
      stage: "Poços de visita",
      code: "04.01",
      description: "Poço de visita em concreto armado, profundidade até 2,00 m",
      unit: "un",
      quantity: 36,
      unitPrice: 3120,
    },
    {
      id: "item-06",
      stage: "Ligações",
      code: "05.02",
      description: "Ligação domiciliar de esgoto com caixa de inspeção",
      unit: "un",
      quantity: 420,
      unitPrice: 468,
    },
    {
      id: "item-07",
      stage: "Pavimentação",
      code: "06.04",
      description: "Recomposição de pavimento asfáltico",
      unit: "m²",
      quantity: 1980,
      unitPrice: 88.6,
    },
  ];
}

function defaultCompositions() {
  return [
    {
      id: "composition-01",
      code: "COMP-ESG-001",
      title: "Assentamento de tubo PVC Ocre DN 200 mm",
      unit: "m",
      cost: 96.4,
      note: "Inclui equipe, preparo de vala, regularização de berço e assentamento.",
      inputs: [
        {
          id: "composition-input-01-01",
          type: "material",
          description: "Tubo PVC Ocre DN 200 mm e conexões",
          unit: "m",
          quantity: 1,
          unitCost: 62.4,
        },
        {
          id: "composition-input-01-02",
          type: "labor",
          description: "Equipe de assentamento e apoio",
          unit: "m",
          quantity: 1,
          unitCost: 34,
        },
      ],
    },
    {
      id: "composition-02",
      code: "COMP-ESG-002",
      title: "Poço de visita em concreto armado até 2,00 m",
      unit: "un",
      cost: 3120,
      note: "Com forma, armação, concreto, tampa e acabamento interno.",
      inputs: [
        {
          id: "composition-input-02-01",
          type: "material",
          description: "Concreto, aço, formas e tampa",
          unit: "un",
          quantity: 1,
          unitCost: 2280,
        },
        {
          id: "composition-input-02-02",
          type: "labor",
          description: "Equipe de execução e acabamento",
          unit: "un",
          quantity: 1,
          unitCost: 840,
        },
      ],
    },
    {
      id: "composition-03",
      code: "COMP-PAV-001",
      title: "Recomposição de pavimento asfáltico",
      unit: "m²",
      cost: 88.6,
      note: "Base compactada, imprimação, CBUQ e acabamento de bordas.",
      inputs: [
        {
          id: "composition-input-03-01",
          type: "material",
          description: "CBUQ, imprimação e material de base",
          unit: "m²",
          quantity: 1,
          unitCost: 61.8,
        },
        {
          id: "composition-input-03-02",
          type: "equipment",
          description: "Compactador, ferramentas e apoio operacional",
          unit: "m²",
          quantity: 1,
          unitCost: 26.8,
        },
      ],
    },
  ];
}

function demoBudget() {
  return {
    id: "budget-01",
    createdAt: "2026-04-30T00:00:00.000Z",
    bid: defaultBid(),
    bdi: defaultBdi(),
    items: defaultItems(),
  };
}

const defaultState = {
  activeBudgetId: "budget-01",
  budgets: [demoBudget()],
  compositions: defaultCompositions(),
};

let encodingRepairSuggested = false;
let state = loadState();
let saveTimer;
let cloudAutoSyncTimer;
let isCloudSyncing = false;
let bidStatusFilter = "Todas";
let deferredInstallPrompt = null;
let pendingBudgetImportItems = [];
let pendingBudgetImportRows = [];
let pendingBudgetImportColumns = {};
let pendingTechnicalQualificationSuggestion = null;
let newBidWizardStep = 0;

const NEW_BID_WIZARD_TITLES = ["Dados básicos", "Local e prazos", "Como deseja começar", "Confirmação"];

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const percentFormatter = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  timeZone: "UTC",
});

const appShell = document.querySelector(".app-shell");
const authScreen = document.querySelector("#auth-screen");
const authTabs = document.querySelectorAll("[data-auth-mode]");
const authTitle = document.querySelector("#auth-title");
const authHint = document.querySelector("#auth-hint");
const authBackApp = document.querySelector("#auth-back-app");
const itemsBody = document.querySelector("#items-body");
const abcList = document.querySelector("#abc-list");
const alertsList = document.querySelector("#alerts-list");
const decisionSummary = document.querySelector("#decision-summary");
const decisionStatus = document.querySelector("#decision-status");
const approveOpportunityButton = document.querySelector("#approve-opportunity");
const rejectOpportunityButton = document.querySelector("#reject-opportunity");
const rejectionControls = document.querySelector("#rejection-controls");
const rejectionReasonSelect = document.querySelector("#rejection-reason");
const confirmRejectionButton = document.querySelector("#confirm-rejection");
const technicalQualificationInputs = document.querySelectorAll("[data-tech]");
const technicalQualificationCount = document.querySelector("#technical-qualification-count");
const readEditalAiButton = document.querySelector("#read-edital-ai");
const editalAiFileInput = document.querySelector("#edital-ai-file");
const techAiStatus = document.querySelector("#tech-ai-status");
const techAiReview = document.querySelector("#tech-ai-review");
const techAiReviewFields = document.querySelector("#tech-ai-review-fields");
const cancelTechAiReviewButton = document.querySelector("#cancel-tech-ai-review");
const applyTechAiReviewButton = document.querySelector("#apply-tech-ai-review");
const analysisLockedMessage = document.querySelector("#analysis-locked-message");
const analysisAbcPanel = document.querySelector("#analysis-abc-panel");
const analysisAlertsPanel = document.querySelector("#analysis-alerts-panel");
const budgetApprovalBlocker = document.querySelector("#budget-approval-blocker");
const budgetTableWrap = document.querySelector("#orcamento .table-wrap");
const budgetPanelActions = document.querySelector("#orcamento .panel-actions");
const budgetTrackingInputs = document.querySelectorAll("[data-budget-tracking]");
const budgetProgressInput = document.querySelector("#budget-progress-input");
const budgetProgressBar = document.querySelector("#budget-progress-bar");
const budgetProgressMode = document.querySelector("#budget-progress-mode");
const recalculateBudgetProgressButton = document.querySelector("#recalculate-budget-progress");
const compositionList = document.querySelector("#composition-list");
const reportList = document.querySelector("#report-list");
const bidsList = document.querySelector("#bids-list");
const pipelineGrid = document.querySelector("#pipeline-grid");
const bidFilters = document.querySelector("#bid-filters");
const activeBudgetCard = document.querySelector("#active-budget-card");
const activeBudgetLabel = document.querySelector("#active-budget-label");
const stageChart = document.querySelector("#stage-chart");
const abcChartWrap = document.querySelector("#abc-chart-wrap");
const bdiChart = document.querySelector("#bdi-chart");
const navItems = document.querySelectorAll(".nav-item");
const workspaceNav = document.querySelector("#workspace-nav");
const workspaceLinks = document.querySelectorAll("[data-workspace-link]");
const pageSections = document.querySelectorAll(".page-section");
const dashboardRecentList = document.querySelector("#dashboard-recent-list");
const bdiInputs = document.querySelectorAll(".bdi-input");
const bdiIncludeInputs = document.querySelectorAll("[data-bdi-include]");
const bidInputs = document.querySelectorAll("[data-bid]");
const estimatedValueInput = document.querySelector('[data-bid="estimatedValue"]');
const estimatedValueField = document.querySelector("[data-estimated-value-field]");
const sealedValueInput = document.querySelector('[data-bid="sealedValue"]');
const addItemButton = document.querySelector("#add-item");
const addCompositionButton = document.querySelector("#add-composition");
const resetTaxBdiButton = document.querySelector("#reset-tax-bdi");
const downloadCsvTemplateButton = document.querySelector("#download-csv-template");
const importCsvButton = document.querySelector("#import-csv");
const csvFileInput = document.querySelector("#csv-file");
const budgetImportModal = document.querySelector("#budget-import-modal");
const closeBudgetImportButton = document.querySelector("#close-budget-import");
const chooseBudgetImportFileButton = document.querySelector("#choose-budget-import-file");
const changeBudgetImportFileButton = document.querySelector("#change-budget-import-file");
const cancelBudgetImportButton = document.querySelector("#cancel-budget-import");
const confirmBudgetImportButton = document.querySelector("#confirm-budget-import");
const budgetImportFileName = document.querySelector("#budget-import-file-name");
const budgetImportMessage = document.querySelector("#budget-import-message");
const budgetImportMapping = document.querySelector("#budget-import-mapping");
const budgetImportMappingBody = document.querySelector("#budget-import-mapping-body");
const budgetImportPreview = document.querySelector("#budget-import-preview");
const budgetImportSummary = document.querySelector("#budget-import-summary");
const budgetImportPreviewBody = document.querySelector("#budget-import-preview-body");
const saveButton = document.querySelector("#save-data");
const resetButton = document.querySelector("#reset-demo");
const exportButton = document.querySelector("#export-csv");
const exportXlsButton = document.querySelector("#export-xls");
const exportBackupButton = document.querySelector("#export-backup");
const exportBackupSecondaryButton = document.querySelector("#export-backup-secondary");
const importBackupButton = document.querySelector("#import-backup");
const backupFileInput = document.querySelector("#backup-file");
const printButton = document.querySelector("#print-proposal");
const saveSecondaryButton = document.querySelector("#save-data-secondary");
const installAppButton = document.querySelector("#install-app");
const installAppSecondaryButton = document.querySelector("#install-app-secondary");
const installStatus = document.querySelector("#install-status");
const refreshAppButton = document.querySelector("#refresh-app");
const newBudgetButtons = document.querySelectorAll("[data-new-budget]");
const saveStatus = document.querySelector("#save-status");
const toast = document.querySelector("#toast");
const proposalPrint = document.querySelector("#proposal-print");
const cloudTechnicalPanel = document.querySelector("#cloud-technical-panel");
const cloudApiUrlInput = document.querySelector("#cloud-api-url");
const cloudPublishableKeyInput = document.querySelector("#cloud-publishable-key");
const cloudStatus = document.querySelector("#cloud-status");
const saveCloudConfigButton = document.querySelector("#save-cloud-config");
const testCloudConnectionButton = document.querySelector("#test-cloud-connection");
const createCloudWorkspaceButton = document.querySelector("#create-cloud-workspace");
const syncActiveCloudButton = document.querySelector("#sync-active-cloud");
const syncAllCloudButton = document.querySelector("#sync-all-cloud");
const loadCloudDataButton = document.querySelector("#load-cloud-data");
const authNameInput = document.querySelector("#auth-name");
const authCompanyInput = document.querySelector("#auth-company");
const authEmailInput = document.querySelector("#auth-email");
const authPasswordInput = document.querySelector("#auth-password");
const authStatus = document.querySelector("#auth-status");
const signInCloudButton = document.querySelector("#sign-in-cloud");
const signUpCloudButton = document.querySelector("#sign-up-cloud");
const resendAuthEmailButton = document.querySelector("#resend-auth-email");
const requestPasswordCloudButton = document.querySelector("#request-password-cloud");
const updatePasswordCloudButton = document.querySelector("#update-password-cloud");
const signOutCloudButton = document.querySelector("#sign-out-cloud");
const settingsBdiPercent = document.querySelector("#settings-bdi-percent");
const settingsUserEmail = document.querySelector("#settings-user-email");
const settingsChangePasswordButton = document.querySelector("#settings-change-password");
const settingsSignOutButton = document.querySelector("#settings-sign-out");
const encodingTools = document.querySelector("#encoding-tools");
const encodingStatus = document.querySelector("#encoding-status");
const fixLoadedEncodingButton = document.querySelector("#fix-loaded-encoding");
const logoutConfirmation = document.querySelector("#logout-confirmation");
const cancelLogoutButton = document.querySelector("#cancel-logout");
const confirmLogoutButton = document.querySelector("#confirm-logout");
const newBidWizard = document.querySelector("#new-bid-wizard");
const newBidWizardForm = document.querySelector("#new-bid-wizard-form");
const closeNewBidWizardButton = document.querySelector("#close-new-bid-wizard");
const newBidWizardBackButton = document.querySelector("#new-bid-wizard-back");
const newBidWizardNextButton = document.querySelector("#new-bid-wizard-next");
const newBidWizardCreateButton = document.querySelector("#new-bid-wizard-create");
const newBidWizardProgress = document.querySelector("#new-bid-wizard-progress");
const newBidWizardTitle = document.querySelector("#new-bid-wizard-title");
const newBidWizardError = document.querySelector("#new-bid-wizard-error");
const newBidWizardSummary = document.querySelector("#new-bid-wizard-summary");
const newBidWizardPanels = document.querySelectorAll("[data-wizard-step]");
const newBidWizardIndicators = document.querySelectorAll("[data-wizard-step-indicator]");
const wizardBidTitleInput = document.querySelector("#wizard-bid-title");
const wizardBidAgencyInput = document.querySelector("#wizard-bid-agency");
const wizardBidWorkTypeInput = document.querySelector("#wizard-bid-work-type");
const wizardBidLocationInput = document.querySelector("#wizard-bid-location");
const wizardBidOpeningDateInput = document.querySelector("#wizard-bid-opening-date");
const wizardBidExecutionDaysInput = document.querySelector("#wizard-bid-execution-days");
const wizardBidValidityDaysInput = document.querySelector("#wizard-bid-validity-days");
const wizardStartModeInputs = document.querySelectorAll("input[name='wizard-start-mode']");

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function createId() {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID();
  return `id-${Date.now()}-${Math.round(Math.random() * 1000)}`;
}

const CP1252_BYTE_BY_CODE_POINT = new Map([
  [0x20ac, 0x80],
  [0x201a, 0x82],
  [0x0192, 0x83],
  [0x201e, 0x84],
  [0x2026, 0x85],
  [0x2020, 0x86],
  [0x2021, 0x87],
  [0x02c6, 0x88],
  [0x2030, 0x89],
  [0x0160, 0x8a],
  [0x2039, 0x8b],
  [0x0152, 0x8c],
  [0x017d, 0x8e],
  [0x2018, 0x91],
  [0x2019, 0x92],
  [0x201c, 0x93],
  [0x201d, 0x94],
  [0x2022, 0x95],
  [0x2013, 0x96],
  [0x2014, 0x97],
  [0x02dc, 0x98],
  [0x2122, 0x99],
  [0x0161, 0x9a],
  [0x203a, 0x9b],
  [0x0153, 0x9c],
  [0x017e, 0x9e],
  [0x0178, 0x9f],
]);

function hasMojibakeText(value) {
  return /(?:Ã|Â|â|�)/u.test(String(value || ""));
}

function repairTextEncoding(value) {
  if (typeof value !== "string") return value;
  if (!hasMojibakeText(value) || typeof TextDecoder === "undefined") return value.normalize("NFC");

  let best = value;
  let bestScore = textEncodingIssueScore(value);

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const repaired = decodeMojibakeOnce(best);
    const score = textEncodingIssueScore(repaired);

    if (score >= bestScore || repaired === best) break;

    best = repaired;
    bestScore = score;

    if (!hasMojibakeText(best)) break;
  }

  if (best !== value) encodingRepairSuggested = true;
  return best.normalize("NFC");
}

function textEncodingIssueScore(value) {
  const text = String(value || "");
  const mojibakeMatches = text.match(/(?:Ã.|Â.|â..|�)/gu) || [];
  return mojibakeMatches.length * 3 + (text.match(/[ÃÂâ�]/gu) || []).length;
}

function decodeMojibakeOnce(value) {
  if (typeof TextDecoder === "undefined") return value;

  const bytes = [];

  for (const char of value) {
    const codePoint = char.codePointAt(0);
    const byte = CP1252_BYTE_BY_CODE_POINT.get(codePoint) ?? (codePoint <= 0xff ? codePoint : null);

    if (byte === null) return value;
    bytes.push(byte);
  }

  const repaired = new TextDecoder("utf-8").decode(new Uint8Array(bytes));
  return repaired.includes("\uFFFD") ? value : repaired;
}

function cleanText(value, fallback = "") {
  return repairTextEncoding(String(value ?? fallback));
}

function parseBoolean(value) {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value !== 0;

  const text = cleanText(value).trim().toLowerCase();
  if (!text) return false;
  return ["1", "true", "sim", "yes", "on"].includes(text);
}

function normalizeBidStatus(value) {
  const status = cleanText(value).trim();
  const mappedStatus = LEGACY_BID_STATUS_MAP[status] || status;

  return BID_STATUSES.includes(mappedStatus) ? mappedStatus : DEFAULT_BID_STATUS;
}

function normalizeTechnicalQualification(value = {}) {
  const source = value && typeof value === "object" && !Array.isArray(value) ? value : {};
  const defaults = defaultTechnicalQualification();

  return Object.fromEntries(
    TECHNICAL_QUALIFICATION_FIELDS.map((field) => [field, cleanText(source[field] ?? defaults[field])]),
  );
}

function normalizeBudgetWorkStatus(value) {
  const status = cleanText(value).trim();
  return BUDGET_WORK_STATUSES.includes(status) ? status : "Não iniciado";
}

function clampBudgetProgress(value) {
  return Math.min(Math.max(parseNumber(value), 0), 100);
}

function calculateBudgetProgressFromItems(items = []) {
  const totalItems = items.length;
  if (!totalItems) return 0;

  const pricedItems = items.filter((item) => parseNumber(item.unitPrice) > 0).length;
  return Math.round((pricedItems / totalItems) * 100);
}

function cleanTextOrNull(value) {
  const text = cleanText(value).trim();
  return text || null;
}

function cleanTextDeep(value) {
  if (typeof value === "string") return cleanText(value);
  if (Array.isArray(value)) return value.map(cleanTextDeep);
  if (!value || typeof value !== "object") return value;

  return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, cleanTextDeep(entry)]));
}

function hasMojibakeDeep(value) {
  if (typeof value === "string") return hasMojibakeText(value);
  if (Array.isArray(value)) return value.some(hasMojibakeDeep);
  if (!value || typeof value !== "object") return false;
  return Object.values(value).some(hasMojibakeDeep);
}

function normalizeLoadedStateText() {
  state = normalizeState(cleanTextDeep(state));
}

function normalizeItem(item, index) {
  return {
    id: item.id || `item-${String(index + 1).padStart(2, "0")}`,
    stage: cleanText(item.stage),
    code: cleanText(item.code),
    description: cleanText(item.description),
    unit: cleanText(item.unit, "un") || "un",
    quantity: Number(item.quantity) || 0,
    unitPrice: Number(item.unitPrice) || 0,
  };
}

function normalizeCompositionInput(input, index) {
  const source = input && typeof input === "object" ? input : {};
  const type = cleanText(source.type || source.inputType || source.input_type || "material");

  return {
    id: source.id || `composition-input-${String(index + 1).padStart(2, "0")}`,
    type: COMPOSITION_INPUT_TYPES.includes(type) ? type : "material",
    description: cleanText(source.description || "Novo insumo"),
    unit: cleanText(source.unit, "un") || "un",
    quantity: parseNumber(source.quantity),
    unitCost: parseNumber(source.unitCost ?? source.unit_cost),
  };
}

function calculateCompositionCost(composition) {
  const inputs = Array.isArray(composition?.inputs) ? composition.inputs : [];
  return inputs.reduce((sum, input) => sum + parseNumber(input.quantity) * parseNumber(input.unitCost), 0);
}

function normalizeComposition(composition, index) {
  const sourceInputs = Array.isArray(composition.inputs) ? composition.inputs : [];
  const legacyCost = parseNumber(composition.cost);
  const inputs = sourceInputs.length
    ? sourceInputs.map(normalizeCompositionInput)
    : legacyCost > 0
      ? [
          normalizeCompositionInput(
            {
              id: `${composition.id || `composition-${index + 1}`}-legacy-cost`,
              type: "other",
              description: "Custo manual anterior",
              unit: composition.unit || "un",
              quantity: 1,
              unitCost: legacyCost,
            },
            0,
          ),
        ]
      : [];

  const normalized = {
    id: composition.id || `composition-${String(index + 1).padStart(2, "0")}`,
    code: cleanText(composition.code),
    title: cleanText(composition.title),
    unit: cleanText(composition.unit, "un") || "un",
    cost: 0,
    note: cleanText(composition.note),
    inputs,
  };

  normalized.cost = calculateCompositionCost(normalized);
  return {
    ...normalized,
  };
}

function normalizeBdiEnabledCharges(value = {}) {
  const source = value && typeof value === "object" && !Array.isArray(value) ? value : {};
  const defaults = defaultBdiEnabledCharges();

  return Object.fromEntries(BDI_COMPONENT_KEYS.map((key) => [key, parseBoolean(source[key] ?? defaults[key])]));
}

function normalizeBdi(rawBdi) {
  const source = rawBdi && typeof rawBdi === "object" ? rawBdi : {};
  const normalized = {
    ...defaultBdi(),
    ...source,
  };

  if (source.taxes !== undefined && source.iss === undefined && source.pisCofins === undefined) {
    normalized.iss = 3;
    normalized.pisCofins = Math.max(parseNumber(source.taxes) - 5, 0);
    normalized.otherTaxes = 0;
  }

  delete normalized.taxes;
  BDI_COMPONENT_KEYS.forEach((key) => {
    normalized[key] = parseNumber(normalized[key]);
  });
  normalized.enabledCharges = normalizeBdiEnabledCharges(source.enabledCharges || source.enabled_charges);
  return normalized;
}

function normalizeBudget(rawBudget, index) {
  const base = demoBudget();
  const source = rawBudget && typeof rawBudget === "object" ? rawBudget : {};
  const items = Array.isArray(source.items) ? source.items : base.items;
  const bid = {
    ...Object.fromEntries(Object.entries(base.bid).map(([key, value]) => [key, typeof value === "string" ? cleanText(value) : value])),
    ...Object.fromEntries(Object.entries(source.bid || {}).map(([key, value]) => [key, typeof value === "string" ? cleanText(value) : value])),
  };

  bid.estimatedValue = parseNumber(bid.estimatedValue);
  bid.sealedValue = parseBoolean(bid.sealedValue);
  bid.proposalDeadline = cleanText(bid.proposalDeadline);
  bid.modality = cleanText(bid.modality);
  bid.status = normalizeBidStatus(bid.status);
  bid.decision = ["participar", "nao_participar"].includes(cleanText(bid.decision)) ? cleanText(bid.decision) : "";
  bid.rejectionReason = cleanText(bid.rejectionReason);
  bid.decisionDate = cleanText(bid.decisionDate);
  bid.budgetStatus = normalizeBudgetWorkStatus(bid.budgetStatus);
  bid.budgetOwner = cleanText(bid.budgetOwner);
  bid.budgetStartDate = cleanText(bid.budgetStartDate);
  bid.budgetDueDate = cleanText(bid.budgetDueDate);
  bid.budgetProgressManual = parseBoolean(bid.budgetProgressManual);
  bid.technicalQualification = normalizeTechnicalQualification(bid.technicalQualification);

  const normalizedItems = items.map(normalizeItem);
  bid.budgetProgress = bid.budgetProgressManual
    ? clampBudgetProgress(bid.budgetProgress)
    : calculateBudgetProgressFromItems(normalizedItems);

  return {
    id: source.id || `budget-${String(index + 1).padStart(2, "0")}`,
    cloudBidId: source.cloudBidId || "",
    createdAt: source.createdAt || new Date().toISOString(),
    bid,
    bdi: normalizeBdi(source.bdi),
    items: normalizedItems,
  };
}

function normalizeState(savedState) {
  const source = savedState && typeof savedState === "object" ? savedState : {};
  let budgets;

  if (Array.isArray(source.budgets) && source.budgets.length) {
    budgets = source.budgets.map(normalizeBudget);
  } else {
    budgets = [
      normalizeBudget(
        {
          id: "budget-01",
          bid: source.bid,
          bdi: source.bdi,
          items: source.items,
        },
        0,
      ),
    ];
  }

  const activeBudgetId = budgets.some((budget) => budget.id === source.activeBudgetId)
    ? source.activeBudgetId
    : budgets[0].id;

  const compositions =
    Array.isArray(source.compositions) && source.compositions.length
      ? source.compositions
      : defaultCompositions();

  return {
    activeBudgetId,
    budgets,
    compositions: compositions.map(normalizeComposition),
  };
}

function loadState() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY) || window.localStorage.getItem(LEGACY_STORAGE_KEY);
    return normalizeState(saved ? JSON.parse(saved) : defaultState);
  } catch {
    return clone(defaultState);
  }
}

function hasPersistedWorkspaceData() {
  return Boolean(window.localStorage.getItem(STORAGE_KEY) || window.localStorage.getItem(LEGACY_STORAGE_KEY));
}

function loadPersistedWorkspaceState() {
  const raw = window.localStorage.getItem(STORAGE_KEY) || window.localStorage.getItem(LEGACY_STORAGE_KEY);
  if (!raw) return null;

  try {
    return normalizeState(JSON.parse(raw));
  } catch {
    return null;
  }
}

function comparableWorkspaceSlice(workspace) {
  return {
    budgets: (workspace?.budgets || []).map((budget) => ({
      bid: budget.bid,
      bdi: budget.bdi,
      items: budget.items,
    })),
    compositions: workspace?.compositions || [],
  };
}

function isDemoOnlyWorkspace(workspace) {
  const normalized = normalizeState(workspace || {});
  const demo = normalizeState(defaultState);

  if (normalized.budgets.length !== 1) return false;
  if (normalized.budgets[0].cloudBidId) return false;

  return JSON.stringify(comparableWorkspaceSlice(normalized)) === JSON.stringify(comparableWorkspaceSlice(demo));
}

function hasMeaningfulWorkspaceData(workspace = loadPersistedWorkspaceState()) {
  if (!workspace) return false;
  return !isDemoOnlyWorkspace(workspace);
}

function alternateLocalOrigin() {
  const { protocol, hostname, port } = window.location;
  const suffix = port ? `:${port}` : "";

  if (hostname === "localhost") return `${protocol}//127.0.0.1${suffix}`;
  if (hostname === "127.0.0.1") return `${protocol}//localhost${suffix}`;

  return "";
}

function isTrustedLocalOrigin(origin) {
  return [window.location.origin, alternateLocalOrigin()].filter(Boolean).includes(origin);
}

function localWorkspaceSnapshot() {
  return {
    workspace: window.localStorage.getItem(STORAGE_KEY),
    legacyWorkspace: window.localStorage.getItem(LEGACY_STORAGE_KEY),
    cloudSession: window.localStorage.getItem(CLOUD_SESSION_KEY),
    cloudConfig: window.localStorage.getItem(CLOUD_CONFIG_KEY),
  };
}

function isRecoveryBridgePage() {
  return new URLSearchParams(window.location.search).has("orcasanBridge");
}

window.addEventListener("message", (event) => {
  if (!isTrustedLocalOrigin(event.origin)) return;
  if (event.data?.type !== "orcasan:request-local-snapshot") return;

  event.source?.postMessage(
    {
      type: "orcasan:local-snapshot",
      sourceOrigin: window.location.origin,
      payload: localWorkspaceSnapshot(),
    },
    event.origin,
  );
});

function requestLocalSnapshotFromOrigin(origin) {
  return new Promise((resolve) => {
    const frame = document.createElement("iframe");
    let finished = false;
    let attempts = 0;

    function cleanup(value = null) {
      if (finished) return;
      finished = true;
      window.removeEventListener("message", receiveSnapshot);
      window.clearInterval(interval);
      window.clearTimeout(timeout);
      frame.remove();
      resolve(value);
    }

    function receiveSnapshot(event) {
      if (event.origin !== origin || event.data?.type !== "orcasan:local-snapshot") return;
      cleanup(event.data.payload || null);
    }

    function askSnapshot() {
      attempts += 1;
      frame.contentWindow?.postMessage({ type: "orcasan:request-local-snapshot" }, origin);
      if (attempts >= 12) cleanup();
    }

    frame.hidden = true;
    frame.src = `${origin}${window.location.pathname}?orcasanBridge=${Date.now()}`;
    window.addEventListener("message", receiveSnapshot);
    document.body.appendChild(frame);

    const interval = window.setInterval(askSnapshot, 350);
    const timeout = window.setTimeout(() => cleanup(), 5000);
  });
}

async function offerAlternateOriginRecovery() {
  const origin = alternateLocalOrigin();
  if (!origin || isRecoveryBridgePage()) return;

  const sessionKey = `orcasan.recovery-checked.${origin}`;
  if (window.sessionStorage.getItem(sessionKey)) return;
  window.sessionStorage.setItem(sessionKey, "1");

  const snapshot = await requestLocalSnapshotFromOrigin(origin);
  const rawWorkspace = snapshot?.workspace || snapshot?.legacyWorkspace;
  if (!rawWorkspace) return;

  let incomingState;

  try {
    incomingState = normalizeState(JSON.parse(rawWorkspace));
  } catch {
    return;
  }

  if ((incomingState.budgets?.length || 0) <= (state.budgets?.length || 0)) return;

  const confirmed = window.confirm(
    `Encontrei ${incomingState.budgets.length} licitação(ões) salva(s) em ${origin}. Deseja trazer esses dados para este endereço?`,
  );

  if (!confirmed) return;

  state = incomingState;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  if (snapshot.cloudSession) window.localStorage.setItem(CLOUD_SESSION_KEY, snapshot.cloudSession);
  if (snapshot.cloudConfig) window.localStorage.setItem(CLOUD_CONFIG_KEY, snapshot.cloudConfig);

  hydrateForm();
  render();
  saveState(true);
  showToast("Licitações recuperadas deste computador.");
}

function getActiveBudget() {
  let budget = state.budgets.find((candidate) => candidate.id === state.activeBudgetId);

  if (!budget) {
    budget = state.budgets[0] || demoBudget();
    state.budgets = state.budgets.length ? state.budgets : [budget];
    state.activeBudgetId = budget.id;
  }

  return budget;
}

function activeBid() {
  return getActiveBudget().bid;
}

function activeBdi() {
  return getActiveBudget().bdi;
}

function activeItems() {
  return getActiveBudget().items;
}

function clearDuplicateCloudBidIds() {
  const seenCloudIds = new Set();

  state.budgets.forEach((budget) => {
    if (!budget.cloudBidId) return;

    if (seenCloudIds.has(budget.cloudBidId)) {
      budget.cloudBidId = "";
      return;
    }

    seenCloudIds.add(budget.cloudBidId);
  });
}

function syncKey(value) {
  return cleanText(value)
    .trim()
    .toLocaleLowerCase("pt-BR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ");
}

function budgetFingerprint(budget) {
  const bid = budget?.bid || {};
  const edital = syncKey(bid.editalNumber);
  const agency = syncKey(bid.agency);
  const title = syncKey(bid.title);
  const location = syncKey(bid.location);

  if (edital) return `edital:${edital}|agency:${agency}`;
  if (title) return `title:${title}|agency:${agency}|location:${location}`;

  return "";
}

function cloudBidFingerprint(row) {
  const edital = syncKey(row?.edital_number);
  const agency = syncKey(row?.agency);
  const title = syncKey(row?.title);
  const location = syncKey(row?.location);

  if (edital) return `edital:${edital}|agency:${agency}`;
  if (title) return `title:${title}|agency:${agency}|location:${location}`;

  return "";
}

function currentTimeLabel() {
  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());
}

function setSaveStatus(message) {
  if (saveStatus) saveStatus.textContent = cleanText(message);
}

function saveState(showFeedback = false, options = {}) {
  normalizeLoadedStateText();
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));

  const now = currentTimeLabel();
  setSaveStatus(
    hasAuthenticatedSession()
      ? `Salvo neste dispositivo às ${now}. Sincronizando com a nuvem...`
      : `Salvo neste dispositivo às ${now}`,
  );
  if (showFeedback) showToast("Orçamento salvo.");

  if (options.syncCloud !== false) scheduleCloudAutoSync();
}

function scheduleSave() {
  setSaveStatus("Alterações pendentes...");
  window.clearTimeout(saveTimer);
  saveTimer = window.setTimeout(() => saveState(), 300);
}

function scheduleCloudAutoSync(delay = 1200) {
  if (!hasAuthenticatedSession()) return;

  window.clearTimeout(cloudAutoSyncTimer);
  cloudAutoSyncTimer = window.setTimeout(() => {
    syncAllDataToCloud({ silent: true, auto: true });
  }, delay);
}

function showToast(message) {
  toast.textContent = cleanText(message);
  toast.classList.add("visible");
  window.setTimeout(() => toast.classList.remove("visible"), 2200);
}

function isLocalAppOrigin() {
  return ["127.0.0.1", "localhost"].includes(window.location.hostname);
}

function installUnavailableMessage() {
  if (isLocalAppOrigin()) {
    return `Este endereço é só de teste local. Para instalar sem depender do 127.0.0.1, abra ${PUBLIC_APP_URL} no Chrome e use o ícone de instalação.`;
  }

  return "Se o prompt não abrir, use o ícone de instalação do navegador ou verifique se o app já foi instalado.";
}

function updateInstallUi() {
  const isStandalone =
    window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;

  if (isStandalone) {
    installAppButton.hidden = true;
    installAppSecondaryButton.disabled = true;
    installStatus.textContent = isLocalAppOrigin()
      ? "Este atalho foi instalado a partir do 127.0.0.1 e depende do servidor local ligado. Para uso real, instale pelo link online em HTTPS."
      : "O OrçaSan já está instalado como aplicativo neste dispositivo.";
    return;
  }

  if (deferredInstallPrompt) {
    installAppButton.hidden = false;
    installAppSecondaryButton.disabled = false;
    installStatus.textContent = "Instale o OrçaSan para abrir em janela própria, com ícone e atalho.";
    return;
  }

  installAppButton.hidden = false;
  installAppSecondaryButton.disabled = false;
  installStatus.textContent = installUnavailableMessage();
}

async function installApp() {
  if (!deferredInstallPrompt) {
    showToast(isLocalAppOrigin() ? "Instale pelo link online HTTPS, não pelo 127.0.0.1." : "Use o ícone de instalação do navegador.");
    if (installStatus) installStatus.textContent = installUnavailableMessage();
    updateInstallUi();
    return;
  }

  deferredInstallPrompt.prompt();
  const result = await deferredInstallPrompt.userChoice;
  deferredInstallPrompt = null;
  updateInstallUi();

  if (result.outcome === "accepted") showToast("OrçaSan instalado.");
  else showToast("Instalação cancelada.");
}

function setupPwa() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("./service-worker.js")
        .then((registration) => registration.update())
        .catch(() => {
          showToast("Não foi possível ativar o modo offline.");
        });
    });
  }

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredInstallPrompt = event;
    updateInstallUi();
  });

  window.addEventListener("appinstalled", () => {
    deferredInstallPrompt = null;
    updateInstallUi();
    showToast("Aplicativo instalado.");
  });

  updateInstallUi();
}

async function refreshAppCache() {
  try {
    if ("serviceWorker" in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map((registration) => registration.unregister()));
    }

    if ("caches" in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)));
    }

    showToast("Cache limpo. Recarregando app...");
    window.setTimeout(() => window.location.reload(), 500);
  } catch {
    showToast("Não foi possível limpar o cache automaticamente.");
  }
}

function cloudProjectUrl(apiUrl) {
  return normalizeCloudApiUrl(apiUrl).replace(/\/rest\/v1\/?$/, "");
}

function authRedirectUrl() {
  const { origin, pathname } = window.location;
  return `${origin}${pathname}`;
}

function isAdminMode() {
  const params = new URLSearchParams(window.location.search);

  if (params.get("admin") === "1") {
    window.localStorage.setItem(ADMIN_MODE_KEY, "true");
    return true;
  }

  if (params.get("admin") === "0") {
    window.localStorage.removeItem(ADMIN_MODE_KEY);
    return false;
  }

  return window.localStorage.getItem(ADMIN_MODE_KEY) === "true";
}

function normalizeCloudApiUrl(value) {
  let url = String(value || "").trim();
  if (!url) return DEFAULT_CLOUD_API_URL;

  url = url.replace(/\/+$/, "");
  if (!url.endsWith("/rest/v1")) url = `${url}/rest/v1`;

  return `${url}/`;
}

const AUTH_MODE_COPY = {
  signin: {
    title: "Acessar conta",
    hint: "",
    status: "",
    panel: "",
  },
  signup: {
    title: "Criar conta",
    hint: "",
    status: "Preencha os dados da empresa para criar seu acesso.",
    panel: "",
  },
  recover: {
    title: "Recuperar senha",
    hint: "",
    status: "Você receberá um link para trocar a senha.",
    panel: "",
  },
  reset: {
    title: "Nova senha",
    hint: "",
    status: "Digite a nova senha recebida pelo fluxo de recuperação.",
    panel: "",
  },
};

let authMode = "signin";

function setAuthMode(mode) {
  authMode = AUTH_MODE_COPY[mode] ? mode : "signin";
  const copy = AUTH_MODE_COPY[authMode];
  const isSignup = authMode === "signup";
  const isRecover = authMode === "recover";
  const isReset = authMode === "reset";

  if (authTitle) authTitle.textContent = copy.title;
  if (authHint) authHint.textContent = copy.hint;

  authTabs.forEach((tab) => {
    const active = tab.dataset.authMode === authMode;
    tab.classList.toggle("active", active);
    tab.setAttribute("aria-selected", String(active));
  });

  document.querySelectorAll("[data-auth-signup]").forEach((field) => {
    field.hidden = !isSignup;
  });

  document.querySelectorAll("[data-auth-password]").forEach((field) => {
    field.hidden = isRecover;
  });

  document.querySelectorAll("[data-auth-email]").forEach((field) => {
    field.hidden = isReset;
  });

  if (authPasswordInput) {
    authPasswordInput.autocomplete = isSignup || isReset ? "new-password" : "current-password";
    authPasswordInput.placeholder = isReset
      ? "Digite a nova senha"
      : isSignup
        ? "Crie uma senha"
        : "Digite sua senha";
  }

  if (signInCloudButton) signInCloudButton.hidden = authMode !== "signin";
  if (signUpCloudButton) signUpCloudButton.hidden = authMode !== "signup";
  if (resendAuthEmailButton) resendAuthEmailButton.hidden = authMode !== "signup";
  if (requestPasswordCloudButton) requestPasswordCloudButton.hidden = !isRecover;
  if (updatePasswordCloudButton) updatePasswordCloudButton.hidden = !isReset;

  document.querySelectorAll("[data-auth-entry-link]").forEach((link) => {
    link.hidden = authMode !== "signin";
  });

  document.querySelectorAll("[data-auth-return]").forEach((link) => {
    link.hidden = authMode === "signin";
  });

  if (!loadCloudSession()?.user?.email) setAuthStatus(copy.status, "");
}

function loadCloudSession() {
  try {
    return JSON.parse(window.localStorage.getItem(CLOUD_SESSION_KEY) || "null");
  } catch {
    return null;
  }
}

function hasAuthenticatedSession() {
  const session = loadCloudSession();
  if (!session?.access_token) return false;
  if (session.authType === "recovery") return false;
  if (session.expiresAt && session.expiresAt <= Date.now()) return false;
  return true;
}

function extractAuthSession(payload) {
  const candidate = payload?.session || payload;
  if (!candidate?.access_token) return null;

  const expiresIn = Number(candidate.expires_in) || 3600;
  const expiresAt = candidate.expires_at ? Number(candidate.expires_at) * 1000 : Date.now() + expiresIn * 1000;

  return {
    access_token: candidate.access_token,
    refresh_token: candidate.refresh_token || "",
    expiresAt,
    user: payload?.user || candidate.user || null,
  };
}

function saveCloudSession(payload) {
  const session = extractAuthSession(payload);
  if (!session) return null;

  window.localStorage.setItem(CLOUD_SESSION_KEY, JSON.stringify(session));
  return session;
}

function sessionFromUrlHash() {
  const hash = window.location.hash || "";
  if (!hash.includes("access_token=")) return null;

  const params = new URLSearchParams(hash.slice(1));
  const accessToken = params.get("access_token");
  if (!accessToken) return null;

  const expiresIn = Number(params.get("expires_in")) || 3600;
  const session = {
    access_token: accessToken,
    refresh_token: params.get("refresh_token") || "",
    expiresAt: Date.now() + expiresIn * 1000,
    user: null,
    authType: params.get("type") || "",
  };

  window.localStorage.setItem(CLOUD_SESSION_KEY, JSON.stringify(session));
  window.history.replaceState(null, "", "#conta");
  return session;
}

function captureAuthRedirectSession() {
  const session = sessionFromUrlHash();
  if (!session) return null;

  setAuthStatus("E-mail confirmado. Finalizando sessão...", "success");
  showToast("E-mail confirmado.");
  if (session.authType === "recovery") setAuthMode("reset");
  else setAuthMode("signin");
  return ensureFreshCloudSession();
}

function clearCloudSession() {
  window.localStorage.removeItem(CLOUD_SESSION_KEY);
}

function setAuthStatus(message, kind = "") {
  if (!authStatus) return;

  authStatus.textContent = cleanText(message);
  authStatus.classList.toggle("success", kind === "success");
  authStatus.classList.toggle("error", kind === "error");
}

function renderAuthState() {
  const session = loadCloudSession();
  const hasSession = hasAuthenticatedSession();
  if (signOutCloudButton) signOutCloudButton.hidden = !hasSession;
  if (authBackApp) authBackApp.hidden = !hasSession;

  if (authMode === "reset") {
    setAuthStatus("Digite a nova senha recebida pelo fluxo de recuperação.", "success");
    if (signOutCloudButton) signOutCloudButton.disabled = !hasSession;
    return;
  }

  if (session?.user?.email) {
    if (authEmailInput) authEmailInput.value = session.user.email;
    setAuthStatus("", "");
    if (signOutCloudButton) signOutCloudButton.disabled = false;
  } else {
    setAuthStatus(AUTH_MODE_COPY[authMode]?.status || "", "");
    if (signOutCloudButton) signOutCloudButton.disabled = true;
  }

  renderSettingsAccount();
}

function renderSettingsAccount() {
  const session = loadCloudSession();
  const email = session?.user?.email || authEmailInput?.value || "";
  const hasSession = hasAuthenticatedSession();

  if (settingsUserEmail) settingsUserEmail.textContent = email || "Conta não conectada";
  if (settingsSignOutButton) settingsSignOutButton.disabled = !hasSession;
  if (settingsChangePasswordButton) settingsChangePasswordButton.disabled = !email;
}

function renderSettingsPanel(budgetSummary = calculateBudget()) {
  if (settingsBdiPercent) settingsBdiPercent.textContent = toPercent(budgetSummary.bdiPercent);
  renderSettingsAccount();
  renderEncodingTools();
}

function renderEncodingTools() {
  if (!encodingTools) return;

  const hasIssues = hasMojibakeDeep(state) || encodingRepairSuggested;
  encodingTools.hidden = !hasIssues;
  if (encodingStatus) {
    encodingStatus.textContent = hasIssues
      ? "Encontramos textos com acentuação quebrada nos dados carregados. Clique para salvar a versão corrigida e sincronizar com a nuvem."
      : "Acentuação dos dados carregados está correta.";
  }
}

async function fixLoadedEncoding() {
  if (!hasMojibakeDeep(state) && !encodingRepairSuggested) {
    showToast("Nenhum texto com acentuação quebrada foi encontrado.");
    renderEncodingTools();
    return;
  }

  normalizeLoadedStateText();
  encodingRepairSuggested = false;
  hydrateForm();
  render();
  saveState(true);
  showToast("Acentuação dos dados carregados corrigida.");

  if (hasAuthenticatedSession()) {
    await syncAllDataToCloud({ silent: true });
  }
}

function cloudAuthHeaders(config, session = null) {
  const headers = {
    apikey: config.publishableKey,
    Accept: "application/json",
  };

  if (session?.access_token) headers.Authorization = `Bearer ${session.access_token}`;
  return headers;
}

async function cloudAuthRequest(path, options = {}) {
  const config = requireCloudConfig();
  const url = `${cloudProjectUrl(config.apiUrl)}/auth/v1/${path}`;
  const response = await fetch(url, {
    method: options.method || "GET",
    headers: {
      ...cloudAuthHeaders(config, options.session),
      ...(options.body ? { "Content-Type": "application/json" } : {}),
    },
    body: options.body ? JSON.stringify(cleanTextDeep(options.body)) : undefined,
  });
  const data = await readSupabaseResponse(response);

  if (!response.ok) {
    const detail =
      typeof data === "string"
        ? data
        : data?.msg || data?.message || data?.error_description || `Serviço de autenticação respondeu ${response.status}.`;
    throw new Error(detail);
  }

  return data;
}

async function ensureFreshCloudSession() {
  const session = loadCloudSession();
  if (!session?.access_token) return null;

  if (session.expiresAt && session.expiresAt > Date.now() + 60000 && session.user) return session;

  if (!session.user) {
    try {
      const userResponse = await cloudAuthRequest("user", {
        session,
      });
      session.user = userResponse?.user || userResponse || null;
      window.localStorage.setItem(CLOUD_SESSION_KEY, JSON.stringify(session));
      if (session.user && session.expiresAt && session.expiresAt > Date.now() + 60000) return session;
    } catch {
      // Continue to refresh-token flow when available.
    }
  }

  if (!session.refresh_token) return session;

  try {
    const refreshed = await cloudAuthRequest("token?grant_type=refresh_token", {
      method: "POST",
      body: { refresh_token: session.refresh_token },
    });
    return saveCloudSession(refreshed);
  } catch {
    clearCloudSession();
    renderAuthState();
    return null;
  }
}

function loadCloudConfig() {
  try {
    const stored = JSON.parse(window.localStorage.getItem(CLOUD_CONFIG_KEY) || "{}");
    return {
      apiUrl: normalizeCloudApiUrl(stored.apiUrl || DEFAULT_CLOUD_API_URL),
      publishableKey: String(stored.publishableKey || DEFAULT_CLOUD_PUBLISHABLE_KEY).trim(),
      organizationId: stored.organizationId || "",
    };
  } catch {
    return {
      apiUrl: DEFAULT_CLOUD_API_URL,
      publishableKey: DEFAULT_CLOUD_PUBLISHABLE_KEY,
      organizationId: "",
    };
  }
}

function persistCloudConfig(config) {
  window.localStorage.setItem(
    CLOUD_CONFIG_KEY,
    JSON.stringify({
      apiUrl: normalizeCloudApiUrl(config.apiUrl),
      publishableKey: String(config.publishableKey || "").trim(),
      organizationId: config.organizationId || "",
    }),
  );
}

function setCloudStatus(message, kind = "") {
  if (!cloudStatus) return;

  cloudStatus.textContent = cleanText(message);
  cloudStatus.classList.toggle("success", kind === "success");
  cloudStatus.classList.toggle("error", kind === "error");
}

function renderCloudConfig() {
  if (!cloudApiUrlInput || !cloudPublishableKeyInput) return;

  if (cloudTechnicalPanel) {
    cloudTechnicalPanel.hidden = true;
    cloudTechnicalPanel.setAttribute("aria-hidden", "true");
  }

  const config = loadCloudConfig();
  cloudApiUrlInput.value = config.apiUrl;
  cloudPublishableKeyInput.value = config.publishableKey;

  if (config.publishableKey && config.organizationId) {
    setCloudStatus("Conexão salva. Workspace pronto para sincronizar.", "success");
  } else if (config.publishableKey) {
    setCloudStatus("Chave salva. Teste a conexão e crie o workspace.", "");
  } else {
    setCloudStatus("Cole a API URL e a publishable key para ativar a nuvem.", "");
  }
}

function saveCloudConfig(showFeedback = true) {
  const current = loadCloudConfig();
  const config = {
    ...current,
    apiUrl: normalizeCloudApiUrl(cloudApiUrlInput?.value || current.apiUrl),
    publishableKey: String(cloudPublishableKeyInput?.value || current.publishableKey || DEFAULT_CLOUD_PUBLISHABLE_KEY).trim(),
  };

  persistCloudConfig(config);

  if (showFeedback) {
    setCloudStatus("Conexão salva neste navegador.", "success");
    showToast("Conexão da nuvem salva.");
  }

  return config;
}

function requireCloudConfig() {
  const config = loadCloudConfig();

  if (!config.apiUrl || !config.publishableKey) {
    throw new Error("Informe a API URL e a publishable key.");
  }

  persistCloudConfig(config);
  return config;
}

function cloudHeaders(config, prefer = "return=representation") {
  const headers = {
    apikey: config.publishableKey,
    Accept: "application/json",
  };

  if (prefer) headers.Prefer = prefer;
  return headers;
}

async function readSupabaseResponse(response) {
  const text = await response.text();
  if (!text) return null;

  try {
    return cleanTextDeep(JSON.parse(text));
  } catch {
    return cleanText(text);
  }
}

function supabaseErrorMessage(error) {
  const message = String(error?.message || error || "Erro inesperado.");

  if (/permission denied|row-level security|violates row-level security/i.test(message)) {
    return "Conexão chegou no Supabase, mas falta liberar permissão/API para estas tabelas.";
  }

  if (/Failed to fetch|NetworkError|nome remoto não pôde ser resolvido|could not be resolved/i.test(message)) {
    return "Não consegui acessar a nuvem. Confira sua conexão com a internet e tente novamente.";
  }

  return message.length > 170 ? `${message.slice(0, 170)}...` : message;
}

async function supabaseRequest(path, options = {}) {
  const config = requireCloudConfig();
  const session = await ensureFreshCloudSession();
  const baseUrl = normalizeCloudApiUrl(config.apiUrl).replace(/\/+$/, "");
  const response = await fetch(`${baseUrl}/${path}`, {
    method: options.method || "GET",
    headers: {
      ...cloudHeaders(config, options.prefer),
      ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(options.headers || {}),
    },
    body: options.body ? JSON.stringify(cleanTextDeep(options.body)) : undefined,
  });

  const data = await readSupabaseResponse(response);

  if (!response.ok) {
    const detail =
      typeof data === "string"
        ? data
        : data?.message || data?.hint || data?.details || `Supabase respondeu ${response.status}.`;
    throw new Error(detail);
  }

  return data;
}

function setCloudBusy(isBusy) {
  [
    saveCloudConfigButton,
    testCloudConnectionButton,
    createCloudWorkspaceButton,
    syncActiveCloudButton,
    syncAllCloudButton,
    loadCloudDataButton,
  ].forEach((button) => {
    if (button) button.disabled = isBusy;
  });
}

async function runCloudAction(workingMessage, successMessage, action) {
  setCloudBusy(true);
  setCloudStatus(workingMessage, "");

  try {
    const result = await action();
    setCloudStatus(successMessage, "success");
    showToast(successMessage);
    return result;
  } catch (error) {
    console.error(error);
    const message = supabaseErrorMessage(error);
    setCloudStatus(message, "error");
    showToast("Ação de nuvem não concluída.");
    return null;
  } finally {
    setCloudBusy(false);
  }
}

function setAuthBusy(isBusy) {
  [
    signInCloudButton,
    signUpCloudButton,
    resendAuthEmailButton,
    requestPasswordCloudButton,
    updatePasswordCloudButton,
    signOutCloudButton,
  ].forEach((button) => {
    if (!button) return;
    button.disabled = isBusy || (button === signOutCloudButton && !loadCloudSession()?.access_token);
  });
}

async function runAuthAction(workingMessage, successMessage, action) {
  setAuthBusy(true);
  setAuthStatus(workingMessage, "");

  try {
    const result = await action();
    if (successMessage) {
      setAuthStatus(successMessage, "success");
      showToast(successMessage);
      renderAuthState();
    }
    return result;
  } catch (error) {
    console.error(error);
    const message = supabaseErrorMessage(error);
    setAuthStatus(message, "error");
    showToast("Ação de conta não concluída.");
    return null;
  } finally {
    setAuthBusy(false);
  }
}

function authFormPayload() {
  return {
    name: String(authNameInput?.value || "").trim(),
    company: String(authCompanyInput?.value || activeBid().company || "").trim(),
    email: String(authEmailInput?.value || "").trim().toLowerCase(),
    password: String(authPasswordInput?.value || ""),
  };
}

function validateAuthForm({ email, password }) {
  if (!email || !email.includes("@")) throw new Error("Informe um e-mail válido.");
  if (!password || password.length < 6) throw new Error("A senha precisa ter pelo menos 6 caracteres.");
}

async function ensureCloudProfile(user, form = authFormPayload()) {
  if (!user?.id) throw new Error("Usuário autenticado não encontrado.");

  return supabaseRequest("profiles?on_conflict=id", {
    method: "POST",
    body: {
      id: user.id,
      full_name: form.name || user.email || "",
      email: user.email || form.email || "",
    },
    prefer: "resolution=merge-duplicates,return=representation",
  });
}

async function ensureCloudMembership(organizationId, userId) {
  if (!organizationId || !userId) return null;

  const existingRows = await supabaseRequest(
    `organization_members?organization_id=eq.${encodeURIComponent(organizationId)}&user_id=eq.${encodeURIComponent(userId)}&select=organization_id,user_id&limit=1`,
    { prefer: "" },
  );

  if (Array.isArray(existingRows) && existingRows[0]) return existingRows[0];

  const memberRows = await supabaseRequest("organization_members", {
    method: "POST",
    body: {
      organization_id: organizationId,
      user_id: userId,
      role: "owner",
    },
    prefer: "return=representation",
  });

  return Array.isArray(memberRows) ? memberRows[0] : memberRows;
}

async function cloudWorkspaceSummary() {
  const cloudBids = await supabaseRequest("bids?select=*&order=updated_at.desc,created_at.desc", {
    prefer: "",
  });
  const bids = dedupeCloudBids(cloudBids);

  return {
    bids,
    budgetCount: bids.length,
  };
}

function meaningfulBudgets(workspace) {
  if (!workspace || isDemoOnlyWorkspace(workspace)) return [];
  return normalizeState(workspace).budgets;
}

function hasLocalBudgetsMissingInCloud(localWorkspace, cloudRows) {
  const cloudKeys = new Set((cloudRows || []).map((row) => cloudBidFingerprint(row) || `cloud:${row.id}`));

  return meaningfulBudgets(localWorkspace).some((budget) => {
    const key = budgetFingerprint(budget) || `local:${budget.id}`;
    return !cloudKeys.has(key);
  });
}

async function syncAuthProfileAndWorkspace(form = authFormPayload()) {
  const session = await ensureFreshCloudSession();
  const user = session?.user;
  if (!user?.id) throw new Error("Entre na conta antes de configurar o workspace.");

  await ensureCloudProfile(user, form);
  if (form.company) activeBid().company = form.company;
  const organization = await ensureCloudOrganization();
  await ensureCloudMembership(organization.id, user.id);
  hydrateForm();
  saveState(false, { syncCloud: false });

  return organization;
}

async function syncWorkspaceAfterLogin(localWorkspace = loadPersistedWorkspaceState()) {
  try {
    const cloudSummary = await cloudWorkspaceSummary();
    const localBudgetCount = meaningfulBudgets(localWorkspace).length;
    const shouldOfferLocalUpload =
      localBudgetCount > 0 &&
      cloudSummary.budgetCount > 0 &&
      hasLocalBudgetsMissingInCloud(localWorkspace, cloudSummary.bids);

    if (cloudSummary.budgetCount === 0 && localBudgetCount > 0) {
      state = normalizeState(localWorkspace);
      hydrateForm();
      render();
      const uploadResult = await syncAllDataToCloud({ silent: true });
      if (!uploadResult) return null;
      return loadDataFromCloud({ confirm: false, silent: true });
    }

    if (shouldOfferLocalUpload) {
      const confirmed = window.confirm(
        `A nuvem tem ${cloudSummary.budgetCount} licitação(ões), mas este navegador tem ${localBudgetCount} licitação(ões) com dados que ainda não estão na nuvem. Deseja enviar estes dados para a nuvem agora?`,
      );

      if (confirmed) {
        state = normalizeState(localWorkspace);
        hydrateForm();
        render();
        const uploadResult = await syncAllDataToCloud({ silent: true });
        if (!uploadResult) return null;
      }
    }

    return loadDataFromCloud({ confirm: false, silent: true });
  } catch (error) {
    console.error(error);
    setCloudStatus(supabaseErrorMessage(error), "error");
    setSaveStatus("Conta conectada. Usando dados deste dispositivo até a nuvem responder.");
    return null;
  }
}

async function signUpCloudAccount() {
  return runAuthAction("Criando conta...", "", async () => {
    const localWorkspace = loadPersistedWorkspaceState();
    const form = authFormPayload();
    validateAuthForm(form);

    const response = await cloudAuthRequest(`signup?redirect_to=${encodeURIComponent(authRedirectUrl())}`, {
      method: "POST",
      body: {
        email: form.email,
        password: form.password,
        data: {
          full_name: form.name,
          company_name: form.company,
        },
      },
    });
    const session = saveCloudSession(response);

    if (!session) {
      setAuthStatus("Conta criada. Confirme o e-mail e depois clique em Entrar.", "success");
      showToast("Conta criada. Verifique o e-mail.");
      return response;
    }

    await syncAuthProfileAndWorkspace(form);
    renderAuthState();
    setAuthStatus("Conta criada com sucesso.", "success");
    showToast("Conta criada e conectada.");
    showPage("#dashboard");
    await syncWorkspaceAfterLogin(localWorkspace);
    return response;
  });
}

async function signInCloudAccount() {
  return runAuthAction("Entrando na conta...", "", async () => {
    const localWorkspace = loadPersistedWorkspaceState();
    const form = authFormPayload();
    validateAuthForm(form);

    const response = await cloudAuthRequest("token?grant_type=password", {
      method: "POST",
      body: {
        email: form.email,
        password: form.password,
      },
    });
    const session = saveCloudSession(response);
    if (!session) throw new Error("Não foi possível iniciar sessão.");

    await syncAuthProfileAndWorkspace(form);
    renderAuthState();
    setAuthStatus("Acesso confirmado.", "success");
    showToast("Conta conectada.");
    showPage("#dashboard");
    await syncWorkspaceAfterLogin(localWorkspace);
    return response;
  });
}

async function resendAuthConfirmationEmail() {
  return runAuthAction("Reenviando confirmação...", "", async () => {
    const form = authFormPayload();
    if (!form.email || !form.email.includes("@")) throw new Error("Informe o e-mail para reenviar.");

    await cloudAuthRequest("resend", {
      method: "POST",
      body: {
        type: "signup",
        email: form.email,
        options: {
          email_redirect_to: authRedirectUrl(),
        },
      },
    });

    setAuthStatus("Confirmação reenviada. Verifique caixa de entrada e spam.", "success");
    showToast("Confirmação reenviada.");
  });
}

async function requestPasswordRecoveryEmail() {
  return runAuthAction("Enviando recuperação...", "", async () => {
    const form = authFormPayload();
    if (!form.email || !form.email.includes("@")) throw new Error("Informe o e-mail de recuperação.");

    await cloudAuthRequest(`recover?redirect_to=${encodeURIComponent(authRedirectUrl())}`, {
      method: "POST",
      body: {
        email: form.email,
      },
    });

    setAuthStatus("E-mail de recuperação enviado. Verifique caixa de entrada e spam.", "success");
    showToast("Recuperação enviada.");
  });
}

async function updateCloudPassword() {
  return runAuthAction("Salvando nova senha...", "", async () => {
    const form = authFormPayload();
    if (!form.password || form.password.length < 6) throw new Error("A nova senha precisa ter pelo menos 6 caracteres.");

    const session = await ensureFreshCloudSession();
    if (!session?.access_token) throw new Error("Abra o link de recuperação novamente para trocar a senha.");

    await cloudAuthRequest("user", {
      method: "PUT",
      session,
      body: {
        password: form.password,
      },
    });

    setAuthMode("signin");
    setAuthStatus("Senha atualizada. Você já pode entrar.", "success");
    showToast("Senha atualizada.");
  });
}

async function signOutCloudAccount() {
  return runAuthAction("Saindo da conta...", "Sessão encerrada.", async () => {
    const session = loadCloudSession();

    if (session?.access_token) {
      try {
        await cloudAuthRequest("logout", {
          method: "POST",
          session,
        });
      } catch {
        // The local session is still cleared if the remote logout token has expired.
      }
    }

    clearCloudSession();
    setAuthMode("signin");
    showPage("#conta");
  });
}

function closeLogoutConfirmation() {
  if (logoutConfirmation) logoutConfirmation.hidden = true;
}

function requestSignOutConfirmation() {
  if (!hasAuthenticatedSession()) {
    showToast("Nenhuma conta conectada.");
    return;
  }

  if (!logoutConfirmation) {
    signOutCloudAccount();
    return;
  }

  logoutConfirmation.hidden = false;
  cancelLogoutButton?.focus();
}

function openPasswordRecoveryFromSettings() {
  const email = loadCloudSession()?.user?.email || authEmailInput?.value || "";
  if (authEmailInput && email) authEmailInput.value = email;
  setAuthMode("recover");
  showPage("#conta");
}

async function testCloudConnection() {
  return runCloudAction("Testando conexão com o Supabase...", "Supabase conectado.", async () => {
    const session = loadCloudSession();

    if (session?.access_token) {
      await supabaseRequest("organizations?select=id,name&limit=1", { prefer: "" });
      return;
    }

    const config = requireCloudConfig();
    const response = await fetch(normalizeCloudApiUrl(config.apiUrl), {
      headers: cloudHeaders(config, ""),
    });

    if (!response.ok) throw new Error(`Supabase respondeu ${response.status}.`);
  });
}

function locationParts(location) {
  const [city, stateCode] = String(location || "")
    .split("/")
    .map((part) => part.trim());

  return {
    city: city || null,
    state: stateCode || null,
  };
}

async function ensureCloudOrganization() {
  const config = requireCloudConfig();
  const session = await ensureFreshCloudSession();
  const user = session?.user;

  if (config.organizationId) {
    const existing = await supabaseRequest(
      `organizations?id=eq.${encodeURIComponent(config.organizationId)}&select=id,name&limit=1`,
      { prefer: "" },
    );

    if (Array.isArray(existing) && existing[0]) {
      if (user?.id) await ensureCloudMembership(existing[0].id, user.id);
      return existing[0];
    }
  }

  const accessibleOrganizations = await supabaseRequest("organizations?select=*&order=created_at.desc&limit=1", {
    prefer: "",
  });
  const existingOrganization = Array.isArray(accessibleOrganizations) ? accessibleOrganizations[0] : null;

  if (existingOrganization?.id) {
    if (user?.id) await ensureCloudMembership(existingOrganization.id, user.id);
    persistCloudConfig({
      ...config,
      organizationId: existingOrganization.id,
    });
    return existingOrganization;
  }

  const bid = activeBid();
  const location = locationParts(bid.location);
  const organizationPayload = {
    name: cleanText(bid.company || "OrçaSan Workspace"),
    legal_name: cleanTextOrNull(bid.company),
    document_number: cleanTextOrNull(bid.companyDocument),
    city: cleanTextOrNull(location.city),
    state: cleanTextOrNull(location.state),
    ...(user?.id ? { owner_user_id: user.id } : {}),
  };
  let organizationRows;

  try {
    organizationRows = await supabaseRequest("organizations", {
      method: "POST",
      body: organizationPayload,
      prefer: "return=representation",
    });
  } catch (error) {
    if (!/owner_user_id/i.test(String(error?.message || error))) throw error;

    const { owner_user_id: _ownerUserId, ...legacyPayload } = organizationPayload;
    organizationRows = await supabaseRequest("organizations", {
      method: "POST",
      body: legacyPayload,
      prefer: "return=representation",
    });
  }
  const organization = Array.isArray(organizationRows) ? organizationRows[0] : organizationRows;

  if (!organization?.id) throw new Error("Workspace não retornou ID no Supabase.");

  if (user?.id) await ensureCloudMembership(organization.id, user.id);

  persistCloudConfig({
    ...config,
    organizationId: organization.id,
  });

  return organization;
}

async function createCloudWorkspace() {
  return runCloudAction("Criando workspace na nuvem...", "Workspace da nuvem pronto.", ensureCloudOrganization);
}

function cloudDateValue(value) {
  const text = String(value || "").trim();
  if (!text) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return text;

  const parsed = new Date(text);
  if (Number.isNaN(parsed.getTime())) return null;

  return parsed.toISOString().slice(0, 10);
}

function cloudBidPayload(budget, organizationId) {
  const normalizedBudget = normalizeBudget(cleanTextDeep(budget), 0);
  const bid = normalizedBudget.bid;

  return {
    organization_id: organizationId,
    title: cleanText(bid.title || "Licitação sem nome"),
    agency: cleanTextOrNull(bid.agency),
    edital_number: cleanTextOrNull(bid.editalNumber),
    location: cleanTextOrNull(bid.location),
    work_type: cleanTextOrNull(bid.workType),
    opening_date: cloudDateValue(bid.openingDate),
    estimated_value: parseBoolean(bid.sealedValue) ? 0 : parseNumber(bid.estimatedValue),
    sealed_value: parseBoolean(bid.sealedValue),
    proposal_deadline: cloudDateValue(bid.proposalDeadline),
    modality: cleanTextOrNull(bid.modality),
    execution_days: Number(bid.executionDays) || 0,
    validity_days: Number(bid.validityDays) || 0,
    technical_owner: cleanTextOrNull(bid.technicalOwner),
    technical_registry: cleanTextOrNull(bid.technicalRegistry),
    technical_qualification: normalizeTechnicalQualification(bid.technicalQualification),
    status: normalizeBidStatus(bid.status),
    decision: cleanTextOrNull(bid.decision),
    rejection_reason: cleanTextOrNull(bid.rejectionReason),
    decision_date: cloudDateValue(bid.decisionDate),
    budget_status: normalizeBudgetWorkStatus(bid.budgetStatus),
    budget_owner: cleanTextOrNull(bid.budgetOwner),
    budget_start_date: cloudDateValue(bid.budgetStartDate),
    budget_due_date: cloudDateValue(bid.budgetDueDate),
    budget_progress: clampBudgetProgress(bid.budgetProgress),
    budget_progress_manual: parseBoolean(bid.budgetProgressManual),
    updated_at: new Date().toISOString(),
  };
}

function cloudBdiPayload(bidId, bdi) {
  const normalized = normalizeBdi(bdi);

  return {
    bid_id: bidId,
    admin: parseNumber(normalized.admin),
    insurance: parseNumber(normalized.insurance),
    guarantees: parseNumber(normalized.guarantees),
    risk: parseNumber(normalized.risk),
    finance: parseNumber(normalized.finance),
    profit: parseNumber(normalized.profit),
    iss: parseNumber(normalized.iss),
    pis_cofins: parseNumber(normalized.pisCofins),
    cprb: parseNumber(normalized.cprb),
    other_taxes: parseNumber(normalized.otherTaxes),
    enabled_charges: normalizeBdiEnabledCharges(normalized.enabledCharges),
  };
}

function cloudBudgetItemsPayload(bidId, items) {
  return items.map((item, index) => normalizeItem(cleanTextDeep(item), index)).map((item, index) => ({
    bid_id: bidId,
    position: index + 1,
    stage: cleanTextOrNull(item.stage),
    code: cleanTextOrNull(item.code),
    description: cleanText(item.description || "Item sem descrição"),
    unit: cleanText(item.unit || "un"),
    quantity: parseNumber(item.quantity),
    unit_price: parseNumber(item.unitPrice),
  }));
}

async function replaceCloudBdiSettings(bidId, bdi) {
  await supabaseRequest(`bdi_settings?bid_id=eq.${encodeURIComponent(bidId)}`, {
    method: "DELETE",
    prefer: "return=minimal",
  });

  const payload = cloudBdiPayload(bidId, bdi);

  try {
    return await supabaseRequest("bdi_settings", {
      method: "POST",
      body: payload,
      prefer: "return=representation",
    });
  } catch (error) {
    if (!/enabled_charges|schema cache|column/i.test(String(error?.message || error))) throw error;

    const { enabled_charges: _enabledCharges, ...legacyPayload } = payload;
    return supabaseRequest("bdi_settings", {
      method: "POST",
      body: legacyPayload,
      prefer: "return=representation",
    });
  }
}

async function replaceCloudBudgetItems(bidId, items) {
  await supabaseRequest(`budget_items?bid_id=eq.${encodeURIComponent(bidId)}`, {
    method: "DELETE",
    prefer: "return=minimal",
  });

  const payload = cloudBudgetItemsPayload(bidId, items);
  if (!payload.length) return [];

  return supabaseRequest("budget_items", {
    method: "POST",
    body: payload,
    prefer: "return=representation",
  });
}

async function saveBudgetToCloud(budget, organization = null) {
  const workspace = organization || (await ensureCloudOrganization());
  const payload = cloudBidPayload(budget, workspace.id);
  let cloudBid = null;

  if (budget.cloudBidId) {
    try {
      const updatedRows = await supabaseRequest(`bids?id=eq.${encodeURIComponent(budget.cloudBidId)}`, {
        method: "PATCH",
        body: payload,
        prefer: "return=representation",
      });
      cloudBid = Array.isArray(updatedRows) ? updatedRows[0] : updatedRows;
    } catch (error) {
      console.warn("Nao foi possivel atualizar a licitacao na nuvem. Um novo registro sera criado.", error);
      budget.cloudBidId = "";
    }
  }

  if (!cloudBid?.id) {
    const createdRows = await supabaseRequest("bids", {
      method: "POST",
      body: payload,
      prefer: "return=representation",
    });
    cloudBid = Array.isArray(createdRows) ? createdRows[0] : createdRows;
  }

  if (!cloudBid?.id) throw new Error("Licitação não retornou ID no Supabase.");

  budget.cloudBidId = cloudBid.id;
  await replaceCloudBdiSettings(cloudBid.id, budget.bdi);
  await replaceCloudBudgetItems(cloudBid.id, budget.items);

  return cloudBid;
}

function cloudCompositionPayload(organizationId, composition, index = 0) {
  const normalized = normalizeComposition(cleanTextDeep(composition), index);

  return {
    organization_id: organizationId,
    code: cleanTextOrNull(normalized.code),
    title: cleanText(normalized.title || "Composição sem nome"),
    unit: cleanText(normalized.unit || "un"),
    unit_cost: calculateCompositionCost(normalized),
    note: cleanTextOrNull(normalized.note),
  };
}

function cloudCompositionInputsPayload(compositionId, inputs = []) {
  return inputs.map(normalizeCompositionInput).map((input) => ({
    composition_id: compositionId,
    input_type: input.type,
    description: cleanText(input.description || "Insumo sem descrição"),
    unit: cleanText(input.unit || "un"),
    quantity: parseNumber(input.quantity),
    unit_cost: parseNumber(input.unitCost),
  }));
}

async function replaceCloudCompositions(organizationId) {
  await supabaseRequest(`compositions?organization_id=eq.${encodeURIComponent(organizationId)}`, {
    method: "DELETE",
    prefer: "return=minimal",
  });

  const createdCompositions = [];

  for (const [index, composition] of state.compositions.entries()) {
    const normalized = normalizeComposition(cleanTextDeep(composition), index);
    const createdRows = await supabaseRequest("compositions", {
      method: "POST",
      body: cloudCompositionPayload(organizationId, normalized, index),
      prefer: "return=representation",
    });
    const createdComposition = Array.isArray(createdRows) ? createdRows[0] : createdRows;

    if (!createdComposition?.id) continue;

    const inputPayload = cloudCompositionInputsPayload(createdComposition.id, normalized.inputs);
    if (inputPayload.length) {
      await supabaseRequest("composition_inputs", {
        method: "POST",
        body: inputPayload,
        prefer: "return=minimal",
      });
    }

    createdCompositions.push(createdComposition);
  }

  return createdCompositions;
}

async function cloudBidLookupForOrganization(organizationId) {
  const rows = await supabaseRequest(
    `bids?organization_id=eq.${encodeURIComponent(organizationId)}&select=*&order=updated_at.desc,created_at.desc`,
    { prefer: "" },
  );
  const byId = new Map();
  const byFingerprint = new Map();

  (rows || []).forEach((row) => {
    if (row.id) byId.set(row.id, row);

    const fingerprint = cloudBidFingerprint(row);
    if (fingerprint && !byFingerprint.has(fingerprint)) byFingerprint.set(fingerprint, row);
  });

  return { byId, byFingerprint };
}

function attachExistingCloudBidIds(budgets, lookup) {
  budgets.forEach((budget) => {
    if (budget.cloudBidId && lookup.byId.has(budget.cloudBidId)) return;

    const existing = lookup.byFingerprint.get(budgetFingerprint(budget));
    budget.cloudBidId = existing?.id || "";
  });
}

async function persistActiveBudgetToCloud() {
  const organization = await ensureCloudOrganization();
  await saveBudgetToCloud(getActiveBudget(), organization);
  saveState(false, { syncCloud: false });
}

async function syncActiveBudgetToCloud(options = {}) {
  const { silent = false } = options;

  if (!hasAuthenticatedSession()) return null;
  if (isCloudSyncing) return null;

  window.clearTimeout(cloudAutoSyncTimer);
  isCloudSyncing = true;

  if (silent) {
    try {
      await persistActiveBudgetToCloud();
      setCloudStatus("Dados sincronizados com a nuvem.", "success");
      setSaveStatus(`Salvo na nuvem às ${currentTimeLabel()}`);
      return true;
    } catch (error) {
      console.error(error);
      setCloudStatus(supabaseErrorMessage(error), "error");
      setSaveStatus("Salvo neste dispositivo. A sincronização com a nuvem falhou.");
      return null;
    } finally {
      isCloudSyncing = false;
    }
  }

  try {
    return await runCloudAction("Enviando licitação atual para a nuvem...", "Licitação enviada para a nuvem.", persistActiveBudgetToCloud);
  } finally {
    isCloudSyncing = false;
  }
}

async function persistAllDataToCloud() {
  const organization = await ensureCloudOrganization();
  clearDuplicateCloudBidIds();
  attachExistingCloudBidIds(state.budgets, await cloudBidLookupForOrganization(organization.id));

  for (const budget of state.budgets) {
    await saveBudgetToCloud(budget, organization);
  }

  await replaceCloudCompositions(organization.id);
  saveState(false, { syncCloud: false });
  render();

  return {
    organization,
    budgetCount: state.budgets.length,
  };
}

async function syncAllDataToCloud(options = {}) {
  const { silent = false } = options;

  if (silent && !hasAuthenticatedSession()) return null;
  if (isCloudSyncing) return null;

  window.clearTimeout(cloudAutoSyncTimer);
  isCloudSyncing = true;

  if (silent) {
    try {
      const result = await persistAllDataToCloud();
      setCloudStatus(`${result.budgetCount} licitação(ões) sincronizada(s) com a nuvem.`, "success");
      setSaveStatus(`Salvo na nuvem às ${currentTimeLabel()}`);
      return result;
    } catch (error) {
      console.error(error);
      setCloudStatus(supabaseErrorMessage(error), "error");
      setSaveStatus("Salvo neste dispositivo. A sincronização com a nuvem falhou.");
      return null;
    } finally {
      isCloudSyncing = false;
    }
  }

  try {
    return await runCloudAction("Enviando carteira completa para a nuvem...", "Carteira enviada para a nuvem.", persistAllDataToCloud);
  } finally {
    isCloudSyncing = false;
  }
}

async function findCloudOrganization() {
  const config = requireCloudConfig();

  if (config.organizationId) {
    const existing = await supabaseRequest(
      `organizations?id=eq.${encodeURIComponent(config.organizationId)}&select=*&limit=1`,
      { prefer: "" },
    );

    if (Array.isArray(existing) && existing[0]) return existing[0];
  }

  const organizations = await supabaseRequest("organizations?select=*&order=created_at.desc&limit=1", {
    prefer: "",
  });
  const organization = Array.isArray(organizations) ? organizations[0] : null;

  if (!organization?.id) throw new Error("Nenhum workspace encontrado na nuvem.");

  persistCloudConfig({
    ...config,
    organizationId: organization.id,
  });

  return organization;
}

function mapCloudBdi(row) {
  return normalizeBdi({
    admin: Number(row?.admin) || 0,
    insurance: Number(row?.insurance) || 0,
    guarantees: Number(row?.guarantees) || 0,
    risk: Number(row?.risk) || 0,
    finance: Number(row?.finance) || 0,
    profit: Number(row?.profit) || 0,
    iss: Number(row?.iss) || 0,
    pisCofins: Number(row?.pis_cofins) || 0,
    cprb: Number(row?.cprb) || 0,
    otherTaxes: Number(row?.other_taxes) || 0,
    enabledCharges: normalizeBdiEnabledCharges(row?.enabled_charges),
  });
}

function mapCloudItem(row, index) {
  return normalizeItem(
    {
      id: `cloud-item-${row.id || index}`,
      stage: row.stage || "",
      code: row.code || "",
      description: row.description || "",
      unit: row.unit || "un",
      quantity: Number(row.quantity) || 0,
      unitPrice: Number(row.unit_price) || 0,
    },
    index,
  );
}

function mapCloudBid(row, organization, bdiRow, itemRows, index) {
  return normalizeBudget(
    {
      id: `cloud-budget-${row.id}`,
      cloudBidId: row.id,
      createdAt: row.created_at || new Date().toISOString(),
      bid: {
        company: organization.legal_name || organization.name || defaultBid().company,
        companyDocument: organization.document_number || "",
        title: row.title || "",
        agency: row.agency || "",
        editalNumber: row.edital_number || "",
        location: row.location || "",
        workType: row.work_type || "",
        openingDate: row.opening_date || "",
        estimatedValue: Number(row.estimated_value) || 0,
        sealedValue: parseBoolean(row.sealed_value),
        proposalDeadline: row.proposal_deadline || "",
        modality: row.modality || "",
        executionDays: Number(row.execution_days) || 0,
        validityDays: Number(row.validity_days) || 0,
        technicalOwner: row.technical_owner || "",
        technicalRegistry: row.technical_registry || "",
        technicalQualification: row.technical_qualification || {},
        status: normalizeBidStatus(row.status),
        decision: row.decision || "",
        rejectionReason: row.rejection_reason || "",
        decisionDate: row.decision_date || "",
        budgetStatus: row.budget_status || "",
        budgetOwner: row.budget_owner || "",
        budgetStartDate: row.budget_start_date || "",
        budgetDueDate: row.budget_due_date || "",
        budgetProgress: Number(row.budget_progress) || 0,
        budgetProgressManual: parseBoolean(row.budget_progress_manual),
      },
      bdi: mapCloudBdi(bdiRow),
      items: itemRows.map(mapCloudItem),
    },
    index,
  );
}

function mapCloudComposition(row, index, inputRows = []) {
  return normalizeComposition(
    {
      id: `cloud-composition-${row.id || index}`,
      cloudCompositionId: row.id || "",
      code: row.code || "",
      title: row.title || "",
      unit: row.unit || "un",
      cost: Number(row.unit_cost) || 0,
      note: row.note || "",
      inputs: (inputRows || []).map((inputRow, inputIndex) => ({
        id: `cloud-composition-input-${inputRow.id || inputIndex}`,
        type: inputRow.input_type || "material",
        description: inputRow.description || "",
        unit: inputRow.unit || "un",
        quantity: Number(inputRow.quantity) || 0,
        unitCost: Number(inputRow.unit_cost) || 0,
      })),
    },
    index,
  );
}

function dedupeCloudBids(rows) {
  const seen = new Set();

  return (rows || []).filter((row) => {
    const fingerprint = cloudBidFingerprint(row) || `id:${row.id}`;
    if (seen.has(fingerprint)) return false;

    seen.add(fingerprint);
    return true;
  });
}

async function persistCloudDataToLocal() {
  const organizations = await supabaseRequest("organizations?select=*&order=created_at.desc", {
    prefer: "",
  });
  const organizationList = Array.isArray(organizations) ? organizations : [];

  if (!organizationList.length) throw new Error("Nenhum workspace encontrado na nuvem.");

  const config = loadCloudConfig();
  persistCloudConfig({
    ...config,
    organizationId: organizationList[0].id,
  });

  const organizationsById = new Map(organizationList.map((organization) => [organization.id, organization]));
  const cloudBids = await supabaseRequest("bids?select=*&order=updated_at.desc,created_at.desc", {
    prefer: "",
  });
  const budgets = [];

  for (const [index, cloudBid] of dedupeCloudBids(cloudBids).entries()) {
    const organization = organizationsById.get(cloudBid.organization_id) || organizationList[0];
    const [bdiRows, itemRows] = await Promise.all([
      supabaseRequest(`bdi_settings?bid_id=eq.${encodeURIComponent(cloudBid.id)}&select=*&limit=1`, {
        prefer: "",
      }),
      supabaseRequest(`budget_items?bid_id=eq.${encodeURIComponent(cloudBid.id)}&select=*&order=position.asc`, {
        prefer: "",
      }),
    ]);

    budgets.push(mapCloudBid(cloudBid, organization, bdiRows?.[0], itemRows || [], index));
  }

  const cloudCompositionRows = await Promise.all(
    organizationList.map((organization) =>
      supabaseRequest(`compositions?organization_id=eq.${encodeURIComponent(organization.id)}&select=*&order=created_at.asc`, {
        prefer: "",
      }),
    ),
  );
  const cloudCompositions = cloudCompositionRows.flat();
  const mappedCompositions = [];

  for (const [index, composition] of (cloudCompositions || []).entries()) {
    const inputRows = await supabaseRequest(
      `composition_inputs?composition_id=eq.${encodeURIComponent(composition.id)}&select=*&order=created_at.asc`,
      {
        prefer: "",
      },
    );

    mappedCompositions.push(mapCloudComposition(composition, index, inputRows || []));
  }

  state = normalizeState({
    activeBudgetId: budgets[0]?.id,
    budgets: budgets.length ? budgets : [demoBudget()],
    compositions: mappedCompositions,
  });

  hydrateForm();
  render();
  saveState(false, { syncCloud: false });

  return {
    organization: organizationList[0],
    budgetCount: budgets.length,
  };
}

async function loadDataFromCloud(options = {}) {
  const { confirm = true, silent = false } = options;

  if (confirm) {
    const confirmed = window.confirm("Carregar dados da nuvem? Os dados atuais deste navegador ser\u00e3o substitu\u00eddos.");
    if (!confirmed) return null;
  }

  if (silent) {
    try {
      const result = await persistCloudDataToLocal();
      setCloudStatus(`${result.budgetCount} licita\u00e7\u00e3o(\u00f5es) carregada(s) da nuvem.`, "success");
      setSaveStatus(`${result.budgetCount} licitação(ões) carregada(s) da nuvem às ${currentTimeLabel()}`);
      return result;
    } catch (error) {
      console.error(error);
      setCloudStatus(supabaseErrorMessage(error), "error");
      return null;
    }
  }

  return runCloudAction("Carregando dados da nuvem...", "Dados carregados da nuvem.", persistCloudDataToLocal);
}

async function deleteCloudBudgetById(cloudBidId) {
  if (!cloudBidId || !hasAuthenticatedSession()) return;

  await supabaseRequest(`bids?id=eq.${encodeURIComponent(cloudBidId)}`, {
    method: "DELETE",
    prefer: "return=minimal",
  });
}

function escapeHtml(value) {
  return cleanText(value).replace(/[&<>"']/g, (char) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[char];
  });
}

function parseNumber(value) {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;

  let normalized = String(value ?? "")
    .trim()
    .replace(/\s/g, "")
    .replace(/R\$/gi, "")
    .replace(/[^\d,.-]/g, "");

  if (!normalized) return 0;

  const hasComma = normalized.includes(",");
  const hasDot = normalized.includes(".");

  if (hasComma && hasDot) {
    const lastComma = normalized.lastIndexOf(",");
    const lastDot = normalized.lastIndexOf(".");
    normalized =
      lastComma > lastDot
        ? normalized.replace(/\./g, "").replace(",", ".")
        : normalized.replace(/,/g, "");
  } else if (hasComma) {
    normalized = normalized.replace(/\./g, "").replace(",", ".");
  }

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

function toCurrency(value) {
  return currencyFormatter.format(value);
}

function toPercent(value) {
  return `${percentFormatter.format(value)}%`;
}

function toDateBR(value) {
  if (!value) return "Sem data";
  const date = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) return "Sem data";
  return dateFormatter.format(date);
}

function isBdiComponentEnabled(bdi, key) {
  return parseBoolean(normalizeBdiEnabledCharges(bdi?.enabledCharges)[key]);
}

function bdiComponentValue(bdi, key) {
  return isBdiComponentEnabled(bdi, key) ? parseNumber(bdi?.[key]) : 0;
}

function getBdiBreakdown(budget = getActiveBudget()) {
  const bdi = normalizeBdi(budget.bdi);
  const indirectPercent =
    bdiComponentValue(bdi, "admin") +
    bdiComponentValue(bdi, "insurance") +
    bdiComponentValue(bdi, "guarantees") +
    bdiComponentValue(bdi, "risk");
  const taxPercent =
    bdiComponentValue(bdi, "iss") +
    bdiComponentValue(bdi, "pisCofins") +
    bdiComponentValue(bdi, "cprb") +
    bdiComponentValue(bdi, "otherTaxes");
  const denominator = Math.max(1 - taxPercent / 100, 0.01);
  const factor =
    ((1 + indirectPercent / 100) *
      (1 + bdiComponentValue(bdi, "finance") / 100) *
      (1 + bdiComponentValue(bdi, "profit") / 100)) /
    denominator;
  const totalPercent = (factor - 1) * 100;

  return {
    bdi,
    indirectPercent,
    taxPercent,
    factor,
    totalPercent,
  };
}

function getBdiPercent(budget = getActiveBudget()) {
  return getBdiBreakdown(budget).totalPercent;
}

function getBdiEntries(budget = getActiveBudget()) {
  const bdi = normalizeBdi(budget.bdi);

  return [
    ["Administração central", bdiComponentValue(bdi, "admin")],
    ["Seguros", bdiComponentValue(bdi, "insurance")],
    ["Garantias", bdiComponentValue(bdi, "guarantees")],
    ["Risco", bdiComponentValue(bdi, "risk")],
    ["Despesas financeiras", bdiComponentValue(bdi, "finance")],
    ["Lucro", bdiComponentValue(bdi, "profit")],
    ["ISS", bdiComponentValue(bdi, "iss")],
    ["PIS/COFINS", bdiComponentValue(bdi, "pisCofins")],
    ["CPRB/INSS receita", bdiComponentValue(bdi, "cprb")],
    ["Outros tributos indiretos", bdiComponentValue(bdi, "otherTaxes")],
  ];
}

function classifyItems(itemsWithTotals) {
  const total = itemsWithTotals.reduce((sum, item) => sum + item.totalWithBdi, 0);
  let accumulated = 0;

  return [...itemsWithTotals]
    .sort((a, b) => b.totalWithBdi - a.totalWithBdi)
    .map((item) => {
      const share = total ? item.totalWithBdi / total : 0;
      accumulated += share;

      let abcClass = "C";
      if (accumulated <= 0.8) abcClass = "A";
      else if (accumulated <= 0.95) abcClass = "B";

      return {
        ...item,
        share,
        accumulated,
        abcClass,
      };
    });
}

function calculateBudget(budget = getActiveBudget()) {
  const bdiPercent = getBdiPercent(budget);
  const bdiFactor = 1 + bdiPercent / 100;

  const itemsWithTotals = budget.items.map((item) => {
    const quantity = parseNumber(item.quantity);
    const unitPrice = parseNumber(item.unitPrice);
    const baseTotal = quantity * unitPrice;
    const unitPriceWithBdi = unitPrice * bdiFactor;
    const totalWithBdi = quantity * unitPriceWithBdi;

    return {
      ...item,
      quantity,
      unitPrice,
      baseTotal,
      unitPriceWithBdi,
      totalWithBdi,
    };
  });

  const classifiedItems = classifyItems(itemsWithTotals);
  const totalBase = itemsWithTotals.reduce((sum, item) => sum + item.baseTotal, 0);
  const totalWithBdi = itemsWithTotals.reduce((sum, item) => sum + item.totalWithBdi, 0);
  const criticalItems = classifiedItems.filter((item) => item.abcClass === "A").length;

  return {
    bdiPercent,
    totalBase,
    totalWithBdi,
    criticalItems,
    classifiedItems,
  };
}

function updateBdiInclusionControls() {
  if (!bdiIncludeInputs.length) return;

  const bdi = normalizeBdi(activeBdi());
  activeBdi().enabledCharges = bdi.enabledCharges;

  bdiIncludeInputs.forEach((input) => {
    const key = input.dataset.bdiInclude;
    const enabled = parseBoolean(bdi.enabledCharges[key]);
    const field = input.closest(".bdi-field");
    const valueInput = document.querySelector(`.bdi-input[data-bdi="${key}"]`);
    const statusLabel = field?.querySelector("[data-bdi-include-label]");

    input.checked = enabled;
    if (valueInput) valueInput.disabled = !enabled;
    field?.classList.toggle("bdi-field-disabled", !enabled);
    if (statusLabel) statusLabel.textContent = enabled ? "Entra" : "Fora";
  });
}

function hydrateForm() {
  const budget = getActiveBudget();

  bidInputs.forEach((input) => {
    const key = input.dataset.bid;
    if (input.type === "checkbox") {
      input.checked = parseBoolean(budget.bid[key]);
      return;
    }

    input.value = typeof budget.bid[key] === "string" ? cleanText(budget.bid[key]) : (budget.bid[key] ?? "");
  });

  bdiInputs.forEach((input) => {
    const key = input.dataset.bdi;
    input.value = budget.bdi[key] ?? 0;
  });
  updateBdiInclusionControls();

  updateSealedValueControls();
  renderTechnicalQualification();
}

function updateSealedValueControls() {
  const sealed = parseBoolean(activeBid().sealedValue);

  if (sealedValueInput) sealedValueInput.checked = sealed;
  if (estimatedValueInput) estimatedValueInput.disabled = sealed;
  if (estimatedValueField) estimatedValueField.hidden = sealed;
}

function isAnalysisAvailable(status = activeBid().status) {
  return ANALYSIS_AVAILABLE_STATUSES.includes(normalizeBidStatus(status));
}

function isBudgetAvailable(status = activeBid().status) {
  return BUDGET_AVAILABLE_STATUSES.includes(normalizeBidStatus(status));
}

function currentDateIso() {
  return new Date().toISOString().slice(0, 10);
}

function renderOpportunityDecision() {
  if (!decisionSummary) return;

  const bid = activeBid();
  const estimatedValue = parseBoolean(bid.sealedValue) ? "Sigiloso" : toCurrency(parseNumber(bid.estimatedValue));
  const decisionLabel =
    bid.decision === "participar"
      ? `Participar • ${toDateBR(bid.decisionDate)}`
      : bid.decision === "nao_participar"
        ? `Não participar • ${cleanText(bid.rejectionReason || "Motivo não informado")}`
        : "Sem decisão";

  decisionSummary.innerHTML = [
    ["Licitação", bid.title || "Licitação sem nome"],
    ["Órgão", bid.agency || "Órgão não informado"],
    ["Valor estimado", estimatedValue],
    ["Prazo da proposta", bid.proposalDeadline ? toDateBR(bid.proposalDeadline) : "Não informado"],
    ["Modalidade", bid.modality || "Não informada"],
  ]
    .map(
      ([label, value]) => `
        <div class="metric-card">
          <span>${escapeHtml(label)}</span>
          <strong>${escapeHtml(value)}</strong>
        </div>
      `,
    )
    .join("");

  if (decisionStatus) decisionStatus.textContent = decisionLabel;
  const isParticipating = bid.decision === "participar";
  const isRejecting = bid.decision === "nao_participar";

  if (approveOpportunityButton) {
    approveOpportunityButton.classList.toggle("primary-button", isParticipating);
    approveOpportunityButton.classList.toggle("ghost-button", !isParticipating);
    approveOpportunityButton.setAttribute("aria-pressed", String(isParticipating));
  }

  if (rejectOpportunityButton) {
    rejectOpportunityButton.classList.toggle("primary-button", isRejecting);
    rejectOpportunityButton.classList.toggle("ghost-button", !isRejecting);
    rejectOpportunityButton.setAttribute("aria-pressed", String(isRejecting));
  }

  if (rejectionReasonSelect) rejectionReasonSelect.value = bid.rejectionReason || "";
  if (rejectionControls) rejectionControls.hidden = bid.decision !== "nao_participar";
}

function renderTechnicalQualification() {
  if (!technicalQualificationInputs.length) return;

  const bid = activeBid();
  bid.technicalQualification = normalizeTechnicalQualification(bid.technicalQualification);
  const filledRequirements = TECHNICAL_QUALIFICATION_REQUIREMENT_KEYS.filter((field) =>
    cleanText(bid.technicalQualification[field]).trim(),
  ).length;

  technicalQualificationInputs.forEach((input) => {
    const field = input.dataset.tech;
    const value = bid.technicalQualification[field] || "";

    if (document.activeElement !== input) input.value = value;
    input.closest(".tech-field")?.classList.toggle("filled", Boolean(value.trim()));
  });

  if (technicalQualificationCount) {
    technicalQualificationCount.textContent = `${filledRequirements} de ${TECHNICAL_QUALIFICATION_REQUIREMENT_KEYS.length} exigências preenchidas`;
  }
}

function updateTechnicalQualification(field, value) {
  const bid = activeBid();
  bid.technicalQualification = normalizeTechnicalQualification(bid.technicalQualification);
  bid.technicalQualification[field] = cleanText(value);
  renderTechnicalQualification();
  scheduleSave();
}

function setTechAiStatus(message = "", kind = "idle") {
  if (!techAiStatus) return;

  techAiStatus.textContent =
    message || "A sugestão da IA deve ser revisada antes de aplicar na qualificação técnica.";
  techAiStatus.classList.toggle("loading", kind === "loading");
  techAiStatus.classList.toggle("error", kind === "error");
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.addEventListener("load", () => resolve(String(reader.result || "")));
    reader.addEventListener("error", () => reject(new Error("Não foi possível ler o arquivo.")));
    reader.readAsDataURL(file);
  });
}

function openTechnicalQualificationReview(fields) {
  if (!techAiReview || !techAiReviewFields) return;

  pendingTechnicalQualificationSuggestion = normalizeTechnicalQualification(fields);
  techAiReviewFields.innerHTML = TECHNICAL_QUALIFICATION_FIELDS.map((field) => {
    const label = TECHNICAL_QUALIFICATION_LABELS[field] || field;
    const value = pendingTechnicalQualificationSuggestion[field] || "";

    return `
      <label>
        ${escapeHtml(label)}
        <textarea data-tech-review="${escapeHtml(field)}" rows="4" placeholder="Não informado">${escapeHtml(value)}</textarea>
      </label>
    `;
  }).join("");

  techAiReview.hidden = false;
}

function closeTechnicalQualificationReview() {
  if (techAiReview) techAiReview.hidden = true;
  if (techAiReviewFields) techAiReviewFields.innerHTML = "";
  pendingTechnicalQualificationSuggestion = null;
}

function applyTechnicalQualificationReview() {
  if (!pendingTechnicalQualificationSuggestion || !techAiReviewFields) return;

  const bid = activeBid();
  const reviewedFields = {};

  techAiReviewFields.querySelectorAll("[data-tech-review]").forEach((input) => {
    reviewedFields[input.dataset.techReview] = input.value;
  });

  bid.technicalQualification = normalizeTechnicalQualification({
    ...bid.technicalQualification,
    ...reviewedFields,
  });

  renderTechnicalQualification();
  saveState(false);
  closeTechnicalQualificationReview();
  setTechAiStatus("Qualificação técnica atualizada. Revise os campos antes de usar na decisão.", "idle");
  showToast("Qualificação técnica aplicada.");
}

async function analyzeEditalWithAi(file) {
  if (!file) return;

  const isPdf = file.type === "application/pdf" || String(file.name || "").toLowerCase().endsWith(".pdf");
  if (!isPdf) {
    setTechAiStatus("Selecione um arquivo PDF do edital.", "error");
    return;
  }

  if (readEditalAiButton) {
    readEditalAiButton.disabled = true;
    readEditalAiButton.textContent = "Analisando...";
  }
  setTechAiStatus("Analisando edital...", "loading");

  try {
    const dataUrl = await readFileAsDataUrl(file);
    const pdfBase64 = dataUrl.split(",")[1] || dataUrl;
    const response = await fetch("/api/analisar-edital", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pdfBase64 }),
    });
    const data = await response.json().catch(() => ({}));

    if (!response.ok || !data?.ok) {
      throw new Error(data?.error || "Falha ao analisar o edital.");
    }

    openTechnicalQualificationReview(data.fields || {});
    setTechAiStatus("Sugestão pronta. Revise os campos antes de aplicar.", "idle");
  } catch {
    setTechAiStatus("Não foi possível ler o edital. Tente novamente ou preencha manualmente.", "error");
  } finally {
    if (readEditalAiButton) {
      readEditalAiButton.disabled = false;
      readEditalAiButton.textContent = "Ler edital com IA";
    }
    if (editalAiFileInput) editalAiFileInput.value = "";
  }
}

function renderAnalysisGate() {
  const available = isAnalysisAvailable();

  if (analysisLockedMessage) analysisLockedMessage.hidden = available;
  if (analysisAbcPanel) analysisAbcPanel.hidden = !available;
  if (analysisAlertsPanel) analysisAlertsPanel.hidden = !available;
}

function renderBudgetGate() {
  const available = isBudgetAvailable();

  if (budgetApprovalBlocker) budgetApprovalBlocker.hidden = available;
  if (budgetTableWrap) budgetTableWrap.hidden = !available;
  if (budgetPanelActions) budgetPanelActions.hidden = !available;
}

function refreshBudgetProgress(budget = getActiveBudget()) {
  const bid = budget.bid;

  if (!parseBoolean(bid.budgetProgressManual)) {
    bid.budgetProgress = calculateBudgetProgressFromItems(budget.items);
  } else {
    bid.budgetProgress = clampBudgetProgress(bid.budgetProgress);
  }

  return bid.budgetProgress;
}

function formatProgressInputValue(value) {
  const progress = clampBudgetProgress(value);
  return Number.isInteger(progress) ? String(progress) : progress.toFixed(2);
}

function renderBudgetTracking() {
  if (!budgetTrackingInputs.length && !budgetProgressBar) return;

  const budget = getActiveBudget();
  const bid = budget.bid;
  const progress = refreshBudgetProgress(budget);

  budgetTrackingInputs.forEach((input) => {
    const field = input.dataset.budgetTracking;

    if (field === "budgetProgress") {
      input.value = formatProgressInputValue(progress);
      return;
    }

    input.value = bid[field] ?? "";
  });

  if (budgetProgressBar) {
    budgetProgressBar.style.width = `${progress}%`;
    budgetProgressBar.parentElement?.setAttribute("aria-valuenow", String(Math.round(progress)));
  }

  if (budgetProgressMode) {
    budgetProgressMode.textContent = parseBoolean(bid.budgetProgressManual) ? "Manual" : "Automático";
  }
}

function updateBudgetTracking(field, value) {
  const bid = activeBid();

  if (field === "budgetStatus") {
    bid.budgetStatus = normalizeBudgetWorkStatus(value);
  } else if (field === "budgetProgress") {
    bid.budgetProgress = clampBudgetProgress(value);
    bid.budgetProgressManual = true;
  } else {
    bid[field] = cleanText(value);
  }

  renderBudgetTracking();
  scheduleSave();
}

function recalculateBudgetProgress() {
  const bid = activeBid();
  bid.budgetProgressManual = false;
  bid.budgetProgress = calculateBudgetProgressFromItems(activeItems());
  renderBudgetTracking();
  saveState(true);
  showToast("Avanço recalculado automaticamente.");
}

function applyOpportunityDecision(decision, rejectionReason = "") {
  const bid = activeBid();

  if (decision === "participar") {
    bid.decision = "participar";
    bid.rejectionReason = "";
    bid.status = "Aprovada";
  } else {
    bid.decision = "nao_participar";
    bid.rejectionReason = cleanText(rejectionReason);
    bid.status = "Recusada";
  }

  bid.decisionDate = currentDateIso();
  hydrateForm();
  render();
  saveState(true);
}

function approveOpportunity() {
  applyOpportunityDecision("participar");
  showToast("Oportunidade aprovada para orçamento.");
}

function showRejectionControls() {
  if (rejectionControls) rejectionControls.hidden = false;
  rejectionReasonSelect?.focus();
}

function confirmOpportunityRejection() {
  const reason = cleanText(rejectionReasonSelect?.value).trim();

  if (!reason) {
    showToast("Selecione o motivo da recusa.");
    rejectionReasonSelect?.focus();
    return;
  }

  applyOpportunityDecision("nao_participar", reason);
  showToast("Oportunidade recusada.");
}

function renderBidMeta() {
  const bid = activeBid();
  const datedBudgets = state.budgets
    .filter((budget) => budget.bid.openingDate)
    .sort((a, b) => String(a.bid.openingDate).localeCompare(String(b.bid.openingDate)));
  const nextBudget = datedBudgets[0] || getActiveBudget();

  document.querySelector("#bid-status-pill").textContent = normalizeBidStatus(bid.status);
  document.querySelector("#next-opening-date").textContent = toDateBR(nextBudget.bid.openingDate);
  document.querySelector("#next-opening-summary").textContent =
    `${nextBudget.bid.editalNumber || "Sem edital"} - ${nextBudget.bid.workType || "Tipo não informado"}`;
}

function renderBidList() {
  const filteredBudgets =
    bidStatusFilter === "Todas"
      ? state.budgets
      : state.budgets.filter((budget) => normalizeBidStatus(budget.bid.status) === bidStatusFilter);

  if (!filteredBudgets.length) {
    bidsList.innerHTML = '<div class="empty-state">Nenhuma licitação neste filtro.</div>';
    return;
  }

  bidsList.innerHTML = filteredBudgets
    .map((budget) => {
      const totals = calculateBudget(budget);
      const isActive = budget.id === state.activeBudgetId;

      return `
        <article class="bid-card ${isActive ? "active" : ""}">
          <button class="bid-card-main" data-select-budget="${escapeHtml(budget.id)}" type="button">
            <div>
              <span class="bid-card-kicker">${escapeHtml(budget.bid.editalNumber || "Sem edital")}</span>
              <strong>${escapeHtml(budget.bid.title || "Licitação sem nome")}</strong>
              <span>${escapeHtml(budget.bid.agency || "Órgão não informado")} • ${escapeHtml(budget.bid.location || "Local não informado")}</span>
            </div>
            <div class="bid-card-meta">
              <span>${escapeHtml(normalizeBidStatus(budget.bid.status))}</span>
              <strong>${toCurrency(totals.totalWithBdi)}</strong>
              <span>Abertura: ${toDateBR(budget.bid.openingDate)}</span>
            </div>
          </button>
          <div class="bid-card-actions">
            <button class="ghost-button compact" data-duplicate-budget="${escapeHtml(budget.id)}" type="button">Duplicar</button>
            <button class="ghost-button compact danger-text" data-delete-budget="${escapeHtml(budget.id)}" type="button">Excluir licitação</button>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderPipeline() {
  pipelineGrid.innerHTML = BID_STATUSES.map((status) => {
    const budgets = state.budgets.filter((budget) => normalizeBidStatus(budget.bid.status) === status);
    const total = budgets.reduce((sum, budget) => sum + calculateBudget(budget).totalWithBdi, 0);

    return `
      <button class="pipeline-card ${bidStatusFilter === status ? "active" : ""}" data-filter-status="${escapeHtml(status)}" type="button">
        <span>${escapeHtml(status)}</span>
        <strong>${budgets.length}</strong>
        <small>${toCurrency(total)}</small>
      </button>
    `;
  }).join("");
}

function renderBidFilters() {
  const filters = ["Todas", ...BID_STATUSES];

  bidFilters.innerHTML = filters
    .map((status) => {
      const count =
        status === "Todas"
          ? state.budgets.length
          : state.budgets.filter((budget) => normalizeBidStatus(budget.bid.status) === status).length;

      return `
        <button class="filter-tab ${bidStatusFilter === status ? "active" : ""}" data-filter-status="${escapeHtml(status)}" type="button">
          ${escapeHtml(status)} <span>${count}</span>
        </button>
      `;
    })
    .join("");
}

function renderDashboardOverview() {
  const portfolio = state.budgets.map((budget) => ({
    budget,
    totals: calculateBudget(budget),
    bidStatus: normalizeBidStatus(budget.bid.status),
    budgetStatus: normalizeBudgetWorkStatus(budget.bid.budgetStatus),
  }));
  const approvedStatuses = ["Aprovada", "Em orçamento", "Em revisão", "Proposta enviada", "Ganha", "Perdida"];
  const budgetInProgressStatuses = ["Em andamento", "Aguardando informações", "Em revisão"];
  const participatedStatuses = ["Proposta enviada", "Ganha", "Perdida"];
  const analysisStatuses = ["Identificada", "Em análise"];
  const totalValue = portfolio.reduce((sum, item) => sum + item.totals.totalWithBdi, 0);
  const countByBidStatus = (status) => portfolio.filter((item) => item.bidStatus === status).length;
  const countByBidStatuses = (statuses) => portfolio.filter((item) => statuses.includes(item.bidStatus)).length;
  const countByBudgetStatuses = (statuses) => portfolio.filter((item) => statuses.includes(item.budgetStatus)).length;
  const sumEstimatedByBidStatuses = (statuses) =>
    portfolio.reduce((sum, item) => (statuses.includes(item.bidStatus) ? sum + parseNumber(item.budget.bid.estimatedValue) : sum), 0);
  const sumTotalByBidStatuses = (statuses) =>
    portfolio.reduce((sum, item) => (statuses.includes(item.bidStatus) ? sum + item.totals.totalWithBdi : sum), 0);
  const setMetric = (selector, value) => {
    const element = document.querySelector(selector);
    if (element) element.textContent = value;
  };

  const totalCount = portfolio.length;
  const approvedCount = countByBidStatuses(approvedStatuses);
  const participatedCount = countByBidStatuses(participatedStatuses);
  const wonCount = countByBidStatus("Ganha");
  const budgetInProgressCount = countByBudgetStatuses(budgetInProgressStatuses);
  const budgetFinishedCount = countByBudgetStatuses(["Finalizado"]);
  const opportunityUseRate = totalCount ? (approvedCount / totalCount) * 100 : 0;
  const successRate = participatedCount ? (wonCount / participatedCount) * 100 : null;

  setMetric("#metric-bids-total", totalCount);
  setMetric("#metric-identificadas", countByBidStatus("Identificada"));
  setMetric("#metric-aprovadas", approvedCount);
  setMetric("#metric-recusadas", countByBidStatus("Recusada"));
  setMetric("#metric-orc-andamento", budgetInProgressCount);
  setMetric("#metric-orc-concluidos", budgetFinishedCount);
  setMetric("#metric-participadas", participatedCount);
  setMetric("#metric-ganhas", wonCount);
  setMetric("#metric-perdidas", countByBidStatus("Perdida"));
  setMetric("#metric-declinadas", countByBidStatus("Declinada"));
  setMetric("#metric-taxa-aproveitamento", toPercent(opportunityUseRate));
  setMetric("#metric-taxa-sucesso", successRate === null ? "—" : toPercent(successRate));
  setMetric("#metric-portfolio-total", toCurrency(totalValue));
  setMetric("#metric-valor-analise", toCurrency(sumEstimatedByBidStatuses(analysisStatuses)));
  setMetric("#metric-valor-propostas", toCurrency(sumTotalByBidStatuses(participatedStatuses)));
  setMetric("#metric-valor-ganhas", toCurrency(sumTotalByBidStatuses(["Ganha"])));
  setMetric("#metric-valor-perdidas", toCurrency(sumTotalByBidStatuses(["Perdida"])));
  setMetric("#metric-in-progress", budgetInProgressCount);
  setMetric("#metric-finished", budgetFinishedCount);

  if (!dashboardRecentList) return;

  dashboardRecentList.innerHTML = portfolio
    .sort((a, b) => String(b.budget.createdAt || "").localeCompare(String(a.budget.createdAt || "")))
    .slice(0, 5)
    .map(({ budget, totals }) => {
      const isActive = budget.id === state.activeBudgetId;

      return `
        <article class="recent-bid-row ${isActive ? "active" : ""}">
          <div>
            <span>${escapeHtml(budget.bid.editalNumber || "Sem edital")} • ${escapeHtml(normalizeBidStatus(budget.bid.status))}</span>
            <strong>${escapeHtml(budget.bid.title || "Licitação sem nome")}</strong>
            <small>${escapeHtml(budget.bid.agency || "Órgão não informado")} • ${toCurrency(totals.totalWithBdi)}</small>
          </div>
          <button class="ghost-button compact" data-dashboard-open-budget="${escapeHtml(budget.id)}" type="button">Abrir</button>
        </article>
      `;
    })
    .join("");
}

function renderSummary(budget) {
  const bdiBreakdown = getBdiBreakdown();
  updateBdiInclusionControls();
  renderDashboardOverview();
  document.querySelector("#bdi-total").textContent = toPercent(budget.bdiPercent);
  document.querySelector("#bdi-total-hero").textContent = toPercent(bdiBreakdown.totalPercent);
  document.querySelector("#bdi-indirect-total").textContent = toPercent(bdiBreakdown.indirectPercent);
  document.querySelector("#bdi-tax-total").textContent = toPercent(bdiBreakdown.taxPercent);
  document.querySelector("#bdi-factor").textContent = bdiBreakdown.factor.toLocaleString("pt-BR", {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  });
}

function aggregateStages(classifiedItems) {
  const stageMap = new Map();

  classifiedItems.forEach((item) => {
    const stage = item.stage || "Sem grupo";
    const current = stageMap.get(stage) || 0;
    stageMap.set(stage, current + item.totalWithBdi);
  });

  return Array.from(stageMap.entries())
    .map(([stage, total]) => ({ stage, total }))
    .sort((a, b) => b.total - a.total);
}

function aggregateAbc(classifiedItems) {
  return classifiedItems.reduce(
    (accumulator, item) => {
      accumulator[item.abcClass] += item.totalWithBdi;
      return accumulator;
    },
    { A: 0, B: 0, C: 0 },
  );
}

function renderCharts(budgetSummary) {
  const budget = getActiveBudget();
  const stageTotals = aggregateStages(budgetSummary.classifiedItems);
  const biggestStage = stageTotals[0]?.total || 0;
  const abcTotals = aggregateAbc(budgetSummary.classifiedItems);
  const abcTotal = abcTotals.A + abcTotals.B + abcTotals.C || 1;
  const aPercent = (abcTotals.A / abcTotal) * 100;
  const bPercent = (abcTotals.B / abcTotal) * 100;
  const cPercent = (abcTotals.C / abcTotal) * 100;
  const bdiEntries = getBdiEntries(budget);
  const maxBdi = Math.max(...bdiEntries.map((entry) => parseNumber(entry[1])), 1);

  activeBudgetLabel.textContent = budget.bid.status || "Selecionada";
  activeBudgetCard.innerHTML = `
    <strong>${escapeHtml(budget.bid.title || "Licitação sem nome")}</strong>
    <span>${escapeHtml(budget.bid.editalNumber || "Sem edital")} • ${escapeHtml(budget.bid.agency || "Órgão não informado")}</span>
    <div class="active-budget-facts">
      <div><span>Abertura</span><strong>${toDateBR(budget.bid.openingDate)}</strong></div>
      <div><span>Itens</span><strong>${budget.items.length}</strong></div>
      <div><span>Total</span><strong>${toCurrency(budgetSummary.totalWithBdi)}</strong></div>
    </div>
  `;

  if (!stageTotals.length) {
    stageChart.innerHTML = '<div class="empty-state">Adicione itens para gerar o gráfico por grupo.</div>';
  } else {
    stageChart.innerHTML = stageTotals
      .slice(0, 6)
      .map((item) => {
        const width = biggestStage ? (item.total / biggestStage) * 100 : 0;
        const share = budgetSummary.totalWithBdi ? (item.total / budgetSummary.totalWithBdi) * 100 : 0;
        return `
          <div class="chart-row">
            <div class="chart-row-label">
              <strong>${escapeHtml(item.stage)}</strong>
              <span>${toCurrency(item.total)} • ${percentFormatter.format(share)}%</span>
            </div>
            <div class="chart-bar"><span style="width: ${Math.max(width, 3)}%"></span></div>
          </div>
        `;
      })
      .join("");
  }

  abcChartWrap.innerHTML = `
    <div class="donut-chart" style="--a: ${aPercent}; --b: ${bPercent}; --c: ${cPercent};">
      <strong>${toCurrency(budgetSummary.totalWithBdi)}</strong>
      <span>Total</span>
    </div>
    <div class="chart-legend">
      <div><i class="legend-a"></i><span>Classe A</span><strong>${percentFormatter.format(aPercent)}%</strong></div>
      <div><i class="legend-b"></i><span>Classe B</span><strong>${percentFormatter.format(bPercent)}%</strong></div>
      <div><i class="legend-c"></i><span>Classe C</span><strong>${percentFormatter.format(cPercent)}%</strong></div>
    </div>
  `;

  bdiChart.innerHTML = bdiEntries
    .map(([label, value]) => {
      const numericValue = parseNumber(value);
      const width = (numericValue / maxBdi) * 100;
      return `
        <div class="chart-row compact-chart-row">
          <div class="chart-row-label">
            <strong>${escapeHtml(label)}</strong>
            <span>${toPercent(numericValue)}</span>
          </div>
          <div class="chart-bar secondary"><span style="width: ${Math.max(width, 3)}%"></span></div>
        </div>
      `;
    })
    .join("");
}

function renderTable(classifiedItems) {
  const classificationById = new Map(classifiedItems.map((item) => [item.id, item]));

  itemsBody.innerHTML = activeItems()
    .map((item) => {
      const calculated = classificationById.get(item.id);

      return `
        <tr data-row-id="${escapeHtml(item.id)}">
          <td>
            <input class="table-input" data-item-id="${escapeHtml(item.id)}" data-field="stage" value="${escapeHtml(item.stage)}" />
          </td>
          <td>
            <input class="table-input code-input" data-item-id="${escapeHtml(item.id)}" data-field="code" value="${escapeHtml(item.code)}" />
          </td>
          <td>
            <input class="table-input description-input" data-item-id="${escapeHtml(item.id)}" data-field="description" value="${escapeHtml(item.description)}" />
          </td>
          <td>
            <input class="table-input unit-input" data-item-id="${escapeHtml(item.id)}" data-field="unit" value="${escapeHtml(item.unit)}" />
          </td>
          <td>
            <input class="table-input number-input" data-item-id="${escapeHtml(item.id)}" data-field="quantity" type="number" min="0" step="0.01" value="${calculated.quantity}" />
          </td>
          <td>
            <input class="table-input money-input" data-item-id="${escapeHtml(item.id)}" data-field="unitPrice" type="number" min="0" step="0.01" value="${calculated.unitPrice}" />
          </td>
          <td class="money-cell">${toCurrency(calculated.baseTotal)}</td>
          <td class="money-cell">${toCurrency(calculated.totalWithBdi)}</td>
          <td><span class="abc-pill ${calculated.abcClass.toLowerCase()}">${calculated.abcClass}</span></td>
          <td>
            <button class="icon-button danger-button" data-remove-id="${escapeHtml(item.id)}" type="button" title="Remover item">×</button>
          </td>
        </tr>
      `;
    })
    .join("");
}

function renderAbcList(classifiedItems) {
  if (!classifiedItems.length) {
    abcList.innerHTML = '<div class="empty-state">Nenhum item cadastrado.</div>';
    return;
  }

  abcList.innerHTML = classifiedItems
    .slice(0, 5)
    .map(
      (item) => `
        <div class="abc-row">
          <div class="abc-row-header">
            <strong>${escapeHtml(item.description || "Item sem descrição")}</strong>
            <span>${toCurrency(item.totalWithBdi)}</span>
          </div>
          <div class="bar" aria-hidden="true">
            <div class="bar-fill" style="width: ${Math.max(item.share * 100, 3)}%"></div>
          </div>
          <div class="abc-row-footer">
            <span>${percentFormatter.format(item.share * 100)}% do orçamento</span>
            <span>Classe ${item.abcClass}</span>
          </div>
        </div>
      `,
    )
    .join("");
}

function buildAlerts(budgetSummary) {
  const budget = getActiveBudget();
  const alerts = [];
  const biggestItem = budgetSummary.classifiedItems[0];
  const emptyValues = budget.items.filter((item) => !parseNumber(item.quantity) || !parseNumber(item.unitPrice));

  if (biggestItem && biggestItem.share >= 0.25) {
    alerts.push({
      type: "warning",
      title: biggestItem.description || "Item de maior impacto",
      text: `Representa ${percentFormatter.format(biggestItem.share * 100)}% do orçamento. Vale conferir composição, produtividade e cotação.`,
    });
  }

  if (budgetSummary.bdiPercent < 15) {
    alerts.push({
      type: "warning",
      title: "BDI baixo",
      text: "O percentual está abaixo da faixa comum para obras públicas. Confira tributos, lucro, risco e despesas financeiras.",
    });
  } else if (budgetSummary.bdiPercent > 35) {
    alerts.push({
      type: "warning",
      title: "BDI alto",
      text: "O percentual pode exigir justificativa técnica e atenção ao limite aceito pelo edital.",
    });
  } else {
    alerts.push({
      type: "positive",
      title: "BDI consistente",
      text: "Percentual dentro de uma faixa preliminar saudável para análise de proposta.",
    });
  }

  if (emptyValues.length) {
    alerts.push({
      type: "warning",
      title: `${emptyValues.length} item(ns) incompleto(s)`,
      text: "Revise quantidades e preços unitários antes de gerar a proposta.",
    });
  }

  if (!budget.items.length) {
    alerts.push({
      type: "warning",
      title: "Planilha vazia",
      text: "Adicione itens para calcular totais, BDI e curva ABC.",
    });
  }

  return alerts;
}

function renderAlerts(budgetSummary) {
  alertsList.innerHTML = buildAlerts(budgetSummary)
    .map(
      (alert) => `
        <div class="alert-row ${alert.type === "positive" ? "positive" : ""}">
          <strong>${escapeHtml(alert.title)}</strong>
          <span>${escapeHtml(alert.text)}</span>
        </div>
      `,
    )
    .join("");
}

function renderCompositionInputTypeOptions(currentType) {
  return COMPOSITION_INPUT_TYPES.map(
    (type) =>
      `<option value="${escapeHtml(type)}" ${type === currentType ? "selected" : ""}>${escapeHtml(
        COMPOSITION_INPUT_TYPE_LABELS[type],
      )}</option>`,
  ).join("");
}

function renderCompositionInputs(composition) {
  if (!composition.inputs.length) {
    return '<div class="empty-state compact-empty">Nenhum insumo cadastrado nesta composição.</div>';
  }

  return `
    <div class="composition-input-table-wrap">
      <table class="composition-input-table">
        <thead>
          <tr>
            <th>Tipo</th>
            <th>Descrição</th>
            <th>Un.</th>
            <th>Qtd.</th>
            <th>Custo unit.</th>
            <th>Subtotal</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          ${composition.inputs
            .map((input) => {
              const subtotal = parseNumber(input.quantity) * parseNumber(input.unitCost);

              return `
                <tr data-composition-input-id="${escapeHtml(input.id)}">
                  <td>
                    <select class="table-input composition-input-type" data-composition-input-field="type">
                      ${renderCompositionInputTypeOptions(input.type)}
                    </select>
                  </td>
                  <td>
                    <input class="table-input composition-input-description" data-composition-input-field="description" value="${escapeHtml(input.description)}" />
                  </td>
                  <td>
                    <input class="table-input unit-input" data-composition-input-field="unit" value="${escapeHtml(input.unit)}" />
                  </td>
                  <td>
                    <input class="table-input number-input" data-composition-input-field="quantity" type="number" min="0" step="0.01" value="${parseNumber(input.quantity)}" />
                  </td>
                  <td>
                    <input class="table-input money-input" data-composition-input-field="unitCost" type="number" min="0" step="0.01" value="${parseNumber(input.unitCost)}" />
                  </td>
                  <td class="money-cell" data-composition-input-subtotal="${escapeHtml(input.id)}">${toCurrency(subtotal)}</td>
                  <td>
                    <button class="icon-button danger-button" data-remove-composition-input="${escapeHtml(input.id)}" type="button" title="Remover insumo">×</button>
                  </td>
                </tr>
              `;
            })
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderCompositions() {
  compositionList.innerHTML = state.compositions
    .map((composition) => {
      composition.cost = calculateCompositionCost(composition);

      return `
        <div class="composition-row editable-composition detailed-composition" data-composition-id="${escapeHtml(composition.id)}">
          <div class="composition-header">
            <div class="composition-fields">
              <input class="table-input code-input" data-composition-field="code" value="${escapeHtml(composition.code)}" aria-label="Código da composição" />
              <input class="table-input composition-title-input" data-composition-field="title" value="${escapeHtml(composition.title)}" aria-label="Título da composição" />
              <textarea class="composition-note-input" data-composition-field="note" aria-label="Observação da composição">${escapeHtml(composition.note)}</textarea>
            </div>
            <div class="composition-price">
              <input class="table-input unit-input" data-composition-field="unit" value="${escapeHtml(composition.unit)}" aria-label="Unidade" />
              <span>Custo calculado</span>
              <strong data-composition-cost>${toCurrency(composition.cost)}</strong>
              <button class="ghost-button compact" data-add-composition-input="${escapeHtml(composition.id)}" type="button">Adicionar insumo</button>
              <button class="ghost-button compact" data-apply-composition="${escapeHtml(composition.id)}" type="button">Aplicar</button>
              <button class="icon-button danger-button" data-remove-composition="${escapeHtml(composition.id)}" type="button" title="Remover composição">×</button>
            </div>
          </div>
          ${renderCompositionInputs(composition)}
        </div>
      `;
    })
    .join("");
}

function refreshCompositionTotals(compositionId) {
  const composition = state.compositions.find((currentComposition) => currentComposition.id === compositionId);
  const row = compositionList.querySelector(`[data-composition-id="${CSS.escape(compositionId)}"]`);
  if (!composition || !row) return;

  composition.cost = calculateCompositionCost(composition);
  const total = row.querySelector("[data-composition-cost]");
  if (total) total.textContent = toCurrency(composition.cost);

  (composition.inputs || []).forEach((input) => {
    const subtotal = row.querySelector(`[data-composition-input-subtotal="${CSS.escape(input.id)}"]`);
    if (subtotal) subtotal.textContent = toCurrency(parseNumber(input.quantity) * parseNumber(input.unitCost));
  });
}

function renderReports(budgetSummary) {
  const budget = getActiveBudget();
  const reports = [
    {
      title: "Orçamento sintético",
      text: `${budget.items.length} itens, total de ${toCurrency(budgetSummary.totalWithBdi)} com BDI.`,
      action: "csv",
      label: "Exportar",
    },
    {
      title: "Planilha completa",
      text: "Gera um arquivo Excel compatível com dados da licitação, BDI, itens e curva ABC.",
      action: "xls",
      label: "Gerar XLS",
    },
    {
      title: "Curva ABC",
      text: `${budgetSummary.criticalItems} item(ns) classificados como A para análise de risco.`,
      action: "abc",
      label: "Ver análise",
    },
    {
      title: "Proposta comercial",
      text: `Validade de ${budget.bid.validityDays || 0} dias e prazo de execução de ${budget.bid.executionDays || 0} dias.`,
      action: "print",
      label: "Gerar PDF",
    },
    {
      title: "Memória do BDI",
      text: `Administração, risco, lucro, tributos e despesas totalizam ${toPercent(budgetSummary.bdiPercent)}.`,
      action: "bdi",
      label: "Revisar",
    },
  ];

  reportList.innerHTML = reports
    .map(
      (report) => `
        <div class="report-row">
          <div>
            <strong>${escapeHtml(report.title)}</strong>
            <span>${escapeHtml(report.text)}</span>
          </div>
          <button class="ghost-button compact" data-report-action="${report.action}" type="button">${escapeHtml(report.label)}</button>
        </div>
      `,
    )
    .join("");
}

function render() {
  const budgetSummary = calculateBudget();

  renderCloudConfig();
  renderBidMeta();
  renderPipeline();
  renderBidFilters();
  renderBidList();
  renderSummary(budgetSummary);
  renderCharts(budgetSummary);
  renderSettingsPanel(budgetSummary);
  renderOpportunityDecision();
  renderTechnicalQualification();
  renderAnalysisGate();
  renderBudgetGate();
  renderBudgetTracking();
  renderTable(budgetSummary.classifiedItems);
  renderAbcList(budgetSummary.classifiedItems);
  renderAlerts(budgetSummary);
  renderCompositions();
  renderReports(budgetSummary);
}

function isWorkspacePage(page) {
  return ["licitacao", "orcamento", "bdi", "analise", "relatorios", "composicoes"].includes(page);
}

function setActiveNav(hash) {
  const targetHash = hash || "#dashboard";
  const targetPage = targetHash.replace("#", "") || "dashboard";
  const mainHash = isWorkspacePage(targetPage) ? "#licitacoes" : targetHash;

  navItems.forEach((item) => {
    const isActive = item.getAttribute("href") === mainHash;
    item.classList.toggle("active", isActive);

    if (isActive) item.setAttribute("aria-current", "page");
    else item.removeAttribute("aria-current");
  });

  workspaceLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === targetHash;
    link.classList.toggle("active", isActive);
    if (isActive) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
}

function showPage(hash = "#dashboard", updateHash = true) {
  const targetHash = hash || "#dashboard";
  const page = targetHash.replace("#", "") || "dashboard";

  if (page === "conta") {
    if (appShell) appShell.hidden = true;
    if (authScreen) authScreen.hidden = false;
    if (workspaceNav) workspaceNav.hidden = true;
    renderAuthState();
    setActiveNav("#conta");

    if (updateHash && window.location.hash !== "#conta") {
      window.history.pushState(null, "", "#conta");
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  if (!hasAuthenticatedSession()) {
    if (appShell) appShell.hidden = true;
    if (authScreen) authScreen.hidden = false;
    if (workspaceNav) workspaceNav.hidden = true;
    setAuthMode("signin");
    renderAuthState();

    if (updateHash && window.location.hash !== "#conta") {
      window.history.pushState(null, "", "#conta");
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  if (appShell) appShell.hidden = false;
  if (authScreen) authScreen.hidden = true;

  const hasPage = Array.from(pageSections).some((section) => section.dataset.page === page);
  const finalPage = hasPage ? page : "dashboard";
  const finalHash = `#${finalPage}`;

  pageSections.forEach((section) => {
    section.hidden = section.dataset.page !== finalPage;
  });

  if (workspaceNav) workspaceNav.hidden = !isWorkspacePage(finalPage);
  setActiveNav(finalHash);

  if (updateHash && window.location.hash !== finalHash) {
    window.history.pushState(null, "", finalHash);
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function setupSectionObserver() {
  showPage(window.location.hash || "#dashboard", false);
}

function updateItem(id, field, value) {
  const item = activeItems().find((currentItem) => currentItem.id === id);
  if (!item) return;

  if (field === "quantity" || field === "unitPrice") {
    item[field] = parseNumber(value);
  } else {
    item[field] = cleanText(value);
  }
}

function addItem() {
  const items = activeItems();
  const nextNumber = String(items.length + 1).padStart(2, "0");

  items.push({
    id: createId(),
    stage: "Novo serviço",
    code: `07.${nextNumber}`,
    description: "Novo item de orçamento",
    unit: "un",
    quantity: 1,
    unitPrice: 1000,
  });

  render();
  scheduleSave();
  showToast("Item adicionado.");

  const lastRowInput = itemsBody.querySelector("tr:last-child .description-input");
  if (lastRowInput) lastRowInput.focus();
}

function removeItem(id) {
  const item = activeItems().find((currentItem) => currentItem.id === id);
  if (!item) return;

  const confirmed = window.confirm(`Remover o item "${item.description || item.code || "sem descrição"}"?`);
  if (!confirmed) return;

  getActiveBudget().items = activeItems().filter((item) => item.id !== id);
  render();
  saveState(true);
  showToast("Item removido.");
}

function updateComposition(id, field, value) {
  const composition = state.compositions.find((currentComposition) => currentComposition.id === id);
  if (!composition) return;

  composition[field] = cleanText(value);
  composition.cost = calculateCompositionCost(composition);
}

function addCompositionInput(compositionId, type = "material") {
  const composition = state.compositions.find((currentComposition) => currentComposition.id === compositionId);
  if (!composition) return;

  const inputType = COMPOSITION_INPUT_TYPES.includes(type) ? type : "material";
  composition.inputs = Array.isArray(composition.inputs) ? composition.inputs : [];
  composition.inputs.push(
    normalizeCompositionInput(
      {
        id: createId(),
        type: inputType,
        description: inputType === "service" ? "Novo serviço" : "Novo insumo",
        unit: composition.unit || "un",
        quantity: 1,
        unitCost: 0,
      },
      composition.inputs.length,
    ),
  );
  composition.cost = calculateCompositionCost(composition);
  renderCompositions();
  scheduleSave();
  showToast(inputType === "service" ? "Serviço adicionado." : "Insumo adicionado.");
}

function updateCompositionInput(compositionId, inputId, field, value) {
  const composition = state.compositions.find((currentComposition) => currentComposition.id === compositionId);
  const input = composition?.inputs?.find((currentInput) => currentInput.id === inputId);
  if (!composition || !input) return;

  if (field === "quantity" || field === "unitCost") {
    input[field] = parseNumber(value);
  } else if (field === "type") {
    input.type = COMPOSITION_INPUT_TYPES.includes(value) ? value : "material";
  } else {
    input[field] = cleanText(value);
  }

  composition.cost = calculateCompositionCost(composition);
}

function removeCompositionInput(compositionId, inputId) {
  const composition = state.compositions.find((currentComposition) => currentComposition.id === compositionId);
  if (!composition) return;

  composition.inputs = (composition.inputs || []).filter((input) => input.id !== inputId);
  composition.cost = calculateCompositionCost(composition);
  renderCompositions();
  saveState(true);
  showToast("Insumo removido.");
}

function addComposition() {
  const nextNumber = String(state.compositions.length + 1).padStart(3, "0");

  state.compositions.unshift({
    id: createId(),
    code: `COMP-NOVA-${nextNumber}`,
    title: "Nova composição de serviço",
    unit: "un",
    cost: 0,
    note: "Descreva os insumos, produtividade e critérios de medição.",
    inputs: [],
  });

  renderCompositions();
  scheduleSave();
  showToast("Composição criada.");

  const firstTitle = compositionList.querySelector(".composition-title-input");
  if (firstTitle) firstTitle.focus();
}

function removeComposition(id) {
  const composition = state.compositions.find((currentComposition) => currentComposition.id === id);
  if (!composition) return;

  const confirmed = window.confirm(`Remover a composição "${composition.title || composition.code || "sem descrição"}"?`);
  if (!confirmed) return;

  state.compositions = state.compositions.filter((composition) => composition.id !== id);
  renderCompositions();
  saveState(true);
  showToast("Composição removida.");
}

function applyComposition(id) {
  const composition = state.compositions.find((currentComposition) => currentComposition.id === id);
  if (!composition) return;
  const calculatedCost = calculateCompositionCost(composition);
  composition.cost = calculatedCost;

  activeItems().push({
    id: createId(),
    stage: "Composição aplicada",
    code: composition.code,
    description: composition.title,
    unit: composition.unit,
    quantity: 1,
    unitPrice: calculatedCost,
  });

  render();
  scheduleSave();
  showToast("Composição aplicada na planilha.");
  showPage("#orcamento");
}

function selectedWizardStartMode() {
  return [...wizardStartModeInputs].find((input) => input.checked)?.value || "blank";
}

function newBidWizardData() {
  return {
    title: cleanText(wizardBidTitleInput?.value).trim(),
    agency: cleanText(wizardBidAgencyInput?.value).trim(),
    workType: cleanText(wizardBidWorkTypeInput?.value).trim(),
    location: cleanText(wizardBidLocationInput?.value).trim(),
    openingDate: String(wizardBidOpeningDateInput?.value || "").trim(),
    executionDays: String(wizardBidExecutionDaysInput?.value || "").trim(),
    validityDays: String(wizardBidValidityDaysInput?.value || "").trim(),
    startMode: selectedWizardStartMode(),
  };
}

function setNewBidWizardError(message = "") {
  if (!newBidWizardError) return;

  newBidWizardError.textContent = message;
  newBidWizardError.hidden = !message;
}

function wizardStartModeLabel(value) {
  const labels = {
    blank: "Começar em branco",
    import: "Importar planilha",
    template: "Usar modelo padrão",
  };

  return labels[value] || labels.blank;
}

function renderNewBidWizardSummary() {
  if (!newBidWizardSummary) return;

  const data = newBidWizardData();
  const summary = [
    ["Nome", data.title || "Não informado"],
    ["Órgão", data.agency || "Não informado"],
    ["Tipo de obra", data.workType || "Não informado"],
    ["Município/UF", data.location || "Não informado"],
    ["Data de abertura", data.openingDate ? toDateBR(data.openingDate) : "Sem data"],
    ["Prazo de execução", data.executionDays ? `${parseNumber(data.executionDays)} dias` : "Não informado"],
    ["Validade", data.validityDays ? `${parseNumber(data.validityDays)} dias` : "Não informado"],
    ["Início", wizardStartModeLabel(data.startMode)],
  ];

  newBidWizardSummary.innerHTML = summary
    .map(
      ([label, value]) => `
        <div class="wizard-summary-item">
          <span>${escapeHtml(label)}</span>
          <strong>${escapeHtml(value)}</strong>
        </div>
      `,
    )
    .join("");
}

function renderNewBidWizard() {
  const totalSteps = NEW_BID_WIZARD_TITLES.length;
  const title = NEW_BID_WIZARD_TITLES[newBidWizardStep] || NEW_BID_WIZARD_TITLES[0];

  if (newBidWizardProgress) newBidWizardProgress.textContent = `Passo ${newBidWizardStep + 1} de ${totalSteps}`;
  if (newBidWizardTitle) newBidWizardTitle.textContent = title;

  newBidWizardPanels.forEach((panel) => {
    panel.hidden = Number(panel.dataset.wizardStep) !== newBidWizardStep;
  });

  newBidWizardIndicators.forEach((indicator) => {
    const step = Number(indicator.dataset.wizardStepIndicator);
    indicator.classList.toggle("active", step === newBidWizardStep);
    indicator.classList.toggle("done", step < newBidWizardStep);
  });

  if (newBidWizardBackButton) newBidWizardBackButton.disabled = newBidWizardStep === 0;
  if (newBidWizardNextButton) newBidWizardNextButton.hidden = newBidWizardStep === totalSteps - 1;
  if (newBidWizardCreateButton) newBidWizardCreateButton.hidden = newBidWizardStep !== totalSteps - 1;

  if (newBidWizardStep === totalSteps - 1) renderNewBidWizardSummary();
  setNewBidWizardError("");
}

function resetNewBidWizard() {
  newBidWizardStep = 0;
  newBidWizardForm?.reset();
  renderNewBidWizard();
}

function openNewBidWizard() {
  if (!newBidWizard) {
    createBudget();
    return;
  }

  resetNewBidWizard();
  newBidWizard.hidden = false;
  document.body.classList.add("wizard-open");
  window.setTimeout(() => wizardBidTitleInput?.focus(), 40);
}

function closeNewBidWizard() {
  if (!newBidWizard) return;

  newBidWizard.hidden = true;
  document.body.classList.remove("wizard-open");
  setNewBidWizardError("");
}

function validateNewBidWizardStep() {
  const data = newBidWizardData();

  if (newBidWizardStep === 0 && !data.title) {
    setNewBidWizardError("Informe o nome da licitação para continuar.");
    wizardBidTitleInput?.focus();
    return false;
  }

  setNewBidWizardError("");
  return true;
}

function nextNewBidWizardStep() {
  if (!validateNewBidWizardStep()) return;

  newBidWizardStep = Math.min(newBidWizardStep + 1, NEW_BID_WIZARD_TITLES.length - 1);
  renderNewBidWizard();
}

function previousNewBidWizardStep() {
  newBidWizardStep = Math.max(newBidWizardStep - 1, 0);
  renderNewBidWizard();
}

function submitNewBidWizard(event) {
  event?.preventDefault();
  if (newBidWizardStep < NEW_BID_WIZARD_TITLES.length - 1) {
    nextNewBidWizardStep();
    return;
  }

  const previousStep = newBidWizardStep;
  newBidWizardStep = 0;

  if (!validateNewBidWizardStep()) {
    renderNewBidWizard();
    return;
  }

  newBidWizardStep = previousStep;
  const data = newBidWizardData();
  createBudget(data);
  closeNewBidWizard();
  showPage("#licitacao");

  if (data.startMode === "import") {
    window.setTimeout(() => openBudgetImportModal(), 180);
  }
}

function createBudget(options = {}) {
  const cleanOptions = cleanTextDeep(options);
  const current = getActiveBudget();
  const nextIndex = state.budgets.length + 1;
  const startMode = cleanOptions.startMode || "blank";
  const hasOption = (key) => Object.prototype.hasOwnProperty.call(cleanOptions, key);
  const templateItems =
    startMode === "template"
      ? defaultItems().map((item) => ({
          ...item,
          id: createId(),
        }))
      : [];
  const budget = {
    id: createId(),
    createdAt: new Date().toISOString(),
    bid: {
      ...defaultBid(),
      company: current.bid.company,
      companyDocument: current.bid.companyDocument,
      technicalOwner: current.bid.technicalOwner,
      technicalRegistry: current.bid.technicalRegistry,
      title: hasOption("title") ? cleanOptions.title : `Nova licitação de saneamento ${nextIndex}`,
      agency: hasOption("agency") ? cleanOptions.agency : "",
      editalNumber: cleanOptions.editalNumber || `Edital ${String(nextIndex).padStart(3, "0")}/2026`,
      location: hasOption("location") ? cleanOptions.location : "",
      workType: hasOption("workType") ? cleanOptions.workType : defaultBid().workType,
      openingDate: hasOption("openingDate") ? cleanOptions.openingDate : "",
      executionDays: cleanOptions.executionDays === undefined ? defaultBid().executionDays : parseNumber(cleanOptions.executionDays),
      validityDays: cleanOptions.validityDays === undefined ? defaultBid().validityDays : parseNumber(cleanOptions.validityDays),
      status: DEFAULT_BID_STATUS,
    },
    bdi: {
      ...current.bdi,
    },
    items: templateItems,
  };

  state.budgets.unshift(budget);
  state.activeBudgetId = budget.id;
  hydrateForm();
  render();
  saveState();
  showToast("Nova licitação criada.");
  showPage("#licitacao");
  return budget;
}

function selectBudget(id) {
  if (id === state.activeBudgetId) return;

  state.activeBudgetId = id;
  hydrateForm();
  render();
  saveState();
  showToast("Licitação selecionada.");
}

function duplicateBudget(id) {
  const source = state.budgets.find((budget) => budget.id === id);
  if (!source) return;

  const copy = clone(source);
  copy.id = createId();
  copy.cloudBidId = "";
  copy.createdAt = new Date().toISOString();
  copy.bid.title = `${source.bid.title || "Licitação"} - cópia`;
  copy.bid.editalNumber = `${source.bid.editalNumber || "Edital"} - cópia`;
  copy.bid.status = DEFAULT_BID_STATUS;
  copy.items = copy.items.map((item) => ({
    ...item,
    id: createId(),
  }));

  state.budgets.unshift(copy);
  state.activeBudgetId = copy.id;
  bidStatusFilter = "Todas";
  hydrateForm();
  render();
  saveState();
  showToast("Licitação duplicada.");
}

async function deleteBudget(id) {
  if (state.budgets.length <= 1) {
    showToast("Mantenha pelo menos uma licitação.");
    return;
  }

  const target = state.budgets.find((budget) => budget.id === id);
  if (!target) return;

  const confirmed = window.confirm(`Excluir a licitação "${target.bid.title || "sem nome"}"?`);
  if (!confirmed) return;

  if (target.cloudBidId && hasAuthenticatedSession()) {
    try {
      await deleteCloudBudgetById(target.cloudBidId);
    } catch (error) {
      console.error(error);
      showToast("Não foi possível excluir a licitação na nuvem.");
      return;
    }
  }

  state.budgets = state.budgets.filter((budget) => budget.id !== id);

  if (state.activeBudgetId === id) {
    state.activeBudgetId = state.budgets[0].id;
    hydrateForm();
  }

  render();
  saveState();
  showToast("Licitação excluída.");
}

function resetOutOfBdiTaxes() {
  activeBdi().otherTaxes = 0;
  hydrateForm();
  render();
  saveState();
  showToast("IRPJ/CSLL retirados do BDI da proposta.");
}

function csvCell(value) {
  const text = cleanText(value).replace(/"/g, '""');
  return `"${text}"`;
}

function normalizeHeader(value) {
  return cleanText(value)
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

function normalizeImportText(value) {
  return cleanText(value)
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[_/-]+/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function compactImportText(value) {
  return normalizeImportText(value).replace(/\s+/g, "");
}

function levenshteinDistance(a, b) {
  const left = String(a || "");
  const right = String(b || "");
  if (left === right) return 0;
  if (!left.length) return right.length;
  if (!right.length) return left.length;

  const previous = Array.from({ length: right.length + 1 }, (_, index) => index);
  const current = new Array(right.length + 1);

  for (let i = 0; i < left.length; i += 1) {
    current[0] = i + 1;
    for (let j = 0; j < right.length; j += 1) {
      const cost = left[i] === right[j] ? 0 : 1;
      current[j + 1] = Math.min(current[j] + 1, previous[j + 1] + 1, previous[j] + cost);
    }
    previous.splice(0, previous.length, ...current);
  }

  return previous[right.length];
}

function textSimilarity(a, b) {
  const left = compactImportText(a);
  const right = compactImportText(b);
  const maxLength = Math.max(left.length, right.length);
  if (!maxLength) return 1;
  return 1 - levenshteinDistance(left, right) / maxLength;
}

function numberForCsv(value) {
  return Number(value || 0).toFixed(2).replace(".", ",");
}

function fileSafeName(value) {
  return cleanText(value || "orcamento")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

function downloadTextFile(filename, contents, type) {
  const blob = new Blob([contents], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function exportCsv() {
  const budget = normalizeBudget(getActiveBudget(), 0);
  const budgetSummary = calculateBudget(budget);
  const classificationById = new Map(budgetSummary.classifiedItems.map((item) => [item.id, item]));
  const header = [
    "Grupo",
    "Item",
    "Descrição",
    "Unidade",
    "Quantidade",
    "Preço unitário sem BDI",
    "Total sem BDI",
    "Total com BDI",
    "Classe ABC",
  ];

  const rows = budget.items.map((item) => {
    const calculated = classificationById.get(item.id);
    return [
      item.stage,
      item.code,
      item.description,
      item.unit,
      numberForCsv(calculated.quantity),
      numberForCsv(calculated.unitPrice),
      numberForCsv(calculated.baseTotal),
      numberForCsv(calculated.totalWithBdi),
      calculated.abcClass,
    ];
  });

  const metadata = [
    ["Empresa", budget.bid.company],
    ["CNPJ", budget.bid.companyDocument],
    ["Obra", budget.bid.title],
    ["Órgão", budget.bid.agency],
    ["Edital", budget.bid.editalNumber],
    ["Município/UF", budget.bid.location],
    ["Tipo", budget.bid.workType],
    ["Data de abertura", toDateBR(budget.bid.openingDate)],
    ["Prazo de execução", `${budget.bid.executionDays || 0} dias`],
    ["Validade da proposta", `${budget.bid.validityDays || 0} dias`],
    ["BDI", toPercent(budgetSummary.bdiPercent)],
    ["Total com BDI", toCurrency(budgetSummary.totalWithBdi)],
    [],
  ];

  const csv = [
    ...metadata.map((row) => row.map(csvCell).join(";")),
    header.map(csvCell).join(";"),
    ...rows.map((row) => row.map(csvCell).join(";")),
  ].join("\n");

  downloadTextFile(
    `orcasan-${fileSafeName(budget.bid.editalNumber || budget.bid.title)}.csv`,
    `\uFEFF${csv}`,
    "text/csv;charset=utf-8",
  );
  showToast("CSV exportado.");
}

function spreadsheetCell(value, className = "") {
  return `<td${className ? ` class="${className}"` : ""}>${escapeHtml(value)}</td>`;
}

function spreadsheetRow(values, className = "") {
  return `<tr>${values.map((value) => spreadsheetCell(value, className)).join("")}</tr>`;
}

function exportXls() {
  const budget = normalizeBudget(getActiveBudget(), 0);
  const budgetSummary = calculateBudget(budget);
  const classificationById = new Map(budgetSummary.classifiedItems.map((item) => [item.id, item]));
  const bidRows = [
    ["Empresa", budget.bid.company],
    ["CNPJ", budget.bid.companyDocument],
    ["Obra", budget.bid.title],
    ["Órgão", budget.bid.agency],
    ["Edital", budget.bid.editalNumber],
    ["Município/UF", budget.bid.location],
    ["Tipo de obra", budget.bid.workType],
    ["Data de abertura", toDateBR(budget.bid.openingDate)],
    ["Prazo de execução", `${budget.bid.executionDays || 0} dias`],
    ["Validade da proposta", `${budget.bid.validityDays || 0} dias`],
    ["Responsável técnico", budget.bid.technicalOwner],
    ["CREA/CAU", budget.bid.technicalRegistry],
    ["Status", budget.bid.status],
  ];
  const bdiRows = getBdiEntries(budget).map(([label, value]) => [label, toPercent(parseNumber(value))]);
  const budgetRows = budget.items.map((item) => {
    const calculated = classificationById.get(item.id);
    return [
      item.stage,
      item.code,
      item.description,
      item.unit,
      percentFormatter.format(calculated.quantity),
      toCurrency(calculated.unitPrice),
      toCurrency(calculated.baseTotal),
      toCurrency(calculated.totalWithBdi),
      calculated.abcClass,
      `${percentFormatter.format(calculated.share * 100)}%`,
    ];
  });
  const abcRows = budgetSummary.classifiedItems.map((item) => [
    item.code,
    item.description,
    toCurrency(item.totalWithBdi),
    `${percentFormatter.format(item.share * 100)}%`,
    `${percentFormatter.format(item.accumulated * 100)}%`,
    item.abcClass,
  ]);
  const compositionRows = state.compositions.map((composition, index) => normalizeComposition(composition, index)).map((composition) => [
    composition.code,
    composition.title,
    composition.unit,
    toCurrency(composition.cost),
    composition.note,
  ]);
  const html = `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          body { font-family: Arial, sans-serif; color: #182323; }
          h1 { font-size: 22px; margin: 0 0 4px; }
          h2 { margin-top: 24px; font-size: 16px; color: #115e59; }
          table { border-collapse: collapse; width: 100%; margin-bottom: 16px; }
          th { background: #eef4f2; color: #263534; }
          th, td { border: 1px solid #cfdad8; padding: 7px; vertical-align: top; }
          .label { width: 220px; font-weight: bold; background: #f4f7f7; }
          .total { font-weight: bold; background: #fff0dc; }
        </style>
      </head>
      <body>
        <h1>OrçaSan - Planilha de orçamento</h1>
        <p>Arquivo gerado em ${new Date().toLocaleString("pt-BR")}</p>

        <h2>Dados da licitação</h2>
        <table>
          ${bidRows.map((row) => spreadsheetRow(row, "label")).join("")}
        </table>

        <h2>Resumo</h2>
        <table>
          ${spreadsheetRow(["Valor sem BDI", toCurrency(budgetSummary.totalBase)])}
          ${spreadsheetRow(["BDI aplicado", toPercent(budgetSummary.bdiPercent)])}
          ${spreadsheetRow(["Valor com BDI", toCurrency(budgetSummary.totalWithBdi)], "total")}
        </table>

        <h2>Memória do BDI</h2>
        <table>
          <tr><th>Parâmetro</th><th>Percentual</th></tr>
          ${bdiRows.map((row) => spreadsheetRow(row)).join("")}
          ${spreadsheetRow(["BDI total", toPercent(budgetSummary.bdiPercent)], "total")}
        </table>

        <h2>Planilha orçamentária</h2>
        <table>
          <tr>
            <th>Grupo</th><th>Item</th><th>Descrição</th><th>Unidade</th><th>Quantidade</th>
            <th>Preço unitário sem BDI</th><th>Total sem BDI</th><th>Total com BDI</th><th>ABC</th><th>Participação</th>
          </tr>
          ${budgetRows.map((row) => spreadsheetRow(row)).join("")}
          ${spreadsheetRow(["", "", "", "", "", "", toCurrency(budgetSummary.totalBase), toCurrency(budgetSummary.totalWithBdi), "", ""], "total")}
        </table>

        <h2>Curva ABC</h2>
        <table>
          <tr><th>Item</th><th>Descrição</th><th>Total com BDI</th><th>Participação</th><th>Acumulado</th><th>Classe</th></tr>
          ${abcRows.map((row) => spreadsheetRow(row)).join("")}
        </table>

        <h2>Composições base</h2>
        <table>
          <tr><th>Código</th><th>Composição</th><th>Unidade</th><th>Custo unitário</th><th>Observação</th></tr>
          ${compositionRows.map((row) => spreadsheetRow(row)).join("")}
        </table>
      </body>
    </html>
  `;

  downloadTextFile(
    `orcasan-planilha-${fileSafeName(budget.bid.editalNumber || budget.bid.title)}.xls`,
    `\uFEFF${html}`,
    "application/vnd.ms-excel;charset=utf-8",
  );
  showToast("Planilha completa gerada.");
}

function proposalRows(rows) {
  return rows.map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`).join("");
}

function buildProposalDocument() {
  const budget = normalizeBudget(getActiveBudget(), 0);
  const budgetSummary = calculateBudget(budget);
  const bdiBreakdown = getBdiBreakdown(budget);
  const classificationById = new Map(budgetSummary.classifiedItems.map((item) => [item.id, item]));
  const topAbc = budgetSummary.classifiedItems.slice(0, 5);
  const generatedAt = new Date().toLocaleDateString("pt-BR");
  const proposalItems = budget.items.map((item) => {
    const calculated = classificationById.get(item.id);
    return [
      item.stage,
      item.code,
      item.description,
      item.unit,
      percentFormatter.format(calculated.quantity),
      toCurrency(calculated.unitPrice),
      toCurrency(calculated.totalWithBdi),
    ];
  });
  const bdiRows = [
    ["Administração central - AC", toPercent(bdiComponentValue(budget.bdi, "admin"))],
    ["Seguros - S", toPercent(bdiComponentValue(budget.bdi, "insurance"))],
    ["Garantias - G", toPercent(bdiComponentValue(budget.bdi, "guarantees"))],
    ["Risco - R", toPercent(bdiComponentValue(budget.bdi, "risk"))],
    ["Despesas financeiras - DF", toPercent(bdiComponentValue(budget.bdi, "finance"))],
    ["Lucro - L", toPercent(bdiComponentValue(budget.bdi, "profit"))],
    ["Tributos totais - I", toPercent(bdiBreakdown.taxPercent)],
    ["BDI final", toPercent(bdiBreakdown.totalPercent)],
  ];
  const marketPracticeRows = [
    ["ISS", "Entra no BDI"],
    ["PIS/COFINS", "Entra no BDI"],
    ["CPRB", "Entra se aplicável"],
    ["IRPJ", "Fora do BDI"],
    ["CSLL", "Fora do BDI"],
  ];

  return `
    <div class="proposal-page">
      <header class="proposal-header">
        <div class="proposal-brand">
          <div class="proposal-mark">OS</div>
          <div>
            <strong>OrçaSan</strong>
            <span>Proposta comercial de obra de saneamento</span>
          </div>
        </div>
        <div class="proposal-date">
          <span>Data de emissão</span>
          <strong>${escapeHtml(generatedAt)}</strong>
        </div>
      </header>

      <section class="proposal-title">
        <p>Proposta Comercial</p>
        <h1>${escapeHtml(budget.bid.title || "Obra de saneamento")}</h1>
        <span>${escapeHtml(budget.bid.editalNumber || "Edital não informado")}</span>
      </section>

      <section class="proposal-two-columns">
        <div>
          <h2>Proponente</h2>
          <table>
            ${proposalRows([
              ["Empresa", budget.bid.company],
              ["CNPJ", budget.bid.companyDocument],
              ["Responsável técnico", budget.bid.technicalOwner],
              ["CREA/CAU", budget.bid.technicalRegistry],
            ])}
          </table>
        </div>
        <div>
          <h2>Licitação</h2>
          <table>
            ${proposalRows([
              ["Órgão contratante", budget.bid.agency],
              ["Município/UF", budget.bid.location],
              ["Tipo de obra", budget.bid.workType],
              ["Data de abertura", toDateBR(budget.bid.openingDate)],
            ])}
          </table>
        </div>
      </section>

      <section>
        <h2>Resumo financeiro</h2>
        <div class="proposal-metrics">
          <div><span>Valor sem BDI</span><strong>${toCurrency(budgetSummary.totalBase)}</strong></div>
          <div><span>BDI aplicado</span><strong>${toPercent(budgetSummary.bdiPercent)}</strong></div>
          <div><span>Valor global proposto</span><strong>${toCurrency(budgetSummary.totalWithBdi)}</strong></div>
        </div>
      </section>

      <section>
        <h2>Condições da proposta</h2>
        <table>
          ${proposalRows([
            ["Prazo de execução", `${budget.bid.executionDays || 0} dias`],
            ["Validade da proposta", `${budget.bid.validityDays || 0} dias`],
            ["Status interno", budget.bid.status],
            ["Observação", "Valores calculados conforme itens, quantitativos, preços unitários e BDI informados no OrçaSan."],
          ])}
        </table>
      </section>

      <section>
        <h2>Memória do BDI</h2>
        <p class="proposal-note">BDI = [((1 + AC + S + G + R) × (1 + DF) × (1 + L)) ÷ (1 - I) - 1] × 100</p>
        <table>
          <thead><tr><th>Parâmetro</th><th>Percentual</th></tr></thead>
          <tbody>${proposalRows(bdiRows)}</tbody>
        </table>
        <p class="proposal-note">IRPJ e CSLL ficam fora do BDI da proposta. Usar apenas tributos indiretos sobre receita.</p>
        <table>
          <thead><tr><th>Item</th><th>Prática comum</th></tr></thead>
          <tbody>${proposalRows(marketPracticeRows)}</tbody>
        </table>
      </section>

      <section>
        <h2>Planilha orçamentária sintética</h2>
        <table>
          <thead>
            <tr>
              <th>Grupo</th><th>Item</th><th>Descrição</th><th>Un.</th><th>Qtd.</th><th>Preço unit.</th><th>Total c/ BDI</th>
            </tr>
          </thead>
          <tbody>
            ${proposalRows(proposalItems)}
            <tr class="proposal-total-row"><td colspan="6">Valor global proposto</td><td>${toCurrency(budgetSummary.totalWithBdi)}</td></tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>Itens críticos - Curva ABC</h2>
        <table>
          <thead><tr><th>Item</th><th>Descrição</th><th>Total</th><th>Participação</th><th>Classe</th></tr></thead>
          <tbody>
            ${proposalRows(
              topAbc.map((item) => [
                item.code,
                item.description,
                toCurrency(item.totalWithBdi),
                `${percentFormatter.format(item.share * 100)}%`,
                item.abcClass,
              ]),
            )}
          </tbody>
        </table>
      </section>

      <footer class="proposal-signature">
        <div>
          <span>Assinatura do responsável técnico</span>
          <strong>${escapeHtml(budget.bid.technicalOwner || "Responsável técnico")}</strong>
          <small>${escapeHtml(budget.bid.technicalRegistry || "Registro profissional")}</small>
        </div>
      </footer>
    </div>
  `;
}

function generateProfessionalProposal() {
  proposalPrint.innerHTML = buildProposalDocument();
  proposalPrint.hidden = false;
  document.body.classList.add("printing-proposal");
  window.print();
}

function downloadCsvTemplate() {
  const header = ["Grupo", "Item", "Descrição", "Unidade", "Quantidade", "Preço unitário sem BDI"];
  const rows = [header, ...Array.from({ length: 20 }, () => header.map(() => ""))];
  const csv = rows.map((row) => row.map(csvCell).join(";")).join("\n");

  downloadTextFile("orcasan-planilha-padrao.csv", `\uFEFF${csv}`, "text/csv;charset=utf-8");
  showToast("Planilha padrão baixada.");
}

function splitCsvLine(line, separator) {
  const values = [];
  let value = "";
  let insideQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const nextChar = line[index + 1];

    if (char === '"' && nextChar === '"') {
      value += '"';
      index += 1;
    } else if (char === '"') {
      insideQuotes = !insideQuotes;
    } else if (char === separator && !insideQuotes) {
      values.push(value.trim());
      value = "";
    } else {
      value += char;
    }
  }

  values.push(value.trim());
  return values;
}

function decodedTextScore(text) {
  return textEncodingIssueScore(text) + (String(text || "").match(/\uFFFD/g) || []).length * 5;
}

function decodeSpreadsheetText(buffer) {
  if (typeof TextDecoder === "undefined") return "";

  const bytes = buffer instanceof ArrayBuffer ? new Uint8Array(buffer) : buffer;
  const utf8 = new TextDecoder("utf-8").decode(bytes);
  const latin1 = new TextDecoder("iso-8859-1").decode(bytes);
  const best = decodedTextScore(latin1) < decodedTextScore(utf8) ? latin1 : utf8;

  return cleanText(best).replace(/^\uFEFF/, "");
}

async function readCsvFileText(file) {
  if (!file) return "";

  try {
    return decodeSpreadsheetText(await file.arrayBuffer());
  } catch {
    return cleanText(await file.text()).replace(/^\uFEFF/, "");
  }
}

function parseCsvTable(text) {
  const normalizedText = cleanText(text).replace(/^\uFEFF/, "");
  const lines = normalizedText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2) return [];

  const firstLine = lines[0];
  const semicolonCount = (firstLine.match(/;/g) || []).length;
  const commaCount = (firstLine.match(/,/g) || []).length;
  const separator = semicolonCount >= commaCount ? ";" : ",";

  return lines.map((line) => splitCsvLine(line, separator));
}

function rowsToObjects(rows) {
  if (!rows.length) return [];

  const headers = rows[0].map(normalizeHeader);

  return rows.slice(1).map((values) => {
    return headers.reduce((row, header, index) => {
      row[header] = values[index] || "";
      return row;
    }, {});
  });
}

function parseCsv(text) {
  return rowsToObjects(parseCsvTable(text));
}

function valueFromRow(row, possibleHeaders) {
  const key = possibleHeaders.map(normalizeHeader).find((header) => row[header] !== undefined);
  return key ? row[key] : "";
}

function importConfidenceFromScore(score) {
  if (score >= 0.9) return "alta";
  if (score >= 0.74) return "média";
  return "baixa";
}

function importAliasWeight(field, alias) {
  const normalizedAlias = compactImportText(alias);
  return IMPORT_ALIAS_WEIGHTS[field]?.[normalizedAlias] ?? 1;
}

function scoreImportHeader(header, aliases, field = "") {
  const compactHeader = compactImportText(header);
  if (!compactHeader) return { score: 0, alias: "", reason: "" };

  return aliases.reduce(
    (best, alias) => {
      const compactAlias = compactImportText(alias);
      if (!compactAlias) return best;

      const weight = importAliasWeight(field, alias);
      let score = textSimilarity(header, alias);
      let reason = "semelhança textual";

      if (compactHeader === compactAlias) {
        score = 1;
        reason = "nome igual ao esperado";
      } else if (
        compactHeader.length >= 4 &&
        compactAlias.length >= 4 &&
        (compactHeader.includes(compactAlias) || compactAlias.includes(compactHeader))
      ) {
        const coverage = Math.min(compactHeader.length, compactAlias.length) / Math.max(compactHeader.length, compactAlias.length);
        score = Math.max(score, coverage >= 0.55 ? 0.86 : 0.74);
        reason = "nome parecido";
      }

      score *= weight;
      return score > best.score ? { score, alias, reason } : best;
    },
    { score: 0, alias: "", reason: "" },
  );
}

function findImportColumn(headerRow, field, aliases, usedIndexes = new Set()) {
  const candidates = headerRow
    .map((header, index) => ({
      index,
      header: String(header || "").trim(),
      ...scoreImportHeader(header, aliases, field),
    }))
    .filter((candidate) => !usedIndexes.has(candidate.index) && candidate.header && candidate.score >= 0.62)
    .sort((a, b) => b.score - a.score || a.index - b.index);

  const best = candidates[0];
  if (!best) return { index: -1, header: "", confidence: "", score: 0, alias: "", reason: "" };

  return {
    ...best,
    confidence: importConfidenceFromScore(best.score),
  };
}

function detectImportColumns(headerRow) {
  const usedIndexes = new Set();
  const columns = {};
  const matches = {};

  IMPORT_FIELD_DEFINITIONS.forEach(({ key }) => {
    const match = findImportColumn(headerRow, key, IMPORT_COLUMN_ALIASES[key] || [], usedIndexes);
    matches[key] = match;

    if (match.index >= 0) {
      columns[key] = match.index;
      usedIndexes.add(match.index);
    }
  });

  return {
    columns,
    matches,
    headers: headerRow.map((header) => String(header || "").trim()),
  };
}

function scoreImportDetection(row, detection) {
  const nonEmptyCount = row.filter(Boolean).length;
  const recommendedScore = RECOMMENDED_IMPORT_COLUMNS.reduce((total, field) => {
    const match = detection.matches[field];
    return total + (match?.index >= 0 ? 1 + match.score : 0);
  }, 0);
  const optionalScore = ["code", "stage"].reduce((total, field) => {
    const match = detection.matches[field];
    return total + (match?.index >= 0 ? match.score : 0);
  }, 0);

  return recommendedScore * 100 + optionalScore * 12 + Math.min(nonEmptyCount, 12);
}

function findImportHeaderRow(cleanRows) {
  const candidates = cleanRows.slice(0, 40).map((row, index) => {
    const detection = detectImportColumns(row);
    return {
      index,
      detection,
      score: scoreImportDetection(row, detection),
      nonEmptyCount: row.filter(Boolean).length,
    };
  });

  const best = candidates
    .filter((candidate) => candidate.nonEmptyCount >= 3)
    .sort((a, b) => b.score - a.score || a.index - b.index)[0];

  if (!best) {
    return {
      headerIndex: 0,
      detection: detectImportColumns(cleanRows[0] || []),
    };
  }

  return {
    headerIndex: best.index,
    detection: best.detection,
  };
}

function importValue(row, index) {
  if (index === undefined || index < 0) return "";
  return cleanText(row[index]).trim();
}

function cleanSpreadsheetRows(rows) {
  return rows
    .map((row) => row.map((cell) => cleanText(cell).trim()))
    .filter((row) => row.some(Boolean));
}

function missingRequiredImportColumns(columns) {
  return REQUIRED_IMPORT_COLUMNS.filter((field) => columns[field] === undefined || columns[field] < 0);
}

function hasImportDataRows(cleanRows, columns) {
  if (!cleanRows.length || columns.description === undefined) return false;
  return cleanRows.slice(1).some((row) => importValue(row, columns.description));
}

function duplicatedImportColumns(columns) {
  const byIndex = new Map();

  Object.keys(columns).forEach((field) => {
    const index = columns[field];
    if (index === undefined || index < 0) return;
    byIndex.set(index, [...(byIndex.get(index) || []), field]);
  });

  return [...byIndex.values()].filter((fields) => fields.length > 1);
}

function itemsFromCleanRows(cleanRows, columns) {
  const missingRequired = missingRequiredImportColumns(columns);

  if (missingRequired.length) {
    throw new Error("Escolha uma coluna para usar como descrição dos itens. Os demais campos podem ser importados ou preenchidos depois.");
  }

  if (!hasImportDataRows(cleanRows, columns)) {
    throw new Error("A planilha tem cabeçalho, mas não tem linhas de itens abaixo dele. Escolha outro arquivo ou adicione itens na planilha antes de importar.");
  }

  if (duplicatedImportColumns(columns).length) {
    throw new Error("Uma mesma coluna não pode ser usada em mais de um campo. Ajuste o mapeamento e tente novamente.");
  }

  return cleanRows
    .slice(1)
    .map((row, index) => {
      const description = importValue(row, columns.description);
      if (!description) return null;

      const quantity = columns.quantity === undefined ? 1 : parseNumber(importValue(row, columns.quantity));
      const unitPrice = columns.unitPrice === undefined ? 0 : parseNumber(importValue(row, columns.unitPrice));

      return {
        id: createId(),
        stage: importValue(row, columns.stage) || "Importado da planilha",
        code: importValue(row, columns.code) || `IMP-${String(index + 1).padStart(3, "0")}`,
        description,
        unit: importValue(row, columns.unit) || "un",
        quantity,
        unitPrice,
      };
    })
    .filter(Boolean);
}

function itemsFromSpreadsheetRows(rows) {
  const cleanRows = cleanSpreadsheetRows(rows);
  if (cleanRows.length < 2) return [];

  const { headerIndex, detection } = findImportHeaderRow(cleanRows);
  return itemsFromCleanRows(cleanRows.slice(headerIndex), detection.columns);
}

function itemsFromCsvRows(rows) {
  return itemsFromSpreadsheetRows([
    Object.keys(rows[0] || {}),
    ...rows.map((row) => Object.keys(rows[0] || {}).map((key) => row[key])),
  ]);
}

function uint16(view, offset) {
  return view.getUint16(offset, true);
}

function uint32(view, offset) {
  return view.getUint32(offset, true);
}

async function inflateRaw(bytes) {
  if (!window.DecompressionStream) {
    throw new Error("Este navegador não consegue ler Excel diretamente. Salve a planilha como CSV e tente novamente.");
  }

  const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

async function createZipReader(arrayBuffer) {
  const bytes = new Uint8Array(arrayBuffer);
  const view = new DataView(arrayBuffer);
  const minOffset = Math.max(0, bytes.length - 65558);
  let eocdOffset = -1;

  for (let offset = bytes.length - 22; offset >= minOffset; offset -= 1) {
    if (uint32(view, offset) === 0x06054b50) {
      eocdOffset = offset;
      break;
    }
  }

  if (eocdOffset < 0) throw new Error("Não foi possível ler o arquivo Excel.");

  const entryCount = uint16(view, eocdOffset + 10);
  const centralDirectoryOffset = uint32(view, eocdOffset + 16);
  const entries = new Map();
  let offset = centralDirectoryOffset;

  for (let index = 0; index < entryCount; index += 1) {
    if (uint32(view, offset) !== 0x02014b50) break;

    const method = uint16(view, offset + 10);
    const compressedSize = uint32(view, offset + 20);
    const fileNameLength = uint16(view, offset + 28);
    const extraLength = uint16(view, offset + 30);
    const commentLength = uint16(view, offset + 32);
    const localHeaderOffset = uint32(view, offset + 42);
    const nameBytes = bytes.slice(offset + 46, offset + 46 + fileNameLength);
    const name = new TextDecoder().decode(nameBytes).replace(/\\/g, "/");

    entries.set(name, {
      method,
      compressedSize,
      localHeaderOffset,
    });

    offset += 46 + fileNameLength + extraLength + commentLength;
  }

  return {
    names: [...entries.keys()],
    async readText(name) {
      const entry = entries.get(name);
      if (!entry) return "";

      const localOffset = entry.localHeaderOffset;
      if (uint32(view, localOffset) !== 0x04034b50) return "";

      const fileNameLength = uint16(view, localOffset + 26);
      const extraLength = uint16(view, localOffset + 28);
      const dataOffset = localOffset + 30 + fileNameLength + extraLength;
      const compressed = bytes.slice(dataOffset, dataOffset + entry.compressedSize);
      const content = entry.method === 0 ? compressed : await inflateRaw(compressed);

      return new TextDecoder("utf-8").decode(content);
    },
  };
}

function parseXml(text) {
  return new DOMParser().parseFromString(text, "application/xml");
}

function parseSharedStrings(xmlText) {
  if (!xmlText) return [];

  const xml = parseXml(xmlText);
  return [...xml.getElementsByTagName("si")].map((item) =>
    [...item.getElementsByTagName("t")].map((textNode) => textNode.textContent || "").join(""),
  );
}

function columnIndexFromCellRef(ref) {
  const letters = String(ref || "").match(/^[A-Z]+/i)?.[0] || "";
  if (!letters) return -1;

  return [...letters.toUpperCase()].reduce((total, letter) => total * 26 + letter.charCodeAt(0) - 64, 0) - 1;
}

function cellText(cell, sharedStrings) {
  const type = cell.getAttribute("t");

  if (type === "inlineStr") {
    return [...cell.getElementsByTagName("t")].map((node) => node.textContent || "").join("");
  }

  const value = cell.getElementsByTagName("v")[0]?.textContent || "";
  if (type === "s") return sharedStrings[Number(value)] || "";
  return value;
}

function rowsFromWorksheetXml(xmlText, sharedStrings) {
  const xml = parseXml(xmlText);

  return [...xml.getElementsByTagName("row")].map((row) => {
    const values = [];
    let nextColumn = 0;

    [...row.getElementsByTagName("c")].forEach((cell) => {
      const columnIndex = columnIndexFromCellRef(cell.getAttribute("r"));
      const finalIndex = columnIndex >= 0 ? columnIndex : nextColumn;
      values[finalIndex] = cellText(cell, sharedStrings);
      nextColumn = finalIndex + 1;
    });

    return values;
  });
}

function firstWorksheetPath(zipReader) {
  return zipReader.names
    .filter((name) => /^xl\/worksheets\/sheet\d+\.xml$/i.test(name))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))[0];
}

async function parseXlsxTable(file) {
  const zipReader = await createZipReader(await file.arrayBuffer());
  const sheetPath = firstWorksheetPath(zipReader);

  if (!sheetPath) throw new Error("Não foi possível encontrar uma aba de planilha no Excel.");

  const [sheetXml, sharedStringsXml] = await Promise.all([
    zipReader.readText(sheetPath),
    zipReader.readText("xl/sharedStrings.xml"),
  ]);

  return rowsFromWorksheetXml(sheetXml, parseSharedStrings(sharedStringsXml));
}

async function readBudgetImportData(file) {
  const fileName = String(file?.name || "").toLowerCase();
  const isExcel = fileName.endsWith(".xlsx") || file?.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
  const rows = isExcel ? await parseXlsxTable(file) : parseCsvTable(await readCsvFileText(file));
  const cleanRows = cleanSpreadsheetRows(rows);

  if (cleanRows.length < 2) {
    throw new Error("Não foi possível encontrar cabeçalho e itens na planilha.");
  }

  const { headerIndex, detection } = findImportHeaderRow(cleanRows);

  return {
    rows: cleanRows.slice(headerIndex),
    detection,
    skippedRows: headerIndex,
  };
}

async function readBudgetImportItems(file) {
  const data = await readBudgetImportData(file);
  const items = itemsFromCleanRows(data.rows, data.detection.columns);
  if (!items.length) throw new Error("Nenhum item válido foi encontrado. Linhas sem descrição foram ignoradas.");
  return items;
}

function setImportMessage(message = "", kind = "error") {
  if (!budgetImportMessage) return;

  budgetImportMessage.hidden = !message;
  budgetImportMessage.textContent = message;
  budgetImportMessage.classList.toggle("success", kind === "success");
}

function columnLabel(header, index) {
  return `${String.fromCharCode(65 + index)} - ${header || `Coluna ${index + 1}`}`;
}

function importFieldKindLabel({ required, recommended }) {
  if (required) return "Obrigatório";
  if (recommended) return "Recomendado";
  return "Opcional";
}

function renderBudgetImportMapping(detection) {
  if (!budgetImportMapping || !budgetImportMappingBody) return;

  const headers = detection.headers || [];
  budgetImportMapping.hidden = false;
  budgetImportMappingBody.innerHTML = IMPORT_FIELD_DEFINITIONS.map((definition) => {
    const { key, label, required, defaultText } = definition;
    const selectedIndex = pendingBudgetImportColumns[key] ?? -1;
    const match = detection.matches?.[key] || {};
    const confidence = match.confidence || "";
    const statusText =
      selectedIndex >= 0
        ? `Coluna identificada automaticamente${confidence ? ` com confiança ${confidence}` : ""}.`
        : required
          ? "Escolha qual coluna da planilha será a descrição do item."
          : `Se não adicionar, o OrçaSan usará ${defaultText}.`;
    const statusClass = confidence ? `confidence-${normalizeHeader(confidence)}` : "confidence-empty";

    return `
      <div class="import-mapping-row">
        <div>
          <strong>${escapeHtml(label)}</strong>
          <small>${escapeHtml(importFieldKindLabel(definition))}</small>
        </div>
        <select data-import-field="${escapeHtml(key)}" aria-label="${escapeHtml(label)}" ${!required && selectedIndex < 0 ? "disabled" : ""}>
          <option value="">Não importar</option>
          ${headers
            .map(
              (header, index) =>
                `<option value="${index}" ${selectedIndex === index ? "selected" : ""}>${escapeHtml(columnLabel(header, index))}</option>`,
            )
            .join("")}
        </select>
        <span class="import-confidence ${statusClass}" data-import-confidence="${escapeHtml(key)}">${escapeHtml(
          selectedIndex >= 0 && confidence ? confidence : required ? "pendente" : "ignorado",
        )}</span>
        <label class="import-toggle">
          <input
            type="checkbox"
            data-import-enabled="${escapeHtml(key)}"
            ${required || selectedIndex >= 0 ? "checked" : ""}
            ${required ? "disabled" : ""}
          />
          <span>${required ? "Necessário" : "Adicionar"}</span>
        </label>
        <small data-import-helper="${escapeHtml(key)}">${escapeHtml(statusText)}</small>
      </div>
    `;
  }).join("");
}

function selectedBudgetImportColumns() {
  if (!budgetImportMappingBody) return { ...pendingBudgetImportColumns };

  return [...budgetImportMappingBody.querySelectorAll("[data-import-field]")].reduce((columns, select) => {
    const field = select.dataset.importField;
    const definition = IMPORT_FIELD_DEFINITIONS.find((item) => item.key === field);
    const enabledInput = budgetImportMappingBody.querySelector(`[data-import-enabled="${field}"]`);
    const enabled = definition?.required || enabledInput?.checked;
    const index = select.value === "" ? -1 : Number(select.value);
    if (field && enabled && index >= 0) columns[field] = index;
    return columns;
  }, {});
}

function updateBudgetImportMappingStatus(columns) {
  if (!budgetImportMappingBody) return;

  IMPORT_FIELD_DEFINITIONS.forEach(({ key, required, defaultText }) => {
    const select = budgetImportMappingBody.querySelector(`[data-import-field="${key}"]`);
    const enabledInput = budgetImportMappingBody.querySelector(`[data-import-enabled="${key}"]`);
    const confidence = budgetImportMappingBody.querySelector(`[data-import-confidence="${key}"]`);
    const helper = budgetImportMappingBody.querySelector(`[data-import-helper="${key}"]`);
    const enabled = required || enabledInput?.checked;
    const selected = enabled && select?.value !== "";

    if (select) {
      select.disabled = !required && !enabled;
      if (!enabled) select.value = "";
    }

    if (confidence) {
      confidence.textContent = selected ? "manual" : required ? "pendente" : "ignorado";
      confidence.className = `import-confidence ${selected ? "confidence-manual" : "confidence-empty"}`;
    }

    if (helper) {
      helper.textContent = !enabled
        ? `Este campo será ignorado. O padrão será ${defaultText}.`
        : selected
        ? "Coluna selecionada manualmente."
        : required
          ? "Escolha qual coluna da planilha será a descrição do item."
          : `Selecione uma coluna ou desmarque para usar ${defaultText}.`;
    }
  });

  pendingBudgetImportColumns = columns;
}

function clearBudgetImportPreview() {
  pendingBudgetImportItems = [];
  if (budgetImportPreview) budgetImportPreview.hidden = true;
  if (budgetImportPreviewBody) budgetImportPreviewBody.innerHTML = "";
  if (budgetImportSummary) budgetImportSummary.textContent = "0 item selecionado";
  if (confirmBudgetImportButton) confirmBudgetImportButton.disabled = true;
}

function applyBudgetImportMapping({ manual = false, notice = "" } = {}) {
  const columns = selectedBudgetImportColumns();
  if (manual) updateBudgetImportMappingStatus(columns);

  const missingRequired = missingRequiredImportColumns(columns);
  if (missingRequired.length) {
    clearBudgetImportPreview();
    setImportMessage("Escolha uma coluna para usar como descrição dos itens. Os demais campos podem ser importados ou preenchidos depois.");
    return;
  }

  if (duplicatedImportColumns(columns).length) {
    clearBudgetImportPreview();
    setImportMessage("Uma mesma coluna não pode ser usada em mais de um campo. Ajuste o mapeamento e tente novamente.");
    return;
  }

  if (!hasImportDataRows(pendingBudgetImportRows, columns)) {
    clearBudgetImportPreview();
    setImportMessage("A planilha tem cabeçalho, mas não tem linhas de itens abaixo dele. O OrçaSan precisa de pelo menos uma linha para criar item no orçamento.");
    return;
  }

  try {
    const items = itemsFromCleanRows(pendingBudgetImportRows, columns);
    if (!items.length) throw new Error("Nenhum item válido foi encontrado. Linhas sem descrição foram ignoradas.");
    renderBudgetImportPreview(items, budgetImportFileName?.textContent || "", { message: notice });
  } catch (error) {
    clearBudgetImportPreview();
    setImportMessage(error?.message || "Não foi possível importar este arquivo.");
  }
}

function resetImportPreview() {
  pendingBudgetImportItems = [];
  pendingBudgetImportRows = [];
  pendingBudgetImportColumns = {};
  if (budgetImportFileName) budgetImportFileName.textContent = "Nenhum arquivo selecionado";
  if (budgetImportMapping) budgetImportMapping.hidden = true;
  if (budgetImportMappingBody) budgetImportMappingBody.innerHTML = "";
  if (budgetImportPreview) budgetImportPreview.hidden = true;
  if (budgetImportPreviewBody) budgetImportPreviewBody.innerHTML = "";
  if (budgetImportSummary) budgetImportSummary.textContent = "0 item selecionado";
  if (confirmBudgetImportButton) confirmBudgetImportButton.disabled = true;
  setImportMessage("");
}

function openBudgetImportModal() {
  resetImportPreview();
  if (budgetImportModal) budgetImportModal.hidden = false;
}

function closeBudgetImportModal() {
  if (budgetImportModal) budgetImportModal.hidden = true;
  resetImportPreview();
}

function renderBudgetImportPreview(items, fileName, options = {}) {
  pendingBudgetImportItems = items;
  const totalPreview = items.reduce((sum, item) => sum + parseNumber(item.quantity) * parseNumber(item.unitPrice), 0);
  const previewRows = items.slice(0, 80);

  if (budgetImportFileName) budgetImportFileName.textContent = fileName;
  if (budgetImportPreview) budgetImportPreview.hidden = false;
  if (budgetImportSummary) {
    budgetImportSummary.textContent = `${items.length} item(ns) reconhecido(s), total estimado de ${toCurrency(totalPreview)}.`;
  }
  if (confirmBudgetImportButton) confirmBudgetImportButton.disabled = !items.length;
  if (budgetImportPreviewBody) {
    budgetImportPreviewBody.innerHTML = previewRows
      .map((item) => {
        const total = parseNumber(item.quantity) * parseNumber(item.unitPrice);
        return `
          <tr>
            <td>${escapeHtml(item.code)}</td>
            <td>${escapeHtml(item.stage)}</td>
            <td>${escapeHtml(item.description)}</td>
            <td>${escapeHtml(item.unit)}</td>
            <td>${percentFormatter.format(parseNumber(item.quantity))}</td>
            <td>${toCurrency(item.unitPrice)}</td>
            <td>${toCurrency(total)}</td>
          </tr>
        `;
      })
      .join("");
  }

  const previewLimitMessage = items.length > previewRows.length ? `Mostrando as primeiras ${previewRows.length} linhas na prévia.` : "";
  setImportMessage(options.message || previewLimitMessage, "success");
}

async function previewBudgetImportFile(file) {
  if (!file) return;

  setImportMessage("Lendo planilha...", "success");
  if (confirmBudgetImportButton) confirmBudgetImportButton.disabled = true;

  try {
    const data = await readBudgetImportData(file);
    pendingBudgetImportRows = data.rows;
    pendingBudgetImportColumns = { ...data.detection.columns };

    if (budgetImportFileName) budgetImportFileName.textContent = file.name;
    renderBudgetImportMapping(data.detection);

    const lowConfidenceFields = IMPORT_FIELD_DEFINITIONS.filter(({ key }) => {
      const match = data.detection.matches?.[key];
      return match?.index >= 0 && match.confidence === "baixa";
    }).map(({ label }) => label);
    const defaultedFields = IMPORT_FIELD_DEFINITIONS.filter(
      ({ key, required, recommended }) => !required && recommended && data.detection.columns[key] === undefined,
    ).map(({ label }) => label);
    const notice = lowConfidenceFields.length
      ? `Coluna identificada automaticamente. Verifique colunas com baixa confiança: ${lowConfidenceFields.join(", ")}.`
      : defaultedFields.length
        ? `Você pode confirmar assim mesmo. Campos sem coluna serão preenchidos com padrão: ${defaultedFields.join(", ")}.`
      : "Colunas identificadas automaticamente. Confira a pré-visualização antes de confirmar.";

    applyBudgetImportMapping({ notice });
  } catch (error) {
    resetImportPreview();
    if (budgetImportFileName) budgetImportFileName.textContent = file.name;
    setImportMessage(error?.message || "Não foi possível importar este arquivo.");
    showToast("Não foi possível importar a planilha.");
  } finally {
    if (csvFileInput) csvFileInput.value = "";
  }
}

async function confirmBudgetImport() {
  if (!pendingBudgetImportItems.length) return;

  const currentItems = activeItems();
  const importedItems = pendingBudgetImportItems.map((item, index) =>
    normalizeItem(
      {
        ...item,
        id: createId(),
      },
      currentItems.length + index,
    ),
  );

  currentItems.push(...importedItems);
  hydrateForm();
  render();
  saveState(true);
  closeBudgetImportModal();
  showPage("#orcamento");
  showToast(`${importedItems.length} item(ns) importado(s).`);

  if (hasAuthenticatedSession()) {
    await syncAllDataToCloud();
  }
}

function importCsvFile(file) {
  if (!file) return;
  previewBudgetImportFile(file);
}

function exportBackup() {
  const payload = {
    product: "OrçaSan",
    version: 2,
    exportedAt: new Date().toISOString(),
    data: state,
  };
  const filename = `orcasan-backup-${new Date().toISOString().slice(0, 10)}.json`;

  downloadTextFile(filename, JSON.stringify(payload, null, 2), "application/json;charset=utf-8");
  showToast("Backup exportado.");
}

function importBackupFile(file) {
  if (!file) return;

  const reader = new FileReader();

  reader.addEventListener("load", () => {
    try {
      const parsed = JSON.parse(String(reader.result || "{}"));
      const incomingState = parsed.data || parsed;
      const normalized = normalizeState(incomingState);

      const confirmed = window.confirm("Importar este backup? Os dados atuais deste navegador serão substituídos.");
      if (!confirmed) return;

      state = normalized;
      hydrateForm();
      render();
      saveState();
      showToast("Backup importado.");
    } catch {
      showToast("Não foi possível importar o backup.");
    } finally {
      backupFileInput.value = "";
    }
  });

  reader.readAsText(file, "utf-8");
}

function resetDemo() {
  const confirmed = window.confirm("Restaurar os dados de exemplo? Os dados atuais deste navegador serão substituídos.");
  if (!confirmed) return;

  state = clone(defaultState);
  hydrateForm();
  render();
  saveState(true);
}

function syncBidInputs(field, value, sourceInput = null) {
  bidInputs.forEach((input) => {
    if (input === sourceInput || input.dataset.bid !== field) return;
    if (input.type === "checkbox") {
      input.checked = parseBoolean(value);
      return;
    }

    input.value = value;
  });
}

bidInputs.forEach((input) => {
  input.addEventListener("input", (event) => {
    const field = event.target.dataset.bid;
    let value = cleanText(event.target.value);

    if (event.target.type === "checkbox") value = event.target.checked;
    if (field === "estimatedValue") value = parseNumber(value);

    activeBid()[field] = value;
    syncBidInputs(field, value, event.target);
    updateSealedValueControls();
    renderBidMeta();
    renderOpportunityDecision();
    renderAnalysisGate();
    renderBudgetGate();
    renderPipeline();
    renderBidFilters();
    renderBidList();
    renderReports(calculateBudget());
    renderSettingsPanel();
    scheduleSave();
  });
});

budgetTrackingInputs.forEach((input) => {
  const handleBudgetTrackingChange = (event) => {
    updateBudgetTracking(event.target.dataset.budgetTracking, event.target.value);
  };

  input.addEventListener("input", handleBudgetTrackingChange);
  input.addEventListener("change", handleBudgetTrackingChange);
});

recalculateBudgetProgressButton?.addEventListener("click", recalculateBudgetProgress);

technicalQualificationInputs.forEach((input) => {
  input.addEventListener("input", (event) => {
    updateTechnicalQualification(event.target.dataset.tech, event.target.value);
  });
});

readEditalAiButton?.addEventListener("click", () => {
  editalAiFileInput?.click();
});

editalAiFileInput?.addEventListener("change", (event) => {
  analyzeEditalWithAi(event.target.files?.[0]);
});

cancelTechAiReviewButton?.addEventListener("click", closeTechnicalQualificationReview);
applyTechAiReviewButton?.addEventListener("click", applyTechnicalQualificationReview);

techAiReview?.addEventListener("click", (event) => {
  if (event.target === techAiReview) closeTechnicalQualificationReview();
});

navItems.forEach((item) => {
  item.addEventListener("click", (event) => {
    event.preventDefault();
    showPage(item.getAttribute("href"));
  });
});

workspaceLinks.forEach((item) => {
  item.addEventListener("click", (event) => {
    event.preventDefault();
    showPage(item.getAttribute("href"));
  });
});

authTabs.forEach((tab) => {
  tab.addEventListener("click", () => setAuthMode(tab.dataset.authMode));
});

window.addEventListener("hashchange", () => showPage(window.location.hash, false));

bdiInputs.forEach((input) => {
  input.addEventListener("input", (event) => {
    activeBdi()[event.target.dataset.bdi] = parseNumber(event.target.value);
    render();
    scheduleSave();
  });
});

bdiIncludeInputs.forEach((input) => {
  input.addEventListener("change", (event) => {
    const bdi = activeBdi();
    bdi.enabledCharges = normalizeBdiEnabledCharges(bdi.enabledCharges);
    bdi.enabledCharges[event.target.dataset.bdiInclude] = event.target.checked;
    updateBdiInclusionControls();
    render();
    scheduleSave();
  });
});

bidsList.addEventListener("click", (event) => {
  const selectButton = event.target.closest("[data-select-budget]");
  const duplicateButton = event.target.closest("[data-duplicate-budget]");
  const deleteButton = event.target.closest("[data-delete-budget]");

  if (deleteButton) {
    event.preventDefault();
    deleteBudget(deleteButton.dataset.deleteBudget);
    return;
  }

  if (duplicateButton) {
    event.preventDefault();
    duplicateBudget(duplicateButton.dataset.duplicateBudget);
    return;
  }

  if (selectButton) {
    selectBudget(selectButton.dataset.selectBudget);
    showPage("#orcamento");
  }
});

function applyBidStatusFilter(status) {
  bidStatusFilter = status;
  renderPipeline();
  renderBidFilters();
  renderBidList();
}

pipelineGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-filter-status]");
  if (!button) return;
  applyBidStatusFilter(button.dataset.filterStatus);
});

bidFilters.addEventListener("click", (event) => {
  const button = event.target.closest("[data-filter-status]");
  if (!button) return;
  applyBidStatusFilter(button.dataset.filterStatus);
});

dashboardRecentList?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-dashboard-open-budget]");
  if (!button) return;

  selectBudget(button.dataset.dashboardOpenBudget);
  showPage("#orcamento");
});

itemsBody.addEventListener("input", (event) => {
  const target = event.target;
  if (!target.matches("[data-item-id][data-field]")) return;

  updateItem(target.dataset.itemId, target.dataset.field, target.value);
  if (target.dataset.field === "unitPrice") renderBudgetTracking();
  scheduleSave();
});

itemsBody.addEventListener("change", (event) => {
  const target = event.target;
  if (!target.matches("[data-item-id][data-field]")) return;

  updateItem(target.dataset.itemId, target.dataset.field, target.value);
  render();
});

itemsBody.addEventListener("click", (event) => {
  const removeButton = event.target.closest("[data-remove-id]");
  if (!removeButton) return;

  removeItem(removeButton.dataset.removeId);
});

compositionList.addEventListener("input", (event) => {
  const target = event.target;
  const row = target.closest("[data-composition-id]");
  if (!row) return;

  if (target.matches("[data-composition-input-field]")) {
    const inputRow = target.closest("[data-composition-input-id]");
    if (!inputRow) return;

    updateCompositionInput(
      row.dataset.compositionId,
      inputRow.dataset.compositionInputId,
      target.dataset.compositionInputField,
      target.value,
    );
    refreshCompositionTotals(row.dataset.compositionId);
    scheduleSave();
    return;
  }

  if (!target.matches("[data-composition-field]")) return;

  updateComposition(row.dataset.compositionId, target.dataset.compositionField, target.value);
  scheduleSave();
});

compositionList.addEventListener("change", (event) => {
  const target = event.target;
  const row = target.closest("[data-composition-id]");
  if (!row) return;

  if (target.matches("[data-composition-input-field]")) {
    const inputRow = target.closest("[data-composition-input-id]");
    if (!inputRow) return;

    updateCompositionInput(
      row.dataset.compositionId,
      inputRow.dataset.compositionInputId,
      target.dataset.compositionInputField,
      target.value,
    );
    renderCompositions();
    scheduleSave();
    return;
  }

  if (!target.matches("[data-composition-field]")) return;

  updateComposition(row.dataset.compositionId, target.dataset.compositionField, target.value);
  render();
});

compositionList.addEventListener("click", (event) => {
  const applyButton = event.target.closest("[data-apply-composition]");
  const removeButton = event.target.closest("[data-remove-composition]");
  const addInputButton = event.target.closest("[data-add-composition-input]");
  const removeInputButton = event.target.closest("[data-remove-composition-input]");
  const row = event.target.closest("[data-composition-id]");

  if (addInputButton) addCompositionInput(addInputButton.dataset.addCompositionInput);
  if (applyButton) applyComposition(applyButton.dataset.applyComposition);
  if (removeButton) removeComposition(removeButton.dataset.removeComposition);
  if (removeInputButton && row) removeCompositionInput(row.dataset.compositionId, removeInputButton.dataset.removeCompositionInput);
});

newBudgetButtons.forEach((button) => button.addEventListener("click", openNewBidWizard));
closeNewBidWizardButton?.addEventListener("click", closeNewBidWizard);
newBidWizardBackButton?.addEventListener("click", previousNewBidWizardStep);
newBidWizardNextButton?.addEventListener("click", nextNewBidWizardStep);
newBidWizardForm?.addEventListener("submit", submitNewBidWizard);
addItemButton.addEventListener("click", addItem);
addCompositionButton.addEventListener("click", addComposition);
approveOpportunityButton?.addEventListener("click", approveOpportunity);
rejectOpportunityButton?.addEventListener("click", showRejectionControls);
confirmRejectionButton?.addEventListener("click", confirmOpportunityRejection);
resetTaxBdiButton?.addEventListener("click", resetOutOfBdiTaxes);
downloadCsvTemplateButton.addEventListener("click", downloadCsvTemplate);
importCsvButton.addEventListener("click", openBudgetImportModal);
chooseBudgetImportFileButton?.addEventListener("click", () => csvFileInput.click());
changeBudgetImportFileButton?.addEventListener("click", () => csvFileInput.click());
cancelBudgetImportButton?.addEventListener("click", closeBudgetImportModal);
closeBudgetImportButton?.addEventListener("click", closeBudgetImportModal);
confirmBudgetImportButton?.addEventListener("click", confirmBudgetImport);
budgetImportMappingBody?.addEventListener("change", () => applyBudgetImportMapping({ manual: true }));
budgetImportModal?.addEventListener("click", (event) => {
  if (event.target === budgetImportModal) closeBudgetImportModal();
});
csvFileInput.addEventListener("change", (event) => importCsvFile(event.target.files[0]));
saveButton.addEventListener("click", () => saveState(true));
resetButton.addEventListener("click", resetDemo);
exportButton.addEventListener("click", exportCsv);
exportXlsButton.addEventListener("click", exportXls);
exportBackupButton.addEventListener("click", exportBackup);
exportBackupSecondaryButton.addEventListener("click", exportBackup);
importBackupButton.addEventListener("click", () => backupFileInput.click());
backupFileInput.addEventListener("change", (event) => importBackupFile(event.target.files[0]));
printButton.addEventListener("click", generateProfessionalProposal);
saveSecondaryButton.addEventListener("click", () => saveState(true));
installAppButton.addEventListener("click", installApp);
installAppSecondaryButton.addEventListener("click", installApp);
refreshAppButton.addEventListener("click", refreshAppCache);
saveCloudConfigButton?.addEventListener("click", () => saveCloudConfig(true));
testCloudConnectionButton?.addEventListener("click", testCloudConnection);
createCloudWorkspaceButton?.addEventListener("click", createCloudWorkspace);
syncActiveCloudButton?.addEventListener("click", syncActiveBudgetToCloud);
syncAllCloudButton?.addEventListener("click", syncAllDataToCloud);
loadCloudDataButton?.addEventListener("click", loadDataFromCloud);
signInCloudButton?.addEventListener("click", signInCloudAccount);
signUpCloudButton?.addEventListener("click", signUpCloudAccount);
resendAuthEmailButton?.addEventListener("click", resendAuthConfirmationEmail);
requestPasswordCloudButton?.addEventListener("click", requestPasswordRecoveryEmail);
updatePasswordCloudButton?.addEventListener("click", updateCloudPassword);
signOutCloudButton?.addEventListener("click", requestSignOutConfirmation);
settingsChangePasswordButton?.addEventListener("click", openPasswordRecoveryFromSettings);
settingsSignOutButton?.addEventListener("click", requestSignOutConfirmation);
fixLoadedEncodingButton?.addEventListener("click", fixLoadedEncoding);
cancelLogoutButton?.addEventListener("click", closeLogoutConfirmation);
confirmLogoutButton?.addEventListener("click", async () => {
  closeLogoutConfirmation();
  await signOutCloudAccount();
});
logoutConfirmation?.addEventListener("click", (event) => {
  if (event.target === logoutConfirmation) closeLogoutConfirmation();
});
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && newBidWizard && !newBidWizard.hidden) closeNewBidWizard();
  if (event.key === "Escape" && logoutConfirmation && !logoutConfirmation.hidden) closeLogoutConfirmation();
  if (event.key === "Escape" && budgetImportModal && !budgetImportModal.hidden) closeBudgetImportModal();
});
reportList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-report-action]");
  if (!button) return;

  const action = button.dataset.reportAction;
  if (action === "csv") exportCsv();
  if (action === "xls") exportXls();
  if (action === "abc") showPage("#analise");
  if (action === "print") generateProfessionalProposal();
  if (action === "bdi") showPage("#bdi");
});

window.addEventListener("afterprint", () => {
  document.body.classList.remove("printing-proposal");
  proposalPrint.hidden = true;
});

async function bootstrapCloudWorkspace() {
  if (!hasAuthenticatedSession() || isRecoveryBridgePage()) return;

  try {
    setCloudStatus("Carregando dados da nuvem...", "");
    await syncWorkspaceAfterLogin(loadPersistedWorkspaceState());
  } catch (error) {
    console.error(error);
    setCloudStatus(supabaseErrorMessage(error), "error");
    setSaveStatus("Usando dados deste dispositivo. Não consegui carregar a nuvem agora.");
  }
}

setAuthMode("signin");
renderCloudConfig();
captureAuthRedirectSession();
renderAuthState();
hydrateForm();
render();
setupSectionObserver();
setupPwa();
setSaveStatus(hasPersistedWorkspaceData() ? `Dados carregados deste dispositivo às ${currentTimeLabel()}` : "Pronto para começar.");
bootstrapCloudWorkspace().finally(() => offerAlternateOriginRecovery());
