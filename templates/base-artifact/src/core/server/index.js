import express from "express";

import { getLogger } from "#util/logger.util";
import { isFullDefined } from "#util/json.util";

import { catchGenericError, catchNotFoundError } from "#middleware/error.middleware.js";

import helmet from "helmet";
import pkj from "../../../package.json";
import * as CONFIG from "#config";
import Router from "./router.js";
import * as colors from "colors";

const logger = getLogger("Server");

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";

/**
 * Carga las rutas de las API a servidor
 * @param {express.Express} app
 */
function loadRouters(app) {
  let router = new Router();
  let basePath = buildBasePath();
  app.use(basePath, router);
  logger.info("Rutas cargadas con path base=", basePath);
}

/**
 * Inicia el servidor cargando sus configuraciones
 */
function starServer() {
  logger.info("Iniciando ".concat(pkj.artifactType, " ", pkj.name));
  let app = express();
  logger.info("Configurando servidor");
  configServer(app);
  logger.info("Cargando Rutas");
  loadRouters(app);
  app.use(catchGenericError);
  app.use(catchNotFoundError);
  logger.info("Configurando puerto ", CONFIG.GENERAL_CONFIG.PORT);
  app.listen(CONFIG.GENERAL_CONFIG.PORT);
  logger.info("".concat(pkj.artifactType, " ", pkj.name, " iniciado"));
}

/**
 * Agrega configuraciones al servidor
 * @param {*} app
 */
function configServer(app) {
  app.use(helmet());
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
}

/**
 * Crea el path para la API del artefacto con el formato:
 * [tipo_artefacto]/v[version]/[nombre_artefacto]
 * @returns {string} path base.
 */
function buildBasePath() {
  let artifactType = pkj.artifactType;
  let version = pkj.version.split(".")[0];
  let name = pkj.name;

  let path = "/".concat(artifactType, "/v", version, "/", name);
  return path;
}

function validateConfig(config) {
  logger.info("#########################".cyan);
  logger.info("Checking configs".cyan);
  let valid = isFullDefined(config)
  if (valid) {
    logger.info("Checking configs done".cyan);
    logger.info("#########################".cyan);
  } else {
    logger.fatal("Can't start artifact, exist configs not settings".bgRed);
    logger.info("#########################".cyan);
  }
  return valid;
}

/**
 * Funcion main de arranque de servidor
 */
function main() {
  if (validateConfig(CONFIG)) {
    starServer();
  } else {
    return;
  }
}

main();
