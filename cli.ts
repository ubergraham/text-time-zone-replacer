#!/usr/bin/env tsx

import { readFileSync } from "node:fs";
import { formatInTimeZone } from "date-fns-tz";
import { parseTimeInput } from "./timeParser.ts";

const SOURCE_ZONE = process.env.SOURCE_ZONE || "America/Los_Angeles";
const OUTPUT_ZONES = parseOutputZones(
  process.env.OUTPUT_ZONES || "PT=America/Los_Angeles,ET=America/New_York",
);

interface OutputZone {
  label: string;
  zone: string;
}

function readInput(): string {
  const argInput = process.argv.slice(2).join(" ").trim();
  if (argInput) return argInput;
  return readFileSync(0, "utf8").trim();
}

function parseOutputZones(value: string): OutputZone[] {
  return value
    .split(/[;,]/)
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const [label, ...zoneParts] = entry.split("=");
      const zone = zoneParts.join("=").trim();

      if (!label?.trim() || !zone) {
        throw new Error(
          `Invalid OUTPUT_ZONES entry "${entry}". Use LABEL=IANA_ZONE.`,
        );
      }

      return { label: label.trim(), zone };
    });
}

function compactTime(date: Date, zone: string): string {
  return formatInTimeZone(date, zone, "h:mma")
    .toLowerCase()
    .replace(":00", "");
}

function compactDayTime(date: Date, zone: string): string {
  return formatInTimeZone(date, zone, "EEE h:mma")
    .replace(":00", "")
    .toLowerCase()
    .replace(/^\w/, (c) => c.toUpperCase());
}

function formatConvertedZone(
  input: string,
  zone: OutputZone,
  parsed: ReturnType<typeof parseTimeInput>,
): string {
  if (zone.zone === SOURCE_ZONE) {
    return `${input} ${zone.label}`;
  }

  return `${formatConvertedTime(parsed, zone.zone)} ${zone.label}`;
}

function formatConvertedTime(
  parsed: ReturnType<typeof parseTimeInput>,
  targetZone: string,
): string {
  if (parsed.isRange) {
    const sourceStartDay = formatInTimeZone(
      parsed.date,
      SOURCE_ZONE,
      "yyyy-MM-dd",
    );
    const targetStartDay = formatInTimeZone(
      parsed.date,
      targetZone,
      "yyyy-MM-dd",
    );
    const sourceEndDay = formatInTimeZone(
      parsed.endDate,
      SOURCE_ZONE,
      "yyyy-MM-dd",
    );
    const targetEndDay = formatInTimeZone(
      parsed.endDate,
      targetZone,
      "yyyy-MM-dd",
    );
    const showStartDay = sourceStartDay !== targetStartDay;
    const showEndDay =
      sourceEndDay !== targetEndDay || targetStartDay !== targetEndDay;

    const start = showStartDay
      ? compactDayTime(parsed.date, targetZone)
      : compactTime(parsed.date, targetZone);
    const end = showEndDay
      ? compactDayTime(parsed.endDate, targetZone)
      : compactTime(parsed.endDate, targetZone);

    return `${start}-${end}`;
  }

  const sourceDay = formatInTimeZone(parsed.date, SOURCE_ZONE, "yyyy-MM-dd");
  const targetDay = formatInTimeZone(parsed.date, targetZone, "yyyy-MM-dd");

  return sourceDay === targetDay
    ? compactTime(parsed.date, targetZone)
    : compactDayTime(parsed.date, targetZone);
}

function replaceTimeZoneText(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) {
    throw new Error("No selected text was provided.");
  }

  const parsed = parseTimeInput(trimmed);
  return OUTPUT_ZONES.map((zone) =>
    formatConvertedZone(trimmed, zone, parsed),
  ).join(" / ");
}

function main() {
  const input = readInput();
  process.stdout.write(replaceTimeZoneText(input));
}

try {
  main();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`time-converter: ${message}\n`);
  process.exit(1);
}
