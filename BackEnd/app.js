import express from "express";
import { Routes } from "./routes/index.js";
import cors from "cors";

export class App {
    express = express();
    routes = new Routes();
    
    constructor() {
        this.express.use(express.json({ limit: '100mb' }));

        //* Use to resolve cors error
        this.express.use(
            cors({
            origin: "*",
            methods: ["GET", "POST", "OPTIONS", "PUT", "PATCH", "DELETE"],
            allowedHeaders: [
                "Origin, X-Requested-With, Content-Type, Accept,Authorization, Access-Control-Allow-Headers, access-token, X-User-Ip",
            ],
            credentials: true,
            })
        );

        this.express.use('/api', this.routes.router);
        
        this.express.get('/', (req, res) => {
            res.send('Server Works! ☘️');
        });
    }

    listen(port, callback) {
        this.express.listen(port, callback);
    }
}
