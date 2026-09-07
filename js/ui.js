/* Glavna logika sučelja - Školski raspored (web/PWA). */
"use strict";

const HR_WEEKDAYS = ["Ponedjeljak", "Utorak", "Srijeda", "Četvrtak", "Petak", "Subota", "Nedjelja"];

function formatDateShort(d) {
  return `${pad2(d.getDate())}.${pad2(d.getMonth() + 1)}.${d.getFullYear()}.`;
}

// ------------------------------------------------------------------
// Stanje
// ------------------------------------------------------------------
let appData = loadData();
let currentSingleTurnus = 0;

function currentChild() {
  return appData.getActive();
}

function persist() {
  saveData(appData);
}

// ------------------------------------------------------------------
// Elementi
// ------------------------------------------------------------------
const el = (id) => document.getElementById(id);

const childSelect = el("childSelect");
const addChildBtn = el("addChildBtn");
const menuBtn = el("menuBtn");

const dateLabel = el("dateLabel");
const weekLabel = el("weekLabel");
const turnusLabel = el("turnusLabel");

const emptyState = el("emptyState");
const dualView = el("dualView");
const singleView = el("singleView");

const titleA = el("titleA");
const titleB = el("titleB");
const tableA = el("tableA");
const tableB = el("tableB");
const cardA = el("cardA");
const cardB = el("cardB");

const titleSingle = el("titleSingle");
const tableSingle = el("tableSingle");
const backBtn = el("backBtn");

const sideMenu = el("sideMenu");
const sideMenuOverlay = el("sideMenuOverlay");

const childModal = el("childModal");
const childModalTitle = el("childModalTitle");
const childNameInput = el("childNameInput");
const turnus1Input = el("turnus1Input");
const turnus2Input = el("turnus2Input");
const periodsInput = el("periodsInput");
const startDateWrap = el("startDateWrap");
const startDateInput = el("startDateInput");
const startTurnusSelect = el("startTurnusSelect");
const childModalHint = el("childModalHint");

const scheduleModal = el("scheduleModal");
const editPeriodsInput = el("editPeriodsInput");
const editTable0 = el("editTable0");
const editTable1 = el("editTable1");
const tabBtn0 = el("tabBtn0");
const tabBtn1 = el("tabBtn1");

const correctionModal = el("correctionModal");
const correctionModalTitle = el("correctionModalTitle");
const correctionList = el("correctionList");
const correctionDateInput = el("correctionDateInput");
const correctionTurnusSelect = el("correctionTurnusSelect");

const aboutModal = el("aboutModal");

// ------------------------------------------------------------------
// Render: statusna traka
// ------------------------------------------------------------------
function refreshStatusHeader() {
  const today = new Date();
  const weekdayName = HR_WEEKDAYS[(today.getDay() + 6) % 7];
  dateLabel.textContent = `${weekdayName}, ${formatDateShort(today)}`;

  const { monday, sunday, weekNum } = weekStatus(today);
  weekLabel.textContent = `${weekNum}. tjedan u godini  (${formatDateShort(monday)} – ${formatDateShort(sunday)})`;

  const child = currentChild();
  if (!child) {
    turnusLabel.textContent = "";
    return;
  }
  turnusLabel.textContent = `Aktivni turnus danas: ${child.turnusNameForDate(today)}`;
}

