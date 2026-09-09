// Brzi node test za js/models.js (isti scenariji kao Python tests/test_logic.py)
import fs from "fs";
import vm from "vm";

const code = fs.readFileSync(new URL("./models.js", import.meta.url), "utf-8");
const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(code, sandbox);
// class/const deklaracije na vrhu skripte su leksičke, ne postaju svojstva
// globalnog objekta - dohvatimo ih eksplicitno u istom kontekstu.
const Child = vm.runInContext("Child", sandbox);
const isoWeekMonday = vm.runInContext("isoWeekMonday", sandbox);
const isoWeekNumber = vm.runInContext("isoWeekNumber", sandbox);
const weekStatus = vm.runInContext("weekStatus", sandbox);
const toISODate = vm.runInContext("toISODate", sandbox);
const parseTimeToMinutes = vm.runInContext("parseTimeToMinutes", sandbox);
const minutesToTimeStr = vm.runInContext("minutesToTimeStr", sandbox);
const normalizeTimeSettings = vm.runInContext("normalizeTimeSettings", sandbox);
const buildPeriodSchedule = vm.runInContext("buildPeriodSchedule", sandbox);
const dayEndTimeLabel = vm.runInContext("dayEndTimeLabel", sandbox);
const DEFAULT_TIME_SETTINGS = vm.runInContext("DEFAULT_TIME_SETTINGS", sandbox);
const AppData = vm.runInContext("AppData", sandbox);
const holidayForISODate = vm.runInContext("holidayForISODate", sandbox);
const holidayStatus = vm.runInContext("holidayStatus", sandbox);
const sortedHolidays = vm.runInContext("sortedHolidays", sandbox);

let failures = 0;
function assertEqual(actual, expected, label) {
  const a = actual instanceof Date ? actual.toISOString() : JSON.stringify(actual);
  const e = expected instanceof Date ? expected.toISOString() : JSON.stringify(expected);
  if (a !== e) {
    failures++;
    console.error(`FAIL: ${label} -- got ${a}, expected ${e}`);
  } else {
    console.log(`ok: ${label}`);
  }
}

// test_iso_week_monday
assertEqual(toISODate(isoWeekMonday(new Date(2026, 8, 7))), "2026-09-07", "monday of 2026-09-07 (already Monday)");
assertEqual(toISODate(isoWeekMonday(new Date(2026, 8, 10))), "2026-09-07", "monday of 2026-09-10 (Thursday)");
assertEqual(toISODate(isoWeekMonday(new Date(2026, 8, 13))), "2026-09-07", "monday of 2026-09-13 (Sunday)");

// test_week_status_number
{
  const { monday, sunday, weekNum } = weekStatus(new Date(2026, 8, 7));
  assertEqual(toISODate(monday), "2026-09-07", "week_status monday");
  assertEqual(toISODate(sunday), "2026-09-13", "week_status sunday");
  assertEqual(weekNum, 37, "week_status week number == 37");
}

// test_basic_alternation_no_correction
{
  const c = new Child({ name: "Ana", turnusNames: ["A", "B"] });
  c.addOrReplaceReset(new Date(2026, 8, 7), 0);
  assertEqual(c.turnusIndexForWeek(new Date(2026, 8, 7)), 0, "basic alternation week0 == A(0)");
  assertEqual(c.turnusIndexForWeek(new Date(2026, 8, 14)), 1, "basic alternation week1 == B(1)");
  assertEqual(c.turnusIndexForWeek(new Date(2026, 8, 21)), 0, "basic alternation week2 == A(0)");
  assertEqual(c.turnusNameForDate(new Date(2026, 8, 10)), "A", "turnus name for date in week0");
  assertEqual(c.turnusNameForDate(new Date(2026, 8, 17)), "B", "turnus name for date in week1");
}

