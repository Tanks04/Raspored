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

if (failures > 0) {
  console.error(`\n${failures} test(ova) palo.`);
  process.exit(1);
} else {
  console.log("\nSvi JS testovi prošli.");
}
