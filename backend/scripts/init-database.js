const db = require('../config/database');
const bcrypt = require('bcryptjs');

async function initializeDatabase() {
  try {
    console.log('🔄 Initializing database with sample data...');

    // Create sample users
    const sampleUsers = [
      {
        email: 'john@brewconnect.com',
        password: await bcrypt.hash('password123', 12),
        firstName: 'John',
        lastName: 'Smith',
        userType: 'business'
      },
      {
        email: 'sarah@techforward.com',
        password: await bcrypt.hash('password123', 12),
        firstName: 'Sarah',
        lastName: 'Johnson',
        userType: 'business'
      },
      {
        email: 'mike@creativeminds.com',
        password: await bcrypt.hash('password123', 12),
        firstName: 'Mike',
        lastName: 'Chen',
        userType: 'business'
      },
      {
        email: 'emma@strategicgrowth.com',
        password: await bcrypt.hash('password123', 12),
        firstName: 'Emma',
        lastName: 'Davis',
        userType: 'business'
      },
      {
        email: 'alex@example.com',
        password: await bcrypt.hash('password123', 12),
        firstName: 'Alex',
        lastName: 'Wilson',
        userType: 'professional'
      },
      {
        email: 'jessica@example.com',
        password: await bcrypt.hash('password123', 12),
        firstName: 'Jessica',
        lastName: 'Brown',
        userType: 'professional'
      }
    ];

    // Insert users
    for (const user of sampleUsers) {
      const result = await db.run(
        'INSERT INTO users (email, password, first_name, last_name, user_type) VALUES (?, ?, ?, ?, ?)',
        [user.email, user.password, user.firstName, user.lastName, user.userType]
      );
      console.log(`✅ Created user: ${user.email} (ID: ${result.id})`);
    }

    // Create sample business profiles
    const businessProfiles = [
      {
        userId: 1,
        businessName: 'Brew & Connect Café',
        category: 'food',
        description: 'A cozy neighborhood café fostering professional connections over artisanal coffee and fresh pastries.',
        phone: '(555) 123-4567',
        address: '123 Main Street, Downtown',
        website: 'https://brewconnect.com',
        foundedYear: 2020,
        services: ['Coffee & Beverages', 'Meeting Spaces', 'Catering', 'Event Hosting'],
        specializations: ['Networking Events', 'Business Meetings', 'Community Workspace']
      },
      {
        userId: 2,
        businessName: 'TechForward Solutions',
        category: 'technology',
        description: 'Innovative web development and digital transformation services for modern businesses.',
        phone: '(555) 234-5678',
        address: '456 Tech Avenue, Innovation District',
        website: 'https://techforward.com',
        foundedYear: 2018,
        services: ['Web Development', 'Mobile Apps', 'Cloud Solutions', 'Digital Strategy'],
        specializations: ['React', 'Node.js', 'AWS', 'DevOps']
      },
      {
        userId: 3,
        businessName: 'Creative Minds Marketing',
        category: 'marketing',
        description: 'Full-service marketing agency specializing in brand development and digital campaigns.',
        phone: '(555) 345-6789',
        address: '789 Creative Boulevard, Arts Quarter',
        website: 'https://creativeminds.com',
        foundedYear: 2019,
        services: ['Brand Strategy', 'Digital Marketing', 'Content Creation', 'Social Media'],
        specializations: ['Startup Branding', 'B2B Marketing', 'Influencer Campaigns']
      },
      {
        userId: 4,
        businessName: 'Strategic Growth Consulting',
        category: 'consulting',
        description: 'Business consulting firm helping companies optimize operations and accelerate growth.',
        phone: '(555) 456-7890',
        address: '321 Business Plaza, Financial District',
        website: 'https://strategicgrowth.com',
        foundedYear: 2017,
        services: ['Business Strategy', 'Operations Consulting', 'Financial Planning', 'Market Analysis'],
        specializations: ['Startup Consulting', 'Digital Transformation', 'Process Optimization']
      }
    ];

    // Insert business profiles
    for (const profile of businessProfiles) {
      await db.run(`
        INSERT INTO business_profiles 
        (user_id, business_name, category, description, phone, address, website, founded_year, services, specializations)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        profile.userId,
        profile.businessName,
        profile.category,
        profile.description,
        profile.phone,
        profile.address,
        profile.website,
        profile.foundedYear,
        JSON.stringify(profile.services),
        JSON.stringify(profile.specializations)
      ]);
      console.log(`✅ Created business profile: ${profile.businessName}`);
    }

    // Create sample professional profiles
    const professionalProfiles = [
      {
        userId: 5,
        title: 'Senior Software Engineer',
        company: 'Tech Innovations Inc.',
        experienceYears: 7,
        skills: ['JavaScript', 'React', 'Node.js', 'Python', 'AWS'],
        bio: 'Experienced full-stack developer passionate about building scalable web applications and mentoring junior developers.',
        phone: '(555) 567-8901',
        linkedinUrl: 'https://linkedin.com/in/alexwilson',
        portfolioUrl: 'https://alexwilson.dev',
        hourlyRate: 85.00,
        availability: 'available'
      },
      {
        userId: 6,
        title: 'UX/UI Designer',
        company: 'Design Studio Pro',
        experienceYears: 5,
        skills: ['Figma', 'Adobe Creative Suite', 'User Research', 'Prototyping', 'Design Systems'],
        bio: 'Creative designer focused on user-centered design and creating intuitive digital experiences.',
        phone: '(555) 678-9012',
        linkedinUrl: 'https://linkedin.com/in/jessicabrown',
        portfolioUrl: 'https://jessicabrown.design',
        hourlyRate: 75.00,
        availability: 'available'
      }
    ];

    // Insert professional profiles
    for (const profile of professionalProfiles) {
      await db.run(`
        INSERT INTO professional_profiles 
        (user_id, title, company, experience_years, skills, bio, phone, linkedin_url, portfolio_url, hourly_rate, availability)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        profile.userId,
        profile.title,
        profile.company,
        profile.experienceYears,
        JSON.stringify(profile.skills),
        profile.bio,
        profile.phone,
        profile.linkedinUrl,
        profile.portfolioUrl,
        profile.hourlyRate,
        profile.availability
      ]);
      console.log(`✅ Created professional profile: ${profile.title}`);
    }

    // Create sample reviews
    const reviews = [
      { reviewerId: 5, businessId: 1, rating: 5, reviewText: 'Amazing coffee and perfect atmosphere for client meetings!' },
      { reviewerId: 6, businessId: 1, rating: 5, reviewText: 'Love the community vibe here. Great place to network!' },
      { reviewerId: 5, businessId: 2, rating: 5, reviewText: 'Excellent technical expertise and professional service.' },
      { reviewerId: 6, businessId: 3, rating: 4, reviewText: 'Creative team with fresh ideas. Delivered on time!' }
    ];

    for (const review of reviews) {
      await db.run(
        'INSERT INTO reviews (reviewer_id, business_id, rating, review_text) VALUES (?, ?, ?, ?)',
        [review.reviewerId, review.businessId, review.rating, review.reviewText]
      );
    }
    console.log('✅ Created sample reviews');

    console.log('🎉 Database initialization complete!');
    console.log('');
    console.log('📋 Sample Accounts:');
    console.log('Business Owner: john@brewconnect.com / password123');
    console.log('Business Owner: sarah@techforward.com / password123');
    console.log('Professional: alex@example.com / password123');
    console.log('Professional: jessica@example.com / password123');
    console.log('');

  } catch (error) {
    console.error('❌ Database initialization failed:', error);
  }
}

// Run if called directly
if (require.main === module) {
  initializeDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = initializeDatabase;