// test_correction_mid_year_swap
{
  const c = new Child({ name: "Marko", turnusNames: ["AB", "CD"] });
  c.addOrReplaceReset(new Date(2026, 8, 7), 0);
  const natural = c.turnusIndexForWeek(new Date(2027, 0, 11));
  const correctedIndex = 1 - natural;
  c.addOrReplaceReset(new Date(2027, 0, 11), correctedIndex);
  assertEqual(c.turnusIndexForWeek(new Date(2027, 0, 11)), correctedIndex, "correction applies on correction week");
  assertEqual(c.turnusIndexForWeek(new Date(2027, 0, 4)), 1 - natural, "week before correction keeps old scheme");
  assertEqual(c.turnusIndexForWeek(new Date(2027, 0, 18)), 1 - correctedIndex, "week after correction alternates from new point");
}

// test_multiple_corrections_sorted
{
  const c = new Child({ name: "Iva" });
  c.addOrReplaceReset(new Date(2026, 8, 7), 0);
  c.addOrReplaceReset(new Date(2027, 2, 1), 1);
  c.addOrReplaceReset(new Date(2027, 0, 11), 0);
  const dates = c.sortedResets().map((r) => r.dateFrom);
  assertEqual(dates, ["2026-09-07", "2027-01-11", "2027-03-01"], "resets sorted regardless of insert order");
}

// test_schedule_get_and_set
{
  const c = new Child({ name: "Ana", periodsCount: 5 });
  c.setScheduleForTurnus(0, { mon: ["Matematika", "Hrvatski"] });
  assertEqual(c.getSubject(0, "mon", 0), "Matematika", "get subject 0");
  assertEqual(c.getSubject(0, "mon", 1), "Hrvatski", "get subject 1");
  assertEqual(c.getSubject(0, "mon", 4), "", "get subject out of range");
  assertEqual(c.getDayRow(0, "mon"), ["Matematika", "Hrvatski", "", "", ""], "get day row padded");
}

// roundtrip
{
  const c = new Child({ name: "Ana", turnusNames: ["AB", "CD"] });
  c.addOrReplaceReset(new Date(2026, 8, 7), 0);
  c.setScheduleForTurnus(0, { mon: ["Matematika"] });
  const c2 = Child.fromJSON(JSON.parse(JSON.stringify(c.toJSON())));
  assertEqual(c2.name, c.name, "roundtrip name");
  assertEqual(c2.turnusIndexForWeek(new Date(2026, 8, 14)), 1, "roundtrip turnus calc");
  assertEqual(c2.getSubject(0, "mon", 0), "Matematika", "roundtrip subject");
}

// --- vrijeme sati i odmora ---

// parseTimeToMinutes / minutesToTimeStr
assertEqual(parseTimeToMinutes("08:00"), 480, "parseTimeToMinutes 08:00");
assertEqual(parseTimeToMinutes("13:30"), 810, "parseTimeToMinutes 13:30");
assertEqual(minutesToTimeStr(480), "08:00", "minutesToTimeStr 480");
assertEqual(minutesToTimeStr(1445), "00:05", "minutesToTimeStr wraps past midnight");

// normalizeTimeSettings: zadane vrijednosti kad nema ničega
assertEqual(
  normalizeTimeSettings({}),
  {
    startTime: "08:00",
    periodMinutes: 45,
    shortBreakMinutes: 5,
    longBreakMinutes: 15,
    longBreakAfterPeriod: 3,
    hasPrePeriod: false,
    prePeriodStartTime: "07:10",
    prePeriodMinutes: 45,
  },
  "normalizeTimeSettings defaults"
);
// djelomično popunjeno + snake_case (interoperabilnost s Python appom)
assertEqual(
  normalizeTimeSettings({ startTime: "09:00", short_break_minutes: 10 }),
  {
    startTime: "09:00",
    periodMinutes: 45,
    shortBreakMinutes: 10,
    longBreakMinutes: 15,
    longBreakAfterPeriod: 3,
    hasPrePeriod: false,
    prePeriodStartTime: "07:10",
    prePeriodMinutes: 45,
  },
  "normalizeTimeSettings partial + snake_case fallback"
);

