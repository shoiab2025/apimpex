import express from 'express';
import {
  saveOrUpdateDelivery,
  getAllDeliveries,
  getDeliveryById,
  deleteDelivery,
} from '../controllers/delivery.controller.js';

const router = express.Router();

/**
 * POST /api/deliveries
 * PUT  /api/deliveries   (same handler)
 *
 * Body variants:
 *   { order, deliveryAgent, ... }        ➜ create-or-update-by-order
 *   { _id, deliveryStatus, ... }         ➜ update existing by _id
 */
router.post('/', saveOrUpdateDelivery);
router.put('/',  saveOrUpdateDelivery);

// conventional REST endpoints
router.get('/', getAllDeliveries);
router.get('/:id', getDeliveryById);
router.delete('/:id', deleteDelivery);

export default router;
