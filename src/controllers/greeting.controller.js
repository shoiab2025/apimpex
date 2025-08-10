import Greeting from '../models/greeting.model.js';

// Create Greeting
export const createGreeting = async (req, res) => {
  try {
    const greeting = await Greeting.create(req.body);
    res.success(201, 'Greeting created successfully', greeting);
  } catch (err) {
    res.error(500, 'Server error', err.message);
  }
};

// Get All Greetings
export const getGreetings = async (req, res) => {
  try {
    const greetings = await Greeting.find();
    res.success(200, 'Greetings fetched successfully', greetings);
  } catch (err) {
    res.error(500, 'Server error', err.message);
  }
};

// Get Single Greeting
export const getGreetingById = async (req, res) => {
  try {
    const greeting = await Greeting.findById(req.params.id);
    if (!greeting) return res.error(404, 'Greeting not found');
    res.success(200, 'Greeting fetched successfully', greeting);
  } catch (err) {
    res.error(500, 'Server error', err.message);
  }
};

// Update Greeting
export const updateGreeting = async (req, res) => {
  try {
    const updated = await Greeting.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.error(404, 'Greeting not found');
    res.success(200, 'Greeting updated successfully', updated);
  } catch (err) {
    res.error(500, 'Server error', err.message);
  }
};

// Delete Greeting
export const deleteGreeting = async (req, res) => {
  try {
    const deleted = await Greeting.findByIdAndDelete(req.params.id);
    if (!deleted) return res.error(404, 'Greeting not found');
    res.success(200, 'Greeting deleted successfully', deleted);
  } catch (err) {
    res.error(500, 'Server error', err.message);
  }
};
