const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const router = express.Router();

// User Schema
const User = require('../models/User');

router.get('/', async (req, res) => {
    try {
        //Pagination
		const page = parseInt(req.query.page) || 1;
		const limit = parsetInt(req.query.limit) || 10;
		const skip = (page - 1) * limit;

		//Only return minimal necessary fields
		const users = await User.find()
		.select("name email createdAt") // Only safe fields
		.limit(limit)
		.skip(skip)
		.sort({createdAt: -1});

		const total = await User.countDocuments();

		res.json({
			users,
			currentPage: page,
			totalPages: Math.ceil(total/limit),
			totalUsers: total
		});
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});
router.get('/:id', async (req, res) => {
    try {
		const user = await User.findById(req.params.id).select("name email createdAt"); // Only safe fields
		if (!user) return res.status(404).json({ message: 'User not found' });
		res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });  
    }
});

router.post('/register', async (req, res) => {

    try {
        const { email, password, confirmPassword } = req.body;

        if (!email || !password || !confirmPassword) {
            return res.status(400).json({ message: 'Please fill in all fields' });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        const hashedPassword = await bcrypt.getSalt(10).then(salt => {
            return bcrypt.hash(password, salt);
        });
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();

        // Create and sign JWT
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ message: 'User registered successfully', token });
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

// Login endpoint
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Please fill in all fields' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ message: 'Login successful', token });
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

// Update user endpoint
router.put('/:id', async (req, res) => {
    try {
        const { email, password } = req.body;
        const updatedData = {};

        if (email) updatedData.email = email;
        if (password) {
            const hashedPassword = await bcrypt.getSalt(10).then(salt => {
                return bcrypt.hash(password, salt);
            });
            updatedData.password = hashedPassword;
        }

        const user = await User.findByIdAndUpdate(req.params.id, updatedData, { new: true }).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User updated successfully', user });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Delete user endpoint
router.delete('/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

module.exports = router;