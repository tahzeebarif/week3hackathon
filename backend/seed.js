const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
dotenv.config();

const User = require('./models/User');
const Product = require('./models/Product');

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  await User.deleteMany();
  await Product.deleteMany();

  // Create superadmin
  await User.create({
    name: 'Super Admin',
    email: 'superadmin@tea.com',
    password: 'password123',
    role: 'superadmin',
  });

  await User.create({
    name: 'Admin User',
    email: 'admin@tea.com',
    password: 'password123',
    role: 'admin',
  });

  await User.create({
    name: 'Test User',
    email: 'user@tea.com',
    password: 'password123',
    role: 'user',
  });

  const products = [
    {
      name: 'Ceylon Ginger Cinnamon Chai Tea',
      description: 'A cozy warming chai tea with ginger cinnamon flavours. Perfect for cold mornings.',
      category: 'Chai',
      origin: 'Sri Lanka',
      flavor: ['Spicy', 'Sweet', 'Earthy'],
      qualities: 'Premium',
      caffeine: 'Medium Caffeine',
      allergens: [],
      isOrganic: true,
      isVegan: true,
      images: [],
      variants: [
        { weight: '50g', price: 3.90, stock: 100 },
        { weight: '100g', price: 6.90, stock: 80 },
        { weight: '250g', price: 14.90, stock: 50 },
        { weight: '500g', price: 26.90, stock: 30 },
        { weight: '1kg', price: 48.90, stock: 20 },
      ],
      steepeingInstructions: {
        servingSize: '2.5g per cup / 1 tsp per cup',
        waterTemp: '95°C',
        steepingTime: '3-5 minutes',
        colorAfter: '15 minutes',
      },
      ingredients: 'Black Ceylon tea, Ginger root, Cloves, Black pepper, Cinnamon, Cardamom',
    },
    {
      name: 'Earl Grey Classic Black Tea',
      description: 'A timeless classic with bergamot orange aroma. Smooth, aromatic and deeply satisfying.',
      category: 'Black Tea',
      origin: 'India',
      flavor: ['Floral', 'Citrus', 'Earthy'],
      qualities: 'Standard',
      caffeine: 'High Caffeine',
      allergens: [],
      isOrganic: false,
      isVegan: true,
      images: [],
      variants: [
        { weight: '50g', price: 3.50, stock: 120 },
        { weight: '100g', price: 5.90, stock: 90 },
        { weight: '250g', price: 12.90, stock: 60 },
        { weight: '500g', price: 22.90, stock: 40 },
      ],
      steepeingInstructions: {
        servingSize: '2g per cup',
        waterTemp: '100°C',
        steepingTime: '3-4 minutes',
        colorAfter: '10 minutes',
      },
      ingredients: 'Black tea, Bergamot oil',
    },
    {
      name: 'Japanese Sencha Green Tea',
      description: 'Fresh, grassy and vegetal. A classic Japanese green tea for everyday drinking.',
      category: 'Green Tea',
      origin: 'Japan',
      flavor: ['Grassy', 'Fresh', 'Vegetal'],
      qualities: 'Premium',
      caffeine: 'Low Caffeine',
      allergens: [],
      isOrganic: true,
      isVegan: true,
      images: [],
      variants: [
        { weight: '50g', price: 4.50, stock: 80 },
        { weight: '100g', price: 7.90, stock: 70 },
        { weight: '250g', price: 16.90, stock: 40 },
      ],
      steepeingInstructions: {
        servingSize: '2g per cup',
        waterTemp: '75°C',
        steepingTime: '1-2 minutes',
        colorAfter: '5 minutes',
      },
      ingredients: 'Green tea leaves',
    },
    {
      name: 'Silver Needle White Tea',
      description: 'The most prized white tea. Delicate, sweet and floral with a silky smooth finish.',
      category: 'White Tea',
      origin: 'China',
      flavor: ['Sweet', 'Floral', 'Light'],
      qualities: 'Luxury',
      caffeine: 'Low Caffeine',
      allergens: [],
      isOrganic: true,
      isVegan: true,
      images: [],
      variants: [
        { weight: '25g', price: 8.90, stock: 50 },
        { weight: '50g', price: 15.90, stock: 40 },
        { weight: '100g', price: 28.90, stock: 25 },
      ],
      steepeingInstructions: {
        servingSize: '2g per cup',
        waterTemp: '80°C',
        steepingTime: '4-5 minutes',
        colorAfter: '10 minutes',
      },
      ingredients: 'Silver needle white tea buds',
    },
    {
      name: 'Ceremonial Grade Matcha',
      description: 'Vibrant, umami-rich matcha powder from shade-grown Japanese tea leaves.',
      category: 'Matcha',
      origin: 'Japan',
      flavor: ['Umami', 'Earthy', 'Vegetal'],
      qualities: 'Luxury',
      caffeine: 'Medium Caffeine',
      allergens: [],
      isOrganic: true,
      isVegan: true,
      images: [],
      variants: [
        { weight: '30g', price: 12.90, stock: 60 },
        { weight: '100g', price: 36.90, stock: 30 },
      ],
      steepeingInstructions: {
        servingSize: '1g per cup (1/2 tsp)',
        waterTemp: '70°C',
        steepingTime: 'Whisk for 30 seconds',
        colorAfter: 'N/A',
      },
      ingredients: 'Shade-grown Japanese green tea (powdered)',
    },
    {
      name: 'Peppermint Chamomile Herbal',
      description: 'A calming blend of peppermint and chamomile flowers. Caffeine-free and soothing.',
      category: 'Herbal Tea',
      origin: 'Germany',
      flavor: ['Minty', 'Floral', 'Sweet'],
      qualities: 'Standard',
      caffeine: 'No Caffeine',
      allergens: [],
      isOrganic: true,
      isVegan: true,
      images: [],
      variants: [
        { weight: '50g', price: 3.20, stock: 150 },
        { weight: '100g', price: 5.50, stock: 100 },
        { weight: '250g', price: 11.90, stock: 70 },
      ],
      steepeingInstructions: {
        servingSize: '2g per cup',
        waterTemp: '100°C',
        steepingTime: '5-7 minutes',
        colorAfter: '10 minutes',
      },
      ingredients: 'Peppermint leaves, Chamomile flowers',
    },
    {
      name: 'Taiwan High Mountain Oolong',
      description: 'Complex, layered oolong from Taiwan high mountains. Floral, creamy and lasting.',
      category: 'Taiwanese',
      origin: 'Taiwan',
      flavor: ['Floral', 'Creamy', 'Sweet'],
      qualities: 'Luxury',
      caffeine: 'Medium Caffeine',
      allergens: [],
      isOrganic: false,
      isVegan: true,
      images: [],
      variants: [
        { weight: '50g', price: 9.90, stock: 45 },
        { weight: '100g', price: 17.90, stock: 30 },
        { weight: '250g', price: 39.90, stock: 20 },
      ],
      steepeingInstructions: {
        servingSize: '3g per cup',
        waterTemp: '90°C',
        steepingTime: '2-3 minutes (multiple infusions)',
        colorAfter: '8 minutes',
      },
      ingredients: 'High mountain oolong tea leaves',
    },
    {
      name: 'South African Rooibos Red',
      description: 'Naturally sweet, earthy and caffeine-free. Great hot or iced with milk.',
      category: 'Rooibos',
      origin: 'South Africa',
      flavor: ['Sweet', 'Earthy', 'Nutty'],
      qualities: 'Standard',
      caffeine: 'No Caffeine',
      allergens: [],
      isOrganic: true,
      isVegan: true,
      images: [],
      variants: [
        { weight: '50g', price: 3.40, stock: 110 },
        { weight: '100g', price: 5.80, stock: 90 },
        { weight: '250g', price: 12.50, stock: 55 },
        { weight: '500g', price: 21.90, stock: 35 },
      ],
      steepeingInstructions: {
        servingSize: '2g per cup',
        waterTemp: '100°C',
        steepingTime: '5-7 minutes',
        colorAfter: '15 minutes',
      },
      ingredients: 'Rooibos (Aspalathus linearis)',
    },
    {
      name: 'Wuyi Rock Oolong Tea',
      description: 'Roasted, mineral and complex. Grown in the rocky cliffs of Wuyi Mountains.',
      category: 'Oolong',
      origin: 'China',
      flavor: ['Roasted', 'Earthy', 'Mineral'],
      qualities: 'Premium',
      caffeine: 'Medium Caffeine',
      allergens: [],
      isOrganic: false,
      isVegan: true,
      images: [],
      variants: [
        { weight: '50g', price: 6.90, stock: 60 },
        { weight: '100g', price: 11.90, stock: 45 },
        { weight: '250g', price: 26.90, stock: 25 },
      ],
      steepeingInstructions: {
        servingSize: '3g per cup',
        waterTemp: '95°C',
        steepingTime: '3-4 minutes',
        colorAfter: '10 minutes',
      },
      ingredients: 'Wuyi rock oolong tea leaves',
    },
  ];

  await Product.insertMany(products);
  console.log('✅ Seed data inserted successfully');
  console.log('👤 Superadmin: superadmin@tea.com / password123');
  console.log('👤 Admin: admin@tea.com / password123');
  console.log('👤 User: user@tea.com / password123');
  process.exit(0);
};

seed().catch(err => { console.error(err); process.exit(1); });
