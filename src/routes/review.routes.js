import express from 'express';
import {
  saveOrUpdateReview,
  getReviewsByProduct,
  deleteReview,
} from '../controllers/review.controller.js';

const router = express.Router();

router.post('/', saveOrUpdateReview);
router.put('/', saveOrUpdateReview);
router.get('/product/:productId', getReviewsByProduct);
router.delete('/:id', deleteReview);

export default router;
