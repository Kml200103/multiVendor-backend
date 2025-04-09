const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Helper function to calculate the total price of the cart
const calculateTotal = async (items) => {
  let total = 0;

  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product) {
      throw new Error(`Product with ID ${item.product} not found`);
    }
    total += product.price * item.quantity;
  }

  return total;
};

// Add or Update Cart
exports.addOrUpdateCart = async (req, res) => {
  try {
    const { user, items, total } = req.body;

    // Find the user's cart
    let cart = await Cart.findOne({ user });

    if (!cart) {
      // Create a new cart if it doesn't exist
      cart = new Cart({
        user,
        items,
        total: await calculateTotal(items),
      });
      await cart.save();
      return res.status(201).json({ message: 'Cart created successfully', cart });
    }

    // Update existing cart
    items.forEach((newItem) => {
      const existingItem = cart.items.find(
        (item) => item.product.toString() === newItem.product
      );

      if (existingItem) {
        existingItem.quantity += newItem.quantity;
      } else {
        cart.items.push(newItem);
      }
    });

    // Recalculate total dynamically based on updated items
    cart.total = await calculateTotal(cart.items);
    await cart.save();

    res.status(200).json({ message: 'Cart updated successfully', cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove from cart
exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    // Find the user's cart
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Remove the specified product from the cart
    cart.items = cart.items.filter(item => item.product.toString() !== productId);

    // Recalculate total price
    cart.total = await calculateTotal(cart.items);

    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Cart
exports.getCart = async (req, res) => {
  try {
    const userId=req.params.user||req.user.id
    const cart = await Cart.findOne({ user: userId}).populate('items.product');
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    res.status(200).json({ message: 'Cart retrieved successfully', cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Clear Cart by Cart ID
exports.clearCart = async (req, res) => {
  try {
    const { cartId } = req.params;

    // Find and delete the cart
    const cart = await Cart.findByIdAndDelete(cartId);
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    res.status(200).json({ message: 'Cart deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
