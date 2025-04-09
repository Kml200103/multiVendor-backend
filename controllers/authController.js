// controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Vendor = require('../models/Vendor'); // Adjust path
const { uploadToCloudinary } = require('../helpers/multer');

exports.register = async (req, res) => {
    try {
      const {
        name,
        email,
        password,
        role,
        restaurantName,
        description,
        address,
      } = req.body;
  
      // Check if the user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
  
      // Create and save the user
      const user = new User({ name, email, password, role });
      await user.save();
  
      // If the user's role is "VENDOR", create a vendor entry
      let vendor;
  
      // Handle file uploads for logo
      const files = req.files || {};
      let logoUrl = "";
  
      if (role === "VENDOR") {
        // Check if logo was provided
        if (!files.logo || files.logo.length === 0) {
          // Delete the user that was just created
          await User.findByIdAndDelete(user._id);
          return res
            .status(400)
            .json({ message: "Logo is required for vendor registration" });
        }
  
        try {
          const uploadedUrls = await uploadToCloudinary(files.logo);
          logoUrl = uploadedUrls[0];
  
          if (!logoUrl) {
            // Delete the user if logo upload failed
            await User.findByIdAndDelete(user._id);
            return res.status(400).json({ message: "Logo upload failed" });
          }
  
          vendor = new Vendor({
            userId: user._id,
            restaurantName,
            description,
            address,
            logo: logoUrl,
          });
  
          await vendor.save();
        } catch (uploadError) {
          console.error("Logo upload error:", uploadError);
          // Delete the user if there was an error
          await User.findByIdAndDelete(user._id);
          return res.status(400).json({ message: "Error uploading logo" });
        }
      }
  
      res.status(201).json({
        message: "User registered successfully",
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        ...(vendor && { vendor }), // Include vendor details if created
      });
    } catch (err) {
      console.error("Registration error:", err);
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
