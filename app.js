/* =========================================================================
   APP-LOGIK
   Nutzt die Daten aus config.js (CATEGORIES -> groups -> questions).
   Keine Server-Abhängigkeit, alles läuft im Browser (localStorage für
   Zwischenspeicherung + gespeicherte Bögen).
   ========================================================================= */

const STORAGE_KEY = "ja_entries_v1";
const DRAFT_KEY_PREFIX = "ja_draft_";
const THEME_KEY = "ja_theme";

let state = {
  currentYear: null,
  currentTab: "fragen", // 'fragen' | 'uebersicht'
  currentGroupIndex: 0,
};

// Ausgewählte Einträge für den Vergleich (Entry-IDs). Bewusst global/nicht
// jahresgebunden, damit man Einträge aus verschiedenen Jahren gemeinsam
// auswählen und vergleichen kann.
let compareSelection = [];

/* ---------------------------------------------------------------------
   Flache Gruppen-Liste (Kategorie für Kategorie, darin Gruppe für Gruppe)
   --------------------------------------------------------------------- */
function getFlatGroups() {
  const flat = [];
  CATEGORIES.forEach((cat) => {
    cat.groups.forEach((group) => {
      flat.push({ categoryName: cat.name, groupName: group.name, questions: group.questions });
    });
  });
  return flat;
}

function getAllQuestions() {
  return CATEGORIES.flatMap((cat) => cat.groups.flatMap((g) => g.questions));
}

/* ---------------------------------------------------------------------
   Storage Helper
   --------------------------------------------------------------------- */
function loadEntries() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}
function saveEntries(entries) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}
function loadDraft(yearId) {
  try {
    return JSON.parse(localStorage.getItem(DRAFT_KEY_PREFIX + yearId)) || {};
  } catch {
    return {};
  }
}
function saveDraft(yearId, draft) {
  localStorage.setItem(DRAFT_KEY_PREFIX + yearId, JSON.stringify(draft));
}
function clearDraft(yearId) {
  localStorage.removeItem(DRAFT_KEY_PREFIX + yearId);
}

/* ---------------------------------------------------------------------
   Datum / Freischaltung
   --------------------------------------------------------------------- */
