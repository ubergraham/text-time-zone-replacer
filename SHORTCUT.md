# macOS Shortcut Quick Action

Create this in the Shortcuts app:

First run this once from Terminal:

```zsh
cd /path/to/text-time-zone-replacer
npm install
npm run build
```

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

Usage:

Select `Weds 5pm`, run the Quick Action, and macOS should replace it with:

```text
Weds 5pm PT / 8pm ET
```
