const express = require('express');
require('dotenv').config();
const router = express.Router();

// Project Schema
const Project = require('../models/Project');
router.get("/", async (req, res) => {
    try {
        const projects = await Project.find().populate('author', '-password'); // Populate author details excluding password
        res.status(200).json(projects);
    }
    catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const project = await Project.findById(req.params.id).populate('author', '-password');
        res.status(200).json(project);
    }
    catch (error) {
        console.error('Error fetching project:', error);
        res.status(500).json({
            message: 'Something went wrong !',
            error: error.message
        })
    }

});

