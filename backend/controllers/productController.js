const Product = require('../models/Product');


exports.getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 9,
      category,
      origin,
      flavor,
      qualities,
      caffeine,
      allergens,
      organic,
      minPrice,
      maxPrice,
      sort = 'createdAt',
      search,
    } = req.query;

    const filter = { isActive: true };

    if (category) filter.category = { $in: category.split(',') };
    if (origin) filter.origin = { $in: origin.split(',') };
    if (flavor) filter.flavor = { $in: flavor.split(',') };
    if (qualities) filter.qualities = { $in: qualities.split(',') };
    if (caffeine) filter.caffeine = { $in: caffeine.split(',') };
    if (allergens) filter.allergens = { $in: allergens.split(',') };
    if (organic === 'true') filter.isOrganic = true;
    if (search) filter.name = { $regex: search, $options: 'i' };

    
    if (minPrice || maxPrice) {
      const priceFilter = {};
      if (minPrice) priceFilter.$gte = Number(minPrice);
      if (maxPrice) priceFilter.$lte = Number(maxPrice);
      filter['variants.price'] = priceFilter;
    }

    let sortObj = {};
    if (sort === 'price_asc') sortObj = { 'variants.0.price': 1 };
    else if (sort === 'price_desc') sortObj = { 'variants.0.price': -1 };
    else if (sort === 'rating') sortObj = { rating: -1 };
    else if (sort === 'name') sortObj = { name: 1 };
    else sortObj = { createdAt: -1 };

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter).sort(sortObj).skip(skip).limit(limitNum);

    res.json({
      success: true,
      products,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const images = req.files ? req.files.map(f => `/uploads/${f.filename}`) : [];
    const product = await Product.create({ ...req.body, images });
    res.status(201).json({ success: true, product });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, product });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, message: 'Product deactivated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
exports.getRelatedProducts = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    const related = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      isActive: true,
    }).limit(4);
    res.json({ success: true, products: related });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
