import 'dotenv/config';
import app from './app.js';
import env from "./utils/validate-env.js";

const port = env.PORT;

app.listen(port, () => {
    console.log(`Server listening on port ${port}.`);
});