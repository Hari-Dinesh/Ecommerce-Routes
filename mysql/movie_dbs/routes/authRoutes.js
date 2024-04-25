import express from 'express'
import { Authenticate } from '../controllers/authControllers.js';
import { adminverify } from '../middlewares/verifyauth.js';
const router = express.Router();
router.post('/verifyLoginAdmin',Authenticate.adminLogin)
export default router