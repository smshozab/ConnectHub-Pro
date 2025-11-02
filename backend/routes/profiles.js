const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const { authenticateToken, requireUserType } = require('../middleware/auth');

const router = express.Router();

// Create business profile
router.post('/business', [
  authenticateToken,
  requireUserType('business'),
  body('businessName').notEmpty().trim(),
  body('category').notEmpty().trim(),
  body('description').notEmpty().trim(),
  body('phone').optional().isMobilePhone(),
  body('website').optional().isURL()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      businessName,
      category,
      description,
      phone,
      address,
      website,
      foundedYear,
      services,
      specializations
    } = req.body;

    const userId = req.user.id;

    // Check if profile already exists
    const existingProfile = await db.get(
      'SELECT id FROM business_profiles WHERE user_id = ?',
      [userId]
    );

    if (existingProfile) {
      return res.status(409).json({
        success: false,
        message: 'Business profile already exists'
      });
    }

    // Create business profile
    const result = await db.run(`
      INSERT INTO business_profiles 
      (user_id, business_name, category, description, phone, address, website, founded_year, services, specializations)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      userId,
      businessName,
      category,
      description,
      phone || null,
      address || null,
      website || null,
      foundedYear || null,
      JSON.stringify(services || []),
      JSON.stringify(specializations || [])
    ]);

    res.status(201).json({
      success: true,
      message: 'Business profile created successfully',
      data: {
        profileId: result.id
      }
    });

  } catch (error) {
    console.error('Create business profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create business profile'
    });
  }
});

// Create professional profile
router.post('/professional', [
  authenticateToken,
  requireUserType('professional'),
  body('title').notEmpty().trim(),
  body('experienceYears').isInt({ min: 0 }),
  body('skills').isArray(),
  body('bio').notEmpty().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      title,
      company,
      experienceYears,
      skills,
      bio,
      phone,
      linkedinUrl,
      portfolioUrl,
      hourlyRate
    } = req.body;

    const userId = req.user.id;

    // Check if profile already exists
    const existingProfile = await db.get(
      'SELECT id FROM professional_profiles WHERE user_id = ?',
      [userId]
    );

    if (existingProfile) {
      return res.status(409).json({
        success: false,
        message: 'Professional profile already exists'
      });
    }

    // Create professional profile
    const result = await db.run(`
      INSERT INTO professional_profiles 
      (user_id, title, company, experience_years, skills, bio, phone, linkedin_url, portfolio_url, hourly_rate)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      userId,
      title,
      company || null,
      experienceYears,
      JSON.stringify(skills),
      bio,
      phone || null,
      linkedinUrl || null,
      portfolioUrl || null,
      hourlyRate || null
    ]);

    res.status(201).json({
      success: true,
      message: 'Professional profile created successfully',
      data: {
        profileId: result.id
      }
    });

  } catch (error) {
    console.error('Create professional profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create professional profile'
    });
  }
});

// Get user's own profile
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const userType = req.user.user_type;

    let profile;
    if (userType === 'business') {
      profile = await db.get(`
        SELECT bp.*, u.first_name, u.last_name, u.email
        FROM business_profiles bp
        JOIN users u ON bp.user_id = u.id
        WHERE bp.user_id = ?
      `, [userId]);
    } else {
      profile = await db.get(`
        SELECT pp.*, u.first_name, u.last_name, u.email
        FROM professional_profiles pp
        JOIN users u ON pp.user_id = u.id
        WHERE pp.user_id = ?
      `, [userId]);
    }

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    // Parse JSON fields
    if (profile.services) profile.services = JSON.parse(profile.services);
    if (profile.specializations) profile.specializations = JSON.parse(profile.specializations);
    if (profile.skills) profile.skills = JSON.parse(profile.skills);

    res.json({
      success: true,
      data: profile
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get profile'
    });
  }
});

