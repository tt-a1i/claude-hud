# Claude HUD (Custom Fork)

A customized fork of [jarrodwatts/claude-hud](https://github.com/jarrodwatts/claude-hud) — a Claude Code statusline plugin showing context usage, tool activity, agent tracking, and todo progress.

This fork adds several display customization options for a cleaner, more compact HUD.

## What's New in This Fork

### Compact Model Name

Shorten the model display name for a cleaner look.

| Config | Before | After |
|--------|--------|-------|
| `display.compactModelName: true` | `[Opus 4.6 (1M context)]` | `[Opus 1M]` |

### Inline Context

Move the context percentage to line 1 (next to the model name), eliminating the separate context line.

| Config | Before | After |
|--------|--------|-------|
| `display.showContextInline: true` | Line 2: `Context █████░░░░░ 45%` | Line 1: `[Opus 1M] │ 45% │ my-project` |

### Git Branch Icon

Replace `git:(main*)` with a branch icon and parentheses.

| Config | Before | After |
|--------|--------|-------|
| `display.gitUseIcon: true` | `my-project git:(main*)` | `my-project ( main*)` |

### Hide Reset Time

Remove the "resets in ..." text from usage display.

| Config | Before | After |
|--------|--------|-------|
| `display.showResetTime: false` | `14% (resets in 3h 22m / 5h)` | `5h: 14%` |

### Hide Progress Bars

Remove the visual progress bars from context and/or usage display.

| Config | Before | After |
|--------|--------|-------|
| `display.showContextBar: false` | `Context █████░░░░░ 45%` | `Context 45%` |
| `display.usageBarEnabled: false` | `██░░░░░░░░ 14% (resets in ...)` | `5h: 14%` |

### Custom Bar Width

Set a fixed width for all progress bars instead of auto-detecting from terminal width.

| Config | Effect |
|--------|--------|
| `display.barWidth: 0` | Auto-detect (default: 4-10 based on terminal width) |
| `display.barWidth: 6` | Fixed 6-character bars: `██████░░░░░░` |
| `display.barWidth: 20` | Wider bars for large terminals |

### Hide Project / Git

Hide the project name and/or git branch entirely.

| Config | Effect |
|--------|--------|
| `display.showProject: false` | Hide project directory name |
| `gitStatus.enabled: false` | Hide git branch info |

---

## Full Comparison

```
Default:
[Opus 4.6 (1M context)] │ my-project git:(main*)
Context █████░░░░░ 45% │ Usage ██░░░░░░░░ 14% (resets in 3h 22m / 5h) | ██░░░░░░░░ 1% (resets in 6d 22h / 7d)

Compact:
[Opus 1M] │ 45% │ my-project ( main*)
Usage 5h: 14% | 7d: 1%

Minimal:
[Opus 1M] │ 45%
Usage 5h: 14%
```

---

## All Fork Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `display.showContextInline` | boolean | `false` | Context % on project line instead of separate line |
| `display.compactModelName` | boolean | `false` | Shorten model name (e.g. "Opus 1M") |
| `display.gitUseIcon` | boolean | `false` | Branch icon `` instead of `git:()` |
| `display.showResetTime` | boolean | `true` | Show/hide "resets in ..." on usage |
| `display.barWidth` | number | `0` | Fixed bar width (0 = auto, 1-30 = fixed) |

These work alongside all existing upstream options:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `lineLayout` | string | `expanded` | `expanded` (multi-line) or `compact` (single line) |
| `pathLevels` | 1-3 | `1` | Directory levels to show in project path |
| `display.showModel` | boolean | `true` | Show model name `[Opus]` |
| `display.showProject` | boolean | `true` | Show project directory name |
| `display.showContextBar` | boolean | `true` | Show context progress bar |
| `display.contextValue` | string | `percent` | `percent`, `tokens`, `remaining`, or `both` |
| `display.showUsage` | boolean | `true` | Show usage limits |
| `display.usageBarEnabled` | boolean | `true` | Show usage progress bars |
| `display.showTools` | boolean | `false` | Show tool activity line |
| `display.showAgents` | boolean | `false` | Show agent status line |
| `display.showTodos` | boolean | `false` | Show todo progress line |
| `display.showDuration` | boolean | `false` | Show session duration |
| `display.showSpeed` | boolean | `false` | Show output token speed |
| `display.showConfigCounts` | boolean | `false` | Show CLAUDE.md/rules/MCP counts |
| `display.showSessionName` | boolean | `false` | Show session name |
| `display.showTokenBreakdown` | boolean | `true` | Show token details at high context |
| `display.showMemoryUsage` | boolean | `false` | Show system memory stats |
| `gitStatus.enabled` | boolean | `true` | Show git branch |
| `gitStatus.showDirty` | boolean | `true` | Show `*` for uncommitted changes |
| `gitStatus.showAheadBehind` | boolean | `false` | Show `↑N ↓N` ahead/behind |
| `gitStatus.showFileStats` | boolean | `false` | Show file change counts |

See [upstream README](https://github.com/jarrodwatts/claude-hud) for full documentation on colors, thresholds, and advanced config.

---

## Example Configs

### Compact (recommended)

```json
{
  "lineLayout": "expanded",
  "display": {
    "showContextBar": false,
    "showContextInline": true,
    "compactModelName": true,
    "showResetTime": false,
    "gitUseIcon": true,
    "usageBarEnabled": false
  }
}
```

### Minimal (context + usage only)

```json
{
  "lineLayout": "expanded",
  "display": {
    "showContextBar": false,
    "showContextInline": true,
    "compactModelName": true,
    "showProject": false,
    "usageBarEnabled": false,
    "showResetTime": false
  },
  "gitStatus": { "enabled": false }
}
```

### Full with custom bar width

```json
{
  "lineLayout": "expanded",
  "display": {
    "compactModelName": true,
    "gitUseIcon": true,
    "barWidth": 15,
    "showTools": true,
    "showAgents": true,
    "showTodos": true
  }
}
```

---

## Install

Clone and point your statusline at the local source:

```bash
git clone https://github.com/tt-a1i/claude-hud.git ~/.claude/plugins/cache/claude-hud-custom
```

Configure `~/.claude/settings.json` (adjust runtime path as needed):

```json
{
  "statusLine": {
    "type": "command",
    "command": "bun --env-file /dev/null ~/.claude/plugins/cache/claude-hud-custom/src/index.ts"
  }
}
```

Config file: `~/.claude/plugins/claude-hud/config.json`

Restart Claude Code after updating settings.

---

## License

MIT — see [LICENSE](LICENSE)

## Credits

Based on [claude-hud](https://github.com/jarrodwatts/claude-hud) by Jarrod Watts.
