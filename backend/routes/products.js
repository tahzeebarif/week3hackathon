const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
  getProducts, getProduct, createProduct, updateProduct, deleteProduct, getRelatedProducts
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

router.get('/', getProducts);
router.get('/:id', getProduct);
router.get('/:id/related', getRelatedProducts);
router.post('/', protect, authorize('admin', 'superadmin'), upload.array('images', 5), createProduct);
router.put('/:id', protect, authorize('admin', 'superadmin'), updateProduct);
router.delete('/:id', protect, authorize('admin', 'superadmin'), deleteProduct);

module.exports = router;
