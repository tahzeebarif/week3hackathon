const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  weight: { type: String, required: true }, // e.g., "50g", "100g", "250g"
  price: { type: Number, required: true },
  stock: { type: Number, required: true, default: 0 },
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category: {
    type: String,
    required: true,
    enum: ['Black Tea', 'Green Tea', 'White Tea', 'Matcha', 'Herbal Tea', 'Chai', 'Oolong', 'Rooibos', 'Taiwanese'],
  },
  origin: { type: String },
  flavor: [{ type: String }], // e.g., ['Sweet', 'Earthy', 'Floral']
  qualities: { type: String }, // e.g., 'Premium', 'Standard', 'Luxury'
  caffeine: { type: String, enum: ['No Caffeine', 'Low Caffeine', 'Medium Caffeine', 'High Caffeine'] },
  allergens: [{ type: String }],
  isOrganic: { type: Boolean, default: false },
  isVegan: { type: Boolean, default: false },
  images: [{ type: String }], // image paths/URLs
  variants: [variantSchema],
  steepeingInstructions: {
    servingSize: String,
    waterTemp: String,
    steepingTime: String,
    colorAfter: String,
  },
  ingredients: String,
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// Virtual: base price (cheapest variant)
productSchema.virtual('basePrice').get(function () {
  if (!this.variants.length) return 0;
  return Math.min(...this.variants.map(v => v.price));
});

productSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);
