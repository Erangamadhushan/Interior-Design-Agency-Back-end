const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGO_URI;
console.log('MongoDB URI:', uri); // Debugging line to check if URI is loaded   

const connectDB = async () => {
  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected');

    // handle connection status
    mongoose.connection.on('disconnected', () => {
        console.log('MongoDB disconnected');
    });
    mongoose.connection.on('connected', () => {
        console.log('MongoDB connected');
    }
    );

    mongoose.connection.on('error', (err) => {
        console.error('MongoDB connection error:', err);
    });

    // Gracefull shutdown
    process.on('SIGINT', async () => {
        await mongoose.connection.close();
        console.log('MongoDB connection closed due to app termination');
        process.exit(0);
    });
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;