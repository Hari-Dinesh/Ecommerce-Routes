const {dashboardData,Order,userDashBoard,dateDashboard}=require('../controllers/OrderController')
const router=require('express').Router()
router.post('/OrderDetails',Order)
router.post('/OrderDashboard',dashboardData)
router.post('/Userdash',userDashBoard)
router.post('/datedash',dateDashboard)
module.exports=router