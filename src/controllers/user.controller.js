import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import User from '../models/user.model.js';

const SALT_ROUNDS = 10;

/* ----------------------------- Helpers ----------------------------- */
const stripSensitive = doc => {
  const obj = doc.toObject ? doc.toObject() : { ...doc };
  delete obj.passwordHash;
  return obj;
};

/* ---------------------------- Controllers -------------------------- */

// POST /api/users/register
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, phone, password, address = [], role } = req.body;

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await User.create({
      name,
      email,
      phone,
      passwordHash,
      address,
      role,
    });

    return res.status(201).json(stripSensitive(user));
  } catch (err) {
    if (err.code === 11000) {
      /* duplicate e-mail or phone */
      const field = Object.keys(err.keyPattern)[0];
      return res.status(409).json({ message: `${field} already exists` });
    }
    next(err);
  }
};

// POST /api/users/login
export const loginUser = async (req, res, next) => {
  try {
    const { email, phone, password } = req.body;

    if (!email || !phone || !password) {
      return res.status(400).json({ message: 'Email, phone, and password are required' });
    }

    const user = await User.findOne({ email, phone })
      .select('+passwordHash')
      .lean({ getters: true });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    return res.json(stripSensitive(user));
  } catch (err) {
    next(err);
  }
};

// GET /api/users
export const getUsers = async (_req, res, next) => {
  try {
    const users = await User.find({}).select('-passwordHash');
    res.json(users);
  } catch (err) {
    next(err);
  }
};

// GET /api/users/:id
export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id))
      return res.status(400).json({ message: 'Invalid user id' });

    const user = await User.findById(id).select('-passwordHash');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (err) {
    next(err);
  }
};

// PUT/PATCH /api/users/:id
export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const update = { ...req.body };

    // hash new password if provided
    if (update.password) {
      update.passwordHash = await bcrypt.hash(update.password, SALT_ROUNDS);
      delete update.password;
    }

    const user = await User.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
      context: 'query',
    }).select('-passwordHash');

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/users/:id
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id).select('-passwordHash');

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'User deleted', user });
  } catch (err) {
    next(err);
  }
};
