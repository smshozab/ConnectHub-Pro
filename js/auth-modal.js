/**
 * Authentication Modal Component
 * Handles login and registration forms
 */

class AuthModal {
    constructor() {
        this.modal = null;
        this.currentMode = 'login'; // 'login' or 'register'
        this.init();
    }

    init() {
        this.createModal();
        this.setupEventListeners();
    }

    createModal() {
        // Create modal HTML
        const modalHTML = `
            <div id="auth-modal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50" style="display: none;">
                <div class="bg-white rounded-2xl shadow-custom-xl max-w-md w-full max-h-screen overflow-y-auto m-4">
                    <!-- Modal Header -->
                    <div class="px-6 py-4 border-b border-border flex justify-between items-center">
                        <h2 id="modal-title" class="text-xl font-semibold text-primary">Welcome Back</h2>
                        <button id="close-modal" class="text-text-secondary hover:text-text-primary">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        </button>
                    </div>

                    <!-- Modal Body -->
                    <div class="px-6 py-6">
                        <!-- Login Form -->
                        <form id="login-form" class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-text-primary mb-2">Email Address</label>
                                <input type="email" id="login-email" class="input-field" placeholder="Enter your email" required>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-text-primary mb-2">Password</label>
                                <input type="password" id="login-password" class="input-field" placeholder="Enter your password" required>
                            </div>
                            <button type="submit" class="btn-primary w-full">Sign In</button>
                        </form>

                        <!-- Register Form -->
                        <form id="register-form" class="space-y-4 hidden">
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-text-primary mb-2">First Name</label>
                                    <input type="text" id="register-firstName" class="input-field" placeholder="First name" required>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-text-primary mb-2">Last Name</label>
                                    <input type="text" id="register-lastName" class="input-field" placeholder="Last name" required>
                                </div>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-text-primary mb-2">Email Address</label>
                                <input type="email" id="register-email" class="input-field" placeholder="Enter your email" required>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-text-primary mb-2">Password</label>
                                <input type="password" id="register-password" class="input-field" placeholder="Create a password (min 6 characters)" required minlength="6">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-text-primary mb-2">Account Type</label>
                                <select id="register-userType" class="input-field" required>
                                    <option value="">Select account type</option>
                                    <option value="business">Business Owner</option>
                                    <option value="professional">Professional</option>
                                </select>
                            </div>
                            <button type="submit" class="btn-primary w-full">Create Account</button>
                        </form>

                        <!-- Mode Toggle -->
                        <div class="mt-6 text-center">
                            <p class="text-text-secondary">
                                <span id="mode-text">Don't have an account?</span>
                                <button id="toggle-mode" class="text-primary hover:text-primary-600 font-semibold ml-1">Sign Up</button>
                            </p>
                        </div>

                        <!-- Sample Accounts Info -->
                        <div class="mt-6 p-4 bg-surface rounded-lg">
                            <h4 class="text-sm font-semibold text-primary mb-2">Demo Accounts:</h4>
                            <div class="text-xs text-text-secondary space-y-1">
                                <div><strong>Business:</strong> john@brewconnect.com / password123</div>
                                <div><strong>Professional:</strong> alex@example.com / password123</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add modal to page
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.modal = document.getElementById('auth-modal');
    }

    setupEventListeners() {
        // Close modal
        document.getElementById('close-modal').addEventListener('click', () => this.close());
        
        // Close on backdrop click
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.close();
        });

        // Mode toggle
        document.getElementById('toggle-mode').addEventListener('click', () => this.toggleMode());

        // Form submissions
        document.getElementById('login-form').addEventListener('submit', (e) => this.handleLogin(e));
        document.getElementById('register-form').addEventListener('submit', (e) => this.handleRegister(e));

        // Open modal buttons
        document.addEventListener('click', (e) => {
            if (e.target.matches('.open-auth-modal') || e.target.closest('.open-auth-modal')) {
                e.preventDefault();
                const mode = e.target.dataset.mode || e.target.closest('.open-auth-modal').dataset.mode || 'login';
                this.open(mode);
            }
        });

        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.style.display !== 'none') {
                this.close();
            }
        });
    }

    open(mode = 'login') {
        this.currentMode = mode;
        this.updateModalContent();
        this.modal.style.display = 'flex';
        this.modal.style.alignItems = 'center';
        this.modal.style.justifyContent = 'center';
        this.modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        
        // Focus first input
        setTimeout(() => {
            const firstInput = this.modal.querySelector('input:not([type="hidden"])');
            if (firstInput) firstInput.focus();
        }, 100);
    }

    close() {
        this.modal.style.display = 'none';
        this.modal.classList.add('hidden');
        document.body.style.overflow = '';
        this.clearForms();
    }

    toggleMode() {
        this.currentMode = this.currentMode === 'login' ? 'register' : 'login';
        this.updateModalContent();
    }

    updateModalContent() {
        const title = document.getElementById('modal-title');
        const modeText = document.getElementById('mode-text');
        const toggleBtn = document.getElementById('toggle-mode');
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');

        if (this.currentMode === 'login') {
            title.textContent = 'Welcome Back';
            modeText.textContent = "Don't have an account?";
            toggleBtn.textContent = 'Sign Up';
            loginForm.classList.remove('hidden');
            registerForm.classList.add('hidden');
        } else {
            title.textContent = 'Join ConnectHub Pro';
            modeText.textContent = 'Already have an account?';
            toggleBtn.textContent = 'Sign In';
            loginForm.classList.add('hidden');
            registerForm.classList.remove('hidden');
        }
    }

    clearForms() {
        document.getElementById('login-form').reset();
        document.getElementById('register-form').reset();
        
        // Clear any error states
        this.modal.querySelectorAll('.border-red-500').forEach(input => {
            input.classList.remove('border-red-500');
        });
        this.modal.querySelectorAll('.field-error').forEach(error => {
            error.remove();
        });
    }

    async handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const submitBtn = e.target.querySelector('button[type="submit"]');

        Utils.setLoading(submitBtn, true);

        try {
            const result = await auth.login(email, password);
            
            if (result.success) {
                this.close();
                // Redirect based on user type or current page
                this.redirectAfterLogin(result.user);
            }
        } catch (error) {
            console.error('Login error:', error);
        } finally {
            Utils.setLoading(submitBtn, false);
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        
        const formData = {
            firstName: document.getElementById('register-firstName').value,
            lastName: document.getElementById('register-lastName').value,
            email: document.getElementById('register-email').value,
            password: document.getElementById('register-password').value,
            userType: document.getElementById('register-userType').value
        };
        
        const submitBtn = e.target.querySelector('button[type="submit"]');
        Utils.setLoading(submitBtn, true);

        try {
            const result = await auth.register(formData);
            
            if (result.success) {
                this.close();
                
                // Check if we're already on the profile creation wizard page
                const currentPage = window.location.pathname.split('/').pop();
                if (currentPage === 'profile_creation_wizard.html') {
                    // Reload the page to update the wizard with the new auth state
                    console.log('🔄 Reloading profile wizard with auth state');
                    window.location.reload();
                } else {
                    // Redirect to profile creation
                    console.log('➡️ Redirecting to profile wizard');
                    window.location.href = `profile_creation_wizard.html?type=${result.user.userType}`;
                }
            }
        } catch (error) {
            console.error('Registration error:', error);
        } finally {
            Utils.setLoading(submitBtn, false);
        }
    }

    redirectAfterLogin(user) {
        const currentPage = window.location.pathname.split('/').pop();
        
        console.log('🔄 Redirecting after login. Current page:', currentPage);
        
        // If on profile creation wizard, reload to update auth state
        if (currentPage === 'profile_creation_wizard.html') {
            console.log('📋 Reloading profile wizard with auth state');
            window.location.reload();
            return;
        }
        
        // If on index page, redirect to appropriate directory
        if (currentPage === 'index.html' || currentPage === '') {
            if (user.userType === 'business') {
                window.location.href = 'pages/business_directory.html';
            } else {
                window.location.href = 'pages/professional_network.html';
            }
        } else {
            // Reload current page to update auth state
            window.location.reload();
        }
    }
}

// Initialize auth modal when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.authModal = new AuthModal();
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthModal;
}
