const db = require('./config/database');
const bcrypt = require('bcryptjs');

async function seedProfessionals() {
  try {
    console.log('🌱 Starting to seed professional profiles...');

    const professionals = [
      {
        // User data
        email: 'jessica.parker@example.com',
        password: 'password123',
        firstName: 'Jessica',
        lastName: 'Parker',
        userType: 'professional',
        // Professional profile data
        title: 'Senior Full Stack Developer',
        company: 'TechCorp Solutions',
        experienceYears: 8,
        skills: '["JavaScript", "React", "Node.js", "Python", "AWS", "Docker"]',
        bio: 'Passionate full-stack developer with 8+ years of experience building scalable web applications. Specialized in React and Node.js ecosystems.',
        phone: '(555) 111-2222',
        linkedinUrl: 'https://linkedin.com/in/jessicaparker',
        portfolioUrl: 'https://jessicaparker.dev',
        hourlyRate: 120,
        availability: 'available'
      },
      {
        email: 'michael.rodriguez@example.com',
        password: 'password123',
        firstName: 'Michael',
        lastName: 'Rodriguez',
        userType: 'professional',
        title: 'UX/UI Designer',
        company: 'Creative Studio Inc',
        experienceYears: 6,
        skills: '["Figma", "Adobe XD", "Sketch", "Prototyping", "User Research", "Wireframing"]',
        bio: 'Award-winning UX/UI designer focused on creating intuitive and beautiful user experiences. Expertise in user-centered design and design systems.',
        phone: '(555) 222-3333',
        linkedinUrl: 'https://linkedin.com/in/michaelrodriguez',
        portfolioUrl: 'https://michaelrodriguez.design',
        hourlyRate: 95,
        availability: 'available'
      },
      {
        email: 'sophia.chen@example.com',
        password: 'password123',
        firstName: 'Sophia',
        lastName: 'Chen',
        userType: 'professional',
        title: 'Digital Marketing Strategist',
        company: 'Growth Marketing Agency',
        experienceYears: 7,
        skills: '["SEO", "Content Marketing", "Social Media", "Google Analytics", "PPC", "Email Marketing"]',
        bio: 'Data-driven digital marketing strategist with proven track record of driving growth for B2B and B2C companies. Specialized in SEO and content strategy.',
        phone: '(555) 333-4444',
        linkedinUrl: 'https://linkedin.com/in/sophiachen',
        portfolioUrl: null,
        hourlyRate: 85,
        availability: 'busy'
      },
      {
        email: 'david.williams@example.com',
        password: 'password123',
        firstName: 'David',
        lastName: 'Williams',
        userType: 'professional',
        title: 'Data Scientist',
        company: 'Analytics Pro',
        experienceYears: 5,
        skills: '["Python", "Machine Learning", "SQL", "TensorFlow", "Data Visualization", "Statistics"]',
        bio: 'Data scientist specializing in machine learning and predictive analytics. Experience with large-scale data processing and business intelligence.',
        phone: '(555) 444-5555',
        linkedinUrl: 'https://linkedin.com/in/davidwilliams',
        portfolioUrl: 'https://davidwilliams-data.com',
        hourlyRate: 140,
        availability: 'available'
      },
      {
        email: 'emily.thompson@example.com',
        password: 'password123',
        firstName: 'Emily',
        lastName: 'Thompson',
        userType: 'professional',
        title: 'Project Manager',
        company: 'Agile Solutions Group',
        experienceYears: 10,
        skills: '["Agile", "Scrum", "Project Planning", "Stakeholder Management", "Risk Management", "Jira"]',
        bio: 'Certified PMP and Scrum Master with 10+ years managing complex software projects. Expert in Agile methodologies and team leadership.',
        phone: '(555) 555-6666',
        linkedinUrl: 'https://linkedin.com/in/emilythompson',
        portfolioUrl: null,
        hourlyRate: 110,
        availability: 'available'
      },
      {
        email: 'carlos.martinez@example.com',
        password: 'password123',
        firstName: 'Carlos',
        lastName: 'Martinez',
        userType: 'professional',
        title: 'Cybersecurity Specialist',
        company: 'SecureNet Consulting',
        experienceYears: 9,
        skills: '["Network Security", "Penetration Testing", "CISSP", "Firewall Management", "Incident Response", "Cloud Security"]',
        bio: 'CISSP certified cybersecurity expert with extensive experience in enterprise security. Specialized in threat detection and security architecture.',
        phone: '(555) 666-7777',
        linkedinUrl: 'https://linkedin.com/in/carlosmartinez',
        portfolioUrl: null,
        hourlyRate: 150,
        availability: 'busy'
      },
      {
        email: 'amanda.lee@example.com',
        password: 'password123',
        firstName: 'Amanda',
        lastName: 'Lee',
        userType: 'professional',
        title: 'Content Writer & Copywriter',
        company: 'Freelance',
        experienceYears: 4,
        skills: '["Content Writing", "Copywriting", "SEO Writing", "Technical Writing", "Blog Posts", "Social Media Content"]',
        bio: 'Creative content writer and copywriter helping businesses tell their story. Specialized in B2B SaaS and tech industry content.',
        phone: '(555) 777-8888',
        linkedinUrl: 'https://linkedin.com/in/amandalee',
        portfolioUrl: 'https://amandalee.writing.com',
        hourlyRate: 75,
        availability: 'available'
      },
      {
        email: 'james.brown@example.com',
        password: 'password123',
        firstName: 'James',
        lastName: 'Brown',
        userType: 'professional',
        title: 'Mobile App Developer',
        company: 'AppVentures',
        experienceYears: 6,
        skills: '["React Native", "iOS Development", "Android Development", "Flutter", "Firebase", "Mobile UI/UX"]',
        bio: 'Mobile app developer with expertise in cross-platform development. Built 50+ apps for startups and enterprises.',
        phone: '(555) 888-9999',
        linkedinUrl: 'https://linkedin.com/in/jamesbrown',
        portfolioUrl: 'https://jamesbrown-apps.com',
        hourlyRate: 115,
        availability: 'available'
      }
    ];

    for (const prof of professionals) {
      try {
        // Check if user already exists
        const existingUser = await db.get('SELECT id FROM users WHERE email = ?', [prof.email]);
        
        if (existingUser) {
          console.log(`⚠️  User ${prof.email} already exists, skipping...`);
          continue;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(prof.password, 12);

        // Insert user
        const userResult = await db.run(
          `INSERT INTO users (email, password, first_name, last_name, user_type, is_verified, is_active) 
           VALUES (?, ?, ?, ?, ?, 1, 1)`,
          [prof.email, hashedPassword, prof.firstName, prof.lastName, prof.userType]
        );

        const userId = userResult.id;

        // Insert professional profile
        await db.run(
          `INSERT INTO professional_profiles 
           (user_id, title, company, experience_years, skills, bio, phone, linkedin_url, portfolio_url, hourly_rate, availability) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            userId,
            prof.title,
            prof.company,
            prof.experienceYears,
            prof.skills,
            prof.bio,
            prof.phone,
            prof.linkedinUrl,
            prof.portfolioUrl,
            prof.hourlyRate,
            prof.availability
          ]
        );

        console.log(`✅ Created professional: ${prof.firstName} ${prof.lastName} - ${prof.title}`);
      } catch (error) {
        console.error(`❌ Error creating ${prof.email}:`, error.message);
      }
    }

    console.log('\n🎉 Professional profiles seeding completed!');
    
    // Count total professionals
    const count = await db.get('SELECT COUNT(*) as count FROM professional_profiles');
    console.log(`📊 Total professional profiles in database: ${count.count}`);

  } catch (error) {
    console.error('❌ Seeding error:', error);
  } finally {
    process.exit(0);
  }
}

// Run the seeding
seedProfessionals();

