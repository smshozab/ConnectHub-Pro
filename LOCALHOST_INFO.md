# 🚀 ConnectHub Pro - Localhost Running!

## ✅ **SERVERS RUNNING**

### **Backend API Server**
- **URL:** http://localhost:3000
- **Health Check:** http://localhost:3000/api/health
- **Status:** ✅ Running
- **Window:** Separate PowerShell window

### **Frontend Server**
- **URL:** http://localhost:3001
- **Homepage:** http://localhost:3001/pages/homepage.html
- **Status:** ✅ Running
- **Window:** Separate PowerShell window

**Note:** Using port 3001 because ports 8080 and 8081 were in use by other services (Oracle TNS Listener and Apache).

---

## 🔐 **Demo Accounts**

### Business Account
- **Email:** john@brewconnect.com
- **Password:** password123

### Professional Account
- **Email:** alex@example.com
- **Password:** password123

---

## 📱 **Quick Links**

- **Homepage:** http://localhost:3001/pages/homepage.html
- **Business Directory:** http://localhost:3001/pages/business_directory.html
- **Professional Network:** http://localhost:3001/pages/professional_network.html
- **Profile Creation:** http://localhost:3001/pages/profile_creation_wizard.html
- **Dashboard:** http://localhost:3001/pages/community_dashboard.html

---

## 🛠️ **API Endpoints**

**Base URL:** http://localhost:3000/api

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user (requires token)

### Businesses
- `GET /businesses` - Get all businesses
- `GET /businesses/:id` - Get single business
- `POST /businesses/:id/reviews` - Add review (auth required)

### Profiles
- `POST /profiles/business` - Create business profile (auth required)
- `POST /profiles/professional` - Create professional profile (auth required)
- `GET /profiles/me` - Get own profile (auth required)

### Messages
- `POST /messages` - Send message (auth required)
- `GET /messages/inbox` - Get inbox (auth required)
- `GET /messages/:id` - Get specific message (auth required)

---

## ⚠️ **Port Note**

**We're using Port 3001 instead of 8080/8081 because:**
- Port 8080 was in use by Oracle TNS Listener
- Port 8081 was in use by Apache httpd
- All configuration has been updated to use 3001

---

## 🛑 **To Stop Servers**

Close the PowerShell windows or run:
```powershell
Stop-Process -Name "node" -Force
```

---

## 🔄 **To Restart**

```powershell
# Stop all
Stop-Process -Name "node" -Force

# Start backend
cd D:\ConnectHub\backend
node server.js

# Start frontend (in new terminal)
cd D:\ConnectHub\frontend-server
node minimal-frontend.js
```

---

## 🧪 **Test the Application**

1. ✅ Open http://localhost:8081/pages/homepage.html
2. ✅ Click "Sign In" button
3. ✅ Use demo account: john@brewconnect.com / password123
4. ✅ Explore the dashboard
5. ✅ Test business directory
6. ✅ Try professional network

---

## 📝 **Next Steps**

Now that it's running on localhost, we can:

1. **Test all features** ✅ (We can do this now)
2. **Fix any issues** ✅ (If found during testing)
3. **Push to GitHub** ⏳ (After testing)
4. **Deploy to production** ⏳ (After GitHub push)

---

**Status:** 🟢 **RUNNING & READY FOR TESTING!**
**Date:** 2025-11-02
**Ports:** Backend: 3000 | Frontend: 3001

