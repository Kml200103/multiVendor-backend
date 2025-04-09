const mongoose = require("mongoose");
const Product = require("../models/Product");
const { uploadToCloudinary } = require("../helpers/multer");

// Get all products with pagination and filtering
exports.getAllProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      vendorId,
      isAvailable,
      minPrice,
      maxPrice,
      search,
    } = req.query;

    const filter = {};

    if (category) filter.category = category;
    if (vendorId) filter.vendorId = vendorId;
    if (isAvailable !== undefined) filter.isAvailable = isAvailable === "true";
    if (search) filter.name = { $regex: search, $options: "i" };

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) filter.price.$gte = Number(minPrice);
      if (maxPrice !== undefined) filter.price.$lte = Number(maxPrice);
    }

    const products = await Product.find(filter)
      .populate("category", "name")
      .populate("vendorId", "name")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments(filter);

    res.status(200).json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalProducts: total,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get product by ID
exports.getProductById = async (req, res) => {
  try {
    const productId = req.params.id;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID format" });
    }

    const product = await Product.findById(productId)
      .populate("category", "name")
      .populate("vendorId", "name");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create or update a product
exports.saveProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const productData = req.body;
    const files = req.files || {};

    // Validate required fields for new products
    if (
      !id &&
      (!productData.name ||
        !productData.price ||
        !productData.vendorId ||
        !productData.category)
    ) {
      return res.status(400).json({
        message: "Missing required fields",
        required: ["name", "price", "vendorId", "category"],
      });
    }

    // Validate price is positive
    if (productData.price !== undefined && productData.price <= 0) {
      return res
        .status(400)
        .json({ message: "Price must be greater than zero" });
    }

    // Validate ObjectIds
    if (
      productData.vendorId &&
      !mongoose.Types.ObjectId.isValid(productData.vendorId)
    ) {
      return res.status(400).json({ message: "Invalid vendor ID format" });
    }

    if (
      productData.category &&
      !mongoose.Types.ObjectId.isValid(productData.category)
    ) {
      return res.status(400).json({ message: "Invalid category ID format" });
    }

    // Handle file uploads first
    let imageUrl = "";
    if (files.image && files.image.length > 0) {
      const uploadedUrls = await uploadToCloudinary(files.image);
      imageUrl = uploadedUrls[0];
    }

    let product;

    if (id) {
      // Update existing product
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid product ID format" });
      }

      // First fetch the existing product
      product = await Product.findById(id);

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      // Only update image if a new one was uploaded
      if (imageUrl) {
        productData.image = imageUrl;
      }

      // Update the product
      product = await Product.findByIdAndUpdate(id, productData, {
        new: true,
        runValidators: true,
      });
    } else {
      // Create new product
      if (imageUrl) {
        productData.image = imageUrl;
      }

      product = new Product(productData);
      await product.save();
    }

    res.status(id ? 200 : 201).json(product);
  } catch (error) {
    // Handle validation errors from Mongoose
    if (error.name === "ValidationError") {
      const validationErrors = {};

      for (const field in error.errors) {
        validationErrors[field] = error.errors[field].message;
      }

      return res.status(400).json({
        message: "Validation error",
        errors: validationErrors,
      });
    }

    res.status(400).json({ error: error.message });
  }
};

// Alias for creating a new product
exports.createProduct = (req, res) => {
  return exports.saveProduct(req, res);
};

// Alias for updating a product
exports.updateProductById = (req, res) => {
  return exports.saveProduct(req, res);
};

// Delete a product by ID
exports.deleteProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID format" });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await Product.findByIdAndDelete(id);

    res.status(200).json({
      message: "Product deleted successfully",
      deletedProduct: product,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
