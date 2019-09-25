import MongoHelper from '#helpers/mongo.helper';
import { getLogger } from "#util/logger.util";
import { MONGO_CONFIG } from "#config";


const logger = getLogger("{{pascalCase modelName}}Model");
const schema = {}
export default class {{pascalCase modelName}}Model {

    constructor() {
        logger.trace("Instanciando {{pascalCase modelName}}Model");
        this.conn = new MongoHelper();
        this.conn.configConection(MONGO_CONFIG);
    }

}