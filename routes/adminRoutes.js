// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const adminAuth = require('../helpers/middleware');
// const { authenticate } = require('../helpers/helper');

// router.use(authenticate)
router.use(adminAuth)

router.get('/users', adminController.getUsers);
router.get('/vendors', adminController.getVendors);
router.get('/products', adminController.getProducts);

// Dashboard
router.get('/dashboard', adminController.getDashboardStats);

// Vendor Management
router.get('/vendors', adminController.manageVendors.getAllVendors);
router.get('/vendors/pending', adminController.manageVendors.getAllVendors);
router.get('/vendors/:id', adminController.manageVendors.getVendorById);
router.put('/vendors/:id/status', adminController.manageVendors.updateVendorStatus);
router.delete('/vendors/:id', adminController.manageVendors.deleteVendor);

// Order Management
router.get('/orders', adminController.manageOrders.getAllOrders);
router.put('/orders/:id/resolve', adminController.manageOrders.resolveDispute);

// Category Management
router.post('/categories', adminController.manageCategories.createCategory);
router.get('/categories', adminController.manageCategories.getCategories);
router.put('/categories/:id', adminController.manageCategories.updateCategory);
router.delete('/categories/:id', adminController.manageCategories.deleteCategory);

// Sales Reports
router.get('/reports/sales', adminController.generateSalesReport);

// User Management
router.get('/users', adminController.manageUsers.getAllUsers);
router.put('/users/:id/status', adminController.manageUsers.updateUserStatus);

module.exports = router;
