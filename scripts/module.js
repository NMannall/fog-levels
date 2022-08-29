import { log } from './log.js'

// Main control hook. Resets FoW when token elevation changes.
// TODO: Save FogExploration per level.
Hooks.on("updateToken", (token, updates) => {
    if(token.object._controlled) return;
    if("elevation" in updates) {
        log.info(`Token '${token.data._id}' set elevation to '${token.data.elevation}'`);

        let fogExploration = canvas.sight.exploration;
        if (fogExploration.id) {
            log.info(`Deleting saved FogExploration '${fogExploration.id}'`);
            fogExploration.delete();
        }
        canvas.sight._handleResetFog();
    }
});
