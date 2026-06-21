const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

// HELPER ALGORITHM: Convert HH:MM to absolute minutes from midnight for safe comparisons
const timeToMinutes = (timeStr) => {
    const [hrs, mins] = timeStr.split(':').map(Number);
    return hrs * 60 + mins;
};

// Advanced Conflict Detection Endpoint (Live Check Logic)
router.post('/check-conflict', async (req, res) => {
    try {
        const { venue, date, startTime, endTime, facultyInCharge, excludeId } = req.body;
        const existingEvents = await Event.find({ date });
        
        const newStart = timeToMinutes(startTime);
        const newEnd = timeToMinutes(endTime);
        
        if (newStart >= newEnd) {
            return res.json({ conflict: true, reason: 'Invalid Time: End time must be after start time.' });
        }
        
        let conflicts = [];
        
        existingEvents.forEach(evt => {
            if (excludeId && evt._id.toString() === excludeId) return;
            
            const currStart = timeToMinutes(evt.startTime);
            const currEnd = timeToMinutes(evt.endTime);
            
            // Interval Overlap Core Mathematical Formula
            const isOverlapping = (newStart < currEnd) && (newEnd > currStart);
            
            if (isOverlapping) {
                if (evt.venue === venue) {
                    conflicts.push(`Venue Conflict: "${evt.title}" is already using ${venue} (${evt.startTime} - ${evt.endTime})`);
                }
                if (evt.facultyInCharge.toLowerCase() === facultyInCharge.toLowerCase()) {
                    conflicts.push(`Faculty Conflict: Prof. ${evt.facultyInCharge} is busy with "${evt.title}" (${evt.startTime} - ${evt.endTime})`);
                }
            }
        });
        
        if (conflicts.length > 0) {
            return res.json({ conflict: true, reasons: conflicts });
        }
        return res.json({ conflict: false, message: 'Resource parameters available.' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Create new Event with absolute protection logic
router.post('/', async (req, res) => {
    try {
        const { title, organizer, venue, date, startTime, endTime, facultyInCharge, type } = req.body;
        const newStart = timeToMinutes(startTime);
        const newEnd = timeToMinutes(endTime);
        
        const conflicts = await Event.find({ date });
        for (let evt of conflicts) {
            const isOverlapping = (newStart < timeToMinutes(evt.endTime)) && (newEnd > timeToMinutes(evt.startTime));
            if (isOverlapping && (evt.venue === venue || evt.facultyInCharge.toLowerCase() === facultyInCharge.toLowerCase())) {
                return res.status(400).json({ success: false, message: `Conflict detected with: "${evt.title}"` });
            }
        }
        
        const newEvent = new Event({ title, organizer, venue, date, startTime, endTime, facultyInCharge, type });
        await newEvent.save();
        res.status(201).json({ success: true, data: newEvent });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Fetch all events sorted by Date and Start Time (Chronological Order Logic)
router.get('/', async (req, res) => {
    try {
        const events = await Event.find({});
        events.sort((a, b) => {
            if (a.date !== b.date) return a.date.localeCompare(b.date);
            return timeToMinutes(a.startTime) - timeToMinutes(b.startTime);
        });
        res.json({ success: true, data: events });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Delete/Deallocate Event
router.delete('/:id', async (req, res) => {
    try {
        await Event.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Deallocated successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;