// buildPeriodSchedule: 4 sata, pauza 5 min, veliki odmor od 15 min nakon 2. sata
{
  const ts = { startTime: "08:00", periodMinutes: 45, shortBreakMinutes: 5, longBreakMinutes: 15, longBreakAfterPeriod: 2 };
  const periods = buildPeriodSchedule(ts, 4);
  assertEqual(periods.map((p) => [p.start, p.end]), [
    ["08:00", "08:45"],
    ["08:50", "09:35"],
    ["09:50", "10:35"],
    ["10:40", "11:25"],
  ], "buildPeriodSchedule start/end times");
  assertEqual(periods[0].breakAfter, { kind: "short", minutes: 5, start: "08:45", end: "08:50" }, "short break after period 1");
  assertEqual(periods[1].breakAfter, { kind: "long", minutes: 15, start: "09:35", end: "09:50" }, "long break after period 2");
  assertEqual(periods[3].breakAfter, undefined, "no break after last period");
}

// dayEndTimeLabel: kraj dana prati zadnji NEprazan sat, ne ukupan periodsCount
{
  const ts = { startTime: "08:00", periodMinutes: 45, shortBreakMinutes: 5, longBreakMinutes: 15, longBreakAfterPeriod: 2 };
  assertEqual(dayEndTimeLabel(ts, ["Mat", "HJ", "", "", ""]), "09:35", "day end time stops at last filled period (2), no trailing break");
  assertEqual(dayEndTimeLabel(ts, ["Mat", "HJ", "TZK", "", ""]), "10:35", "day end time includes long break that falls before the last filled period");
  assertEqual(dayEndTimeLabel(ts, ["", "", "", "", ""]), null, "day end time null when day fully empty");
}

// Child integracija: periodSchedule i dayEndTime kroz Child instancu
{
  const c = new Child({ name: "Iva", periodsCount: 3 });
  c.setTimeSettings(0, { startTime: "08:00", periodMinutes: 45, shortBreakMinutes: 5, longBreakMinutes: 15, longBreakAfterPeriod: 1 });
  c.setScheduleForTurnus(0, { mon: ["Matematika", "Hrvatski", ""] });
  assertEqual(c.periodSchedule(0).length, 3, "Child.periodSchedule length == periodsCount");
  assertEqual(c.dayEndTime(0, "mon"), "09:45", "Child.dayEndTime uses child's time settings and schedule");
  assertEqual(c.dayEndTime(0, "tue"), null, "Child.dayEndTime null for empty day");
  // turnus bez ikad postavljenih timeSettings i dalje vraća razumne zadane vrijednosti
  assertEqual(c.getTimeSettings(1), DEFAULT_TIME_SETTINGS, "Child.getTimeSettings falls back to defaults");
}

// roundtrip uključuje timeSettings
{
  const c = new Child({ name: "Ana" });
  c.setTimeSettings(0, { startTime: "09:15", periodMinutes: 50, shortBreakMinutes: 10, longBreakMinutes: 20, longBreakAfterPeriod: 4 });
  const c2 = Child.fromJSON(JSON.parse(JSON.stringify(c.toJSON())));
  assertEqual(c2.getTimeSettings(0), c.getTimeSettings(0), "roundtrip timeSettings");
}

// predsat: isključen po zadanome -> buildPeriodSchedule ne dodaje ništa dodatno
{
  const ts = { startTime: "08:00", periodMinutes: 45, shortBreakMinutes: 5, longBreakMinutes: 15, longBreakAfterPeriod: 2 };
  const periods = buildPeriodSchedule(ts, 2);
  assertEqual(periods.length, 2, "predsat disabled by default - no extra period");
  assertEqual(Boolean(periods[0].isPre), false, "predsat disabled - first period is not marked isPre");
}

