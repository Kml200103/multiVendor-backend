const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { authenticate } = require('../helpers/helper');

// Define routes for CRUD operations
router.get('/', reviewController.getAllReviews); // GET all reviews
router.get('/:id', reviewController.getReviewById); // GET a single review by ID
router.post('/',authenticate, reviewController.createReview); // POST a new review
router.put('/:id',authenticate, reviewController.updateReviewById); // PUT update a review by ID
router.delete('/:id',authenticate, reviewController.deleteReviewById); // DELETE a review by ID

module.exports = router;
