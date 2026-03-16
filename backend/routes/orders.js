const express = require('express');
const router = express.Router();
const {
  placeOrder, getMyOrders, getOrder, getAllOrders, updateOrderStatus
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.post('/place', placeOrder);
router.get('/my-orders', getMyOrders);
router.get('/:id', getOrder);
router.get('/', authorize('admin', 'superadmin'), getAllOrders);
router.put('/:id/status', authorize('admin', 'superadmin'), updateOrderStatus);

module.exports = router;