// predsat: uključen, s razmakom prije redovnog početka -> "gap" prije 1. sata
{
  const ts = {
    startTime: "08:00",
    periodMinutes: 45,
    shortBreakMinutes: 5,
    longBreakMinutes: 15,
    longBreakAfterPeriod: 2,
    hasPrePeriod: true,
    prePeriodStartTime: "07:10",
    prePeriodMinutes: 45,
  };
  const periods = buildPeriodSchedule(ts, 2);
  assertEqual(periods.length, 3, "predsat enabled adds one extra period");
  assertEqual(periods[0].isPre, true, "first entry is the predsat");
  assertEqual([periods[0].start, periods[0].end], ["07:10", "07:55"], "predsat start/end from its own settings");
  assertEqual(
    periods[0].breakAfter,
    { kind: "gap", minutes: 5, start: "07:55", end: "08:00" },
    "gap row between predsat and regular start when there's a time difference"
  );
  assertEqual(periods[1].period, 1, "regular period numbering starts at 1 after predsat");
}

// predsat: bez razmaka (predsat završava točno kad kreće redovna nastava) -> nema gap retka
{
  const ts = {
    startTime: "08:00",
    periodMinutes: 45,
    hasPrePeriod: true,
    prePeriodStartTime: "07:15",
    prePeriodMinutes: 45,
  };
  const periods = buildPeriodSchedule(ts, 1);
  assertEqual(periods[0].breakAfter, undefined, "no gap row when predsat touches regular start exactly");
}

// Child.getPreSubject/setPreScheduleForTurnus - upis po danu, dayEndTime i dalje računa samo redovne sate
{
  const c = new Child({ name: "Petra", periodsCount: 2 });
  c.setTimeSettings(0, { startTime: "08:00", periodMinutes: 45, hasPrePeriod: true, prePeriodStartTime: "07:10", prePeriodMinutes: 45 });
  c.setPreScheduleForTurnus(0, { mon: "Njemački" });
  c.setScheduleForTurnus(0, { mon: ["Matematika", "Hrvatski"] });
  assertEqual(c.getPreSubject(0, "mon"), "Njemački", "predsat upisan ponedjeljkom");
  assertEqual(c.getPreSubject(0, "tue"), "", "dan bez predsata je prazan");
  assertEqual(c.dayEndTime(0, "mon"), "09:35", "Kraj nastave i dalje računa samo redovne sate, predsat ga ne mijenja");
}

// roundtrip uključuje preSchedule i predsat postavke vremena
{
  const c = new Child({ name: "Petra", periodsCount: 2 });
  c.setTimeSettings(0, { startTime: "08:00", periodMinutes: 45, hasPrePeriod: true, prePeriodStartTime: "07:10", prePeriodMinutes: 45 });
  c.setPreScheduleForTurnus(0, { mon: "Njemački" });
  const c2 = Child.fromJSON(JSON.parse(JSON.stringify(c.toJSON())));
  assertEqual(c2.getPreSubject(0, "mon"), "Njemački", "roundtrip preSchedule");
  assertEqual(c2.getTimeSettings(0).hasPrePeriod, true, "roundtrip hasPrePeriod");
  assertEqual(c2.getTimeSettings(0).prePeriodStartTime, "07:10", "roundtrip prePeriodStartTime");
}

// interoperabilnost: snake_case backup iz Python appa (predsat postavke + pre_schedule)
{
  const raw = {
    name: "Filip",
    periods_count: 2,
    schedule: { 0: { mon: ["Matematika", "Hrvatski"] } },
    pre_schedule: { 0: { mon: "Njemački" } },
    time_settings: { 0: { start_time: "08:00", period_minutes: 45, has_pre_period: true, pre_period_start_time: "07:10", pre_period_minutes: 45 } },
  };
  const c = Child.fromJSON(raw);
  assertEqual(c.getPreSubject(0, "mon"), "Njemački", "snake_case pre_schedule se ispravno učita");
  assertEqual(c.getTimeSettings(0).hasPrePeriod, true, "snake_case has_pre_period se ispravno učita");
}

