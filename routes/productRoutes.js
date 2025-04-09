const express = require("express");
const router = express.Router();

const productController = require("../controllers/productController");
const { authenticate } = require("../helpers/helper");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
}).fields([{ name: "image", maxCount: 1 }]);
// Define routes for CRUD operations
router.get("/", productController.getAllProducts); // GET all products
router.get("/:id", productController.getProductById); // GET a single product by ID
router.post("/", authenticate, upload, productController.createProduct); // POST a new product
router.put("/:id", authenticate, productController.updateProductById); // PUT update a product by ID
router.delete("/:id", authenticate, productController.deleteProductById); // DELETE a product by ID

module.exports = router;
