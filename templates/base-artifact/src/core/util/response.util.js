import { getLogger } from "./logger.util";
import Response from "../domain/response";
import pkge from "../../../package.json"

const logger = getLogger("ResponseUtil");

/**
 * Crea una respuesta de salida para el artefacto
 * 
 * @param {String} code codigo de respuesta 
 * @param {JSON} apiCodes JSON con los codigos del api
 * @param {JSON} data JSON con payload
 * @param {*} res callback response de peticion HTTP
 */
export function responseBuilder(code,apiCodes,data,res) {
    let codegroup = apiCodes.codeGroup.filter(group => group.code == code);
    if(codegroup.length > 1){
        logger.error(`codigo [${code}] duplicado en grupo de codigos [${apiCodes.apiCode}]`);
    }
    codegroup = codegroup[0];
    let codeResponse = `${pkge.code}.${apiCodes.apiCode}.${codegroup.code}`;
    let response =  new Response(codegroup.httpStatus,codeResponse,codegroup.message,data);
    res.status(response.getStatusCode()).json(response.getBody());
}