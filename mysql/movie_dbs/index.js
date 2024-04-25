import express from "express";
import { client } from "./db.js";
// import { jwtHelper } from "./helpers/jwt_helper.js";
import movieRoutes from "./routes/movieRoutes.js"
import authRoutes from './routes/authRoutes.js'
import lithium from "./routes/lithiumRoutes.js";
import dotenv from 'dotenv'
dotenv.config();
const app=express()
app.use(express.json())
const port =5050
client.connect().then(()=>{
    console.log("connected to the database");
    app.use('/movies',movieRoutes)
    app.use('/api',authRoutes)
    app.use('/car',lithium)
    app.listen(port,()=>{
        console.log(`running on  port ${port}`)
        
    })

}).catch((err)=>{
    console.log(err)
})