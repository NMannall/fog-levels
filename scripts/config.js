// Register logging levels with dev-mode module
Hooks.once('devModeReady', ({ registerPackageDebugFlag }) => {    
    registerPackageDebugFlag(CONFIG.FogLevels.MODULE_ID, 'level');
});

// Config on initialisation
Hooks.once('init', async function() {

    CONFIG.FogLevels = {
        MODULE_ID: "fog-levels"
    }

    Hooks.callAll("fogLevelsInit", CONFIG.FogLevels);
    Hooks.callAll("fogLevelsReady", CONFIG.FogLevels);
});

// Display pop-up to GM
Hooks.once('ready', async function() {

    // Module title
    const MODULE_ID = CONFIG.FogLevels.MODULE_ID;
    const MODULE_TITLE = game.modules.get(MODULE_ID).data.title;
  
    const FALLBACK_MESSAGE_TITLE = MODULE_TITLE;
    const FALLBACK_MESSAGE = `<large>
    <p><strong>Welcome to the Fog Levels module</strong></p>`;
  
    // Settings key used for the "Don't remind me again" setting
    const DONT_REMIND_AGAIN_KEY = "popup-dont-remind-again";

    // Dialog code
    game.settings.register(MODULE_ID, DONT_REMIND_AGAIN_KEY, {
        name: "",
        default: false,
        type: Boolean,
        scope: "world",
        config: false,
    });
    if (game.user.isGM && !game.settings.get(MODULE_ID, DONT_REMIND_AGAIN_KEY)) {
        new Dialog({
            title: FALLBACK_MESSAGE_TITLE,
            content: FALLBACK_MESSAGE,
            buttons: {
                ok: { icon: '<i class="fas fa-check"></i>', label: "Understood" },
                dont_remind: {
                    icon: '<i class="fas fa-times"></i>',
                    label: "Don't remind me again",
                    callback: () => game.settings.set(MODULE_ID, DONT_REMIND_AGAIN_KEY, true),
                },
            },
        }).render(true);
    }

    game.settings.set(MODULE_ID, DONT_REMIND_AGAIN_KEY, false)
});