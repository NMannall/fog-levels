import { log } from './log.js'

// Main control hook. Resets FoW when token elevation changes.
// TODO: Save FogExploration per level.
Hooks.on("updateToken", (token, updates) => {
    if(game.user.isGM) return;
    if(token.isOwner && "elevation" in updates) {
        canvas.fog._handleReset();
    }
});
