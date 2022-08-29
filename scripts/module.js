// SPDX-FileCopyrightText: 2020 Cody Swendrowski
//
// SPDX-License-Identifier: MIT
import { log } from './log.js'

Hooks.on("updateToken", (token, updates) => {
    if(!canvas.tokens.get(token.id)?._controlled) return;
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

// Hooks.on('levelsOnElevationChangeUpdate', async function(_, token) {
//     let fogExploration = canvas.sight.exploration;

//     if (canvas.sight.pending.children.length > 1 || fogExploration.id) {
//         log.info(`Token '${token.data._id}' set elevation to '${token.data.elevation}'`);

//         if (fogExploration.id) {
//             log.info(`Deleting saved FogExploration '${fogExploration.id}'`);
//             fogExploration.delete();
//         }
//         canvas.sight._handleResetFog();
//     } 
// });
