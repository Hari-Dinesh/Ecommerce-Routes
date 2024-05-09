import pkg from 'pg';
const { Client } = pkg;
const client = new Client({
    user: "postgres",
    host: 'localhost',
    database: 'movies',
    password: 'root',
    port: 5432,
});


export { client };