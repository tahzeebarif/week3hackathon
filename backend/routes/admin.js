const express = require('express');
const router = express.Router();
const { getAnalytics, getUsers, toggleBlockUser, updateUserRole } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.get('/analytics', authorize('admin', 'superadmin'), getAnalytics);
router.get('/users', authorize('admin', 'superadmin'), getUsers);
router.put('/users/:id/block', authorize('superadmin'), toggleBlockUser);
router.put('/users/:id/role', authorize('superadmin'), updateUserRole);

module.exports = router;
