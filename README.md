# ConnectHub Pro

> **Where Local Business Meets Professional Expertise**

A modern, responsive professional networking platform built with HTML, Tailwind CSS, and JavaScript. ConnectHub Pro connects local businesses with skilled professionals in their community.

## 🚀 Features

### ✅ Implemented
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Interactive Navigation** - Smooth mobile menu with JavaScript
- **Business Directory** - Enhanced search, filtering, and real-time results
- **Profile Creation Wizard** - Multi-step forms with validation
- **Form Validation** - Real-time validation with user-friendly error messages
- **Modern UI/UX** - Clean, professional design with smooth animations
- **Backend API** - RESTful API with Express.js and SQLite
- **User Authentication** - JWT-based authentication with bcrypt password hashing
- **Database Integration** - SQLite database with user, business, and professional profiles
- **Security** - Helmet, CORS, rate limiting, and input validation

### 🔄 Coming Soon
- Real-time messaging system
- Event management
- Advanced search algorithms
- Profile image uploads
- Review and rating system
- Advanced filtering and recommendations

## 📋 Prerequisites

- Node.js (v12.x or higher)
- npm or yarn
- Modern web browser

## 🛠️ Installation & Setup

1. **Clone the repository:**
```bash
git clone https://github.com/yourusername/connecthub-pro.git
cd connecthub-pro
```

2. **Install dependencies:**
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..

# Install frontend-server dependencies
cd frontend-server
npm install
cd ..
```

3. **Configure Backend Environment:**
Create a `.env` file in the `backend` directory:
```bash
cd backend
# Copy the example below or create manually
```

Example `.env` file:
```env
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:8080
JWT_SECRET=your-super-secret-jwt-key-change-this
SESSION_EXPIRE=7d
```

4. **Build CSS:**
```bash
npm run build:css
```

5. **Start Servers:**

**Option 1: Use the launcher (Windows)**
```bash
start-connecthub.bat
```

**Option 2: Manual start**
```bash
# Terminal 1 - Backend API
cd backend
node minimal-backend.js    # For development with demo users
# OR
node server.js            # For production with database

# Terminal 2 - Frontend Server
cd frontend-server
node minimal-frontend.js  # For development
# OR  
node server.js           # For production

# Terminal 3 - Frontend CSS Development (optional)
npm run dev
```

6. **Open in browser:**
```
http://localhost:8080/pages/homepage.html
```

## 📁 Project Structure

```
ConnectHub/
├── backend/                       # Backend API server
│   ├── config/
│   │   └── database.js           # SQLite database configuration
│   ├── database/
│   │   └── connecthub.db         # SQLite database file
│   ├── middleware/
│   │   └── auth.js               # Authentication middleware
│   ├── routes/
│   │   ├── auth.js               # Authentication routes
│   │   ├── businesses.js         # Business routes
│   │   ├── messages.js           # Messaging routes
│   │   └── profiles.js           # Profile routes
│   ├── scripts/
│   │   └── init-database.js      # Database initialization script
│   ├── minimal-backend.js        # Minimal dev server (in-memory auth)
│   ├── server.js                 # Production server (database auth)
│   ├── package.json              # Backend dependencies
│   └── .env                      # Environment variables (create this!)
├── frontend-server/              # Frontend static file server
│   ├── minimal-frontend.js       # Minimal static server
│   ├── no-auth-server.js         # Dev server without auth
│   ├── server.js                 # Production frontend server
│   └── package.json              # Frontend server dependencies
├── pages/                        # HTML pages
│   ├── homepage.html             # Landing page
│   ├── business_directory.html   # Business listings with search
│   ├── professional_network.html # Professional profiles
│   ├── profile_creation_wizard.html # Multi-step profile setup
│   ├── community_dashboard.html  # User dashboard
│   └── member_profile_pages.html # Member profiles
├── css/
│   ├── tailwind.css              # Tailwind source with custom utilities
│   └── main.css                  # Compiled CSS (auto-generated)
├── js/                           # JavaScript modules
│   ├── main.js                   # Core functionality & utilities
│   ├── business-directory.js     # Search & filtering logic
│   └── profile-wizard.js         # Form validation & wizard flow
├── public/
│   └── manifest.json             # PWA manifest
├── index.html                    # Entry point with auto-redirect
├── start-connecthub.bat          # Windows launcher with options
├── start-servers.bat             # Quick server start script
├── server-status.bat             # Check server status
├── package.json                  # Frontend dependencies & scripts
├── tailwind.config.js            # Tailwind configuration
└── README.md                     # This file
```

## 🔌 Backend API

The backend API provides the following endpoints:

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile (requires auth)
- `POST /api/auth/logout` - Logout user (requires auth)
- `POST /api/auth/change-password` - Change password (requires auth)

### Profiles
- `GET /api/profiles` - Get all profiles
- `GET /api/profiles/:id` - Get specific profile
- `PUT /api/profiles/:id` - Update profile (requires auth)
- `DELETE /api/profiles/:id` - Delete profile (requires auth)

### Businesses
- `GET /api/businesses` - Get all businesses
- `GET /api/businesses/:id` - Get specific business
- `POST /api/businesses` - Create business (requires auth)
- `PUT /api/businesses/:id` - Update business (requires auth)
- `DELETE /api/businesses/:id` - Delete business (requires auth)

### Messages
- `GET /api/messages` - Get user messages (requires auth)
- `POST /api/messages` - Send message (requires auth)
- `GET /api/messages/:id` - Get specific message (requires auth)
- `PUT /api/messages/:id/read` - Mark message as read (requires auth)

### Health Check
- `GET /api/health` - Check API status

### Demo Accounts
For development and testing:
- **Business**: john@brewconnect.com / password123
- **Professional**: alex@example.com / password123

## 🎨 Styling & Design System

### Color Palette
- **Primary**: Forest Green (`#2B5D4F`) - Professional, trustworthy
- **Secondary**: Earth Brown (`#8B4513`) - Warm, approachable  
- **Accent**: Coral (`#FF6B35`) - Energetic, attention-grabbing
- **Background**: Clean whites and light grays

