/**
 * Dashboard - Real Data Management
 * Fetches and displays actual data from database
 */

class Dashboard {
    constructor() {
        this.API_BASE = 'http://localhost:3000/api';
        this.currentUser = null;
        this.userProfile = null;
        this.init();
    }

    async init() {
        console.log('📊 Initializing dashboard...');
        
        // Check authentication
        const token = localStorage.getItem('auth_token');
        if (!token) {
            console.log('⚠️ No auth token, redirecting to homepage');
            window.location.href = 'homepage.html';
            return;
        }

        try {
            // Get current user data
            const userData = localStorage.getItem('user_data');
            if (userData) {
                this.currentUser = JSON.parse(userData);
                console.log('👤 Current user:', this.currentUser);
            }

            // Fetch user profile
            await this.fetchUserProfile();
            
            // Update UI with real data
            this.updateUserInfo();
            
            console.log('✅ Dashboard initialized');
        } catch (error) {
            console.error('❌ Dashboard initialization failed:', error);
            Utils.showNotification('Failed to load dashboard', 'error');
        }
    }

    async fetchUserProfile() {
        try {
            const token = localStorage.getItem('auth_token');
            const response = await fetch(`${this.API_BASE}/profiles/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            
            if (data.success) {
                this.userProfile = data.data;
                console.log('📋 Profile loaded:', this.userProfile);
                return this.userProfile;
            } else {
                console.log('⚠️ No profile found');
                return null;
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            return null;
        }
    }

    updateUserInfo() {
        // Update welcome message
        const welcomeHeading = document.querySelector('h1');
        if (welcomeHeading && this.currentUser) {
            welcomeHeading.textContent = `Welcome back, ${this.currentUser.firstName}!`;
        }

        // Update user avatar and name in nav
        const userNameElements = document.querySelectorAll('.text-sm.font-medium.text-primary');
        userNameElements.forEach(el => {
            if (this.currentUser) {
                el.textContent = `${this.currentUser.firstName} ${this.currentUser.lastName}`;
            }
        });

        // Update profile card if exists
        this.updateProfileCard();
    }

    updateProfileCard() {
        // Remove dummy profile data
        const profileCards = document.querySelectorAll('.card');
        
        if (this.userProfile && this.currentUser) {
            // Update with real data
            const profileType = this.currentUser.userType;
            
            if (profileType === 'business') {
                this.updateBusinessProfileCard();
            } else {
                this.updateProfessionalProfileCard();
            }
        }
    }

    updateBusinessProfileCard() {
        console.log('📝 Updating business profile card');
        
        // Find profile completion section
        const completionSection = document.querySelector('.bg-white.rounded-lg.p-6');
        if (completionSection && this.userProfile) {
            const nameEl = completionSection.querySelector('h3');
            const categoryEl = completionSection.querySelector('.text-text-secondary');
            
            if (nameEl) {
                nameEl.textContent = this.userProfile.business_name || 'Your Business';
            }
            if (categoryEl && this.userProfile.category) {
                categoryEl.textContent = this.userProfile.category.charAt(0).toUpperCase() + this.userProfile.category.slice(1);
            }
        }
    }

    updateProfessionalProfileCard() {
        console.log('📝 Updating professional profile card');
        
        // Find profile section
        const completionSection = document.querySelector('.bg-white.rounded-lg.p-6');
        if (completionSection && this.userProfile) {
            const nameEl = completionSection.querySelector('h3');
            const titleEl = completionSection.querySelector('.text-accent');
            
            if (nameEl && this.currentUser) {
                nameEl.textContent = `${this.currentUser.firstName} ${this.currentUser.lastName}`;
            }
            if (titleEl && this.userProfile.title) {
                titleEl.textContent = this.userProfile.title;
            }
        }
    }

    // Helper function to create email contact button
    createEmailButton(email, name) {
        return `
            <a href="mailto:${email}" 
               class="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-custom">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                Email ${name}
            </a>
        `;
    }

    // Remove all messaging UI elements
    removeMessagingFeatures() {
        console.log('🗑️ Removing messaging features...');
        
        // Remove message buttons
        const messageButtons = document.querySelectorAll('button:has(svg path[d*="M3 8l7.89"])');
        messageButtons.forEach(btn => {
            const parent = btn.closest('.flex, .inline-flex');
            if (parent) parent.remove();
            else btn.remove();
        });

        // Remove message-related sections
        const messageSections = document.querySelectorAll('[class*="message"], [id*="message"]');
        messageSections.forEach(section => {
            if (section.textContent.toLowerCase().includes('message')) {
                section.remove();
            }
        });

        console.log('✅ Messaging features removed');
    }
}

// Initialize dashboard when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new Dashboard();
    
    // Remove messaging features
    setTimeout(() => {
        window.dashboard.removeMessagingFeatures();
    }, 500);
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Dashboard;
}


