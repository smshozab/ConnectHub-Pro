const express = require('express');
const { query } = require('express-validator');
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all businesses (public endpoint)
router.get('/', [
  query('category').optional().trim(),
  query('search').optional().trim(),
  query('rating').optional().isFloat({ min: 0, max: 5 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('offset').optional().isInt({ min: 0 })
], async (req, res) => {
  try {
    const {
      category,
      search,
      rating,
      limit = 20,
      offset = 0
    } = req.query;

    let query_sql = `
      SELECT 
        bp.*,
        u.first_name,
        u.last_name,
        u.email,
        COUNT(r.id) as review_count,
        COALESCE(AVG(r.rating), 0) as avg_rating
      FROM business_profiles bp
      JOIN users u ON bp.user_id = u.id
      LEFT JOIN reviews r ON bp.id = r.business_id
      WHERE u.is_active = 1
    `;

    const params = [];

    // Add filters
    if (category) {
      query_sql += ' AND bp.category = ?';
      params.push(category);
    }

    if (search) {
      query_sql += ' AND (bp.business_name LIKE ? OR bp.description LIKE ? OR bp.services LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    query_sql += ' GROUP BY bp.id';

    if (rating) {
      query_sql += ' HAVING avg_rating >= ?';
      params.push(rating);
    }

    query_sql += ' ORDER BY bp.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const businesses = await db.all(query_sql, params);

    // Parse JSON fields
    businesses.forEach(business => {
      if (business.services) business.services = JSON.parse(business.services);
      if (business.specializations) business.specializations = JSON.parse(business.specializations);
    });

    // Get total count for pagination
    let countQuery = `
      SELECT COUNT(DISTINCT bp.id) as total
      FROM business_profiles bp
      JOIN users u ON bp.user_id = u.id
      LEFT JOIN reviews r ON bp.id = r.business_id
      WHERE u.is_active = 1
    `;

    const countParams = [];
    if (category) {
      countQuery += ' AND bp.category = ?';
      countParams.push(category);
    }
    if (search) {
      countQuery += ' AND (bp.business_name LIKE ? OR bp.description LIKE ? OR bp.services LIKE ?)';
      const searchTerm = `%${search}%`;
      countParams.push(searchTerm, searchTerm, searchTerm);
    }

    const countResult = await db.get(countQuery, countParams);

    res.json({
      success: true,
      data: {
        businesses,
        pagination: {
          total: countResult.total,
          limit: parseInt(limit),
          offset: parseInt(offset),
          hasMore: countResult.total > parseInt(offset) + parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Get businesses error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get businesses'
    });
  }
});

// Get single business by ID
router.get('/:id', async (req, res) => {
  try {
    const businessId = req.params.id;

    const business = await db.get(`
      SELECT 
        bp.*,
        u.first_name,
        u.last_name,
        u.email,
        COUNT(r.id) as review_count,
        COALESCE(AVG(r.rating), 0) as avg_rating
      FROM business_profiles bp
      JOIN users u ON bp.user_id = u.id
      LEFT JOIN reviews r ON bp.id = r.business_id
      WHERE bp.id = ? AND u.is_active = 1
      GROUP BY bp.id
    `, [businessId]);

    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'Business not found'
      });
    }

    // Parse JSON fields
    if (business.services) business.services = JSON.parse(business.services);
    if (business.specializations) business.specializations = JSON.parse(business.specializations);

    // Get recent reviews
    const reviews = await db.all(`
      SELECT 
        r.*,
        u.first_name,
        u.last_name
      FROM reviews r
      JOIN users u ON r.reviewer_id = u.id
      WHERE r.business_id = ?
      ORDER BY r.created_at DESC
      LIMIT 10
    `, [businessId]);

    res.json({
      success: true,
      data: {
        business,
        reviews
      }
    });

  } catch (error) {
    console.error('Get business error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get business'
    });
  }
});

// Get business categories
router.get('/meta/categories', async (req, res) => {
  try {
    const categories = await db.all(`
      SELECT 
        category,
        COUNT(*) as count
      FROM business_profiles bp
      JOIN users u ON bp.user_id = u.id
      WHERE u.is_active = 1
      GROUP BY category
      ORDER BY count DESC
    `);

    res.json({
      success: true,
      data: categories
    });

  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get categories'
    });
  }
});

// Add review (authenticated users only)
router.post('/:id/reviews', [
  authenticateToken
], async (req, res) => {
  try {
    const businessId = req.params.id;
    const { rating, reviewText } = req.body;
    const userId = req.user.id;

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    // Check if business exists
    const business = await db.get(
      'SELECT id FROM business_profiles WHERE id = ?',
      [businessId]
    );

    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'Business not found'
      });
    }

    // Check if user already reviewed this business
    const existingReview = await db.get(
      'SELECT id FROM reviews WHERE reviewer_id = ? AND business_id = ?',
      [userId, businessId]
    );

    if (existingReview) {
      return res.status(409).json({
        success: false,
        message: 'You have already reviewed this business'
      });
    }

    // Create review
    await db.run(
      'INSERT INTO reviews (reviewer_id, business_id, rating, review_text) VALUES (?, ?, ?, ?)',
      [userId, businessId, rating, reviewText || null]
    );

    res.status(201).json({
      success: true,
      message: 'Review added successfully'
    });

  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add review'
    });
  }
});

// Get business reviews
router.get('/:id/reviews', [
  query('limit').optional().isInt({ min: 1, max: 50 }),
  query('offset').optional().isInt({ min: 0 })
], async (req, res) => {
  try {
    const businessId = req.params.id;
    const { limit = 10, offset = 0 } = req.query;

    const reviews = await db.all(`
      SELECT 
        r.*,
        u.first_name,
        u.last_name
      FROM reviews r
      JOIN users u ON r.reviewer_id = u.id
      WHERE r.business_id = ?
      ORDER BY r.created_at DESC
      LIMIT ? OFFSET ?
    `, [businessId, parseInt(limit), parseInt(offset)]);

    const totalCount = await db.get(
      'SELECT COUNT(*) as total FROM reviews WHERE business_id = ?',
      [businessId]
    );

    res.json({
      success: true,
      data: {
        reviews,
        pagination: {
          total: totalCount.total,
          limit: parseInt(limit),
          offset: parseInt(offset),
          hasMore: totalCount.total > parseInt(offset) + parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get reviews'
    });
  }
});

module.exports = router;
