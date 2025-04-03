const cartController=require('../controllers/cartController')


const express = require('express')

const router = express.Router();



router.post("/items", cartController.addOrUpdateCart);
router.delete("/items/:productId", cartController.removeFromCart);
router.get('/:user', cartController.getCart); // Pass user ID as a parameter

// Clear Cart
router.delete('/:cartId', cartController.clearCart);
module.exports=router
