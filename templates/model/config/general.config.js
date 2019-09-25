export const MONGO_CONFIG = {
    username: process.env.MONGO_USER,
    password: process.env.MONGO_PASS,
    database: process.env.MONGO_DB,
    host: [
        process.env.MONGO_HOST
    ],
    options: {
        replicaSet: process.env.MONGO_RS,
        poolSize: 5
    }
}
