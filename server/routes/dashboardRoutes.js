const express = require('express');
const router = express.Router();
const axios = require('axios');

// Proxy route for total users
router.get('/totalusers', async (req, res) => {
  try {
    const response = await axios.get('https://sc.ecombullet.com/api/dashboard/totalusers');
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      message: error.message || 'Error fetching total users'
    });
  }
});

module.exports = router; 