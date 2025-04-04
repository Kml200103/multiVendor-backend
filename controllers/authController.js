// controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Vendor = require('../models/Vendor'); // Adjust path

exports.register = async (req, res) => {
    try {
        const { name, email, password, role, restaurantName, description, logo, address } = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create and save the user
        const user = new User({ name, email, password, role });
        await user.save();

        // If the user's role is "VENDOR", create a vendor entry
        let vendor;
        if (role === 'VENDOR') {
            vendor = new Vendor({
                userId: user._id,
                restaurantName,
                description,
                logo,
                address,
            });
            await vendor.save();
        }

        res.status(201).json({
            message: 'User registered successfully',
            user,
            ...(vendor && { vendor }), // Include vendor details if created
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
   
        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
            expiresIn: '1h'
        });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
