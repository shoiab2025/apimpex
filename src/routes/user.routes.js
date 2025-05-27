import { Router } from 'express';
import {
  registerUser,
  loginUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '../controllers/user.controller.js';

const router = Router();

// Auth
router.post('/register', registerUser);
router.post('/login',    loginUser);

// CRUD
router.get('/',        getUsers);
router.get('/:id',     getUserById);
router.put('/:id',     updateUser);   // full replace
router.patch('/:id',   updateUser);   // partial update
router.delete('/:id',  deleteUser);

export default router;
