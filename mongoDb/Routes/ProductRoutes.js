
import express from 'express';
import {ProductController} from '../controllers/ProductController.js';
import {adminverify} from '../middlewares/verifyauth.js';
const router = express.Router();

router.post('/addNewProduct', adminverify, ProductController.AddProduct);
router.get('/getProduct', ProductController.getProduct);
router.post('/updateProduct/:id', adminverify, ProductController.updateProduct);
router.delete('/deleteProduct/:id', adminverify, ProductController.deleteProduct);

export default router;
