const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const eventRoutes = require('./routes/eventRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/events', eventRoutes);

// Fallback error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
});

// MongoDB Connection & Server Start
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/dsce_scheduler';

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('Successfully connected to MongoDB (dsce_scheduler)');
        app.listen(PORT, () => console.log(`Backend Server running smoothly on port ${PORT}`));
    })
    .catch(err => {
        console.error('MongoDB Connection Error:', err);
    });