// Update business profile
router.put('/business', [
  authenticateToken,
  requireUserType('business')
], async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      businessName,
      category,
      description,
      phone,
      address,
      website,
      foundedYear,
      services,
      specializations
    } = req.body;

    // Check if profile exists
    const existingProfile = await db.get(
      'SELECT id FROM business_profiles WHERE user_id = ?',
      [userId]
    );

    if (!existingProfile) {
      return res.status(404).json({
        success: false,
        message: 'Business profile not found'
      });
    }

    // Update profile
    await db.run(`
      UPDATE business_profiles SET
        business_name = COALESCE(?, business_name),
        category = COALESCE(?, category),
        description = COALESCE(?, description),
        phone = COALESCE(?, phone),
        address = COALESCE(?, address),
        website = COALESCE(?, website),
        founded_year = COALESCE(?, founded_year),
        services = COALESCE(?, services),
        specializations = COALESCE(?, specializations),
        updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ?
    `, [
      businessName,
      category,
      description,
      phone,
      address,
      website,
      foundedYear,
      services ? JSON.stringify(services) : null,
      specializations ? JSON.stringify(specializations) : null,
      userId
    ]);

    res.json({
      success: true,
      message: 'Business profile updated successfully'
    });

  } catch (error) {
    console.error('Update business profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update business profile'
    });
  }
});

// Update professional profile
router.put('/professional', [
  authenticateToken,
  requireUserType('professional')
], async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      title,
      company,
      experienceYears,
      skills,
      bio,
      phone,
      linkedinUrl,
      portfolioUrl,
      hourlyRate,
      availability
    } = req.body;

    // Check if profile exists
    const existingProfile = await db.get(
      'SELECT id FROM professional_profiles WHERE user_id = ?',
      [userId]
    );

    if (!existingProfile) {
      return res.status(404).json({
        success: false,
        message: 'Professional profile not found'
      });
    }

    // Update profile
    await db.run(`
      UPDATE professional_profiles SET
        title = COALESCE(?, title),
        company = COALESCE(?, company),
        experience_years = COALESCE(?, experience_years),
        skills = COALESCE(?, skills),
        bio = COALESCE(?, bio),
        phone = COALESCE(?, phone),
        linkedin_url = COALESCE(?, linkedin_url),
        portfolio_url = COALESCE(?, portfolio_url),
        hourly_rate = COALESCE(?, hourly_rate),
        availability = COALESCE(?, availability),
        updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ?
    `, [
      title,
      company,
      experienceYears,
      skills ? JSON.stringify(skills) : null,
      bio,
      phone,
      linkedinUrl,
      portfolioUrl,
      hourlyRate,
      availability,
      userId
    ]);

    res.json({
      success: true,
      message: 'Professional profile updated successfully'
    });

  } catch (error) {
    console.error('Update professional profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update professional profile'
    });
  }
});

// Get business profile by user_id
router.get('/business/user/:userId', authenticateToken, async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Only allow users to see their own profile (or implement proper authorization)
    if (req.user.id != userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this profile'
      });
    }
    
    const profile = await db.get(
      'SELECT * FROM business_profiles WHERE user_id = ?',
      [userId]
    );
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }
    
    // Parse JSON fields
    if (profile.services) {
      try {
        profile.services = JSON.parse(profile.services);
      } catch (e) {
        profile.services = [];
      }
    }
    if (profile.specializations) {
      try {
        profile.specializations = JSON.parse(profile.specializations);
      } catch (e) {
        profile.specializations = [];
      }
    }
    
    res.json({
      success: true,
      data: profile
    });
    
  } catch (error) {
    console.error('Get business profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile'
    });
  }
});

// Get professional profile by user_id
router.get('/professional/user/:userId', authenticateToken, async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Only allow users to see their own profile (or implement proper authorization)
    if (req.user.id != userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this profile'
      });
    }
    
    const profile = await db.get(
      'SELECT * FROM professional_profiles WHERE user_id = ?',
      [userId]
    );
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }
    
    // Parse JSON fields
    if (profile.skills) {
      try {
        profile.skills = JSON.parse(profile.skills);
      } catch (e) {
        profile.skills = [];
      }
    }
    if (profile.certifications) {
      try {
        profile.certifications = JSON.parse(profile.certifications);
      } catch (e) {
        profile.certifications = [];
      }
    }
    if (profile.languages) {
      try {
        profile.languages = JSON.parse(profile.languages);
      } catch (e) {
        profile.languages = [];
      }
    }
    
    res.json({
      success: true,
      data: profile
    });
    
  } catch (error) {
    console.error('Get professional profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile'
    });
  }
});

module.exports = router;
