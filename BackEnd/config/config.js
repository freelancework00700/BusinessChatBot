import env from '../utils/validate-env.js';

export const config = {
    development: {
        username: env.MYSQL_USER,
        password: env.MYSQL_PASSWORD,
        database: "business_chat_bot_dev",
        host: env.MYSQL_HOST,
        dialect: "mysql",
        logging: false,
        pool: {
            max: 1000, // Maximum number of connection in pool
            min: 0, // Minimum number of connection in pool
            acquire: 60_000, // The maximum time, in milliseconds, that pool will try to get connection before throwing error
            idle: 10_000,
        },
    },

    staging: {
        username: env.MYSQL_USER,
        password: env.MYSQL_PASSWORD,
        database: "business_chat_bot_dev",
        host: env.MYSQL_HOST,
        dialect: "mysql",
        logging: false,
        pool: {
            max: 1000, // Maximum number of connection in pool
            min: 0, // Minimum number of connection in pool
            acquire: 60_000, // The maximum time, in milliseconds, that pool will try to get connection before throwing error
            idle: 10_000,
        },
    },

    production: {
        username: env.MYSQL_USER,
        password: env.MYSQL_PASSWORD,
        database: "business_chat_bot_dev",
        host: env.MYSQL_HOST,
        dialect: "mysql",
        logging: false,
        pool: {
            max: 1000, // Maximum number of connection in pool
            min: 0, // Minimum number of connection in pool
            acquire: 60_000, // The maximum time, in milliseconds, that pool will try to get connection before throwing error
            idle: 10_000,
        },
    },
}