#!/bin/zsh

# @raycast.schemaVersion 1
# @raycast.title Replace Selected Time Zones
# @raycast.mode silent
# @raycast.packageName Text Time Zone Replacer
# @raycast.icon ⏳
# @raycast.description Replace selected natural-language time text with configured time zone conversions.

set -euo pipefail

# Edit these to change how selected text is interpreted and rendered.
# OUTPUT_ZONES is a comma-separated list of LABEL=IANA_TIME_ZONE entries.
SOURCE_ZONE="America/Los_Angeles"
OUTPUT_ZONES="PT=America/Los_Angeles,ET=America/New_York"

SCRIPT_DIR="${0:A:h}"
REPO_DIR="${SCRIPT_DIR:h}"

NODE_BIN="$(command -v node || true)"
if [[ -z "$NODE_BIN" && -x /opt/homebrew/bin/node ]]; then
  NODE_BIN="/opt/homebrew/bin/node"
fi
if [[ -z "$NODE_BIN" && -x /usr/local/bin/node ]]; then
  NODE_BIN="/usr/local/bin/node"
fi
if [[ -z "$NODE_BIN" ]]; then
  echo "Node.js was not found. Install Node or set NODE_BIN in this script." >&2
  exit 1
fi

osascript -e 'tell application "System Events" to keystroke "c" using command down'
sleep 0.05

selected_text="$(pbpaste)"
if [[ -z "${selected_text//[[:space:]]/}" ]]; then
  echo "No selected text found." >&2
  exit 1
fi

replacement="$(
  cd "$REPO_DIR"
  SOURCE_ZONE="$SOURCE_ZONE" OUTPUT_ZONES="$OUTPUT_ZONES" TZ="$SOURCE_ZONE" \
    "$NODE_BIN" dist/time-converter.js "$selected_text"
)"

printf "%s" "$replacement" | pbcopy
osascript -e 'tell application "System Events" to keystroke "v" using command down'
