import * as express from "express";
import { getLogger } from "#util/logger.util";

//Import controllers Here --

const logger = getLogger("{{pascalCase moduleName}}Module");

export default class {{pascalCase moduleName}}Module {
  constructor() {
    logger.trace("Instanciando {{pascalCase moduleName}}Module");
    this.route = express.Router();
    this.apiLoad(this.route);
    return this.route;
  }

    /**
   * Carga metodos de los controladores
   */
  apiLoad(route){
		
  }

}
