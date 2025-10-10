const express = require('express');
require('dotenv').config();

const router = express.Router();

// Post Schema
const Post = require('../models/Post');
const User = require('../models/User');

// Create a new post
router.post('/', async (req, res) => {
    const { title, content, authorId } = req.body;

    try {
        const post = new Post({ title, content, author: authorId });
        await post.save();
        res.status(201).json(post);
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});