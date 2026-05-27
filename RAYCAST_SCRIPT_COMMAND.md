# Raycast Script Command

This branch includes a lightweight Raycast Script Command for the default
selected-text workflow:

```text
Weds 5pm
```

becomes:

```text
Weds 5pm (PT) / 8pm (ET)
```

## Setup

Build the bundled JavaScript converter:

```zsh
npm install
npm run build
```

In Raycast, add this folder as a Script Commands directory:

```text
raycast-scripts
```

Then assign a hotkey to `Replace Selected Time Zones`.

## Configure Output Zones

Edit the variables at the top of
`raycast-scripts/replace-selected-time-zones.sh`:

```zsh
SOURCE_ZONE="PT"
OUTPUT_ZONES="PT, ET"
```

`SOURCE_ZONE` controls how natural-language input is interpreted. For example,
`Weds 5pm` is read as Pacific time by default.

`OUTPUT_ZONES` controls the rendered output. It is a comma-separated list of
time zone aliases, such as:

```zsh
OUTPUT_ZONES="PT, ET, CET"
```

The source zone entry preserves the original selected text and adds its label.
Other zones are formatted as converted times.

Common aliases include `PT`, `ET`, `CT`, `MT`, `UTC`, `GMT`, `CET`, and `JST`.
Advanced users can also use full time zone names like `Europe/London`, or a
custom label like `London=Europe/London`.
