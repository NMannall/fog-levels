import { log } from './log.js'

// Main control hook. Loads FoW for current token elevation.
Hooks.on("updateToken", async function (token, updates) {
    if(game.user.isGM) return;
    if(token.isOwner && "elevation" in updates) {
        log.info(`Token '${token.actorId}' set elevation to '${token.elevation}'`);
        await canvas.fog.commit();
        await canvas.fog.save();
        await canvas.fog.load();
        canvas.fog.exploration.elevation = token.elevation;
        return;
    }
    if (canvas.fog.exploration.elevation == null) {  // Attempt to load FoW if elevation for current FoW is null and set elevation.
        await canvas.fog.load();
        canvas.fog.exploration.elevation = token.elevation;
        return;
    }
});
