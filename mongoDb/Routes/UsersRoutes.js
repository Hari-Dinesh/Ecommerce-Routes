import express from 'express';
import { UserController, AdminController } from '../controllers/usersController.js';
import {adminverify} from '../middlewares/verifyauth.js'
const router = express.Router();

router.post('/createuser', UserController.usersSigin);
router.post('/login', UserController.userLogin);
router.post('/refreshToken', UserController.refreshToken);
router.post('/logout', UserController.logout);
router.get('/:id', UserController.verify);
router.post('/admincreate', AdminController.adminCreate);
router.post('/adminlogin', AdminController.adminLogin);
router.post('/notify',adminverify, AdminController.notification);

export default router;
