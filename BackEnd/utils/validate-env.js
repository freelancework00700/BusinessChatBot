import { cleanEnv, port, str } from "envalid";

export default cleanEnv(process.env, {

    // API port
    PORT: port(),

    // Server Environment
    NODE_ENV: str(),

    // Database Configuration
    MYSQL_HOST: str(),
    MYSQL_USER: str(),
    MYSQL_PASSWORD: str(),
    MYSQL_PORT: port(),

    SECRET_KEY: str(),
});