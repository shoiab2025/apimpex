import express from 'express';
import {
  saveOrUpdateOrder,
  getOrders,
  getOrderById,
  deleteOrder,
} from '../controllers/order.controller.js';

const router = express.Router();

// Create or update order
router.post('/', saveOrUpdateOrder);
router.put('/', saveOrUpdateOrder);

// Get all orders (optionally filter by user: /?user=userId)
router.get('/', getOrders);

// Get single order by id
router.get('/:id', getOrderById);

// Delete order by id
router.delete('/:id', deleteOrder);

export default router;


// {
//     "user": "userId",
//     "items": [
//       {
//         "product": "productId",
//         "quantityKg": 2,
//         "pricePerKg": 10,
//         "totalPrice": 20
//       }
//     ],
//     "paymentMethod": "UPI",
//     "deliveryAddress": {
//       "street": "123 St",
//       "city": "City",
//       "state": "State",
//       "zip": "12345"
//     },
//     "deliveryType": "same_day"
//   }
  
