
import express from 'express';
import {ProductController} from '../controllers/ProductController.js';
import {adminverify} from '../middlewares/verifyauth.js';
const router = express.Router();

router.post('/admin/addNewProduct', adminverify, ProductController.AddProduct);
router.get('/getProduct', ProductController.getProduct);
router.post('/admin/updateProduct/:id', adminverify, ProductController.updateProduct);
router.delete('/admin/deleteProduct/:id', adminverify, ProductController.deleteProduct);

export default router;
