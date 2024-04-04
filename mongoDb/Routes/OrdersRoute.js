import {OrderController} from '../controllers/OrderController.js'
import {adminverify} from '../middlewares/verifyauth.js';
import {verifyUser} from '../middlewares/verifyauthUser.js';
import express from 'express';
const router = express.Router();
router.post('/Order',verifyUser,OrderController.Order)
router.post('/OrderDashboard',adminverify,OrderController.dashboardData)
router.post('/MyOrder',verifyUser,OrderController.Myorder)
router.post('/updateOrderDetails',adminverify,OrderController.adminOrders)
router.post('/updateOrderDetails/:oid',adminverify,OrderController.updateOrderDetails)
export default router;