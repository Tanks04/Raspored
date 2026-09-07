/* Podatkovni model i logika za izračun tjedna/turnusa - JS port app/models.py */
"use strict";

const DAY_KEYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
const DAY_LABELS_HR = {
  mon: "Ponedjeljak",
  tue: "Utorak",
  wed: "Srijeda",
  thu: "Četvrtak",
  fri: "Petak",
  sat: "Subota",
  sun: "Nedjelja",
};
const DAY_LABELS_SHORT_HR = {
  mon: "Pon",
  tue: "Uto",
  wed: "Sri",
  thu: "Čet",
  fri: "Pet",
  sat: "Sub",
  sun: "Ned",
};
const WEEKEND_KEYS = new Set(["sat", "sun"]);
const DEFAULT_PERIODS = 7;
const DEFAULT_TURNUS_NAMES = ["A", "B"];

function pad2(n) {
  return n < 10 ? "0" + n : "" + n;
}

/** Vraća datum kao "YYYY-MM-DD" (lokalno, bez vremenske zone). */
function toISODate(d) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

/** Parsira "YYYY-MM-DD" u Date (lokalna ponoć). */
function fromISODate(s) {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function atMidnight(d) {
  const r = new Date(d);
  r.setHours(0, 0, 0, 0);
  return r;
}

function addDays(d, days) {
  const r = new Date(d);
  r.setDate(r.getDate() + days);
  return r;
}

/** Ponedjeljak tjedna kojem pripada dani datum. */
function isoWeekMonday(d) {
  const dm = atMidnight(d);
  const weekday = (dm.getDay() + 6) % 7; // 0=pon ... 6=ned
  return addDays(dm, -weekday);
}

/** Standardni ISO-8601 broj tjedna u godini. */
function isoWeekNumber(d) {
  const date = atMidnight(d);
  const dayNum = date.getDay() || 7; // 1..7, pon=1
  const thursday = addDays(date, 4 - dayNum);
  const yearStart = new Date(thursday.getFullYear(), 0, 1);
  return Math.ceil(((thursday - yearStart) / 86400000 + 1) / 7);
}

function mod(n, m) {
  return ((n % m) + m) % m;
}

function weeksBetweenMondays(a, b) {
  // a, b su ponedjeljci (midnight); razlika u punim tjednima
  return Math.round((a - b) / (7 * 86400000));
}

/**
 * TurnusReset: { dateFrom: "YYYY-MM-DD" (ponedjeljak), turnusIndex: 0|1 }
 */

class Child {
  constructor({
    name,
    turnusNames = [...DEFAULT_TURNUS_NAMES],
    resets = [],
    schedule = { 0: {}, 1: {} },
    periodsCount = DEFAULT_PERIODS,
  } = {}) {
    this.name = name;
    this.turnusNames = turnusNames;
    this.resets = resets;
    this.schedule = schedule;
    this.periodsCount = periodsCount;
  }

  sortedResets() {
    return [...this.resets].sort((a, b) => (a.dateFrom < b.dateFrom ? -1 : a.dateFrom > b.dateFrom ? 1 : 0));
  }

  turnusIndexForWeek(monday) {
    if (!this.resets.length) return 0;
    const sorted = this.sortedResets();
    const mondayStr = toISODate(monday);
    let applicable = null;
    for (const r of sorted) {
      if (r.dateFrom <= mondayStr) applicable = r;
      else break;
    }
    if (!applicable) applicable = sorted[0];
    const applicableMonday = fromISODate(applicable.dateFrom);
    const weeksDiff = weeksBetweenMondays(monday, applicableMonday);
    return mod(applicable.turnusIndex + weeksDiff, 2);
  }

  turnusIndexForDate(d) {
    return this.turnusIndexForWeek(isoWeekMonday(d));
  }

  turnusNameForWeek(monday) {
    const idx = this.turnusIndexForWeek(monday);
    return this.turnusNames[idx] !== undefined ? this.turnusNames[idx] : String(idx);
  }

  turnusNameForDate(d) {
    return this.turnusNameForWeek(isoWeekMonday(d));
  }

  addOrReplaceReset(date, turnusIndex) {
    const monday = isoWeekMonday(date);
    const ds = toISODate(monday);
    this.resets = this.resets.filter((r) => r.dateFrom !== ds);
    this.resets.push({ dateFrom: ds, turnusIndex });
    this.resets = this.sortedResets();
  }

  removeReset(dateFrom) {
    this.resets = this.resets.filter((r) => r.dateFrom !== dateFrom);
  }

  getSubject(turnusIndex, dayKey, period) {
    const table = this.schedule[turnusIndex] || {};
    const row = table[dayKey] || [];
    return period < row.length ? row[period] || "" : "";
  }

  getDayRow(turnusIndex, dayKey) {
    const table = this.schedule[turnusIndex] || {};
    let row = (table[dayKey] || []).slice();
    while (row.length < this.periodsCount) row.push("");
    return row.slice(0, this.periodsCount);
  }

  setScheduleForTurnus(turnusIndex, data) {
    this.schedule[turnusIndex] = data;
  }

  toJSON() {
    return {
      name: this.name,
      turnusNames: this.turnusNames,
      resets: this.resets,
      schedule: this.schedule,
      periodsCount: this.periodsCount,
    };
  }

  static fromJSON(d) {
    return new Child({
      name: d.name,
      turnusNames: d.turnusNames || [...DEFAULT_TURNUS_NAMES],
      resets: d.resets || [],
      schedule: d.schedule || { 0: {}, 1: {} },
      periodsCount: d.periodsCount || DEFAULT_PERIODS,
    });
  }
}

class AppData {
  constructor({ children = [], activeChild = null } = {}) {
    this.children = children;
    this.activeChild = activeChild;
  }

  getActive() {
    const found = this.children.find((c) => c.name === this.activeChild);
    if (found) return found;
    return this.children.length ? this.children[0] : null;
  }

  getChild(name) {
    return this.children.find((c) => c.name === name) || null;
  }

  toJSON() {
    return {
      children: this.children.map((c) => c.toJSON()),
      activeChild: this.activeChild,
    };
  }

  static fromJSON(d) {
    return new AppData({
      children: (d.children || []).map(Child.fromJSON),
      activeChild: d.activeChild || null,
    });
  }
}

function weekStatus(today) {
  const monday = isoWeekMonday(today);
  const sunday = addDays(monday, 6);
  const weekNum = isoWeekNumber(today);
  return { monday, sunday, weekNum };
}

// Izvoz za korištenje u drugim modulima (obični <script> - globalni scope)
