// controllers/orderController.js
const { statusTypes } = require('../helpers/constants');
const Order = require('../models/Order');
const Product = require('../models/Product');

exports.placeOrder = async (req, res) => {
    try {
        const { userId, vendorId, products } = req.body;

        // Calculate total amount
        let totalAmount = 0;
        for (const item of products) {
            const product = await Product.findById(item.productId);
            if (!product || !product.isAvailable) {
                return res.status(400).json({ message: `Product ${item.productId} is not available.` });
            }
            totalAmount += product.price * item.quantity;
        }

        // Create and save the order
        const order = new Order({ userId, vendorId, products, totalAmount });
        await order.save();

        res.status(201).json(order);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('products.productId');
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('products.productId');
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.json(order);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


exports.cancelOrder = async (req, res) => {
    try {
        const { id } = req.params; // Order ID
        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (order.status === statusTypes.CANCELED) {
            return res.status(400).json({ message: 'Order is already canceled' });
        }

        // Update the status to CANCELED
        order.status = statusTypes.CANCELED;
        await order.save();

        res.json({ message: 'Order canceled successfully', order });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Change order status
exports.changeOrderStatus = async (req, res) => {
    try {
        const { id } = req.params; // Order ID
        const { status } = req.body; // New status

        if (!Object.values(statusTypes).includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }

        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Update the status
        order.status = status;
        await order.save();

        res.json({ message: 'Order status updated successfully', order });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};