# Text Time Zone Replacer

Small macOS utility for replacing selected natural-language Pacific Time text
with inline time zone conversions.

Example:

```text
Weds 5pm
```

becomes:

```text
Weds 5pm PT / 8pm ET
```

## Options

This repository includes two ways to use the same converter:

- **Raycast Script Command:** fastest setup for Raycast users. Select text,
  run a Raycast hotkey, and it replaces the selected text.
- **macOS Shortcut Quick Action:** built-in macOS workflow using Shortcuts and
  Services. Select text, run the system shortcut, and it replaces the selected
  text.

Both options use the bundled JavaScript converter and support basic natural
language such as `Weds 5pm`, `tomorrow 3pm`, and simple ranges like
`Weds 4:30pm - 5pm`.

## Shared Setup

Install dependencies and build the fast JavaScript bundle:

```zsh
npm install
npm run build
```

Then choose one of the install paths below.

## Raycast Script Command

Use this if you already use Raycast and want the fastest hotkey workflow.

Setup instructions:

[RAYCAST_SCRIPT_COMMAND.md](RAYCAST_SCRIPT_COMMAND.md)

Script location:

```text
raycast-scripts/replace-selected-time-zones.sh
```

Configure output zones by editing variables at the top of that script:

```zsh
SOURCE_ZONE="America/Los_Angeles"
OUTPUT_ZONES="PT=America/Los_Angeles,ET=America/New_York"
```

## macOS Shortcut Quick Action

Use this if you want a built-in macOS option without Raycast.

Setup instructions:

[SHORTCUT.md](SHORTCUT.md)

The macOS Quick Action runs the repository-local helper script:

```zsh
./shortcut-quick-action.sh
```

The script reads selected text from stdin and writes replacement text to stdout.

## Attribution

Portions of this project are derived from Raycast's MIT-licensed `time-converter` extension. See [NOTICE.md](NOTICE.md).