function isUnlocked(year) {
  return new Date() >= new Date(year.targetDate + "T00:00:00");
}
function fillPercent(year) {
  const now = Date.now();
  const start = new Date(year.startDate + "T00:00:00").getTime();
  const end = new Date(year.targetDate + "T00:00:00").getTime();
  if (now <= start) return 0;
  if (now >= end) return 100;
  return ((now - start) / (end - start)) * 100;
}
function formatDate(d) {
  return new Date(d).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

/* ---------------------------------------------------------------------
   Init
   --------------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  applyStoredTheme();
  renderYearNav();
  renderLockedView();
  setInterval(renderYearNav, 60 * 1000);

  document.getElementById("settingsBtn").addEventListener("click", toggleSettingsPanel);
  document.getElementById("darkModeToggle").addEventListener("change", onThemeToggle);
  document.getElementById("modalClose").addEventListener("click", closeModal);
  document.getElementById("entryModal").addEventListener("click", (e) => {
    if (e.target.id === "entryModal") closeModal();
  });

  document.getElementById("compareModalClose").addEventListener("click", closeCompareModal);
  document.getElementById("compareModal").addEventListener("click", (e) => {
    if (e.target.id === "compareModal") closeCompareModal();
  });
  document.getElementById("compareOpenBtn").addEventListener("click", openCompareModal);
  document.getElementById("compareClearBtn").addEventListener("click", () => {
    compareSelection = [];
    updateCompareTray();
    if (state.currentTab === "uebersicht") renderUebersichtTab();
  });

  document.addEventListener("click", (e) => {
    const panel = document.getElementById("settingsPanel");
    const btn = document.getElementById("settingsBtn");
    if (!panel.hidden && !panel.contains(e.target) && e.target !== btn) {
      panel.hidden = true;
    }
  });
});

/* ---------------------------------------------------------------------
   Jahres-Navigation
   --------------------------------------------------------------------- */
function renderYearNav() {
  const nav = document.getElementById("yearNav");
  nav.innerHTML = "";
  YEARS.forEach((year) => {
    const unlocked = isUnlocked(year);
    const pct = fillPercent(year).toFixed(1);

    const btn = document.createElement("button");
    btn.className =
      "year-btn" + (unlocked ? "" : " locked") + (state.currentYear === year.id ? " active" : "");
    btn.style.setProperty("--year-color", year.color);
    btn.setAttribute("aria-pressed", state.currentYear === year.id ? "true" : "false");

    const tooltipText = unlocked
      ? `Freigeschaltet seit ${formatDate(year.targetDate)}`
      : `Freischaltung am ${formatDate(year.targetDate)}`;

    btn.innerHTML = `
      <span class="year-fill" style="width:${pct}%"></span>
      <span class="year-label">${year.label}</span>
      <span class="year-tooltip">${tooltipText}</span>
    `;

    btn.addEventListener("click", () => {
      if (!unlocked) return;
      selectYear(year.id);
    });

    nav.appendChild(btn);
  });
}

function renderLockedView() {
  const view = document.getElementById("lockedView");
  const rows = YEARS.map((y) => {
    const unlocked = isUnlocked(y);
    return `<li><span style="color:${y.color}; font-family:var(--font-mono);">${y.label}</span> — ${unlocked ? "freigeschaltet seit " + formatDate(y.targetDate) : "Freischaltung am " + formatDate(y.targetDate)
      }</li>`;
  }).join("");
  view.innerHTML = `
    <div class="locked-hint">
      <h2>Wähle oben ein freigeschaltetes Jahr</h2>
      <p>Sobald das jeweilige Datum erreicht ist, kannst du den Fragebogen ausfüllen.</p>
      <ul style="list-style:none; padding:0; margin-top:18px; display:inline-block; text-align:left;">${rows}</ul>
    </div>
  `;
}

function selectYear(yearId) {
  state.currentYear = yearId;
  state.currentTab = "fragen";
  state.currentGroupIndex = 0;

  renderYearNav();
  document.getElementById("lockedView").hidden = true;
  document.getElementById("yearView").hidden = false;

  renderYearHeader();
  renderSubnav();
  showTab();
}

function renderYearHeader() {
  const year = YEARS.find((y) => y.id === state.currentYear);
  const header = document.getElementById("yearHeader");
  header.innerHTML = `<button class="year-back" id="backBtn">← Zurück zur Jahresübersicht</button><h1>${year.label}</h1>`;
  document.getElementById("backBtn").addEventListener("click", () => {
    state.currentYear = null;
    renderYearNav();
    document.getElementById("yearView").hidden = true;
    document.getElementById("lockedView").hidden = false;
  });
}

/* ---------------------------------------------------------------------
   Subnav: Fragen / Übersicht
   --------------------------------------------------------------------- */
function renderSubnav() {
  const subnav = document.getElementById("subnav");
  subnav.innerHTML = `
    <button class="tab-btn ${state.currentTab === "fragen" ? "active" : ""}" id="tabFragen">Fragen</button>
    <button class="tab-btn ${state.currentTab === "uebersicht" ? "active" : ""}" id="tabUebersicht">Übersicht</button>
  `;
  document.getElementById("tabFragen").addEventListener("click", () => {
    state.currentTab = "fragen";
    renderSubnav();
    showTab();
  });
  document.getElementById("tabUebersicht").addEventListener("click", () => {
    state.currentTab = "uebersicht";
    renderSubnav();
    showTab();
  });
}

function showTab() {
  document.getElementById("fragenTab").hidden = state.currentTab !== "fragen";
  document.getElementById("uebersichtTab").hidden = state.currentTab !== "uebersicht";
  if (state.currentTab === "fragen") renderFragenTab();
  else renderUebersichtTab();
}

/* ---------------------------------------------------------------------
   Fragen-Tab: Kategorie -> Gruppen-Flow
   --------------------------------------------------------------------- */
function renderFragenTab() {
  const container = document.getElementById("fragenTab");
  const year = YEARS.find((y) => y.id === state.currentYear);
  const draft = loadDraft(year.id);
  const answers = draft.answers || {};
  const flatGroups = getFlatGroups();

  state.currentGroupIndex = draft.groupIndex || 0;
  if (state.currentGroupIndex >= flatGroups.length) state.currentGroupIndex = flatGroups.length - 1;

  const allAnswered = getAllQuestions().every((q) => answers[q.id] !== undefined);

  if (allAnswered) {
    renderResults(container, year, answers);
    return;
  }

  const totalGroups = flatGroups.length;
  const current = flatGroups[state.currentGroupIndex];
  const groupsInCategory = flatGroups.filter((g) => g.categoryName === current.categoryName);
  const indexInCategory = groupsInCategory.indexOf(current) + 1;

  let html = `<div class="category-heading">${current.categoryName}</div>`;
  html += `<div class="progress-indicator">Gruppe ${indexInCategory} von ${groupsInCategory.length} — ${current.groupName}</div>`;
  html += '<div class="question-list">';
  current.questions.forEach((q) => {
    const val = answers[q.id];
    html += `
      <div class="question-card">
        <div class="question-text">${q.text}</div>
        <div class="answer-group" role="radiogroup">
          ${ANSWER_OPTIONS.map(
      (o) => `
              <label class="answer-option${val === o.value ? " selected" : ""}">
                <input type="radio" name="${q.id}" value="${o.value}" ${val === o.value ? "checked" : ""} />
                <span>${o.label}</span>
              </label>`
    ).join("")}
        </div>
      </div>
    `;
  });
  html += "</div>";
  html += `<div class="group-actions"><button id="nextGroupBtn" class="btn-primary">${state.currentGroupIndex === totalGroups - 1 ? "Fertig" : "Weiter"
    }</button></div>`;

  container.innerHTML = html;

  container.querySelectorAll('.answer-group input[type="radio"]').forEach((radio) => {
    radio.addEventListener("change", (e) => {
      const qid = e.target.name;
      const value = parseInt(e.target.value, 10);
      const d = loadDraft(year.id);
      d.answers = d.answers || {};
      d.answers[qid] = value;
      d.groupIndex = state.currentGroupIndex;
      saveDraft(year.id, d);

      const group = e.target.closest(".answer-group");
      group.querySelectorAll(".answer-option").forEach((lbl) => lbl.classList.remove("selected"));
      e.target.closest(".answer-option").classList.add("selected");

      checkGroupComplete();
    });
  });

  checkGroupComplete();

  document.getElementById("nextGroupBtn").addEventListener("click", () => {
    const d = loadDraft(year.id);
    d.groupIndex = state.currentGroupIndex + 1;
    saveDraft(year.id, d);
    state.currentGroupIndex += 1;
    renderFragenTab();
  });
}

function checkGroupComplete() {
  const btn = document.getElementById("nextGroupBtn");
  if (!btn) return;
  const cards = document.querySelectorAll(".question-card");
  const allFilled = Array.from(cards).every((card) => card.querySelector('input[type="radio"]:checked'));
  btn.disabled = !allFilled;
}

/* ---------------------------------------------------------------------
   Lange Kategorienamen (ganze Sätze) als Achsenbeschriftung im
   Spinnendiagramm umbrechen. Ohne das kann Chart.js bei sehr langem Text
   die Zeichenfläche auf 0 schrumpfen lassen, sodass gar nichts mehr zu
   sehen ist (kein Fehler in der Konsole, das Diagramm ist einfach leer).
   --------------------------------------------------------------------- */
function wrapLabel(text, maxChars = 16) {
  const words = String(text).split(" ");
  const lines = [];
  let current = "";
  words.forEach((word) => {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length > maxChars && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  });
  if (current) lines.push(current);
  return lines;
}

/* ---------------------------------------------------------------------
   Auswertung: Kategorie-Scores + Spinnendiagramm
   --------------------------------------------------------------------- */
function computeCategoryScores(answers) {
  const scores = {};
  CATEGORIES.forEach((cat) => {
    const qs = cat.groups.flatMap((g) => g.questions);
    const sum = qs.reduce((acc, q) => acc + (answers[q.id] ?? 0), 0);
    scores[cat.name] = qs.length ? sum / qs.length : 0;
  });
  return scores;
}

function renderResults(container, year, answers) {
  const scores = computeCategoryScores(answers);
  const categoryNames = CATEGORIES.map((c) => c.name);

  container.innerHTML = `
    <h2>Ergebnis</h2>
    <div class="radar-wrap"><canvas id="radarCanvas" width="460" height="460"></canvas></div>
    <div class="save-panel">
      <label for="nameInput">Name</label>
      <input type="text" id="nameInput" placeholder="Dateiname" />
      <button id="saveBtn" class="btn-primary">Als PDF speichern</button>
      <div id="saveMsg" class="save-msg"></div>
    </div>
    <div style="text-align:center;">
      <button id="resetDraftBtn" class="btn-secondary">Antworten zurücksetzen</button>
    </div>
  `;

  drawRadarChart("radarCanvas", scores, categoryNames);

  document.getElementById("saveBtn").addEventListener("click", () => {
    const nameInput = document.getElementById("nameInput");
    const name = nameInput.value.trim();
    if (!name) {
      document.getElementById("saveMsg").textContent = "Bitte einen Namen eingeben.";
      nameInput.focus();
      return;
    }
    saveEntryAndExportPdf(year, name, answers, scores);
  });

  document.getElementById("resetDraftBtn").addEventListener("click", () => {
    if (confirm(`Wirklich alle Antworten für ${year.label} zurücksetzen?`)) {
      clearDraft(year.id);
      renderFragenTab();
    }
  });
}

function drawRadarChart(canvasId, scores, categoryNames) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return null;

  if (typeof Chart === "undefined") {
    console.error("Chart.js wurde nicht geladen (window.Chart ist undefined). Prüfe die Internetverbindung / ob cdnjs.cloudflare.com erreichbar ist.");
    const msg = document.createElement("p");
    msg.className = "empty-state";
    msg.textContent = "Diagramm konnte nicht geladen werden (Chart.js nicht verfügbar). Bitte Internetverbindung prüfen und Seite neu laden.";
    canvas.replaceWith(msg);
    return null;
  }

  const ctx = canvas.getContext("2d");
  const isDark = document.body.classList.contains("dark");
  const gridColor = isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.12)";
  const textColor = isDark ? "#eef2f5" : "#1a1f24";
  const names = categoryNames || CATEGORIES.map((c) => c.name);
  const wrappedLabels = names.map((n) => wrapLabel(n));

  return new Chart(ctx, {
    type: "radar",
    data: {
      labels: wrappedLabels,
      datasets: [
        {
          label: "Bewertung",
          data: names.map((c) => scores[c]),
          backgroundColor: "rgba(59,130,246,0.25)",
          borderColor: "#3b82f6",
          pointBackgroundColor: "#3b82f6",
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: false,
      animation: { duration: 400 },
      scales: {
        r: {
          min: 0,
          max: 4,
          ticks: { stepSize: 1, color: textColor, backdropColor: "transparent" },
          grid: { color: gridColor },
          angleLines: { color: gridColor },
          pointLabels: { color: textColor, font: { size: 13, weight: "600" } },
        },
      },
      plugins: { legend: { display: false } },
    },
  });
}

/* ---------------------------------------------------------------------
   Speziell für PDF-Export: Radar-Chart mit fest dunkler Beschriftung auf
   weißem Hintergrund rendern (unabhängig vom aktuellen Dark/Light-Modus,
   damit die Beschriftung auf der PDF-Seite immer lesbar ist).
   --------------------------------------------------------------------- */
function renderRadarForPdf(scores, categoryNames) {
  const size = 480;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  canvas.style.position = "fixed";
  canvas.style.left = "-9999px";
  canvas.style.top = "0";
  document.body.appendChild(canvas);

  const whiteBackgroundPlugin = {
    id: "whiteBackground",
    beforeDraw: (chart) => {
      const c = chart.canvas.getContext("2d");
      c.save();
      c.globalCompositeOperation = "destination-over";
      c.fillStyle = "#ffffff";
      c.fillRect(0, 0, chart.width, chart.height);
      c.restore();
    },
  };

  const chart = new Chart(canvas.getContext("2d"), {
    type: "radar",
    data: {
      labels: categoryNames.map((n) => wrapLabel(n)),
      datasets: [
        {
          label: "Bewertung",
          data: categoryNames.map((c) => scores[c]),
          backgroundColor: "rgba(59,130,246,0.25)",
          borderColor: "#3b82f6",
          pointBackgroundColor: "#3b82f6",
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: false,
      animation: false,
      scales: {
        r: {
          min: 0,
          max: 4,
          ticks: { stepSize: 1, color: "#1a1f24", backdropColor: "transparent" },
          grid: { color: "rgba(0,0,0,0.15)" },
          angleLines: { color: "rgba(0,0,0,0.15)" },
          pointLabels: { color: "#1a1f24", font: { size: 13, weight: "600" } },
        },
      },
      plugins: { legend: { display: false } },
    },
    plugins: [whiteBackgroundPlugin],
  });

  const dataUrl = canvas.toDataURL("image/png");
  chart.destroy();
  canvas.remove();
  return dataUrl;
}

/* ---------------------------------------------------------------------
   Speichern + PDF-Export
   --------------------------------------------------------------------- */
function saveEntryAndExportPdf(year, name, answers, scores) {
  const entries = loadEntries();
  const entry = {
    id: "entry_" + Date.now(),
    yearId: year.id,
    name,
    date: new Date().toISOString(),
    answers,
    scores,
  };
  entries.push(entry);
  saveEntries(entries);

  exportEntryToPdf(year, entry);
  clearDraft(year.id);

  document.getElementById("saveMsg").textContent = "Gespeichert. PDF wird heruntergeladen …";
}

function exportEntryToPdf(year, entry) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const marginX = 40;
  const pageBottom = 780;
  let y = 50;

  doc.setFontSize(18);
  doc.text(`${year.label} – Auswertung`, marginX, y);
  y += 24;

  doc.setFontSize(11);
  doc.text(`Name: ${entry.name}`, marginX, y);
  y += 16;
  doc.text(`Datum: ${formatDate(entry.date)}`, marginX, y);
  y += 28;

  doc.setFontSize(13);
  doc.text("Fragen und Antworten", marginX, y);
  y += 20;

  CATEGORIES.forEach((cat) => {
    if (y > pageBottom) {
      doc.addPage();
      y = 50;
    }
    doc.setFontSize(12);
    doc.setFont(undefined, "bold");
    doc.text(cat.name, marginX, y);
    y += 16;

    cat.groups.forEach((group) => {
      if (y > pageBottom) {
        doc.addPage();
        y = 50;
      }
      doc.setFontSize(10);
      doc.setFont(undefined, "bold");
      doc.text(group.name, marginX + 8, y);
      y += 14;
      doc.setFont(undefined, "normal");

      group.questions.forEach((q) => {
        const val = entry.answers[q.id];
        const label = ANSWER_OPTIONS.find((o) => o.value === val)?.label || "-";
        const lines = doc.splitTextToSize(q.text, 450);
        lines.forEach((line) => {
          if (y > pageBottom) {
            doc.addPage();
            y = 50;
          }
          doc.text(line, marginX + 16, y);
          y += 12;
        });
        if (y > pageBottom) {
          doc.addPage();
          y = 50;
        }
        doc.text(`Antwort: ${label}`, marginX + 24, y);
        y += 16;
      });
      y += 4;
    });
    y += 8;
  });

  if (y > 480) {
    doc.addPage();
    y = 50;
  }
  doc.setFontSize(13);
  doc.text("Spinnendiagramm", marginX, y);
  y += 12;
  const imgData = renderRadarForPdf(entry.scores, CATEGORIES.map((c) => c.name));
  doc.addImage(imgData, "PNG", marginX, y, 250, 250);

  const safeName = entry.name.replace(/[^a-z0-9äöüß\-_]+/gi, "_");
  doc.save(`${year.label.replace(/\s+/g, "_")}_${safeName}_${formatDate(entry.date).replace(/\./g, "-")}.pdf`);
}

/* ---------------------------------------------------------------------
   Übersicht-Tab
   --------------------------------------------------------------------- */
function renderUebersichtTab() {
  const container = document.getElementById("uebersichtTab");
  const year = YEARS.find((y) => y.id === state.currentYear);
  const entries = loadEntries()
    .filter((e) => e.yearId === year.id)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  if (!entries.length) {
    container.innerHTML = '<p class="empty-state">Für dieses Jahr wurden noch keine Fragebögen gespeichert.</p>';
    return;
  }

  let html = '<table class="entries-table"><thead><tr><th></th><th>Datum</th><th>Name</th></tr></thead><tbody>';
  entries.forEach((e) => {
    const checked = compareSelection.includes(e.id) ? "checked" : "";
    html += `<tr class="entry-row" data-id="${e.id}">
      <td class="compare-check-cell"><input type="checkbox" class="compare-checkbox" data-id="${e.id}" ${checked} /></td>
      <td>${formatDate(e.date)}</td>
      <td>${e.name}</td>
    </tr>`;
  });
  html += "</tbody></table>";
  container.innerHTML = html;

  container.querySelectorAll(".entry-row").forEach((row) => {
    row.addEventListener("click", (e) => {
      if (e.target.classList.contains("compare-checkbox")) return;
      openEntryModal(row.dataset.id);
    });
  });

  container.querySelectorAll(".compare-checkbox").forEach((cb) => {
    cb.addEventListener("click", (e) => e.stopPropagation());
    cb.addEventListener("change", (e) => {
      const id = e.target.dataset.id;
      if (e.target.checked) {
        if (!compareSelection.includes(id)) compareSelection.push(id);
      } else {
        compareSelection = compareSelection.filter((x) => x !== id);
      }
      updateCompareTray();
    });
  });
}

/* ---------------------------------------------------------------------
   Modal: gespeicherten Bogen ansehen
   --------------------------------------------------------------------- */
function openEntryModal(entryId) {
  const entries = loadEntries();
  const entry = entries.find((e) => e.id === entryId);
  if (!entry) return;
  const year = YEARS.find((y) => y.id === entry.yearId);

  const modal = document.getElementById("entryModal");
  const body = document.getElementById("modalBody");

  let html = `<h2>${year.label} – ${entry.name}</h2><p class="modal-date">${formatDate(entry.date)}</p>`;
  html += '<div class="radar-wrap"><canvas id="modalRadarCanvas" width="360" height="360"></canvas></div>';

  CATEGORIES.forEach((cat) => {
    html += `<div class="category-heading">${cat.name}</div>`;
    cat.groups.forEach((group) => {
      html += `<h3>${group.name}</h3><div class="question-list read-only">`;
      group.questions.forEach((q) => {
        const val = entry.answers[q.id];
        const label = ANSWER_OPTIONS.find((o) => o.value === val)?.label || "-";
        html += `
          <div class="question-card">
            <div class="question-text">${q.text}</div>
            <div class="answer-readonly">${label}</div>
          </div>`;
      });
      html += "</div>";
    });
  });

  body.innerHTML = html;
  modal.hidden = false;
  drawRadarChart(
    "modalRadarCanvas",
    entry.scores,
    CATEGORIES.map((c) => c.name)
  );
}

function closeModal() {
  document.getElementById("entryModal").hidden = true;
}

/* ---------------------------------------------------------------------
   Vergleich mehrerer Einträge (auch über Jahre hinweg)
   --------------------------------------------------------------------- */
function updateCompareTray() {
  const tray = document.getElementById("compareTray");
  const list = document.getElementById("compareTrayList");
  const openBtn = document.getElementById("compareOpenBtn");

  if (compareSelection.length === 0) {
    tray.hidden = true;
    document.body.classList.remove("compare-active");
    return;
  }
  tray.hidden = false;
  document.body.classList.add("compare-active");

  const allEntries = loadEntries();
  list.innerHTML = compareSelection
    .map((id) => {
      const entry = allEntries.find((e) => e.id === id);
      if (!entry) return "";
      const year = YEARS.find((y) => y.id === entry.yearId);
      const color = year ? year.color : "#888";
      return `
        <span class="compare-chip" style="border-left-color:${color}">
          ${entry.name} <small>(${year ? year.label : "?"})</small>
          <button class="compare-chip-remove" data-id="${entry.id}" aria-label="Entfernen">✕</button>
        </span>`;
    })
    .join("");

  list.querySelectorAll(".compare-chip-remove").forEach((btn) => {
    btn.addEventListener("click", () => {
      compareSelection = compareSelection.filter((id) => id !== btn.dataset.id);
      updateCompareTray();
      if (state.currentTab === "uebersicht") renderUebersichtTab();
    });
  });

  openBtn.disabled = compareSelection.length < 2;
}

function openCompareModal() {
  if (compareSelection.length < 2) return;
  const allEntries = loadEntries();
  const entries = compareSelection.map((id) => allEntries.find((e) => e.id === id)).filter(Boolean);

  const legendHtml = entries
    .map((entry) => {
      const year = YEARS.find((y) => y.id === entry.yearId);
      const color = year ? year.color : "#888";
      return `
        <div class="compare-legend-item">
          <span class="compare-swatch" style="background:${color}"></span>
          ${entry.name}
          <span class="compare-legend-year">${year ? year.label : "?"} • ${formatDate(entry.date)}</span>
        </div>`;
    })
    .join("");

  const body = document.getElementById("compareModalBody");
  body.innerHTML = `
    <h2>Vergleich</h2>
    <div class="radar-wrap"><canvas id="compareRadarCanvas" width="480" height="480"></canvas></div>
    <div class="compare-legend">${legendHtml}</div>
  `;

  document.getElementById("compareModal").hidden = false;
  drawComparisonRadar("compareRadarCanvas", entries);
}

function closeCompareModal() {
  document.getElementById("compareModal").hidden = true;
}

function hexToRgba(hex, alpha) {
  const clean = hex.replace("#", "");
  const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
  const num = parseInt(full, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function drawComparisonRadar(canvasId, entries) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return null;

  if (typeof Chart === "undefined") {
    console.error("Chart.js wurde nicht geladen (window.Chart ist undefined).");
    const msg = document.createElement("p");
    msg.className = "empty-state";
    msg.textContent = "Diagramm konnte nicht geladen werden (Chart.js nicht verfügbar).";
    canvas.replaceWith(msg);
    return null;
  }

  const isDark = document.body.classList.contains("dark");
  const gridColor = isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.12)";
  const textColor = isDark ? "#eef2f5" : "#1a1f24";
  const categoryNames = CATEGORIES.map((c) => c.name);

  const datasets = entries.map((entry) => {
    const year = YEARS.find((y) => y.id === entry.yearId);
    const color = year ? year.color : "#3b82f6";
    return {
      label: `${entry.name} (${year ? year.label : "?"})`,
      data: categoryNames.map((c) => entry.scores[c] ?? 0),
      borderColor: color,
      backgroundColor: hexToRgba(color, 0.18),
      pointBackgroundColor: color,
      borderWidth: 2,
    };
  });

  return new Chart(canvas.getContext("2d"), {
    type: "radar",
    data: { labels: categoryNames.map((n) => wrapLabel(n)), datasets },
    options: {
      responsive: false,
      animation: { duration: 400 },
      scales: {
        r: {
          min: 0,
          max: 4,
          ticks: { stepSize: 1, color: textColor, backdropColor: "transparent" },
          grid: { color: gridColor },
          angleLines: { color: gridColor },
          pointLabels: { color: textColor, font: { size: 13, weight: "600" } },
        },
      },
      plugins: {
        legend: {
          display: true,
          position: "bottom",
          labels: { color: textColor, font: { size: 11 }, boxWidth: 12 },
        },
      },
    },
  });
}

/* ---------------------------------------------------------------------
   Dark / Light Mode
   --------------------------------------------------------------------- */
function applyStoredTheme() {
  const theme = localStorage.getItem(THEME_KEY) || "dark";
  document.body.classList.toggle("dark", theme === "dark");
  document.body.classList.toggle("light", theme === "light");
  document.getElementById("darkModeToggle").checked = theme === "dark";
}

function onThemeToggle(e) {
  const theme = e.target.checked ? "dark" : "light";
  localStorage.setItem(THEME_KEY, theme);
  document.body.classList.toggle("dark", theme === "dark");
  document.body.classList.toggle("light", theme === "light");
}

function toggleSettingsPanel() {
  const panel = document.getElementById("settingsPanel");
  panel.hidden = !panel.hidden;
}