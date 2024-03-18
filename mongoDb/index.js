const express=require('express')
const app =express()
const mongoose=require('mongoose')
mongoose.connect('mongodb+srv://Dinesh:Asdfg123@cluster0.8pjuhmq.mongodb.net/Mongoln?retryWrites=true&w=majority&appName=Cluster0').then(()=>{
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

app.listen('5000',()=>{
    console.log("port running on 5000")
})
