import { propertyNameForValue } from './helpers.js'

export class log {

    static LogLevel = {
        NONE: 0,
        INFO: 1,
        ERROR: 2,
        DEBUG: 3,
        WARN: 4,
        ALL: 5,
    };

    /**
    * Write to console in log format at the given level
    * @param {log.LogLevel} level Logging level
    * @param {string | any} data Message to be logged
    * @param {boolean} force Ignore logging level
    */
    static _log(level, data, force=false) {
        let MODULE_ID = CONFIG.FogLevels.MODULE_ID
        try {
            const allowedDebugLevel = game.modules.get('_dev-mode')?.api?.getPackageDebugValue(MODULE_ID, 'level')
            const shouldLog = force || allowedDebugLevel >= level;
      
            if (shouldLog) {
                let prefix = `${MODULE_ID} | ${propertyNameForValue(this.LogLevel, level)} --`;
                if (typeof data === 'string') console.log(`${prefix} ${data}`);
                else console.log(prefix, data);
            }
        } catch (e) {
            console.error(e.message);
        }
    }

    /**
     * Log message at info level
     * @param {string} data Message to be logged
     * @param {boolean} force Ignore logging level
     */
    static info (data, force=false) {
        this._log(this.LogLevel.INFO, data, force);
    }

    /**
     * Log message at error level
     * @param {string} data Message to be logged
     * @param {boolean} force Ignore logging level
     */
    static error (data, force=false) {
        this._log(this.LogLevel.ERROR, data, force);
    }

    /**
     * Log message at debug level
     * @param {string} data Message to be logged
     * @param {boolean} force Ignore logging level
     */
    static debug (data, force=false) {
        this._log(this.LogLevel.DEBUG, data, force);
    }

    /**
     * Log message at warn level
     * @param {string} data Message to be logged
     * @param {boolean} force Ignore logging level
     */
    static warn (data, force=false) {
        this._log(this.LogLevel.WARN, data, force)
    }
}