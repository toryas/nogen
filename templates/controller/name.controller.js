{{#if isApi}}
import { getLogger } from "#util/logger.util";
import { responseBuilder } from "#util/response.util";
import { getCodeApi } from '#util/codes.util'
{{else}}
import { getLogger } from "#util/logger.util";
import { responseBuilder } from "#util/response.util";
import { getCodeApi } from '#util/codes.util'
{{/if}}
import modulesCode from '../{{moduleName}}.codes.json'

const logger = getLogger("{{pascalCase controllerName}}Controller");
const apiCodes = getCodeApi(modulesCode,'#apiCode#');

export default class {{pascalCase controllerName}}Controller{
    constructor(){
        logger.trace("Create {{pascalCase controllerName}}Controller");
    }

    main(req,res){
        //TO DO..
    }

}