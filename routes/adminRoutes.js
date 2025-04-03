// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/users', adminController.getUsers);
router.get('/vendors', adminController.getVendors);
router.get('/products', adminController.getProducts);

module.exports = router;
