import { getLogger } from "./logger.util";

const logger = getLogger("ConfigValidator");

export default class ConfigValidator {
  
    /**
   *
   * @param {JSON} config estructura de configuracion
   */
  static validateConfig(config) {
    logger.info("Verificando variables de entorno");
    let configOK = new Array();
    let configFail = new Array();
    for (let node in config) {
      if (config[node]) {
        configOK.push(node);
      } else {
        configFail.push(node);
      }
    }
    for (let i in configOK) {
      logger.info("|_", configOK[i], "...done");
    }
    for (let i in configFail) {
      logger.fatal("|_", configFail[i], "...fail");
    }
    if (configFail.length > 0) {
      return false;
    } else {
      return true;
    }
  }
}
