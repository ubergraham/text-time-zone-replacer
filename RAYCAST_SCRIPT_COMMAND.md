# Raycast Script Command

This branch includes a lightweight Raycast Script Command for the default
selected-text workflow:

```text
Weds 5pm
```

becomes:

```text
Weds 5pm PT / 8pm ET
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
SOURCE_ZONE="America/Los_Angeles"
OUTPUT_ZONES="PT=America/Los_Angeles,ET=America/New_York"
```

`SOURCE_ZONE` controls how natural-language input is interpreted. For example,
`Weds 5pm` is read as Pacific time by default.

`OUTPUT_ZONES` controls the rendered output. It is a comma-separated list of
`LABEL=IANA_TIME_ZONE` entries, such as:

```zsh
OUTPUT_ZONES="PT=America/Los_Angeles,ET=America/New_York,London=Europe/London"
```

The source zone entry preserves the original selected text and adds its label.
Other zones are formatted as converted times.
