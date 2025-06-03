const User = require('../models/auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Sign Up function
const signUp = async (req, res) => {
  try {
    const { username, email, phoneNumber, password } = req.body;

    // Check if user exists by email or username
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Email or username already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user with default role as 'user'
    const newUser = new User({
      username,
      email,
      phoneNumber,
      password: hashedPassword,
      role: 'user' // default role
    });

    await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.SECRET_KEY, {
      expiresIn: '1h',
    });

    res.status(201).json({ message: 'User created successfully', token });
  } catch (error) {
    if (error.code === 11000) {
      // Handle duplicate key error
      const duplicateField = Object.keys(error.keyPattern)[0];
      res.status(400).json({
        message: `The ${duplicateField} "${error.keyValue[duplicateField]}" is already in use.`,
      });
    } else {
      // Handle other server errors
      res.status(500).json({ message: 'Server error' });
    }
  }
};

// Sign In function
const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(422).json({ message: 'Invalid mobile number' });
    }

    // Compare provided password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(422).json({ message: 'Invalid password' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.SECRET_KEY, {
      expiresIn: '1h',
    });

    res.status(200).json({ data: {...user, token, message: 'Login successful'} });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Logout
const logout = async (req, res) => {
  try {        
      res.json({ message: 'User logged out successfully' });
  } catch (error) {
      console.error("Logout error:", error);
      res.status(500).json({ message: 'Error logging out' });
  }
};

module.exports = { signUp, signIn, logout };