// praznici: AppData roundtrip (JSON) + camelCase/snake_case interoperabilnost
{
  const data = new AppData({ holidays: [{ id: "h1", name: "Zimski praznici", dateFrom: "2026-12-23", dateTo: "2027-01-08" }] });
  const data2 = AppData.fromJSON(JSON.parse(JSON.stringify(data.toJSON())));
  assertEqual(data2.holidays.length, 1, "roundtrip broj praznika");
  assertEqual(data2.holidays[0].name, "Zimski praznici", "roundtrip naziv praznika");
  assertEqual(data2.holidays[0].dateFrom, "2026-12-23", "roundtrip dateFrom praznika");
}
{
  const raw = { children: [], holidays: [{ id: "h1", name: "Državni praznik", date_from: "2026-10-08", date_to: "2026-10-08" }] };
  const data = AppData.fromJSON(raw);
  assertEqual(data.holidays[0].dateFrom, "2026-10-08", "snake_case date_from se ispravno učita");
}
{
  // nevaljan zapis (bez datuma) se odbaci umjesto da sruši učitavanje
  const raw = { children: [], holidays: [{ id: "h1", name: "Bez datuma" }, { id: "h2", name: "Ispravan", dateFrom: "2026-06-01", dateTo: "2026-06-05" }] };
  const data = AppData.fromJSON(raw);
  assertEqual(data.holidays.length, 1, "nevaljan zapis praznika se odbaci, ispravan ostaje");
}

// praznici: holidayForISODate / holidayStatus
{
  const holidays = [
    { id: "h1", name: "Zimski praznici", dateFrom: "2026-12-23", dateTo: "2027-01-08" },
    { id: "h2", name: "Državni praznik", dateFrom: "2026-10-08", dateTo: "2026-10-08" },
  ];
  assertEqual(holidayForISODate(holidays, "2026-12-25")?.name, "Zimski praznici", "datum unutar raspona pronađe praznik");
  assertEqual(holidayForISODate(holidays, "2026-12-22"), null, "dan prije raspona nije praznik");
  assertEqual(holidayForISODate(holidays, "2026-10-08")?.name, "Državni praznik", "jednodnevni praznik radi (od==do)");

  // "u tijeku" ima prednost pred "uskoro"
  const today1 = new Date(2026, 11, 25); // 25.12.2026 - unutar zimskih
  const status1 = holidayStatus(holidays, today1, 14);
  assertEqual(status1.status, "current", "praznik koji je danas u tijeku ima status 'current'");
  assertEqual(status1.holiday.name, "Zimski praznici", "'current' vraća ispravan praznik");

  // "uskoro" (unutar withinDays)
  const today2 = new Date(2026, 9, 1); // 01.10.2026 - 7 dana prije Državnog praznika
  const status2 = holidayStatus(holidays, today2, 14);
  assertEqual(status2.status, "upcoming", "praznik za 7 dana ima status 'upcoming'");
  assertEqual(status2.daysUntil, 7, "daysUntil je ispravno izračunat");

  // dalje od withinDays -> null
  const today3 = new Date(2026, 8, 1); // 01.09.2026 - predaleko od oba praznika
  assertEqual(holidayStatus(holidays, today3, 14), null, "praznik dalje od withinDays ne javlja se");
}

// sortedHolidays - poredak po dateFrom, ne mijenja originalni niz
{
  const holidays = [
    { id: "b", name: "B", dateFrom: "2026-06-01", dateTo: "2026-06-02" },
    { id: "a", name: "A", dateFrom: "2026-01-01", dateTo: "2026-01-02" },
  ];
  const sorted = sortedHolidays(holidays);
  assertEqual(sorted.map((h) => h.id), ["a", "b"], "sortedHolidays poreda po dateFrom");
  assertEqual(holidays.map((h) => h.id), ["b", "a"], "sortedHolidays ne mijenja originalni niz");
}

if (failures > 0) {
  console.error(`\n${failures} test(ova) palo.`);
  process.exit(1);
} else {
  console.log("\nSvi JS testovi prošli.");
}
