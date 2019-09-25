import { getLogger } from "./logger.util";
import * as colors from "colors";

const logger = getLogger("JsonUtil");

/**
 * Verifica que el JSON no tenga elementos sin definir ( en estado undefined)
 * @param {JSON} json elemendo de entrada para ser verificado
 */
export function isFullDefined(json) {
  let nodeFail = new Array();
  for (let node in json) {
    let nodeType = elementType(json[node]);
    switch (nodeType) {
      case "string":
        logger.info(`${node} is ${"configured".green}`);
        break;
      case "undefined":
        logger.fatal(`${node} is ${"not configured".red}`);
        nodeFail.push(node);
        break;
      case "number":
        logger.info(`${node} is ${"configured".green}`);
        break;
      case "array":
        logger.info(`${node} is ${"configured".green}`);
        break;
      case "object":
        logger.info(`Checking sub nodes for ${node}`.cyan);
        if (!isFullDefined(json[node])) {
          nodeFail.push(node);
        }
        break;
    }
  }
  if (nodeFail.length > 0) {
    return false;
  } else {
    return true;
  }
}

/**
 * Identifica el tipo de objecto del elemento: null,undefined,strgin, array, number, object
 * @param {*} element elemento para ser identificado
 */
export function elementType(element) {
  let string = "string".constructor;
  let array = [].constructor;
  let object = {}.constructor;

  if (element === null) {
    return "null";
  } else if (element === undefined) {
    return "undefined";
  } else if (element.constructor === string) {
    return "string";
  } else if (element.constructor === array) {
    return "array";
  } else if (element.constructor === object) {
    return "object";
  } else if (typeof element === typeof 1) {
    return "number";
  } else {
    return "I dont know";
  }
}
