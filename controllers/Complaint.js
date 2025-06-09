const Complaint = require("../models/Complaint");
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');
const { sendNotification } = require("./notification");
const Notification = require("../models/notification");

// Report a Problem
const createUserComplaint = async (req, res) => {
    try {
        const { title, description, category, status, createdBy } = req.body;
        const userId = req.user?.id;
        const adminUserId = "YOUR_ADMIN_USER_ID";

        const buffer = req.file?.buffer;
        const count = await Complaint.countDocuments();
        const paddedNumber = String(count + 1).padStart(2, '0'); // e.g., '01', '02'
        const complaintId = `#VCB${paddedNumber}`;


        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized: User ID missing' });
        }

        if (!title || !description || !category || !status || !req.file) {
            return res.status(400).json({ message: 'All fields are required including an image.' });
        }

        // Cloudinary buffer upload
        const uploadFromBuffer = () =>
            new Promise((resolve, reject) => {
                const timestamp = Date.now();
                const stream = cloudinary.uploader.upload_stream(
                    {
                        folder: 'Complaints',
                        public_id: `${userId}_${timestamp}`,
                        invalidate: true
                    },
                    (error, result) => {
                        if (error) return reject(error);
                        resolve(result.secure_url);
                    }
                );
                streamifier.createReadStream(buffer).pipe(stream);
            });

        const imageUrl = await uploadFromBuffer();

        const newBox = new Complaint({
            title,
            description,
            complaintId,
            category,
            userId,
            status,
            imageUrl,
            createdBy: createdBy || 'user'
        });

        await newBox.save();

        // const adminNotification  = await Notification.findOne({ userId: adminUserId }); // Enter admin id manually

        // if (adminNotification ?.fcmToken) {

        //     const notificationData = {
        //         token: New Complaint Created for ${newBox?.category}`,
        //         body: `A new complaint (${newBox?.complaintId}) has been created with Description: ${newBox?.description} and status: ${newBox?.reason}.` || "Please check the new Complaint",
        //         complaintId: newBox?.complaintId
        //     }

        //     await sendNotification(notificationData)
        // }

        res.status(201).json({
            message: 'Complaint created successfully',
            data: newBox
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

const updateComplaintStatus = async (req, res) => {
    try {
        const { complaintId, status, reason } = req.body;

        const updatedComplaint = await Complaint.findByIdAndUpdate(
            complaintId,
            { status, reason },
            { new: true, runValidators: true }
        );

        if (!updatedComplaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        // const notify = await Notification.findOne({ userId: updatedComplaint?.userId });

        // if (notify?.fcmToken) {

        //     const notificationData = {
        //         token: notify?.fcmToken,
        //         title: `Update on your complaint ${updatedComplaint?.complaintId}`,
        //         body: `${updatedComplaint?.title} : ${updatedComplaint?.reason}` || "Please check the updated status of your complaint.",
        //         complaintId: complaintId
        //     }

        //     await sendNotification(notificationData)
        // }


        res.status(200).json({
            message: 'Complaint status updated successfully',
            data: updatedComplaint
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

const getAllUserComplaint = async (req, res) => {
    try {
        const complaint = await Complaint.find().sort({ createdAt: -1 });
        res.status(200).json(complaint);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
const getSingleUserComplaint = async (req, res) => {
    const userId = req.user?.id;

    try {
        const complaints = await Complaint.find({ userId }).sort({ createdAt: -1 }); // newest first
        res.status(200).json(complaints);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// get singe complaint data
const getSingleComplaint = async (req, res) => {
    const { complaintId } = req.params;

    try {
        const complaint = await Complaint.findById(complaintId);

        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        res.status(200).json({ complaint, success: true, message: "Complaint retrieved successfully" });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Remove an complaint by ID
const removeComplaint = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedComplaint = await Complaint.findByIdAndDelete(id);
        if (!deletedComplaint) {
            return res.status(404).json({ success: false, message: "Complaint not found" });
        }

        res.json({ success: true, message: "Complaint removed successfully" });
    } catch (error) {
        console.error("Error removing complaint:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};


module.exports = { createUserComplaint, getAllUserComplaint, getSingleUserComplaint, updateComplaintStatus, removeComplaint, getSingleComplaint };