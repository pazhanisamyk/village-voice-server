const ComplaintBox = require("../models/ComplaintBox");
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

// Report a Problem
const createComplaintBox = async (req, res) => {
  try {
      const { complaintBoxName, description, category, createdBy } = req.body;
      const userId = req.user?.id;
      const buffer = req.file?.buffer;

      if (!userId) {
          return res.status(401).json({ message: 'Unauthorized: User ID missing' });
      }

      if (!complaintBoxName || !description || !category || !req.file) {
          return res.status(400).json({ message: 'All fields are required including an image.' });
      }

      // Cloudinary buffer upload
      const uploadFromBuffer = () =>
          new Promise((resolve, reject) => {
              const stream = cloudinary.uploader.upload_stream(
                  {
                      folder: 'complaintBoxes',
                      public_id: userId,
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

      // Check for existing complaint by category
      const existingBox = await ComplaintBox.findOne({ category });

      if (existingBox) {
          // Update existing record
          existingBox.complaintBoxName = complaintBoxName;
          existingBox.description = description;
          existingBox.imageUrl = imageUrl;
          existingBox.createdBy = createdBy || 'admin';

          await existingBox.save();

          return res.status(200).json({
              message: 'Complaint Box updated successfully',
              data: existingBox
          });
      }

      // Else, create new
      const newBox = new ComplaintBox({
          complaintBoxName,
          description,
          category,
          imageUrl,
          createdBy: createdBy || 'admin'
      });

      await newBox.save();

      res.status(201).json({
          message: 'Complaint Box created successfully',
          data: newBox
      });

  } catch (error) {
      res.status(500).json({ message: 'Server error', error });
  }
};

const getAllComplaintBox = async (req, res) => {
    try {
        const complaintBoxes = await ComplaintBox.find().sort({ createdAt: -1 });
        res.status(200).json(complaintBoxes);
      } catch (error) {
        res.status(500).json({ message: 'Server error', error });
      }
};

module.exports = {createComplaintBox, getAllComplaintBox };