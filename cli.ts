#!/usr/bin/env tsx

import { readFileSync } from "node:fs";
import { formatInTimeZone } from "date-fns-tz";
import { parseTimeInput } from "./timeParser.ts";

const TIME_ZONE_ALIASES: ReadonlyMap<string, string> = new Map([
  ["PT", "America/Los_Angeles"],
  ["PST", "America/Los_Angeles"],
  ["PDT", "America/Los_Angeles"],
  ["PACIFIC", "America/Los_Angeles"],
  ["ET", "America/New_York"],
  ["EST", "America/New_York"],
  ["EDT", "America/New_York"],
  ["EASTERN", "America/New_York"],
  ["CT", "America/Chicago"],
  ["CST", "America/Chicago"],
  ["CDT", "America/Chicago"],
  ["CENTRAL", "America/Chicago"],
  ["MT", "America/Denver"],
  ["MST", "America/Denver"],
  ["MDT", "America/Denver"],
  ["MOUNTAIN", "America/Denver"],
  ["AK", "America/Anchorage"],
  ["AKST", "America/Anchorage"],
  ["AKDT", "America/Anchorage"],
  ["HT", "Pacific/Honolulu"],
  ["HST", "Pacific/Honolulu"],
  ["UTC", "Etc/UTC"],
  ["GMT", "Europe/London"],
  ["UK", "Europe/London"],
  ["LONDON", "Europe/London"],
  ["CET", "Europe/Paris"],
  ["CEST", "Europe/Paris"],
  ["PARIS", "Europe/Paris"],
  ["BERLIN", "Europe/Berlin"],
  ["CST-CHINA", "Asia/Shanghai"],
  ["CHINA", "Asia/Shanghai"],
  ["JST", "Asia/Tokyo"],
  ["TOKYO", "Asia/Tokyo"],
  ["AEST", "Australia/Sydney"],
  ["AEDT", "Australia/Sydney"],
  ["SYDNEY", "Australia/Sydney"],
]);

const SOURCE_ZONE = resolveTimeZone(
  process.env.SOURCE_ZONE || "America/Los_Angeles",
);
process.env.TZ = SOURCE_ZONE;

const OUTPUT_ZONES = parseOutputZones(
  process.env.OUTPUT_ZONES || "PT=PT,ET=ET",
);

interface OutputZone {
  label: string;
  zone: string;
}

const ALTERNATIVE_SEPARATOR_RE = /\s+\bor\b\s+/i;

function readInput(): string {
  const argInput = process.argv.slice(2).join(" ").trim();
  if (argInput) return argInput;
  return readFileSync(0, "utf8").trim();
}

function resolveTimeZone(value: string): string {
  const trimmed = value.trim();
  const alias = TIME_ZONE_ALIASES.get(trimmed.toUpperCase());
  return alias || trimmed;
}

function parseOutputZones(value: string): OutputZone[] {
  return value
    .split(/[;,]/)
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const [label, ...zoneParts] = entry.split("=");
      const displayLabel = label.trim();
      const zoneInput = zoneParts.length ? zoneParts.join("=").trim() : label;

      if (!displayLabel || !zoneInput.trim()) {
        throw new Error(
          `Invalid OUTPUT_ZONES entry "${entry}". Use LABEL=ZONE or ZONE.`,
        );
      }

      return { label: displayLabel, zone: resolveTimeZone(zoneInput) };
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
): string {
  if (zone.zone === SOURCE_ZONE) {
    return `${input} (${zone.label})`;
  }

  return `${formatConvertedInput(input, zone.zone)} (${zone.label})`;
}

function formatConvertedInput(input: string, targetZone: string): string {
  const alternatives = input
    .split(ALTERNATIVE_SEPARATOR_RE)
    .map((part) => part.trim())
    .filter(Boolean);

  if (alternatives.length <= 1) {
    return formatConvertedTime(parseTimeInput(input), targetZone);
  }

  return alternatives
    .map((part) => formatConvertedTime(parseTimeInput(part), targetZone))
    .join(" or ");
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

  const lines = trimmed.split(/\r?\n/);
  if (lines.length > 1) {
    return lines
      .map((line) => {
        const trimmedLine = line.trim();
        return trimmedLine
          ? OUTPUT_ZONES.map((zone) =>
              formatConvertedZone(trimmedLine, zone),
            ).join(" / ")
          : line;
      })
      .join("\n");
  }

  return OUTPUT_ZONES.map((zone) => formatConvertedZone(trimmed, zone)).join(
    " / ",
  );
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
