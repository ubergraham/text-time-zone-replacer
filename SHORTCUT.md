# macOS Shortcut Quick Action

This option uses Apple's built-in Shortcuts app. It takes selected text, sends
it to the converter, and replaces the selected text with the result.

Example:

```text
Weds 5pm
```

becomes:

```text
Weds 5pm (PT) / 8pm (ET)
```

## Before You Start

First run this once from Terminal:

```zsh
cd /path/to/text-time-zone-replacer
npm install
npm run build
```

## Create the Shortcut

1. Create a new shortcut named `Convert PT to ET`.
2. Open Shortcut Details.
3. Enable `Use as Quick Action`.
4. Set `Receive` to `Text`.
5. Add a `Run Shell Script` action.
6. Set `Shell` to `/bin/zsh`.
7. Set `Input` to `Shortcut Input`.
8. Set `Pass Input` to `to stdin`.
9. Paste this script:

```zsh
/path/to/text-time-zone-replacer/shortcut-quick-action.sh
```

10. Add `Stop and Output` with the shell script result.
11. In System Settings, assign a keyboard shortcut under `Keyboard > Keyboard Shortcuts > Services`.

## Change the Time Zones

Open this file:

```text
shortcut-quick-action.sh
```

Near the top, you will see:

```zsh
SOURCE_ZONE="PT"
OUTPUT_ZONES="PT, ET"
```

`SOURCE_ZONE` means “how should the original text be interpreted?”

`OUTPUT_ZONES` means “which time zones should be shown?”

For example, to show Pacific, Eastern, and Central European Time:

```zsh
OUTPUT_ZONES="PT, ET, CET"
```

Common aliases include `PT`, `ET`, `CT`, `MT`, `UTC`, `GMT`, `CET`, and `JST`.
Advanced users can also use full time zone names like `Europe/London`.

## Use It

Select `Weds 5pm`, run the Quick Action, and macOS should replace it with:

```text
Weds 5pm (PT) / 8pm (ET)
```
