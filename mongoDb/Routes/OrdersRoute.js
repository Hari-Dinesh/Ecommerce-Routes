const {dashboardData,Order,Myorder}=require('../controllers/OrderController')
const router=require('express').Router()
router.post('/Order',Order)
router.post('/OrderDashboard',dashboardData)
router.post('/MyOrder',Myorder)
module.exports=router