const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    organizer: { type: String, required: true, trim: true },
    venue: { type: String, required: true, enum: ['Auditorium 1', 'Seminar Hall 2', 'CSE Lab 3', 'Classroom 401', 'Boardroom'] },
    date: { type: String, required: true }, // YYYY-MM-DD
    startTime: { type: String, required: true }, // HH:MM
    endTime: { type: String, required: true }, // HH:MM
    facultyInCharge: { type: String, required: true, trim: true },
    type: { type: String, enum: ['Lecture', 'Workshop', 'Seminar', 'Exam', 'Cultural'], default: 'Seminar' }
}, { timestamps: true });

module.exports = mongoose.model('Event', EventSchema);