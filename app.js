const STORAGE_KEY = "orcasan.workspace.v2";
const LEGACY_STORAGE_KEY = "orcasan.current-budget.v1";

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
    executionDays: 180,
    validityDays: 60,
    technicalOwner: "Eng. Responsável",
    technicalRegistry: "CREA 0000000000",
    status: "Em orçamento",
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
    otherTaxes: 2,
  };
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
    },
    {
      id: "composition-02",
      code: "COMP-ESG-002",
      title: "Poço de visita em concreto armado até 2,00 m",
      unit: "un",
      cost: 3120,
      note: "Com forma, armação, concreto, tampa e acabamento interno.",
    },
    {
      id: "composition-03",
      code: "COMP-PAV-001",
      title: "Recomposição de pavimento asfáltico",
      unit: "m²",
      cost: 88.6,
      note: "Base compactada, imprimação, CBUQ e acabamento de bordas.",
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

let state = loadState();
let saveTimer;
let bidStatusFilter = "Todas";
let deferredInstallPrompt = null;

const BID_STATUSES = ["Em orçamento", "Em revisão", "Enviada", "Vencida", "Perdida"];

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

const itemsBody = document.querySelector("#items-body");
const abcList = document.querySelector("#abc-list");
const alertsList = document.querySelector("#alerts-list");
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
const pageSections = document.querySelectorAll(".page-section");
const bdiInputs = document.querySelectorAll(".bdi-input");
const bidInputs = document.querySelectorAll("[data-bid]");
const addItemButton = document.querySelector("#add-item");
const addCompositionButton = document.querySelector("#add-composition");
const downloadCsvTemplateButton = document.querySelector("#download-csv-template");
const importCsvButton = document.querySelector("#import-csv");
const csvFileInput = document.querySelector("#csv-file");
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

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function createId() {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID();
  return `id-${Date.now()}-${Math.round(Math.random() * 1000)}`;
}

function normalizeItem(item, index) {
  return {
    id: item.id || `item-${String(index + 1).padStart(2, "0")}`,
    stage: item.stage || "",
    code: item.code || "",
    description: item.description || "",
    unit: item.unit || "un",
    quantity: Number(item.quantity) || 0,
    unitPrice: Number(item.unitPrice) || 0,
  };
}

function normalizeComposition(composition, index) {
  return {
    id: composition.id || `composition-${String(index + 1).padStart(2, "0")}`,
    code: composition.code || "",
    title: composition.title || "",
    unit: composition.unit || "un",
    cost: Number(composition.cost) || 0,
    note: composition.note || "",
  };
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
    normalized.otherTaxes = Math.min(parseNumber(source.taxes), 2);
  }

  delete normalized.taxes;
  return normalized;
}

function normalizeBudget(rawBudget, index) {
  const base = demoBudget();
  const source = rawBudget && typeof rawBudget === "object" ? rawBudget : {};
  const items = Array.isArray(source.items) ? source.items : base.items;

  return {
    id: source.id || `budget-${String(index + 1).padStart(2, "0")}`,
    createdAt: source.createdAt || new Date().toISOString(),
    bid: {
      ...base.bid,
      ...(source.bid || {}),
    },
    bdi: normalizeBdi(source.bdi),
    items: items.map(normalizeItem),
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

function saveState(showFeedback = false) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));

  const now = new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());

  saveStatus.textContent = `Salvo no navegador às ${now}`;
  if (showFeedback) showToast("Orçamento salvo.");
}

function scheduleSave() {
  saveStatus.textContent = "Alterações pendentes...";
  window.clearTimeout(saveTimer);
  saveTimer = window.setTimeout(() => saveState(), 300);
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  window.setTimeout(() => toast.classList.remove("visible"), 2200);
}

function updateInstallUi() {
  const isStandalone =
    window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;

  if (isStandalone) {
    installAppButton.hidden = true;
    installAppSecondaryButton.disabled = true;
    installStatus.textContent = "O OrçaSan já está instalado como aplicativo neste dispositivo.";
    return;
  }

  if (deferredInstallPrompt) {
    installAppButton.hidden = false;
    installAppSecondaryButton.disabled = false;
    installStatus.textContent = "Instale o OrçaSan para abrir em janela própria, com ícone e atalho.";
    return;
  }

  installAppButton.hidden = true;
  installAppSecondaryButton.disabled = true;
  installStatus.textContent =
    "A instalação aparece quando o navegador reconhecer o app. Em produção, use um endereço HTTPS.";
}

