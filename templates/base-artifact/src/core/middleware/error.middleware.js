import { getLogger } from "#util/logger.util";
import { responseBuilder } from "#util/response.util";
import { getCodeApi } from '#util/codes.util';
import GENERAL_CODES from "../../config/general-codes.json"

const logger = getLogger("ErrorMiddleware");
const apiCodes = getCodeApi(GENERAL_CODES,'GEN');

/**
 * Manejo de errores genericos
 * @param {object} app - Instancia del servidor.
 */
export function handleGenericErrors() {
  logger.info(
    "El manejador de errores ahora se registra para manejar todos los errores."
  );

  app.use(ErrorMiddleware.catchGenericError);
  app.use(ErrorMiddleware.catchNotFoundError);

  process.on("uncaughtException", ErrorMiddleware.catchUncaughtException);
}

/**
 * Captura de error genérico
 * @param {JSON} err - Error HTTP de la función de middleware, denominado "err" por convención.
 * @param {JSON} req - Solicitud HTTP a la función de middleware, denominado "req" por convención.
 * @param {JSON} res - Respuesta HTTP a la función de middleware, denominado "res" por convención.
 * @param {JSON} next - Devolución de llamada a la función de middleware, denominado "next" por convención.
 */
export function catchGenericError(err,req, res, next) {
  responseBuilder("0002", apiCodes,err,res);
}

/**
 * Captura de error por ruta no encontrada
 * @param {JSON} req - Solicitud HTTP a la función de middleware, denominado "req" por convención.
 * @param {JSON} res - Respuesta HTTP a la función de middleware, denominado "res" por convención.
 */
export function catchNotFoundError(req, res, next) {
  if (!req.route) {
    responseBuilder("0000", apiCodes,{},res);
  }
}
