const express = require('express');
const router = express.Router();
const { authenticateJWT } = require('../utils/jwt');
const User = require('../models/user');

// GET /api/me/wishlists - requires Authorization: Bearer <token>
router.get('/me/wishlists', authenticateJWT, async (req, res) => {
  try {
    const userId = req.user && req.user._id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const user = await User.findById(userId).populate('wishlists');
    res.json({ wishlists: user.wishlists || [] });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
