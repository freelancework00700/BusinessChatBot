import 'dotenv/config';
import { App } from './app.js';
import env from "./utils/validate-env.js";
import { config } from './config/config.js';
import { Sequelize } from 'sequelize';
import { initMySQLModels } from './models/index.js';

const app = new App();

const port = env.PORT;

// Get database configuration
const environment = env.NODE_ENV;
const databaseConfiguration = config[environment];

export let sequelize = Sequelize;

try {
    (async () => {
        // Create database connection
        const dbConfiguration = {
            ...databaseConfiguration,
            database: undefined
        }

        // Create a database if it not exists
        sequelize = new Sequelize(dbConfiguration);
        await sequelize.query(`CREATE DATABASE IF NOT EXISTS ${databaseConfiguration.database};`);
        sequelize = new Sequelize({ ...databaseConfiguration, logging: true});

        // Authenticate database connection and sync models
        await sequelize.authenticate();
        console.log('Database connection has been established successfully.');

        // Initialize models here
        initMySQLModels(sequelize);
        await sequelize.sync({ alter: true });
        console.log("Sequelize OK");

        // Start the server
        app.listen(port, () => {
            console.log(`Server listening on port ${port}.`);
        });
    })();
} catch (err) {
    console.log("Error: ", err);
    console.log('Unable to connect to the database.');
}