// ------------------------------------------------------------------
// Render: tablice (read-only)
// ------------------------------------------------------------------
function buildScheduleTable(tableEl, child, turnusIndex) {
  tableEl.innerHTML = "";
  const thead = document.createElement("thead");
  const headRow = document.createElement("tr");
  const corner = document.createElement("th");
  corner.className = "period-col";
  headRow.appendChild(corner);
  for (const dayKey of DAY_KEYS) {
    const th = document.createElement("th");
    th.textContent = DAY_LABELS_SHORT_HR[dayKey];
    if (WEEKEND_KEYS.has(dayKey)) th.classList.add("weekend");
    headRow.appendChild(th);
  }
  thead.appendChild(headRow);
  tableEl.appendChild(thead);

  const tbody = document.createElement("tbody");
  for (let p = 0; p < child.periodsCount; p++) {
    const tr = document.createElement("tr");
    const th = document.createElement("th");
    th.className = "period-col";
    th.textContent = `${p + 1}.`;
    tr.appendChild(th);
    for (const dayKey of DAY_KEYS) {
      const td = document.createElement("td");
      if (WEEKEND_KEYS.has(dayKey)) td.classList.add("weekend");
      td.textContent = child.getSubject(turnusIndex, dayKey, p);
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }
  tableEl.appendChild(tbody);
}

function turnusTitle(child, turnusIndex) {
  const name = child.turnusNames[turnusIndex] !== undefined ? child.turnusNames[turnusIndex] : String(turnusIndex);
  return `Tjedan — turnus ${name}`;
}

// ------------------------------------------------------------------
// Prikaz: prazno / dual / single
// ------------------------------------------------------------------
function showView(name) {
  emptyState.hidden = name !== "empty";
  dualView.hidden = name !== "dual";
  singleView.hidden = name !== "single";
}

function renderDual(child) {
  titleA.textContent = turnusTitle(child, 0);
  titleB.textContent = turnusTitle(child, 1);
  buildScheduleTable(tableA, child, 0);
  buildScheduleTable(tableB, child, 1);
  showView("dual");
}

function renderSingle(child, turnusIndex) {
  currentSingleTurnus = turnusIndex;
  titleSingle.textContent = turnusTitle(child, turnusIndex);
  buildScheduleTable(tableSingle, child, turnusIndex);
  showView("single");
}

function renderAll(preferredView) {
  populateChildSelect();
  refreshStatusHeader();
  const child = currentChild();
  if (!child) {
    showView("empty");
    return;
  }
  const view = preferredView || (singleView.hidden ? "dual" : "single");
  if (view === "single") {
    renderSingle(child, currentSingleTurnus);
  } else {
    renderDual(child);
  }
}

function populateChildSelect() {
  childSelect.innerHTML = "";
  for (const c of appData.children) {
    const opt = document.createElement("option");
    opt.value = c.name;
    opt.textContent = c.name;
    childSelect.appendChild(opt);
  }
  const active = currentChild();
  if (active) childSelect.value = active.name;
}

cardA.addEventListener("click", () => {
  const child = currentChild();
  if (child) renderSingle(child, 0);
});
cardB.addEventListener("click", () => {
  const child = currentChild();
  if (child) renderSingle(child, 1);
});
backBtn.addEventListener("click", () => {
  const child = currentChild();
  if (child) renderDual(child);
});

childSelect.addEventListener("change", () => {
  appData.activeChild = childSelect.value;
  persist();
  renderAll("dual");
});

// ------------------------------------------------------------------
// Bočni izbornik
// ------------------------------------------------------------------
function openMenu() {
  sideMenu.hidden = false;
  sideMenuOverlay.hidden = false;
}
function closeMenu() {
  sideMenu.hidden = true;
  sideMenuOverlay.hidden = true;
}
menuBtn.addEventListener("click", openMenu);
sideMenuOverlay.addEventListener("click", closeMenu);

el("menuEditSchedule").addEventListener("click", () => {
  closeMenu();
  openScheduleModal();
});
el("menuEditChild").addEventListener("click", () => {
  closeMenu();
  openChildModal(currentChild());
});
el("menuTurnusCorrection").addEventListener("click", () => {
  closeMenu();
  openCorrectionModal();
});
el("menuDeleteChild").addEventListener("click", () => {
  closeMenu();
  deleteCurrentChild();
});
el("menuPrint").addEventListener("click", () => {
  closeMenu();
  window.print();
});
el("menuExportData").addEventListener("click", () => {
  closeMenu();
  exportDataBackup();
});
el("menuImportData").addEventListener("click", () => {
  closeMenu();
  el("importFileInput").click();
});
el("importFileInput").addEventListener("change", (event) => {
  const file = event.target.files && event.target.files[0];
  if (file) importDataBackup(file);
  event.target.value = ""; // omogući ponovni odabir iste datoteke kasnije
});
el("menuAbout").addEventListener("click", () => {
  closeMenu();
  aboutModal.hidden = false;
});
el("aboutModalClose").addEventListener("click", () => {
  aboutModal.hidden = true;
});

addChildBtn.addEventListener("click", () => openChildModal(null));

// ------------------------------------------------------------------
// Modal: dijete (novo / uredi)
// ------------------------------------------------------------------
let editingChildName = null; // null = novo dijete

function openChildModal(child) {
  editingChildName = child ? child.name : null;
  childModalTitle.textContent = child ? "Uredi dijete" : "Novo dijete";
  childNameInput.value = child ? child.name : "";
  turnus1Input.value = child ? child.turnusNames[0] : DEFAULT_TURNUS_NAMES[0];
  turnus2Input.value = child ? child.turnusNames[1] : DEFAULT_TURNUS_NAMES[1];
  periodsInput.value = child ? child.periodsCount : DEFAULT_PERIODS;

  if (!child) {
    startDateWrap.hidden = false;
    childModalHint.hidden = true;
    startDateInput.value = toISODate(new Date());
    refreshStartTurnusOptions();
  } else {
    startDateWrap.hidden = true;
    childModalHint.hidden = false;
  }
  childModal.hidden = false;
  childNameInput.focus();
}

function refreshStartTurnusOptions() {
  startTurnusSelect.innerHTML = "";
  [turnus1Input.value || "A", turnus2Input.value || "B"].forEach((name, idx) => {
    const opt = document.createElement("option");
    opt.value = String(idx);
    opt.textContent = name;
    startTurnusSelect.appendChild(opt);
  });
}
turnus1Input.addEventListener("input", () => {
  if (!startDateWrap.hidden) refreshStartTurnusOptions();
});
turnus2Input.addEventListener("input", () => {
  if (!startDateWrap.hidden) refreshStartTurnusOptions();
});

el("childModalCancel").addEventListener("click", () => {
  childModal.hidden = true;
});

el("childModalSave").addEventListener("click", () => {
  const name = childNameInput.value.trim();
  if (!name) {
    alert("Ime djeteta je obavezno.");
    return;
  }
  const t1 = turnus1Input.value.trim() || "A";
  const t2 = turnus2Input.value.trim() || "B";
  const periods = Math.max(1, Math.min(12, parseInt(periodsInput.value, 10) || DEFAULT_PERIODS));

  const isNew = editingChildName === null;
  const existing = appData.getChild(name);
  if (isNew) {
    if (existing) {
      alert("Dijete s tim imenom već postoji.");
      return;
    }
    const startDate = startDateInput.value ? fromISODate(startDateInput.value) : new Date();
    const startTurnusIdx = parseInt(startTurnusSelect.value, 10) || 0;
    const child = new Child({ name, turnusNames: [t1, t2], periodsCount: periods });
    child.addOrReplaceReset(startDate, startTurnusIdx);
    appData.children.push(child);
    appData.activeChild = name;
  } else {
    if (name !== editingChildName && existing) {
      alert("Dijete s tim imenom već postoji.");
      return;
    }
    const child = appData.getChild(editingChildName);
    const wasActive = appData.activeChild === editingChildName;
    child.name = name;
    child.turnusNames = [t1, t2];
    child.periodsCount = periods;
    if (wasActive) appData.activeChild = name;
  }
  persist();
  childModal.hidden = true;
  renderAll("dual");
});

function deleteCurrentChild() {
  const child = currentChild();
  if (!child) return;
  if (!confirm(`Sigurno želiš obrisati dijete „${child.name}” i njegov raspored?`)) return;
  appData.children = appData.children.filter((c) => c.name !== child.name);
  appData.activeChild = appData.children.length ? appData.children[0].name : null;
  persist();
  renderAll("dual");
}

// ------------------------------------------------------------------
// Modal: uredi raspored
// ------------------------------------------------------------------
function buildEditableTable(tableEl, child, turnusIndex) {
  tableEl.innerHTML = "";
  const thead = document.createElement("thead");
  const headRow = document.createElement("tr");
  const corner = document.createElement("th");
  corner.className = "period-col";
  headRow.appendChild(corner);
  for (const dayKey of DAY_KEYS) {
    const th = document.createElement("th");
    th.textContent = DAY_LABELS_SHORT_HR[dayKey];
    if (WEEKEND_KEYS.has(dayKey)) th.classList.add("weekend");
    headRow.appendChild(th);
  }
  thead.appendChild(headRow);
  tableEl.appendChild(thead);

  const tbody = document.createElement("tbody");
  for (let p = 0; p < child.periodsCount; p++) {
    const tr = document.createElement("tr");
    const th = document.createElement("th");
    th.className = "period-col";
    th.textContent = `${p + 1}.`;
    tr.appendChild(th);
    for (const dayKey of DAY_KEYS) {
      const td = document.createElement("td");
      const isWeekend = WEEKEND_KEYS.has(dayKey);
      if (isWeekend) td.classList.add("weekend");
      const input = document.createElement("input");
      input.type = "text";
      input.dataset.day = dayKey;
      input.dataset.period = String(p);
      input.value = child.getSubject(turnusIndex, dayKey, p);
      td.appendChild(input);
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }
  tableEl.appendChild(tbody);
}

function readEditableTable(tableEl) {
  const result = {};
  for (const dayKey of DAY_KEYS) result[dayKey] = [];
  tableEl.querySelectorAll("input").forEach((inp) => {
    const day = inp.dataset.day;
    const period = parseInt(inp.dataset.period, 10);
    result[day][period] = inp.value;
  });
  return result;
}

function openScheduleModal() {
  const child = currentChild();
  if (!child) {
    alert("Prvo dodaj dijete.");
    return;
  }
  editPeriodsInput.value = child.periodsCount;
  tabBtn0.textContent = `Turnus ${child.turnusNames[0]}`;
  tabBtn1.textContent = `Turnus ${child.turnusNames[1]}`;
  buildEditableTable(editTable0, child, 0);
  buildEditableTable(editTable1, child, 1);
  editTable0.hidden = false;
  editTable1.hidden = true;
  tabBtn0.classList.add("active");
  tabBtn1.classList.remove("active");
  scheduleModal.hidden = false;
}

function setPeriodsCountLive(count) {
  const child = currentChild();
  if (!child) return;
  // sačuvaj trenutno upisano, pa ponovno izgradi s novim brojem redaka
  const data0 = readEditableTable(editTable0);
  const data1 = readEditableTable(editTable1);
  const tmp = new Child({
    name: child.name,
    turnusNames: child.turnusNames,
    periodsCount: count,
  });
  tmp.setScheduleForTurnus(0, data0);
  tmp.setScheduleForTurnus(1, data1);
  buildEditableTable(editTable0, tmp, 0);
  buildEditableTable(editTable1, tmp, 1);
}

editPeriodsInput.addEventListener("change", () => {
  const count = Math.max(1, Math.min(12, parseInt(editPeriodsInput.value, 10) || DEFAULT_PERIODS));
  editPeriodsInput.value = count;
  setPeriodsCountLive(count);
});

tabBtn0.addEventListener("click", () => {
  tabBtn0.classList.add("active");
  tabBtn1.classList.remove("active");
  editTable0.hidden = false;
  editTable1.hidden = true;
});
tabBtn1.addEventListener("click", () => {
  tabBtn1.classList.add("active");
  tabBtn0.classList.remove("active");
  editTable1.hidden = false;
  editTable0.hidden = true;
});

el("scheduleModalCancel").addEventListener("click", () => {
  scheduleModal.hidden = true;
});

el("scheduleModalSave").addEventListener("click", () => {
  const child = currentChild();
  if (!child) return;
  child.periodsCount = Math.max(1, Math.min(12, parseInt(editPeriodsInput.value, 10) || DEFAULT_PERIODS));
  child.setScheduleForTurnus(0, readEditableTable(editTable0));
  child.setScheduleForTurnus(1, readEditableTable(editTable1));
  persist();
  scheduleModal.hidden = true;
  renderAll();
});

// ------------------------------------------------------------------
// Modal: korekcija turnusa
// ------------------------------------------------------------------
function openCorrectionModal() {
  const child = currentChild();
  if (!child) {
    alert("Prvo dodaj dijete.");
    return;
  }
  correctionModalTitle.textContent = `Promjena turnusa — ${child.name}`;
  correctionTurnusSelect.innerHTML = "";
  child.turnusNames.forEach((name, idx) => {
    const opt = document.createElement("option");
    opt.value = String(idx);
    opt.textContent = name;
    correctionTurnusSelect.appendChild(opt);
  });
  correctionDateInput.value = toISODate(new Date());
  renderCorrectionList(child);
  correctionModal.hidden = false;
}

function renderCorrectionList(child) {
  correctionList.innerHTML = "";
  const sorted = child.sortedResets();
  sorted.forEach((r, i) => {
    const li = document.createElement("li");
    const turnusName = child.turnusNames[r.turnusIndex] !== undefined ? child.turnusNames[r.turnusIndex] : r.turnusIndex;
    const prefix = i === 0 ? "Početak" : "Korekcija";
    const span = document.createElement("span");
    span.textContent = `${prefix}: od ${formatDateShort(fromISODate(r.dateFrom))} → turnus ${turnusName}`;
    li.appendChild(span);
    if (i > 0) {
      const btn = document.createElement("button");
      btn.textContent = "Ukloni";
      btn.addEventListener("click", () => {
        child.removeReset(r.dateFrom);
        persist();
        renderCorrectionList(child);
        refreshStatusHeader();
        renderAll();
      });
      li.appendChild(btn);
    }
    correctionList.appendChild(li);
  });
}

el("correctionAddBtn").addEventListener("click", () => {
  const child = currentChild();
  if (!child) return;
  const date = correctionDateInput.value ? fromISODate(correctionDateInput.value) : new Date();
  const idx = parseInt(correctionTurnusSelect.value, 10) || 0;
  child.addOrReplaceReset(date, idx);
  persist();
  renderCorrectionList(child);
  refreshStatusHeader();
  renderAll();
});

el("correctionModalClose").addEventListener("click", () => {
  correctionModal.hidden = true;
});

// ------------------------------------------------------------------
// Sigurnosna kopija (izvoz/uvoz podataka kao .json datoteka)
// ------------------------------------------------------------------
function backupFileName() {
  const d = new Date();
  return `skolski-raspored-backup-${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}.json`;
}

function exportDataBackup() {
  const json = JSON.stringify(appData.toJSON(), null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = backupFileName();
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  // malo kašnjenje prije oslobađanja URL-a - neki mobilni preglednici
  // trebaju taj trenutak da pokrenu preuzimanje
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

function importDataBackup(file) {
  const reader = new FileReader();
  reader.onload = () => {
    let parsed;
    try {
      parsed = JSON.parse(reader.result);
    } catch (e) {
      alert("Datoteka nije ispravan JSON backup.");
      return;
    }
    if (!parsed || !Array.isArray(parsed.children)) {
      alert("Datoteka ne izgleda kao backup Školskog rasporeda.");
      return;
    }
    const brojDjece = parsed.children.length;
    const poruka =
      `Backup sadrži ${brojDjece} ${brojDjece === 1 ? "dijete" : "djece"}.\n\n` +
      "Uvozom ćeš PREBRISATI trenutne podatke na ovom uređaju. Nastaviti?";
    if (!confirm(poruka)) return;
    appData = AppData.fromJSON(parsed);
    persist();
    renderAll("dual");
    alert("Podaci su uspješno vraćeni iz backupa.");
  };
  reader.onerror = () => alert("Greška pri čitanju datoteke.");
  reader.readAsText(file, "utf-8");
}

// ------------------------------------------------------------------
// Init
// ------------------------------------------------------------------
function init() {
  if (!appData.children.length) {
    showView("empty");
    refreshStatusHeader();
    setTimeout(() => openChildModal(null), 300);
  } else {
    renderAll("dual");
  }
  setInterval(refreshStatusHeader, 60000);

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").catch(() => {
      /* offline cache je opcionalan - ne prekidaj rad ako ne uspije */
    });
  }
}

init();
