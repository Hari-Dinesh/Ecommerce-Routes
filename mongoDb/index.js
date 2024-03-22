const express=require('express')
const app =express()
const mongoose=require('mongoose')
require("dotenv").config()
mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log('connected to the mongoose')
}).catch((err)=>{
    console.log(err)
})
app.use(express.json());
const userRoutes=require('./Routes/UsersRoutes')
app.use('/api',userRoutes)
const ItemROutes=require('./Routes/ItemRoutes')
app.use('/mess',ItemROutes)
const OrderRoutes=require('./Routes/OrdersRoute')
app.use('/ord',OrderRoutes)

app.listen(process.env.PORT,()=>{
    console.log(`port running on ${process.env.PORT}`)
})
