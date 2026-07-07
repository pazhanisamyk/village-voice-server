const Events = require('../models/events');
const User = require('../models/auth');
const InAppNotification = require('../models/InAppNotification');

// Add new event
const addEvent = async (req, res) => {
    try {
        const { date, event, eventDescription, time } = req.body;

        if (!date || !event || !eventDescription || !time) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const newEvent = new Events({ date, event, eventDescription, time });
        await newEvent.save();

        // Notify all users about the new event
        try {
            const users = await User.find({ role: 'user' });
            for (const u of users) {
                await InAppNotification.create({
                    recipientId: u._id,
                    title: 'New Event Added',
                    body: `A new event "${event}" is scheduled on ${date} at ${time}.`,
                    type: 'event',
                    referenceId: newEvent._id
                });
            }
        } catch (inAppErr) {
            console.error("Error creating in-app notifications for event:", inAppErr);
        }

        res.status(201).json({ message: "Event created successfully", success: true, data: newEvent });
    } catch (error) {
        console.error("Error adding event:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Remove an event by ID
const removeEvent = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedEvent = await Events.findByIdAndDelete(id);
        if (!deletedEvent) {
            return res.status(404).json({ success: false, message: "Event not found" });
        }

        res.json({ success: true, message: "Event removed successfully" });
    } catch (error) {
        console.error("Error removing event:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Get events by query params (optional: year, month, day)
const getallEvents = async (req, res) => {
    try {
        const { year, month, day } = req.query;

        let query = {};
        if (year && month && day) {
            const date = `${day.padStart(2, '0')}-${month.padStart(2, '0')}-${year}`;
            query.date = date;
        }

        const events = await Events.find(query).sort({ date: 1 });
        res.json({ success: true, data: events });
    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

module.exports = { addEvent, removeEvent, getallEvents };
