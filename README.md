# Claude HUD (Custom Fork)

A customized fork of [jarrodwatts/claude-hud](https://github.com/jarrodwatts/claude-hud) — a Claude Code statusline plugin showing context usage, tool activity, agent tracking, and todo progress.

This fork adds several display customization options for a cleaner, more compact HUD.

## What's New in This Fork

| Option | Default | Description |
|--------|---------|-------------|
| `display.showContextInline` | `false` | Show context % on the project line (line 1) instead of a separate line |
| `display.compactModelName` | `false` | Shorten model name, e.g. "Opus 4.6 (1M context)" → "Opus 1M" |
| `display.gitUseIcon` | `false` | Use branch icon `` instead of `git:()` |
| `display.showResetTime` | `true` | Set `false` to hide "resets in ..." from usage display |

Combined with the existing `showContextBar` and `usageBarEnabled` options, you can achieve a minimal look:

```
Before (default):
[Opus 4.6 (1M context)] │ my-project git:(main*)
Context █████░░░░░ 45% │ Usage ██░░░░░░░░ 14% (resets in 3h 22m / 5h) | ██░░░░░░░░ 1% (resets in 6d 22h / 7d)

After (compact config):
[Opus 1M] │ 45% │ my-project ( main*)
Usage 14% | 1%
```

### Recommended Compact Config

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

---

## Install

This is a custom fork. To use it, clone and point your statusline at the local source:

```bash
git clone https://github.com/tt-a1i/claude-hud.git ~/.claude/plugins/cache/claude-hud-custom
```

Then configure your `~/.claude/settings.json` statusline to point to the cloned source (adjust runtime path as needed):

```json
{
  "statusLine": {
    "type": "command",
    "command": "bun --env-file /dev/null ~/.claude/plugins/cache/claude-hud-custom/src/index.ts"
  }
}
```

Config file location: `~/.claude/plugins/claude-hud/config.json`

---

## All Options

All upstream options from [jarrodwatts/claude-hud](https://github.com/jarrodwatts/claude-hud) are supported. See the original README for the full list. The additions from this fork are listed above.

## License

MIT — see [LICENSE](LICENSE)

## Credits

Based on [claude-hud](https://github.com/jarrodwatts/claude-hud) by Jarrod Watts.
