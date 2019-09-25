//-->Import libs Here:
import * as express from "express";
import { getLogger } from "#util/logger.util";

//-->Import Configs Here:
import pkgjson from "../../../package.json";

//-->Import Routers Here:

const logger = getLogger("Router");

export default class Router {
  constructor() {
    this.route = express.Router();
    this.version(this.route);
    this.loadModules(this.route);
    return this.route;
  }

  /**
   * Response the aartifact's version
   * @param {express.Router} route
   */
  version(route) {
    route.get("/version", (req, res) => {
      res.status(200).json(pkgjson.version);
    });
  }

    /**
   * Load routers from modules
   */
  loadModules(route){
  }
  
}
