import { Router } from 'express';
import {
  createGreeting,
  getGreetings,
  getGreetingById,
  updateGreeting,
  deleteGreeting,
} from '../controllers/greeting.controller.js';

const router = Router();

router.post('/', createGreeting);
router.get('/', getGreetings);
router.get('/:id', getGreetingById);
router.put('/:id', updateGreeting);
router.delete('/:id', deleteGreeting);

export default router;
