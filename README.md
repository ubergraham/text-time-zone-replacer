# Text Time Zone Replacer

Small macOS utility for replacing selected natural-language Pacific Time text with an inline Eastern Time conversion.

Example:

```text
Weds 5pm
```

becomes:

```text
Weds 5pm PT / 8pm ET
```

## Setup

Install dependencies and build the fast JavaScript bundle:

```zsh
npm install
npm run build
```

Then follow the Quick Action setup in [SHORTCUT.md](SHORTCUT.md).

## Usage

The macOS Quick Action runs the repository-local helper script:

```zsh
./shortcut-quick-action.sh
```

The script reads selected text from stdin and writes replacement text to stdout.

## Attribution

Portions of this project are derived from Raycast's MIT-licensed `time-converter` extension. See [NOTICE.md](NOTICE.md).
