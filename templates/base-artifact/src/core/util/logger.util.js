import * as log4js from 'log4js';

export function getLogger(name) {
    log4js.configure({
        appenders: { NOGEN: { type: 'stdout' } },
        categories: { default: { appenders: ['NOGEN'], level: 'info' } }
    });
    return log4js.getLogger(name);
}

/**
 * Trasforma un error a un String de una linea.
 * @param {Error} error 
 * @returns {String} string de mensaje de error a una linea
 */
export function errorToOneLine(error){
    return "".concat(error).replace(/\r?\n|\r/g,"");
}