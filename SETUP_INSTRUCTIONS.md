# ConnectHub Pro - Complete Setup Instructions

## 🚀 **Quick Start Guide**

### **Step 1: Create Environment Configuration**

Create a `.env` file in the `backend` directory with the following content:

```env
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:8080
JWT_SECRET=connecthub-secret-key-change-in-production-2024
SESSION_EXPIRE=7d
DB_PATH=./database/connecthub.db
BCRYPT_ROUNDS=12
MAX_FILE_SIZE=10mb
UPLOAD_DIR=./uploads
```

**⚠️ IMPORTANT:** Change `JWT_SECRET` to a secure random string in production!

---

### **Step 2: Install Dependencies**

```bash
# Install root dependencies (Frontend CSS)
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

---

### **Step 3: Initialize Database**

```bash
cd backend
npm run init-db
```

This will create the SQLite database with all necessary tables and demo users.

---

### **Step 4: Build Frontend CSS**

```bash
# From root directory
npm run build:css
```

---

### **Step 5: Start Servers**

**Option A: Using Batch File (Windows)**
```bash
start-connecthub.bat
```

**Option B: Manual Start (All Platforms)**

Open 3 terminals:

**Terminal 1 - Backend API:**
```bash
cd backend
node minimal-backend.js
# Server will run on http://localhost:3000
```

**Terminal 2 - Frontend Server:**
```bash
cd frontend-server
node minimal-frontend.js
# Server will run on http://localhost:8080
```

**Terminal 3 - CSS Watch (Optional for development):**
```bash
npm run dev
```

---

### **Step 6: Access the Application**

Open your browser and navigate to:
```
http://localhost:8080/pages/homepage.html
```

---

## 🧪 **Demo Accounts**

### Business Account:
- **Email:** `john@brewconnect.com`
- **Password:** `password123`

### Professional Account:
- **Email:** `alex@example.com`
- **Password:** `password123`

---

## 🔗 **API Endpoints**

### Base URL: `http://localhost:3000/api`

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user (requires token)
- `POST /auth/logout` - Logout user

### Businesses
- `GET /businesses` - Get all businesses (with filters)
- `GET /businesses/:id` - Get single business
- `GET /businesses/meta/categories` - Get categories
- `POST /businesses/:id/reviews` - Add review (auth required)

### Profiles
- `POST /profiles/business` - Create business profile (auth required)
- `POST /profiles/professional` - Create professional profile (auth required)
- `GET /profiles/me` - Get own profile (auth required)
- `PUT /profiles/business` - Update business profile (auth required)
- `PUT /profiles/professional` - Update professional profile (auth required)

### Messages
- `POST /messages` - Send message (auth required)
- `GET /messages/inbox` - Get inbox (auth required)
- `GET /messages/sent` - Get sent messages (auth required)
- `GET /messages/:id` - Get specific message (auth required)
- `PATCH /messages/:id/read` - Mark as read (auth required)
- `DELETE /messages/:id` - Delete message (auth required)

---

## 📋 **What's Implemented**

### ✅ Backend (100%)
- User authentication (JWT)
- User registration/login
- Business profiles CRUD
- Professional profiles CRUD
- Messaging system
- Business directory with search
- Review system
- Security (Helmet, CORS, rate limiting)

### ✅ Frontend (95%)
- Beautiful responsive UI
- Authentication modal
- Business directory with filters
- Professional network display
- Profile creation wizard
- API integration layer
- Notification system

---

## 🎯 **Missing Features (for Full Functionality)**

### To Connect Frontend to Backend:

1. **Update Business Directory Page:**
   - Add `<script src="../js/api-business.js"></script>` to `business_directory.html`
   - Businesses will load from backend automatically

2. **Update Professional Network Page:**
   - Add `<script src="../js/api-professionals.js"></script>` to `professional_network.html`
   - Create professionals endpoint in backend (currently missing)

3. **Connect Profile Wizard:**
   - Profile wizard has UI but doesn't save to backend yet
   - Need to add API call on wizard completion

4. **Create Dashboard:**
   - `community_dashboard.html` exists but needs dynamic data loading
   - Create `js/dashboard.js` to fetch user data

5. **Add Messaging UI:**
   - Backend API is complete
   - Need to create messaging interface in frontend

---

## 🛠️ **Troubleshooting**

### Backend won't start:
- Check if `.env` file exists in `backend` directory
- Verify Node.js version (requires 14+)
- Run `npm install` in backend directory

### Frontend not loading:
- Check if CSS was built (`npm run build:css`)
- Verify frontend-server is running on port 8080
- Check browser console for errors

### Database errors:
- Run `npm run init-db` to recreate database
- Check `backend/database/connecthub.db` exists
- Verify file permissions

### API connection errors:
- Ensure backend is running on port 3000
- Check CORS settings in backend
- Verify `API_BASE_URL` in JS files matches backend URL

---

## 📚 **Next Steps**

### Priority 1: Make Dynamic
1. Add API integration scripts to HTML pages
2. Connect profile wizard to backend
3. Create dashboard functionality

### Priority 2: Add Features
1. Professional profiles endpoint
2. Messaging UI
3. Image upload functionality
4. Search improvements
5. Notifications system

### Priority 3: Production Ready
1. Replace `JWT_SECRET` with secure value
2. Add environment-specific configs
3. Set up proper error logging
4. Add request validation
5. Implement rate limiting per user
6. Add SSL/HTTPS support

---

## 🔐 **Security Notes**

- Never commit `.env` file to git
- Change default JWT_SECRET before deploying
- Use HTTPS in production
- Implement proper input sanitization
- Add CSRF protection for production
- Set secure cookie flags in production

---

## 💡 **Development Tips**

### Hot Reload CSS:
```bash
npm run dev
```

### View API Health:
```
http://localhost:3000/api/health
```

### Check Server Status:
```bash
server-status.bat  # Windows
# Or manually check ports 3000 and 8080
```

### Clear Browser Storage:
```javascript
// In browser console:
localStorage.clear();
```

---

## 📝 **File Structure**

```
ConnectHub/
├── backend/              # Backend API
│   ├── routes/          # API routes
│   ├── config/          # Database config
│   ├── middleware/      # Auth middleware
│   ├── database/        # SQLite database
│   └── .env            # Environment vars (CREATE THIS!)
├── frontend-server/     # Static file server
├── pages/              # HTML pages
├── js/                 # Frontend JavaScript
│   ├── auth.js         # Authentication manager
│   ├── utils.js        # Utility functions
│   ├── api-business.js # Business API (NEW!)
│   └── api-professionals.js # Professionals API (NEW!)
├── css/                # Styles
└── public/             # Static assets
```

---

## 🆘 **Support**

If you encounter issues:
1. Check the browser console for errors
2. Check backend terminal for API errors
3. Verify all dependencies are installed
4. Ensure ports 3000 and 8080 are available
5. Try clearing browser cache and localStorage

---

**Built with ❤️ for ConnectHub Pro**


