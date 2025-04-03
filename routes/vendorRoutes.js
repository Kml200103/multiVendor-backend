// routes/vendorRoutes.js
const express = require('express');
const router = express.Router();
const vendorController = require('../controllers/vendorController');

router.get('/:vendorId/products', vendorController.getVendorProducts);
router.post('/:vendorId/products', vendorController.addProduct);

module.exports = router;
