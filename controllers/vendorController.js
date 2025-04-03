// controllers/vendorController.js
const Vendor = require('../models/Vendor');
const Product = require('../models/Product');


const User = require('../models/User'); // Adjust path to your User model
exports.getVendorProducts = async (req, res) => {
    try {
        const vendorId = req.params.vendorId;
        const products = await Product.find({ vendor: vendorId });
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};



exports.registerVendor = async (req, res) => {
    try {
        const { userId, restaurantName, description, logo, address } = req.body;

        // Check if the user exists and has the correct role
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user.role !== 'VENDOR') { // Assuming 'VENDOR' is a valid role in your constants
            return res.status(403).json({ message: 'User is not authorized to register as a vendor' });
        }

        // Create a new vendor
        const vendor = new Vendor({
            userId,
            restaurantName,
            description,
            logo,
            address,
        });

        await vendor.save();
        res.status(201).json({ message: 'Vendor registered successfully', vendor });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.addProduct = async (req, res) => {
    try {
        const { name, price, category } = req.body;
        const vendorId = req.params.vendorId;
        const product = new Product({ name, price, category, vendor: vendorId });
        await product.save();
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
