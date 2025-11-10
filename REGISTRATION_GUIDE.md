# 📝 How to Register on ConnectHub Pro

## ✅ WORKING REGISTRATION FLOW

### **Step 1: Go to Homepage**
URL: http://localhost:3001/pages/homepage.html

### **Step 2: Click "Join Now" Button**
- Located in the top right corner
- Or click "Sign In" and then toggle to "Sign Up"

### **Step 3: Fill Registration Form**
The modal will appear with these fields:
- **First Name** (e.g., "John")
- **Last Name** (e.g., "Doe")
- **Email** (e.g., "john.doe@example.com")
- **Password** (minimum 6 characters)
- **Account Type** (Business Owner or Professional)

### **Step 4: Click "Create Account"**
- Account will be created
- You'll be automatically logged in
- You'll be redirected to the profile creation wizard

### **Step 5: Complete Your Profile**
After registration, you'll be taken to the profile wizard to add details like:
- Business/Professional info
- Photos
- Services/Skills
- Contact information

---

## 🎯 CURRENT WORKING FEATURES

### ✅ **Registration (Auth Modal)**
- First Name ✅
- Last Name ✅
- Email ✅
- Password ✅
- User Type Selection ✅
- Backend Integration ✅

### ✅ **Login**
- Email/Password ✅
- Demo Accounts ✅
- Token Management ✅
- Session Persistence ✅

### ⚠️ **NOT IMPLEMENTED YET**
- ❌ Google OAuth (social login)
- ❌ Microsoft Live OAuth (social login)
- ❌ Facebook OAuth (social login)

The "Continue with Google/Microsoft" buttons are placeholders for future OAuth integration.

---

## 📋 REGISTRATION STEPS (DETAILED)

### **For New Users:**

1. **Open Homepage**
   ```
   http://localhost:3001/pages/homepage.html
   ```

2. **Click "Join Now"** (top right)

3. **Modal Opens with Registration Form**
   - Enter your details
   - Choose account type
   - Click "Create Account"

4. **Success!**
   - Account created
   - Automatically logged in
   - Redirected to profile wizard

5. **Complete Profile Wizard**
   - Add business/professional details
   - Upload photos (optional)
   - Add services/skills
   - Save profile

---

## 🔍 TROUBLESHOOTING

### **Issue: "Continue with Google" doesn't work**
**Reason:** OAuth integration not implemented yet
**Solution:** Use manual registration with email/password

### **Issue: Can't access profile wizard**
**Reason:** Not logged in
**Solution:** Register first from homepage, then access wizard

### **Issue: Profile wizard shows "upload"**
**Reason:** rocket.new scripts were interfering (NOW FIXED)
**Solution:** Hard refresh the page (Ctrl + Shift + R)

---

## 🎯 RECOMMENDED USER FLOW

```
Homepage
   ↓
Click "Join Now"
   ↓
Registration Modal Opens
   ↓
Fill Form & Submit
   ↓
Auto-Login
   ↓
Redirect to Profile Wizard
   ↓
Complete Profile
   ↓
Access Full Platform
```

---

## ✅ TEST REGISTRATION NOW

1. Open: http://localhost:3001/pages/homepage.html
2. Click "Join Now" (top right corner)
3. Fill in the form:
   - First Name: Your name
   - Last Name: Your surname
   - Email: your.email@example.com
   - Password: At least 6 characters
   - Account Type: Choose one
4. Click "Create Account"
5. Wait for success message
6. You'll be redirected to complete your profile!

---

## 📊 CURRENT STATUS

**Registration Features:**
- ✅ Email/Password registration
- ✅ Account type selection
- ✅ Backend integration
- ✅ Auto-login after registration
- ✅ Profile wizard redirect
- ✅ Form validation
- ❌ Social login (not implemented)

**What Works:**
- Manual registration ✅
- Login ✅
- Demo accounts ✅
- Profile creation ✅

**What Doesn't Work Yet:**
- OAuth (Google, Microsoft, Facebook) ❌
- Social media login ❌

---

## 💡 QUICK TIPS

1. **Don't go directly to profile wizard**
   - Register from homepage first

2. **OAuth buttons are placeholders**
   - Use email/password registration

3. **Complete your profile after registration**
   - Fill in all details
   - Add photos
   - Add services/skills

4. **Demo accounts available for testing**
   - Business: john@brewconnect.com / password123
   - Professional: alex@example.com / password123

---

**Status:** ✅ REGISTRATION IS WORKING  
**Method:** Email/Password through Auth Modal  
**OAuth:** Not implemented (future feature)  
**Profile Wizard:** Accessible after registration


