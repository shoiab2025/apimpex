import express from 'express';
import {
  saveOrUpdateOffer,
  getAllOffers,
  getOfferById,
  deleteOffer,
} from '../controllers/offer.controller.js';

const router = express.Router();

// Create or update
router.post('/', saveOrUpdateOffer);
router.put('/', saveOrUpdateOffer);

// Read
router.get('/', getAllOffers);
router.get('/:id', getOfferById);

// Delete
router.delete('/:id', deleteOffer);

export default router;
