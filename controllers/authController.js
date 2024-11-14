import User from '../models/User.js'; // Importing the User model
// Correct way to import jwt
import jwt from 'jsonwebtoken'; // Import the whole jwt package

// Import the jwt package

const { sign } = jwt; // Destructure the sign method from the jwt package

export const registerUser = async (req, res) => {
    const { name, username, email, password } = req.body; // Ensure we are using 'name' here

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Username, email, and password are required' });
    }

    try {
        // Check if the user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create a new user with 'name' instead of 'fullName'
        const newUser = new User({ name, username, email, password }); // Ensure 'name' is used here
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// Login User
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Compare password using the comparePassword method defined in the model
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const token = sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
      );

      res.json({ message: 'Login successful', token });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
};
