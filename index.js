import DB_connect from "./dbs.js";
import userRoutes from './routes/routes.js';
import sessionRoutes from './routes/sessionRouter.js';
import promptRoutes from './routes/promptRouter.js';

import express from "express";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
dotenv.config();


const log = {
    info: (msg, ...args) => console.log(`[INFO] ${msg}`, ...args),
    error: (msg, ...args) => console.log(`[ERROR] ${msg}`, ...args),
    debug: (msg, ...args) => process.env.NODE_ENV === "development" && console.log(`[DEBUG] ${msg}`, ...args)
};

// Initilizing express app.
const app = express();
const port = process.env.PORT;

// database connection
const db = new DB_connect(
    process.env.DB_PORT,
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS
);

await db.connect();
app.locals.models = db.models;

//routers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(express.static(path.resolve(
//     path.dirname(fileURLToPath(import.meta.url)),
//     "../front-end/static"
// )));
app.use('/', userRoutes);
app.use('/Session', sessionRoutes);
app.use('/', promptRoutes);

//Innitiating a the express app.
app.listen(port, ()=> {
    log.info(`Example app listening at http://localhost:${port}`);
});