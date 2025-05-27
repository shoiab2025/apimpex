import { Router } from 'express';
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  adjustStock,
} from '../controllers/product.controller.js';

const router = Router();

router.post('/',        createProduct);
router.get('/',         getProducts);
router.get('/:id',      getProductById);
router.patch('/:id',    updateProduct);  // or put
router.delete('/:id',   deleteProduct);
router.patch('/:id/stock', adjustStock);

export default router;
