import express from 'express';
import {
  saveOrUpdateCategory,
  getAllCategories,
  getCategoryById,
  deleteCategory,
} from '../controllers/category.controller.js';

const router = express.Router();

// Create or Update (by _id or name)
router.post('/', saveOrUpdateCategory);
router.put('/', saveOrUpdateCategory);

// Read
router.get('/', getAllCategories);
router.get('/:id', getCategoryById);

// Delete
router.delete('/:id', deleteCategory);

export default router;
