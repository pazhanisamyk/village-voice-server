const Scheme = require('../models/Scheme');
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');
const User = require('../models/auth');
const InAppNotification = require('../models/InAppNotification');

// Cloudinary buffer upload helper
const uploadImageToCloudinary = (buffer, userId) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'schemes',
        public_id: `${userId}_${Date.now()}`,
        invalidate: true
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

// Create a Government Scheme
const createScheme = async (req, res) => {
  try {
    const { schemeName, schemeUrl, schemeDesc, createdBy } = req.body;
    const userId = req.user?.id;
    const buffer = req.file?.buffer;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: User ID missing' });
    }

    if (!schemeName || !schemeUrl || !schemeDesc || !req.file) {
      return res.status(422).json({ message: 'All fields are required including an image.' });
    }

    const imageUrl = await uploadImageToCloudinary(buffer, userId);

    const newScheme = new Scheme({
      schemeName,
      schemeUrl,
      schemeDesc,
      imageUrl,
      createdBy: createdBy || 'admin'
    });

    await newScheme.save();

    // Notify all users about the new scheme
    try {
      const users = await User.find({ role: 'user' });
      for (const u of users) {
        await InAppNotification.create({
          recipientId: u._id,
          title: 'New Government Scheme',
          body: `A new government scheme "${schemeName}" has been added. Click to view details.`,
          type: 'scheme',
          referenceId: newScheme._id
        });
      }
    } catch (inAppErr) {
      console.error("Error creating notifications for new scheme:", inAppErr);
    }

    res.status(201).json({
      message: 'Scheme created successfully',
      data: newScheme
    });

  } catch (error) {
    console.error("Error creating scheme:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update an existing Government Scheme
const updateScheme = async (req, res) => {
  try {
    const { id, schemeName, schemeUrl, schemeDesc, createdBy } = req.body;
    const userId = req.user?.id;
    const buffer = req.file?.buffer;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: User ID missing' });
    }

    if (!id || !schemeName || !schemeUrl || !schemeDesc) {
      return res.status(422).json({ message: 'All fields are required.' });
    }

    const existingScheme = await Scheme.findById(id);
    if (!existingScheme) {
      return res.status(404).json({ message: 'Scheme not found.' });
    }

    let imageUrl = existingScheme.imageUrl;
    if (buffer) {
      imageUrl = await uploadImageToCloudinary(buffer, userId);
    }

    existingScheme.schemeName = schemeName;
    existingScheme.schemeUrl = schemeUrl;
    existingScheme.schemeDesc = schemeDesc;
    existingScheme.imageUrl = imageUrl;
    existingScheme.createdBy = createdBy || 'admin';

    await existingScheme.save();

    res.status(200).json({
      message: 'Scheme updated successfully',
      data: existingScheme
    });

  } catch (error) {
    console.error("Error updating scheme:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all schemes
const getAllSchemes = async (req, res) => {
  try {
    const schemes = await Scheme.find().sort({ createdAt: -1 });
    res.status(200).json(schemes);
  } catch (error) {
    console.error("Error fetching schemes:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a Scheme
const deleteScheme = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedScheme = await Scheme.findByIdAndDelete(id);

    if (!deletedScheme) {
      return res.status(404).json({ message: 'Scheme not found.' });
    }

    res.status(200).json({ message: 'Scheme deleted successfully' });
  } catch (error) {
    console.error("Error deleting scheme:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createScheme,
  updateScheme,
  getAllSchemes,
  deleteScheme
};
