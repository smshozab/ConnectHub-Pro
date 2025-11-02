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

### 🔄 Coming Soon
- User authentication and profiles
- Real-time messaging system
- Event management
- Advanced search algorithms
- Backend API integration

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
npm install
```

3. **Build CSS:**
```bash
npm run build:css
```

4. **Start development server:**
```bash
npm run dev
```

5. **Open in browser:**
```
http://localhost:8000
```

## 📁 Project Structure

```
ConnectHub/
├── pages/                          # HTML pages
│   ├── homepage.html              # Landing page
│   ├── business_directory.html    # Business listings with search
│   ├── professional_network.html  # Professional profiles
│   ├── profile_creation_wizard.html # Multi-step profile setup
│   ├── community_dashboard.html   # User dashboard
│   └── member_profile_pages.html  # Member profiles
├── css/
│   ├── tailwind.css              # Tailwind source with custom utilities
│   └── main.css                  # Compiled CSS (auto-generated)
├── js/                           # JavaScript modules
│   ├── main.js                   # Core functionality & utilities
│   ├── business-directory.js     # Search & filtering logic
│   └── profile-wizard.js         # Form validation & wizard flow
├── public/
│   └── manifest.json            # PWA manifest
├── index.html                   # Entry point with auto-redirect
├── package.json                 # Dependencies & scripts
├── tailwind.config.js          # Tailwind configuration
└── README.md                   # This file
```

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

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

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

## 📞 Support

For support, questions, or feature requests:
- Create an issue on GitHub
- Email: support@connecthub-pro.com
- Documentation: [Wiki](https://github.com/yourusername/connecthub-pro/wiki)

---

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

## 🙏 Acknowledgments

- Built with [Rocket.new](https://rocket.new)
- Powered by HTML and Tailwind CSS

Built with ❤️ on Rocket.new
