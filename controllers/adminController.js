// controllers/adminController.js
const User = require('../models/User');
const Product = require('../models/Product');
const Vendor = require('../models/Vendor');
const Order = require('../models/Order');
const Category = require('../models/Category');
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getVendors = async (req, res) => {
    try {
        const vendors = await Vendor.find();
        res.json(vendors);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};



// Dashboard Controller
exports.getDashboardStats = async (req, res) => {
    try {
        const [vendors, customers, orders, revenue] = await Promise.all([
            Vendor.countDocuments(),
            User.countDocuments({ role: 'customer' }),
            Order.countDocuments(),
            Order.aggregate([
                { $match: { status: 'completed' } },
                { $group: { _id: null, total: { $sum: '$totalAmount' } } }
            ])
        ]);

        res.json({
            vendors,
            customers,
            orders,
            revenue: revenue[0]?.total || 0
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Vendor Controllers
exports.manageVendors = {
    getAllVendors: async (req, res) => {
        try {
            const { status } = req.query;
            const filter = status ? { status } : {};
            const vendors = await Vendor.find(filter);
            res.json(vendors);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getVendorById: async (req, res) => {
        try {
            const vendor = await Vendor.findById(req.params.id);
            res.json(vendor);
        } catch (error) {
            res.status(404).json({ message: 'Vendor not found' });
        }
    },

    updateVendorStatus: async (req, res) => {
        try {
            const validStatuses = ['approved', 'rejected', 'suspended'];
            if (!validStatuses.includes(req.body.status)) {
                return res.status(400).json({ message: 'Invalid status' });
            }

            const vendor = await Vendor.findByIdAndUpdate(
                req.params.id,
                {
                    status: req.body.status,
                    ...(req.body.reason && { rejectionReason: req.body.reason })
                },
                { new: true }
            );
            res.json(vendor);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    deleteVendor: async (req, res) => {
        try {
            await Vendor.findByIdAndDelete(req.params.id);
            res.json({ message: 'Vendor deleted successfully' });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
};

// Order Controllers
exports.manageOrders = {
    getAllOrders: async (req, res) => {
        try {
            const { status } = req.query;
            const orders = await Order.find(status ? { status } : {})
                .populate('user', 'name email')
                .populate('vendor', 'businessName');
            res.json(orders);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    resolveDispute: async (req, res) => {
        try {
            const order = await Order.findByIdAndUpdate(
                req.params.id,
                {
                    status: 'resolved',
                    resolution: req.body.resolution,
                    ...(req.body.refundAmount && { refundAmount: req.body.refundAmount })
                },
                { new: true }
            );
            res.json(order);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
};

// Category Controllers
exports.manageCategories = {
    createCategory: async (req, res) => {
        try {
            const category = new Category(req.body);
            await category.save();
            res.status(201).json(category);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    getCategories: async (req, res) => {
        try {
            const categories = await Category.find();
            res.json(categories);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    updateCategory: async (req, res) => {
        try {
            const category = await Category.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
            );
            res.json(category);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    deleteCategory: async (req, res) => {
        try {
            await Category.findByIdAndDelete(req.params.id);
            res.json({ message: 'Category deleted successfully' });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
};

// Sales Report Controller
exports.generateSalesReport = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const report = await Order.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: new Date(startDate),
                        $lte: new Date(endDate)
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalSales: { $sum: '$totalAmount' },
                    totalOrders: { $sum: 1 },
                    averageOrderValue: { $avg: '$totalAmount' }
                }
            }
        ]);

        res.json(report[0] || {});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// User Controllers
exports.manageUsers = {
    getAllUsers: async (req, res) => {
        try {
            const { role } = req.query;
            const filter = role ? { role } : {};
            const users = await User.find(filter).select('-password');
            res.json(users);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    updateUserStatus: async (req, res) => {
        try {
            const user = await User.findByIdAndUpdate(
                req.params.id,
                { isActive: req.body.isActive },
                { new: true }
            ).select('-password');
            res.json(user);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
};
