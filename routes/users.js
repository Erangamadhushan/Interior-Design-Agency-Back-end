const express = require('express');

require('dotenv').config();

const router = express.Router();

// User Schema
const User = require('../models/User');

router.get('/', async (req, res) => {
    try {
        const users = await User.find().select('-password'); // Exclude passwords
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});