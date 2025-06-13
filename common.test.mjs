import assert from "node:assert";
import test from "node:test";
import { getUserIds } from "./common.mjs";
import { generateRevisionDatesUTC } from "./utils/generateRevisionDatesUTC.mjs";

test("User count is correct", () => {
  assert.equal(getUserIds().length, 5);
});
test("generateRevisionDates with start date 2025-07-19", () => {
  const startDate = "2025-07-19";
  const result = generateRevisionDatesUTC(startDate);

  const expected = [
    "2025-07-26",
    "2025-08-19",
    "2025-10-19",
    "2026-01-19",
    "2026-07-19",
  ];

  assert.deepStrictEqual(result, expected);
});
test("generateRevisionDatesUTC with start date 2026-01-31", () => {
  const startDate = "2026-01-31";
  const result = generateRevisionDatesUTC(startDate);

  const expected = [
    "2026-02-07",
    "2026-02-28",
    "2026-04-30",
    "2026-07-31",
    "2027-01-31",
  ];

  assert.deepStrictEqual(result, expected);
});
