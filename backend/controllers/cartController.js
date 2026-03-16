const Cart = require('../models/Cart');
const Product = require('../models/Product');


exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart) return res.json({ success: true, cart: { items: [], subtotal: 0 } });
    res.json({ success: true, cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
exports.addToCart = async (req, res) => {
  try {
    const { productId, variantId, quantity = 1 } = req.body;

    const product = await Product.findById(productId);
    if (!product || !product.isActive)
      return res.status(404).json({ success: false, message: 'Product not found' });

    const variant = product.variants.id(variantId);
    if (!variant)
      return res.status(404).json({ success: false, message: 'Variant not found' });

    if (variant.stock < quantity)
      return res.status(400).json({ success: false, message: `Only ${variant.stock} items in stock` });

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = new Cart({ user: req.user._id, items: [] });

    const existingIndex = cart.items.findIndex(
      i => i.product.toString() === productId && i.variantId.toString() === variantId
    );

    if (existingIndex > -1) {
      const newQty = cart.items[existingIndex].quantity + quantity;
      if (variant.stock < newQty)
        return res.status(400).json({ success: false, message: `Only ${variant.stock} items in stock` });
      cart.items[existingIndex].quantity = newQty;
    } else {
      cart.items.push({ product: productId, variantId, weight: variant.weight, price: variant.price, quantity });
    }

    await cart.save();
    await cart.populate('items.product');
    res.json({ success: true, cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


exports.updateCartItem = async (req, res) => {
  try {
    const { itemId, quantity } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

    const item = cart.items.id(itemId);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found in cart' });

    if (quantity <= 0) {
      cart.items.pull(itemId);
    } else {
      const product = await Product.findById(item.product);
      const variant = product.variants.id(item.variantId);
      if (variant.stock < quantity)
        return res.status(400).json({ success: false, message: `Only ${variant.stock} items in stock` });
      item.quantity = quantity;
    }

    await cart.save();
    await cart.populate('items.product');
    res.json({ success: true, cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });
    cart.items.pull(req.params.itemId);
    await cart.save();
    await cart.populate('items.product');
    res.json({ success: true, cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.clearCart = async (req, res) => {
  try {
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
    res.json({ success: true, message: 'Cart cleared' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
