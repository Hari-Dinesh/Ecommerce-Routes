const {dashboardData,Order,Myorder,updateOrderDetails,adminOrders}=require('../controllers/OrderController')
const router=require('express').Router()
router.post('/Order',Order)
router.post('/OrderDashboard',dashboardData)
router.post('/MyOrder',Myorder)
router.post('/updateOrderDetails',adminOrders)
router.post('/updateOrderDetails/:oid',updateOrderDetails)
module.exports=router