### Typography
- **Primary**: Inter - Clean, modern sans-serif
- **Accent**: Playfair Display - Elegant serif for headings

### Custom Components
- `btn-primary` - Primary action buttons
- `btn-secondary` - Secondary action buttons  
- `card` - Content containers with shadow
- `input-field` - Form inputs with consistent styling

## 💻 Development

### NPM Scripts
```bash
npm run build:css    # Compile Tailwind CSS
npm run watch:css    # Watch for changes and recompile
npm run dev          # Start development with CSS watching
```

### Adding New Features
1. Create feature-specific JS files in `/js/`
2. Add styles to `/css/tailwind.css` if needed
3. Run `npm run build:css` to compile changes
4. Test across different screen sizes

### JavaScript Architecture
- **main.js**: Core utilities, mobile menu, form validation helpers
- **business-directory.js**: Search functionality, filtering, animations
- **profile-wizard.js**: Multi-step forms, validation, data persistence

## 🔧 Configuration

### Tailwind CSS
Custom configuration in `tailwind.config.js` includes:
- Extended color palette
- Custom spacing and typography
- Component classes
- Animation utilities

### Browser Support
- Chrome/Edge 80+
- Firefox 75+
- Safari 13+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🚀 Deployment

### Quick Deploy Options
1. **GitHub Pages**: Push to GitHub and enable Pages
2. **Netlify**: Connect repository for automatic deployments
3. **Vercel**: Import project for instant deployment

### Production Build
```bash
npm run build:css
# Deploy all files except node_modules/
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
## 🎯 Roadmap

### Phase 1 (Current)
- [x] Responsive UI/UX
- [x] Core navigation
- [x] Search functionality
- [x] Form validation

### Phase 2
- [ ] User authentication
- [ ] Profile management
- [ ] Real-time notifications
- [ ] Advanced filtering

### Phase 3
- [ ] Messaging system
- [ ] Event management
- [ ] Review system
- [ ] API integration


**ConnectHub Pro** - Building stronger professional communities, one connection at a time.


## 🧩 Customization

To customize the Tailwind configuration, edit the `tailwind.config.js` file:


## 📦 Build for Production

Build the CSS for production:

```bash
npm run build:css
# or
yarn build:css
```

## 📱 Responsive Design

The app is built with responsive design using Tailwind CSS breakpoints:

- `sm`: 640px and up
- `md`: 768px and up
- `lg`: 1024px and up
- `xl`: 1280px and up
- `2xl`: 1536px and up


Built with ❤️ by Shozab Mehdi
