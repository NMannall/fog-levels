Object.defineProperty(FogExploration.prototype, "elevation", {
    get: function () {
        return this.flags?.fogLevels?.elevation;
    },
    set: function (value) {
        this.updateSource({
            flags: { fogLevels: { elevation: value } },
        });
    }
});

// Register logging levels with dev-mode module
Hooks.once('devModeReady', ({ registerPackageDebugFlag }) => {
    registerPackageDebugFlag("fog-levels", "level");
});

// Config on initialisation
Hooks.once('init', async function() {

    CONFIG.FogLevels = {
        MODULE_ID: "fog-levels"
    }

    Hooks.callAll("fogLevelsInit", CONFIG.FogLevels);

    libWrapper.register(
        CONFIG.FogLevels.MODULE_ID,
        'FogExploration.get', async function (wrapped, ...args) {
            console.log('FogLevels | canvas.fog.exploration.get was called');
            const collection = game.collections.get("FogExploration");
            const sceneId = (args[0]?.scene || canvas.scene)?.id || null;
            const userId = (args[0]?.user || game.user)?.id;
            const elevation = CONFIG.Levels?.currentToken?.document?.elevation;
            if ( !sceneId || !userId || elevation === undefined) return null;
            if ( !(game.user.isGM || (userId === game.user.id)) ) {
                throw new Error("FogLevels | You do not have permission to access the FogExploration object of another user");
            }
            
            console.log("FogLevels | args: ", args);
            console.log("FogLevels | sceneId: ", sceneId);
            console.log("FogLevels | userId: ", userId);
            console.log("FogLevels | elevation: ", elevation);

            // Return cached exploration
            let exploration = collection.find(x => (x.user.id === userId) && (x.scene.id === sceneId) && (x.elevation == elevation));
            if ( exploration ) {
                console.log("FogLevels | Found cached exploration");
                return exploration;
            }

            // Return persisted exploration
            let options = args[1] || {};
            const response = await this.database.get(this, {
                query: {scene: sceneId, user: userId},
                options: options
            });
            const explorations = response.filter(x => {
                return x.elevation === elevation;
            })
            exploration = explorations.length ? explorations.shift() : null;
            if ( exploration ) {
                console.log("FogLevels | Found persisted exploration");
                collection.set(exploration.id, exploration);
            } else {
                console.log("FogLevels | Found no exploration");
            }
            return exploration;
        },        
        'OVERRIDE'
    );

    Hooks.callAll("fogLevelsReady", CONFIG.FogLevels);
});

// Display pop-up to GM
// TODO: Add setting to display this again once "Don't remind me again" has been clicked
// TODO: Add actual useful information on here/notify an update is available.
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
});