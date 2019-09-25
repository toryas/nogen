import { getLogger } from "./logger.util";
import jp from 'jsonpath';

const logger = getLogger("CodesUtil");

/**
 * Retorna los codigos de un api
 * @param {JSON} moduleCode JSON conlos codigos del modulo
 * @param {String} apicode codigo de api 
 * @returns {JOSN} codgos de api
 */
export function getCodeApi(moduleCode,apicode){
    let codes = jp.query(moduleCode,`$.moduleApi[?(@.apiCode == '${apicode}')]`);
    if(codes.length === 1){
        return codes[0];
    }else{
        logger.fatal(`No se ecuentran codigos para api ${apicode}`);
        throw new Error(`No se ecuentran codigos para api ${apicode}`)
    }
}