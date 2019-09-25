import { getLogger } from "#util/logger.util";
import mongoose from 'mongoose';
import { Validator } from 'jsonschema';

const logger = getLogger("MongoHelper");
let instance = null;
let db = null;


export default class MongoHelper {
    constructor() {
        if (!instance) {

            instance = this;
        }
        return instance;
    }

    /**
 * Configura la conexion a la base de datos MongoDB
 * @param {JSON} params elementos de conexion a mongo
 * 
 * @example
 * 
 * let params = {
 *     username: "usr",
 *     password: "123123",
 *     database: "database_name",
 *     host: [
 *         "localhost:27017",
 *     ],
 *     options: {
 *         replicaSet: "mongo-rs",
 *         poolSize: 5,
 *         connectTimeoutMS: 3000,
 *         socketTimeoutMS: 3000,
 *         bufferMaxEntries: 1,
 *         keepAliveInitialDelay: 3000,
 *         keepAlive: true
 *     }
 * }
 * 
 */
    configConection(params) {
        if (this.validateParams(params)) {
            this.uri = `mongodb://${params.username}:${params.password}@${params.host.join(",")}/${params.database}`;
            this.options = {
                useNewUrlParser: true,
                ...params.options
            };
        } else {
            throw new Error("Error en los parametros de configuracion");
        }
    }


    /**
   * Valida que el formato y la existencia de los elementos minimos de conexion
   * @param {JSON} params parametros de conexion y opciones.
   * @returns {boolean} true si es valido o false si no.
   */
    validateParams(params) {
        let v = new Validator();
        let schemma = {
            type: "Object",
            properties: {
                username: { type: "string" },
                password: { type: "string" },
                database: { type: "string" },
                host: { type: "array", items: { type: "string" } },
                options: {
                    trype: "object",
                    properties: {
                        replicaSet: { type: "string" },
                        poolSize: { type: "number" },
                        connectTimeoutMS: { type: "number" },
                        socketTimeoutMS: { type: "number" },
                        bufferMaxEntries: { type: "number" },
                        keepAliveInitialDelay: { type: "number" },
                        keepAlive: { type: "number" },
                    }
                }
            },
            required: ["username", "password", "database", "host"]
        }

        let resp = v.validate(params, schemma);
        if (!resp.valid) {
            logger.debug(resp.errors);
        }
        return resp.valid;
    }

    /**
   * Retorna una conexion de mongo si es que existe, de lo contrario crea una nueva.
   */
    async getConection() {
        if (!db) {
            return (db = await mongoose.createConnection(this.uri, this.options));
        } else {
            return db;
        }
    }

    /**
   * Cierra la conexión de mongo
   */
    closeConection() {
        db.close();
    }

    /**
   * Retorna el modelo de mongo si es que ya fue creado o crea uno nuevo en caso de ser primera vez.
   * @param {*} collectionName nombre de la colección
   * @param {*} schema esquema de la colección
   */
    async getModel(collectionName, schema) {
        let conn = await this.getConection();
        if (conn.models.hasOwnProperty(collectionName)) {
            return db.models[collectionName];
        } else {
            let mongoShema;
            if (Array.isArray(schema)) {
                mongoShema = new mongoose.Schema(...schema);
            } else {
                mongoShema = new mongoose.Schema(schema);
            }
            return conn.model(collectionName, mongoShema);
        }
    }

}