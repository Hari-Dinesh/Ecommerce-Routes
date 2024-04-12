import {OrderController} from '../controllers/OrderController.js'
import {adminverify} from '../middlewares/verifyauth.js';
import {verifyUser} from '../middlewares/verifyauthUser.js';
import express from 'express';
const router = express.Router();
router.post('/user/placeOrder',verifyUser,OrderController.Order)
router.post('/admin/OrderDashboard',adminverify,OrderController.dashboardData)
router.post('/user/MyOrder',verifyUser,OrderController.Myorder)
router.get('/admin/OrderDetails',adminverify,OrderController.adminOrders)
router.post('/admin/updateOrderDetails/:oid',adminverify,OrderController.updateOrderDetails)
router.post('/user/updatedetails',verifyUser,OrderController.updateUserDetails)
router.post('/user/addcart',verifyUser,OrderController.addtoUserCart)
router.post('/user/checkOutCart/:id',verifyUser,OrderController.placeMyCart)
export default router;