#!/usr/bin/env tsx

import { readFileSync } from "node:fs";
import { formatInTimeZone } from "date-fns-tz";
import { parseTimeInput } from "./timeParser.ts";

const SOURCE_ZONE = "America/Los_Angeles";
const TARGET_ZONE = "America/New_York";
const SOURCE_LABEL = "PT";
const TARGET_LABEL = "ET";

function readInput(): string {
  const argInput = process.argv.slice(2).join(" ").trim();
  if (argInput) return argInput;
  return readFileSync(0, "utf8").trim();
}

function compactTime(date: Date, zone: string): string {
  return formatInTimeZone(date, zone, "h:mma")
    .toLowerCase()
    .replace(":00", "");
}

function compactDayTime(date: Date, zone: string): string {
  return formatInTimeZone(date, zone, "EEE h:mma").replace(":00", "").toLowerCase().replace(/^\w/, (c) => c.toUpperCase());
}

function formatTarget(input: string): string {
  const parsed = parseTimeInput(input);

  if (parsed.isRange) {
    const sourceStartDay = formatInTimeZone(parsed.date, SOURCE_ZONE, "yyyy-MM-dd");
    const targetStartDay = formatInTimeZone(parsed.date, TARGET_ZONE, "yyyy-MM-dd");
    const sourceEndDay = formatInTimeZone(parsed.endDate, SOURCE_ZONE, "yyyy-MM-dd");
    const targetEndDay = formatInTimeZone(parsed.endDate, TARGET_ZONE, "yyyy-MM-dd");
    const showStartDay = sourceStartDay !== targetStartDay;
    const showEndDay = sourceEndDay !== targetEndDay || targetStartDay !== targetEndDay;

    const start = showStartDay
      ? compactDayTime(parsed.date, TARGET_ZONE)
      : compactTime(parsed.date, TARGET_ZONE);
    const end = showEndDay
      ? compactDayTime(parsed.endDate, TARGET_ZONE)
      : compactTime(parsed.endDate, TARGET_ZONE);

    return `${start}-${end} ${TARGET_LABEL}`;
  }

  const sourceDay = formatInTimeZone(parsed.date, SOURCE_ZONE, "yyyy-MM-dd");
  const targetDay = formatInTimeZone(parsed.date, TARGET_ZONE, "yyyy-MM-dd");
  const targetTime =
    sourceDay === targetDay
      ? compactTime(parsed.date, TARGET_ZONE)
      : compactDayTime(parsed.date, TARGET_ZONE);

  return `${targetTime} ${TARGET_LABEL}`;
}

function main() {
  const input = readInput();
  if (!input) {
    throw new Error("No selected text was provided.");
  }

  process.stdout.write(`${input} ${SOURCE_LABEL} / ${formatTarget(input)}`);
}

try {
  main();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`time-converter: ${message}\n`);
  process.exit(1);
}
