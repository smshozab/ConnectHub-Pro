/**
 * Authentication Manager for ConnectHub Pro Frontend
 * Handles user authentication, session management, and API communication
 */

class AuthManager {
    constructor() {
        this.baseURL = 'http://localhost:3000/api';
        this.token = localStorage.getItem('auth_token');
        this.user = JSON.parse(localStorage.getItem('user_data') || 'null');
        this.init();
    }

    init() {
        // Check if user is logged in and update UI
        this.updateAuthUI();
        
        // Set up navigation guards
        this.setupNavigationGuards();
        
        // Add logout handlers
        this.setupLogoutHandlers();
    }

    // Authentication Methods
    async register(userData) {
        try {
            const response = await fetch(`${this.baseURL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            const data = await response.json();

            if (data.success) {
                this.setAuthData(data.token, data.user);
                Utils.showNotification('Registration successful! Welcome to ConnectHub Pro!', 'success');
                return { success: true, user: data.user };
            } else {
                Utils.showNotification(data.message || 'Registration failed', 'error');
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error('Registration error:', error);
            Utils.showNotification('Registration failed. Please try again.', 'error');
            return { success: false, message: 'Network error' };
        }
    }

    async login(email, password) {
        try {
            const response = await fetch(`${this.baseURL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (data.success) {
                this.setAuthData(data.token, data.user);
                Utils.showNotification(`Welcome back, ${data.user.firstName}!`, 'success');
                return { success: true, user: data.user };
            } else {
                Utils.showNotification(data.message || 'Login failed', 'error');
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error('Login error:', error);
            Utils.showNotification('Login failed. Please try again.', 'error');
            return { success: false, message: 'Network error' };
        }
    }

    async logout() {
        try {
            if (this.token) {
                await fetch(`${this.baseURL}/auth/logout`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${this.token}`,
                        'Content-Type': 'application/json'
                    }
                });
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            this.clearAuthData();
            Utils.showNotification('Logged out successfully', 'info');
            window.location.href = '../index.html';
        }
    }

    async getCurrentUser() {
        if (!this.token) return null;

        try {
            const response = await fetch(`${this.baseURL}/auth/me`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            const data = await response.json();

            if (data.success) {
                this.user = data.data.user;
                localStorage.setItem('user_data', JSON.stringify(this.user));
                return data.data;
            } else {
                this.clearAuthData();
                return null;
            }
        } catch (error) {
            console.error('Get current user error:', error);
            this.clearAuthData();
            return null;
        }
    }

    // Profile Management
    async createProfile(profileData, userType) {
        if (!this.token) {
            Utils.showNotification('Please log in first', 'error');
            return { success: false };
        }

        try {
            const endpoint = userType === 'business' ? 'profiles/business' : 'profiles/professional';
            const response = await fetch(`${this.baseURL}/${endpoint}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(profileData)
            });

            const data = await response.json();

            if (data.success) {
                Utils.showNotification('Profile created successfully!', 'success');
                return { success: true, data: data.data };
            } else {
                Utils.showNotification(data.message || 'Profile creation failed', 'error');
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error('Create profile error:', error);
            Utils.showNotification('Profile creation failed. Please try again.', 'error');
            return { success: false, message: 'Network error' };
        }
    }

    async getProfile() {
        if (!this.token) return null;

        try {
            const response = await fetch(`${this.baseURL}/profiles/me`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            const data = await response.json();
            return data.success ? data.data : null;
        } catch (error) {
            console.error('Get profile error:', error);
            return null;
        }
    }

    // Utility Methods
    setAuthData(token, user) {
        this.token = token;
        this.user = user;
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user_data', JSON.stringify(user));
        this.updateAuthUI();
    }

    clearAuthData() {
        this.token = null;
        this.user = null;
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
        this.updateAuthUI();
    }

    isAuthenticated() {
        return !!this.token && !!this.user;
    }

    getAuthHeaders() {
        return this.token ? { 'Authorization': `Bearer ${this.token}` } : {};
    }

    updateAuthUI() {
        // Update navigation based on auth status
        const authButtons = document.querySelectorAll('.auth-required');
        const guestButtons = document.querySelectorAll('.guest-only');
        const userInfo = document.querySelectorAll('.user-info');

        if (this.isAuthenticated()) {
            authButtons.forEach(btn => btn.style.display = 'block');
            guestButtons.forEach(btn => btn.style.display = 'none');
            
            // Update user info displays
            userInfo.forEach(info => {
                info.textContent = `${this.user.firstName} ${this.user.lastName}`;
                info.style.display = 'block';
            });

            // Update join buttons to "Dashboard"
            document.querySelectorAll('a[href*="profile_creation_wizard"]').forEach(link => {
                link.href = 'community_dashboard.html';
                link.textContent = 'Dashboard';
            });

        } else {
            authButtons.forEach(btn => btn.style.display = 'none');
            guestButtons.forEach(btn => btn.style.display = 'block');
            userInfo.forEach(info => info.style.display = 'none');
        }
    }

    setupNavigationGuards() {
        // Protect certain pages that require authentication
        const protectedPages = [
            'community_dashboard.html',
            'member_profile_pages.html'
        ];

        const currentPage = window.location.pathname.split('/').pop();
        
        if (protectedPages.includes(currentPage) && !this.isAuthenticated()) {
            Utils.showNotification('Please log in to access this page', 'warning');
            window.location.href = '../index.html';
        }
    }

    setupLogoutHandlers() {
        // Add logout functionality to logout buttons
        document.addEventListener('click', (e) => {
            if (e.target.matches('.logout-btn') || e.target.closest('.logout-btn')) {
                e.preventDefault();
                this.logout();
            }
        });
    }

    // API Helper Methods
    async apiCall(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...this.getAuthHeaders(),
                ...options.headers
            },
            ...options
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            // Handle token expiration
            if (response.status === 401 && this.isAuthenticated()) {
                Utils.showNotification('Session expired. Please log in again.', 'warning');
                this.clearAuthData();
                window.location.href = '../index.html';
                return null;
            }

            return data;
        } catch (error) {
            console.error('API call error:', error);
            throw error;
        }
    }
}

// Initialize authentication manager
const auth = new AuthManager();

// Make it globally available
window.auth = auth;

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthManager;
}
