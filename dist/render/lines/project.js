import { getModelName, getProviderLabel, getContextPercent, getBufferedPercent, getTotalTokens } from '../../stdin.js';
import { getOutputSpeed } from '../../speed-tracker.js';
import { git as gitColor, gitBranch as gitBranchColor, label, model as modelColor, project as projectColor, red, custom as customColor, getContextColor, RESET } from '../colors.js';
export function renderProjectLine(ctx) {
    const display = ctx.config?.display;
    const colors = ctx.config?.colors;
    const parts = [];
    if (display?.showModel !== false) {
        let model = getModelName(ctx.stdin);
        if (display?.compactModelName) {
            model = compactifyModelName(model);
        }
        const providerLabel = getProviderLabel(ctx.stdin);
        const showUsage = display?.showUsage !== false;
        const hasApiKey = !!process.env.ANTHROPIC_API_KEY;
        const modelQualifier = providerLabel ?? (showUsage && hasApiKey ? red('API') : undefined);
        const modelDisplay = modelQualifier ? `${model} | ${modelQualifier}` : model;
        parts.push(modelColor(`[${modelDisplay}]`, colors));
    }
    if (display?.showContextInline) {
        const rawPercent = getContextPercent(ctx.stdin);
        const bufferedPercent = getBufferedPercent(ctx.stdin);
        const autocompactMode = display?.autocompactBuffer ?? 'enabled';
        const percent = autocompactMode === 'disabled' ? rawPercent : bufferedPercent;
        const contextValueMode = display?.contextValue ?? 'percent';
        const contextValue = formatInlineContextValue(ctx, percent, contextValueMode);
        parts.push(`${getContextColor(percent, colors)}${contextValue}${RESET}`);
    }
    let projectPart = null;
    if (display?.showProject !== false && ctx.stdin.cwd) {
        const segments = ctx.stdin.cwd.split(/[/\\]/).filter(Boolean);
        const pathLevels = ctx.config?.pathLevels ?? 1;
        const projectPath = segments.length > 0 ? segments.slice(-pathLevels).join('/') : '/';
        projectPart = projectColor(projectPath, colors);
    }
    let gitPart = '';
    const gitConfig = ctx.config?.gitStatus;
    const showGit = gitConfig?.enabled ?? true;
    if (showGit && ctx.gitStatus) {
        const gitParts = [ctx.gitStatus.branch];
        if ((gitConfig?.showDirty ?? true) && ctx.gitStatus.isDirty) {
            gitParts.push('*');
        }
        if (gitConfig?.showAheadBehind) {
            if (ctx.gitStatus.ahead > 0) {
                gitParts.push(` ↑${ctx.gitStatus.ahead}`);
            }
            if (ctx.gitStatus.behind > 0) {
                gitParts.push(` ↓${ctx.gitStatus.behind}`);
            }
        }
        if (gitConfig?.showFileStats && ctx.gitStatus.fileStats) {
            const { modified, added, deleted, untracked } = ctx.gitStatus.fileStats;
            const statParts = [];
            if (modified > 0)
                statParts.push(`!${modified}`);
            if (added > 0)
                statParts.push(`+${added}`);
            if (deleted > 0)
                statParts.push(`✘${deleted}`);
            if (untracked > 0)
                statParts.push(`?${untracked}`);
            if (statParts.length > 0) {
                gitParts.push(` ${statParts.join(' ')}`);
            }
        }
        if (display?.gitUseIcon) {
            gitPart = `${gitColor('(', colors)}${gitBranchColor(`\ue0a0 ${gitParts.join('')}`, colors)}${gitColor(')', colors)}`;
        }
        else {
            gitPart = `${gitColor('git:(', colors)}${gitBranchColor(gitParts.join(''), colors)}${gitColor(')', colors)}`;
        }
    }
    if (projectPart && gitPart) {
        parts.push(`${projectPart} ${gitPart}`);
    }
    else if (projectPart) {
        parts.push(projectPart);
    }
    else if (gitPart) {
        parts.push(gitPart);
    }
    if (display?.showSessionName && ctx.transcript.sessionName) {
        parts.push(label(ctx.transcript.sessionName, colors));
    }
    if (display?.showClaudeCodeVersion && ctx.claudeCodeVersion) {
        parts.push(label(`CC v${ctx.claudeCodeVersion}`, colors));
    }
    if (ctx.extraLabel) {
        parts.push(label(ctx.extraLabel, colors));
    }
    if (display?.showSpeed) {
        const speed = getOutputSpeed(ctx.stdin);
        if (speed !== null) {
            parts.push(label(`out: ${speed.toFixed(1)} tok/s`, colors));
        }
    }
    if (display?.showDuration !== false && ctx.sessionDuration) {
        parts.push(label(`⏱️  ${ctx.sessionDuration}`, colors));
    }
    const customLine = display?.customLine;
    if (customLine) {
        parts.push(customColor(customLine, colors));
    }
    if (parts.length === 0) {
        return null;
    }
    return parts.join(' \u2502 ');
}
function compactifyModelName(name) {
    // "Claude Opus 4.6 (1M context)" → "Opus 1M"
    // "Claude Sonnet 4.6 (200K context)" → "Sonnet 200K"
    const match = name.match(/(?:Claude\s+)?(\w+)[\s\d.]*\((\d+[KMG]?)\s*context\)/i);
    if (match) {
        return `${match[1]} ${match[2]}`;
    }
    // Fallback: strip "Claude " prefix and " context)" suffix
    return name.replace(/^Claude\s+/i, '').replace(/\s*\(\d+[KMG]?\s*context\)/i, '');
}
function formatTokens(n) {
    if (n >= 1000000) {
        return `${(n / 1000000).toFixed(1)}M`;
    }
    if (n >= 1000) {
        return `${(n / 1000).toFixed(0)}k`;
    }
    return n.toString();
}
function formatInlineContextValue(ctx, percent, mode) {
    const totalTokens = getTotalTokens(ctx.stdin);
    const size = ctx.stdin.context_window?.context_window_size ?? 0;
    if (mode === 'tokens') {
        return size > 0 ? `${formatTokens(totalTokens)}/${formatTokens(size)}` : formatTokens(totalTokens);
    }
    if (mode === 'both') {
        return size > 0 ? `${percent}% (${formatTokens(totalTokens)}/${formatTokens(size)})` : `${percent}%`;
    }
    if (mode === 'remaining') {
        return `${Math.max(0, 100 - percent)}%`;
    }
    return `${percent}%`;
}
//# sourceMappingURL=project.js.map