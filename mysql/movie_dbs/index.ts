import express from "express";
// import { client } from "./db.js";
import { Admin } from './entities/admin.ts';
import { Movie } from './entities/movies.ts';
import { Token } from './entities/tokens.ts';
import "reflect-metadata";
import { createConnection } from "typeorm";
// import { jwtHelper } from "./helpers/jwt_helper.js";
import movieRoutes from "./routes/movieRoutes.ts";
import authRoutes from './routes/authRoutes.ts';
// import lithium from "./routes/lithiumRoutes.js";
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());
const port = 5050;

createConnection({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "root",
    password: "root",
    database: "movies",
    entities: [Admin, Movie, Token],
    synchronize: true,
    logging: false,
}).then(() => {
    console.log("Connected to the database");
    app.use('/movies', movieRoutes);
    app.use('/api', authRoutes);
    // app.use('/car', lithium)
    app.listen(port, () => {
        console.log(`Running on port ${port}`);//
    });
}).catch((error: Error) => {
    console.log(error.message);
});