async function installApp() {
  if (!deferredInstallPrompt) {
    showToast("Instalação ainda não disponível neste navegador.");
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

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => {
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
  const normalized = String(value ?? "").replace(",", ".");
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

function getBdiBreakdown(budget = getActiveBudget()) {
  const bdi = normalizeBdi(budget.bdi);
  const indirectPercent =
    parseNumber(bdi.admin) +
    parseNumber(bdi.insurance) +
    parseNumber(bdi.guarantees) +
    parseNumber(bdi.risk);
  const taxPercent =
    parseNumber(bdi.iss) + parseNumber(bdi.pisCofins) + parseNumber(bdi.cprb) + parseNumber(bdi.otherTaxes);
  const denominator = Math.max(1 - taxPercent / 100, 0.01);
  const factor =
    ((1 + indirectPercent / 100) * (1 + parseNumber(bdi.finance) / 100) * (1 + parseNumber(bdi.profit) / 100)) /
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
    ["Administração central", bdi.admin],
    ["Seguros", bdi.insurance],
    ["Garantias", bdi.guarantees],
    ["Risco", bdi.risk],
    ["Despesas financeiras", bdi.finance],
    ["Lucro", bdi.profit],
    ["ISS", bdi.iss],
    ["PIS/COFINS", bdi.pisCofins],
    ["CPRB/INSS receita", bdi.cprb],
    ["Outros tributos", bdi.otherTaxes],
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

function hydrateForm() {
  const budget = getActiveBudget();

  bidInputs.forEach((input) => {
    const key = input.dataset.bid;
    input.value = budget.bid[key] ?? "";
  });

  bdiInputs.forEach((input) => {
    const key = input.dataset.bdi;
    input.value = budget.bdi[key] ?? 0;
  });
}

function renderBidMeta() {
  const bid = activeBid();
  const datedBudgets = state.budgets
    .filter((budget) => budget.bid.openingDate)
    .sort((a, b) => String(a.bid.openingDate).localeCompare(String(b.bid.openingDate)));
  const nextBudget = datedBudgets[0] || getActiveBudget();

  document.querySelector("#bid-status-pill").textContent = bid.status || "Em orçamento";
  document.querySelector("#next-opening-date").textContent = toDateBR(nextBudget.bid.openingDate);
  document.querySelector("#next-opening-summary").textContent =
    `${nextBudget.bid.editalNumber || "Sem edital"} - ${nextBudget.bid.workType || "Tipo não informado"}`;
}

function renderBidList() {
  const filteredBudgets =
    bidStatusFilter === "Todas"
      ? state.budgets
      : state.budgets.filter((budget) => (budget.bid.status || "Em orçamento") === bidStatusFilter);

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
              <span>${escapeHtml(budget.bid.status || "Em orçamento")}</span>
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
    const budgets = state.budgets.filter((budget) => (budget.bid.status || "Em orçamento") === status);
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
          : state.budgets.filter((budget) => (budget.bid.status || "Em orçamento") === status).length;

      return `
        <button class="filter-tab ${bidStatusFilter === status ? "active" : ""}" data-filter-status="${escapeHtml(status)}" type="button">
          ${escapeHtml(status)} <span>${count}</span>
        </button>
      `;
    })
    .join("");
}

function renderSummary(budget) {
  const bdiBreakdown = getBdiBreakdown();
  document.querySelector("#metric-base").textContent = toCurrency(budget.totalBase);
  document.querySelector("#metric-total").textContent = toCurrency(budget.totalWithBdi);
  document.querySelector("#metric-bdi").textContent = toPercent(budget.bdiPercent);
  document.querySelector("#metric-critical").textContent = budget.criticalItems;
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
    const stage = item.stage || "Sem etapa";
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
    stageChart.innerHTML = '<div class="empty-state">Adicione itens para gerar o gráfico por etapa.</div>';
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

function renderCompositions() {
  compositionList.innerHTML = state.compositions
    .map(
      (composition) => `
        <div class="composition-row editable-composition" data-composition-id="${escapeHtml(composition.id)}">
          <div class="composition-fields">
            <input class="table-input code-input" data-composition-field="code" value="${escapeHtml(composition.code)}" aria-label="Código da composição" />
            <input class="table-input composition-title-input" data-composition-field="title" value="${escapeHtml(composition.title)}" aria-label="Título da composição" />
            <textarea class="composition-note-input" data-composition-field="note" aria-label="Observação da composição">${escapeHtml(composition.note)}</textarea>
          </div>
          <div class="composition-price">
            <input class="table-input unit-input" data-composition-field="unit" value="${escapeHtml(composition.unit)}" aria-label="Unidade" />
            <input class="table-input money-input" data-composition-field="cost" type="number" min="0" step="0.01" value="${parseNumber(composition.cost)}" aria-label="Custo unitário" />
            <strong>${toCurrency(composition.cost)}</strong>
            <button class="ghost-button compact" data-apply-composition="${escapeHtml(composition.id)}" type="button">Aplicar</button>
            <button class="icon-button danger-button" data-remove-composition="${escapeHtml(composition.id)}" type="button" title="Remover composição">×</button>
          </div>
        </div>
      `,
    )
    .join("");
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

  renderBidMeta();
  renderPipeline();
  renderBidFilters();
  renderBidList();
  renderSummary(budgetSummary);
  renderCharts(budgetSummary);
  renderTable(budgetSummary.classifiedItems);
  renderAbcList(budgetSummary.classifiedItems);
  renderAlerts(budgetSummary);
  renderCompositions();
  renderReports(budgetSummary);
}

function setActiveNav(hash) {
  const targetHash = hash || "#dashboard";

  navItems.forEach((item) => {
    const isActive = item.getAttribute("href") === targetHash;
    item.classList.toggle("active", isActive);

    if (isActive) item.setAttribute("aria-current", "page");
    else item.removeAttribute("aria-current");
  });
}

function showPage(hash = "#dashboard", updateHash = true) {
  const targetHash = hash || "#dashboard";
  const page = targetHash.replace("#", "") || "dashboard";
  const hasPage = Array.from(pageSections).some((section) => section.dataset.page === page);
  const finalPage = hasPage ? page : "dashboard";
  const finalHash = `#${finalPage}`;

  pageSections.forEach((section) => {
    section.hidden = section.dataset.page !== finalPage;
  });

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
    item[field] = value;
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
  const confirmed = window.confirm("Remover este item da planilha?");
  if (!confirmed) return;

  getActiveBudget().items = activeItems().filter((item) => item.id !== id);
  render();
  scheduleSave();
  showToast("Item removido.");
}

function updateComposition(id, field, value) {
  const composition = state.compositions.find((currentComposition) => currentComposition.id === id);
  if (!composition) return;

  if (field === "cost") {
    composition[field] = parseNumber(value);
  } else {
    composition[field] = value;
  }
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
  });

  renderCompositions();
  scheduleSave();
  showToast("Composição criada.");

  const firstTitle = compositionList.querySelector(".composition-title-input");
  if (firstTitle) firstTitle.focus();
}

function removeComposition(id) {
  const confirmed = window.confirm("Remover esta composição do banco próprio?");
  if (!confirmed) return;

  state.compositions = state.compositions.filter((composition) => composition.id !== id);
  renderCompositions();
  scheduleSave();
  showToast("Composição removida.");
}

function applyComposition(id) {
  const composition = state.compositions.find((currentComposition) => currentComposition.id === id);
  if (!composition) return;

  activeItems().push({
    id: createId(),
    stage: "Composição aplicada",
    code: composition.code,
    description: composition.title,
    unit: composition.unit,
    quantity: 1,
    unitPrice: parseNumber(composition.cost),
  });

  render();
  scheduleSave();
  showToast("Composição aplicada na planilha.");
  showPage("#orcamento");
}

function createBudget() {
  const current = getActiveBudget();
  const nextIndex = state.budgets.length + 1;
  const budget = {
    id: createId(),
    createdAt: new Date().toISOString(),
    bid: {
      ...defaultBid(),
      company: current.bid.company,
      companyDocument: current.bid.companyDocument,
      technicalOwner: current.bid.technicalOwner,
      technicalRegistry: current.bid.technicalRegistry,
      title: `Nova licitação de saneamento ${nextIndex}`,
      agency: "",
      editalNumber: `Edital ${String(nextIndex).padStart(3, "0")}/2026`,
      location: "",
      openingDate: "",
      status: "Em orçamento",
    },
    bdi: {
      ...current.bdi,
    },
    items: [],
  };

  state.budgets.unshift(budget);
  state.activeBudgetId = budget.id;
  hydrateForm();
  render();
  saveState();
  showToast("Nova licitação criada.");
  showPage("#licitacao");
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
  copy.createdAt = new Date().toISOString();
  copy.bid.title = `${source.bid.title || "Licitação"} - cópia`;
  copy.bid.editalNumber = `${source.bid.editalNumber || "Edital"} - cópia`;
  copy.bid.status = "Em orçamento";
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

function deleteBudget(id) {
  if (state.budgets.length <= 1) {
    showToast("Mantenha pelo menos uma licitação.");
    return;
  }

  const target = state.budgets.find((budget) => budget.id === id);
  const confirmed = window.confirm(`Excluir a licitação "${target?.bid.title || "selecionada"}"? Esta ação remove os dados deste navegador.`);
  if (!confirmed) return;

  state.budgets = state.budgets.filter((budget) => budget.id !== id);

  if (state.activeBudgetId === id) {
    state.activeBudgetId = state.budgets[0].id;
    hydrateForm();
  }

  render();
  saveState();
  showToast("Licitação excluída.");
}

function csvCell(value) {
  const text = String(value ?? "").replace(/"/g, '""');
  return `"${text}"`;
}

function normalizeHeader(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

function numberForCsv(value) {
  return Number(value || 0).toFixed(2).replace(".", ",");
}

function fileSafeName(value) {
  return String(value || "orcamento")
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
  const budget = getActiveBudget();
  const budgetSummary = calculateBudget(budget);
  const classificationById = new Map(budgetSummary.classifiedItems.map((item) => [item.id, item]));
  const header = [
    "Etapa",
    "Código",
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
  const budget = getActiveBudget();
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
  const compositionRows = state.compositions.map((composition) => [
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
            <th>Etapa</th><th>Código</th><th>Descrição</th><th>Unidade</th><th>Quantidade</th>
            <th>Preço unitário sem BDI</th><th>Total sem BDI</th><th>Total com BDI</th><th>ABC</th><th>Participação</th>
          </tr>
          ${budgetRows.map((row) => spreadsheetRow(row)).join("")}
          ${spreadsheetRow(["", "", "", "", "", "", toCurrency(budgetSummary.totalBase), toCurrency(budgetSummary.totalWithBdi), "", ""], "total")}
        </table>

        <h2>Curva ABC</h2>
        <table>
          <tr><th>Código</th><th>Descrição</th><th>Total com BDI</th><th>Participação</th><th>Acumulado</th><th>Classe</th></tr>
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
  const budget = getActiveBudget();
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
    ["Administração central - AC", toPercent(parseNumber(budget.bdi.admin))],
    ["Seguros - S", toPercent(parseNumber(budget.bdi.insurance))],
    ["Garantias - G", toPercent(parseNumber(budget.bdi.guarantees))],
    ["Risco - R", toPercent(parseNumber(budget.bdi.risk))],
    ["Despesas financeiras - DF", toPercent(parseNumber(budget.bdi.finance))],
    ["Lucro - L", toPercent(parseNumber(budget.bdi.profit))],
    ["Tributos totais - I", toPercent(bdiBreakdown.taxPercent)],
    ["BDI final", toPercent(bdiBreakdown.totalPercent)],
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
      </section>

      <section>
        <h2>Planilha orçamentária sintética</h2>
        <table>
          <thead>
            <tr>
              <th>Etapa</th><th>Código</th><th>Descrição</th><th>Un.</th><th>Qtd.</th><th>Preço unit.</th><th>Total c/ BDI</th>
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
          <thead><tr><th>Código</th><th>Descrição</th><th>Total</th><th>Participação</th><th>Classe</th></tr></thead>
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
  const rows = [
    ["Etapa", "Código", "Descrição", "Unidade", "Quantidade", "Preço unitário sem BDI"],
    ["Rede coletora", "03.01", "Assentamento de tubo PVC Ocre DN 150 mm", "m", "100,00", "75,50"],
    ["Poços de visita", "04.01", "Poço de visita em concreto armado", "un", "2,00", "3200,00"],
  ];
  const csv = rows.map((row) => row.map(csvCell).join(";")).join("\n");

  downloadTextFile("orcasan-modelo-importacao.csv", `\uFEFF${csv}`, "text/csv;charset=utf-8");
  showToast("Modelo CSV baixado.");
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

function parseCsv(text) {
  const cleanText = String(text || "").replace(/^\uFEFF/, "");
  const lines = cleanText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2) return [];

  const firstLine = lines[0];
  const separator = firstLine.includes(";") ? ";" : ",";
  const headers = splitCsvLine(firstLine, separator).map(normalizeHeader);

  return lines.slice(1).map((line) => {
    const values = splitCsvLine(line, separator);
    return headers.reduce((row, header, index) => {
      row[header] = values[index] || "";
      return row;
    }, {});
  });
}

function valueFromRow(row, possibleHeaders) {
  const key = possibleHeaders.map(normalizeHeader).find((header) => row[header] !== undefined);
  return key ? row[key] : "";
}

function itemsFromCsvRows(rows) {
  return rows
    .map((row, index) => {
      const description = valueFromRow(row, ["descrição", "descricao", "serviço", "servico", "item"]);
      const quantity = parseNumber(valueFromRow(row, ["quantidade", "qtd", "qtde"]));
      const unitPrice = parseNumber(
        valueFromRow(row, ["preço unitário sem bdi", "preco unitario sem bdi", "preço unitário", "preco unitario", "valor unitario"]),
      );

      if (!description && !quantity && !unitPrice) return null;

      return {
        id: createId(),
        stage: valueFromRow(row, ["etapa", "grupo", "fase"]) || "Importado do CSV",
        code: valueFromRow(row, ["código", "codigo", "cod"]) || `IMP-${String(index + 1).padStart(3, "0")}`,
        description: description || "Item importado sem descrição",
        unit: valueFromRow(row, ["unidade", "un", "und"]) || "un",
        quantity,
        unitPrice,
      };
    })
    .filter(Boolean);
}

function importCsvFile(file) {
  if (!file) return;

  const reader = new FileReader();

  reader.addEventListener("load", () => {
    try {
      const rows = parseCsv(reader.result);
      const importedItems = itemsFromCsvRows(rows);

      if (!importedItems.length) {
        showToast("Nenhum item válido encontrado no CSV.");
        return;
      }

      activeItems().push(...importedItems);
      hydrateForm();
      render();
      saveState();
      showToast(`${importedItems.length} item(ns) importado(s).`);
      showPage("#orcamento");
    } catch {
      showToast("Não foi possível importar este CSV.");
    } finally {
      csvFileInput.value = "";
    }
  });

  reader.readAsText(file, "utf-8");
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
      const confirmed = window.confirm("Importar este backup? Os dados atuais neste navegador serão substituídos.");

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
  const confirmed = window.confirm("Restaurar os dados de exemplo? As alterações salvas neste navegador serão substituídas.");
  if (!confirmed) return;

  state = clone(defaultState);
  hydrateForm();
  render();
  saveState(true);
}

bidInputs.forEach((input) => {
  input.addEventListener("input", (event) => {
    activeBid()[event.target.dataset.bid] = event.target.value;
    renderBidMeta();
    renderPipeline();
    renderBidFilters();
    renderBidList();
    renderReports(calculateBudget());
    scheduleSave();
  });
});

navItems.forEach((item) => {
  item.addEventListener("click", (event) => {
    event.preventDefault();
    showPage(item.getAttribute("href"));
  });
});

window.addEventListener("hashchange", () => showPage(window.location.hash, false));

bdiInputs.forEach((input) => {
  input.addEventListener("input", (event) => {
    activeBdi()[event.target.dataset.bdi] = parseNumber(event.target.value);
    render();
    scheduleSave();
  });
});

bidsList.addEventListener("click", (event) => {
  const selectButton = event.target.closest("[data-select-budget]");
  const duplicateButton = event.target.closest("[data-duplicate-budget]");
  const deleteButton = event.target.closest("[data-delete-budget]");

  if (selectButton) selectBudget(selectButton.dataset.selectBudget);
  if (duplicateButton) duplicateBudget(duplicateButton.dataset.duplicateBudget);
  if (deleteButton) deleteBudget(deleteButton.dataset.deleteBudget);
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

itemsBody.addEventListener("input", (event) => {
  const target = event.target;
  if (!target.matches("[data-item-id][data-field]")) return;

  updateItem(target.dataset.itemId, target.dataset.field, target.value);
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
  if (!row || !target.matches("[data-composition-field]")) return;

  updateComposition(row.dataset.compositionId, target.dataset.compositionField, target.value);
  scheduleSave();
});

compositionList.addEventListener("change", (event) => {
  const target = event.target;
  const row = target.closest("[data-composition-id]");
  if (!row || !target.matches("[data-composition-field]")) return;

  updateComposition(row.dataset.compositionId, target.dataset.compositionField, target.value);
  render();
});

compositionList.addEventListener("click", (event) => {
  const applyButton = event.target.closest("[data-apply-composition]");
  const removeButton = event.target.closest("[data-remove-composition]");

  if (applyButton) applyComposition(applyButton.dataset.applyComposition);
  if (removeButton) removeComposition(removeButton.dataset.removeComposition);
});

newBudgetButtons.forEach((button) => button.addEventListener("click", createBudget));
addItemButton.addEventListener("click", addItem);
addCompositionButton.addEventListener("click", addComposition);
downloadCsvTemplateButton.addEventListener("click", downloadCsvTemplate);
importCsvButton.addEventListener("click", () => csvFileInput.click());
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

hydrateForm();
render();
setupSectionObserver();
setupPwa();
saveState();
