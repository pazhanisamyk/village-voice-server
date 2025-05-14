const multer = require('multer');

const storage = multer.memoryStorage(); // store in memory for Firebase or buffer usage

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // optional: 5MB limit
});

module.exports = upload;
