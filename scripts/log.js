import { propertyNameForValue } from './helpers.js'

export class log {
    constructor() {
        this.setHooks();
    }

    setHooks() {
        this.setHooks.on("fogLevelsInit"), () => {
            this.init();
        }
    }

    static init() {
        
    }

    static LogLevel = {
        NONE: 0,
        INFO: 1,
        ERROR: 2,
        DEBUG: 3,
        WARN: 4,
        ALL: 5,
    };

    static _log(level, data, force) {
        let MODULE_ID = CONFIG.FogLevels.MODULE_ID
        try {
            const allowedDebugLevel = game.modules.get('_dev-mode')?.api?.getPackageDebugValue(MODULE_ID, 'level')
            const shouldLog = force || allowedDebugLevel >= level;
      
            if (shouldLog) {
                console.log(`${MODULE_ID} | ${propertyNameForValue(this.LogLevel, level)} -- ${data}`);
            }
        } catch (e) {
            console.error(e.message);
        }
    }

    static info (data, force=false) {
        this._log(this.LogLevel.INFO, data, force);
    }

    static error (data, force=false) {
        this._log(this.LogLevel.ERROR, data, force);
    }

    static debug (data, force=false) {
        this._log(this.LogLevel.DEBUG, data, force);
    }

    static warn (data, force=false) {
        this._log(this.LogLevel.WARN, data, force)
    }
}