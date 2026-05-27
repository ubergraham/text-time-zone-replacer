#!/bin/zsh
set -euo pipefail

# Edit these to change how selected text is interpreted and rendered.
# You can use short aliases such as PT, ET, CT, MT, UTC, GMT, CET, and JST.
SOURCE_ZONE="PT"
OUTPUT_ZONES="PT,ET"

SCRIPT_DIR="${0:A:h}"
cd "$SCRIPT_DIR"

NODE_BIN="$(command -v node || true)"
if [[ -z "$NODE_BIN" && -x /opt/homebrew/bin/node ]]; then
  NODE_BIN="/opt/homebrew/bin/node"
fi
if [[ -z "$NODE_BIN" && -x /usr/local/bin/node ]]; then
  NODE_BIN="/usr/local/bin/node"
fi
if [[ -z "$NODE_BIN" ]]; then
  echo "Node.js was not found. Install Node or update shortcut-quick-action.sh with your Node path." >&2
  exit 1
fi

SOURCE_ZONE="$SOURCE_ZONE" OUTPUT_ZONES="$OUTPUT_ZONES" "$NODE_BIN" \
  dist/time-converter.js
