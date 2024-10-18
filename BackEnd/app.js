import express from "express";

const app = express();

app.use(express.json({ limit: '100mb' }));

app.get('/', (req, res) => {
    res.send('Server Works! ☘️');
});

export default app;