import { log } from './log.js'

// Main control hook. Loads FoW for current token elevation.
Hooks.on("updateToken", async function (token, updates) {
    if(game.user.isGM) return;
    if(token.isOwner && "elevation" in updates) {
        log.info("Elevation changed");
        canvas.fog.commit();
        await canvas.fog.save();
        await canvas.fog._handleReset();

        return;
    }
});

Hooks.on("sightRefresh", async function (arg) {
    log.info(arg);
    if(game.user.isGM) return;
    if(canvas.fog.exploration == null || canvas.fog.exploration.elevation == null) {  // Attempt to load FoW if elevation for current FoW is null and set elevation.
        log.info("FoW undefined");
        await canvas.fog.load();
        canvas.fog.exploration.elevation = CONFIG.Levels.currentToken.document.elevation;
    }
    return;
});
