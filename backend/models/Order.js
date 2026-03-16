const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: String,
  image: String,
  variantId: mongoose.Schema.Types.ObjectId,
  weight: String,
  price: Number,
  quantity: Number,
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  shippingAddress: {
    fullName: String,
    street: String,
    city: String,
    country: String,
    postalCode: String,
    phone: String,
  },
  paymentMethod: { type: String, enum: ['card', 'paypal', 'cash'], default: 'card' },
  subtotal: Number,
  deliveryFee: { type: Number, default: 3.96 },
  total: Number,
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
  isPaid: { type: Boolean, default: false },
  paidAt: Date,
  deliveredAt: Date,
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
