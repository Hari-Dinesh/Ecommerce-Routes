const {dashboardData,Order}=require('../controllers/OrderController')
const router=require('express').Router()
router.post('/OrderDetails',Order)
router.post('/OrderDashboard',dashboardData)
module.exports=router