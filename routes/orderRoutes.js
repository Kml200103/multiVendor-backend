// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');


router.post('/place', orderController.placeOrder); // Place an order
router.get('/', orderController.getOrders); // Get all orders
router.get('/:id', orderController.getOrderById); // Get a specific order by ID
router.put('/:id/cancel', orderController.cancelOrder); // Cancel an order
router.put('/:id/status', orderController.changeOrderStatus); // Change 
module.exports = router;
