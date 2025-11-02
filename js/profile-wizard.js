/**
 * Profile Creation Wizard - Form Logic & Validation
 * Handles multi-step form navigation, validation, and data management
 */

document.addEventListener('DOMContentLoaded', function() {
    // Wizard state management
    let wizardState = {
        currentStep: 1,
        maxStep: 1,
        profileType: null, // 'business' or 'professional'
        formData: {},
        validationErrors: {},
        isAuthenticated: false
    };

    // Initialize wizard
    initializeWizard();

    function initializeWizard() {
        console.log('🚀 Initializing profile wizard...');
        
        // Check authentication status
        const token = localStorage.getItem('auth_token');
        const userData = localStorage.getItem('user_data');
        
        wizardState.isAuthenticated = !!(token && userData);
        console.log('🔐 Authentication status:', wizardState.isAuthenticated);
        
        // Check URL parameters for profile type
        const urlParams = new URLSearchParams(window.location.search);
        const typeParam = urlParams.get('type');
        
        console.log('📝 Profile type from URL:', typeParam);
        
        if (typeParam === 'business' || typeParam === 'professional') {
            selectProfileType(typeParam);
        }

        // Add event listeners
        setupEventListeners();
        
        // Initialize validation
        setupValidation();
        
        // Show profile type selection or first step
        showCurrentStep();
    }

    function setupEventListeners() {
        console.log('🎯 Setting up event listeners...');
        
        // Profile type selection buttons (the cards on the main page)
        const businessOption = document.getElementById('business-option');
        const professionalOption = document.getElementById('professional-option');
        
        if (businessOption) {
            businessOption.addEventListener('click', function() {
                selectProfileType('business');
            });
            // Also handle click on the button inside
            const businessBtn = businessOption.querySelector('button');
            if (businessBtn) {
                businessBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    selectProfileType('business');
                });
            }
        }
        
        if (professionalOption) {
            professionalOption.addEventListener('click', function() {
                selectProfileType('professional');
            });
            // Also handle click on the button inside
            const professionalBtn = professionalOption.querySelector('button');
            if (professionalBtn) {
                professionalBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    selectProfileType('professional');
                });
            }
        }
        
        // Generic data-profile-type handlers
        document.querySelectorAll('[data-profile-type]').forEach(button => {
            button.addEventListener('click', function() {
                const type = this.dataset.profileType;
                selectProfileType(type);
            });
        });

        // Form inputs for real-time validation
        document.querySelectorAll('input, textarea, select').forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                // Clear error state on input
                clearFieldError(this);
            });
        });

        // Navigation buttons - remove onclick handlers and use event listeners
        document.querySelectorAll('button[onclick*="next"]').forEach(button => {
            button.removeAttribute('onclick');
            button.addEventListener('click', function(e) {
                e.preventDefault();
                nextStep();
            });
        });

        document.querySelectorAll('button[onclick*="prev"]').forEach(button => {
            button.removeAttribute('onclick');
            button.addEventListener('click', function(e) {
                e.preventDefault();
                prevStep();
            });
        });
        
        // Handle publish buttons
        document.querySelectorAll('button[onclick*="publish"]').forEach(button => {
            button.removeAttribute('onclick');
            button.addEventListener('click', function(e) {
                e.preventDefault();
                completeWizard();
            });
        });
        
        console.log('✅ Event listeners set up');
    }

    function selectProfileType(type) {
        console.log('✅ Profile type selected:', type);
        wizardState.profileType = type;
        
        // Check if user is logged in - skip authentication step
        const token = localStorage.getItem('auth_token');
        const userData = localStorage.getItem('user_data');
        
        if (token && userData) {
            wizardState.isAuthenticated = true;
            wizardState.currentStep = 2; // Skip to Basic Info
            console.log('✅ User authenticated, skipping to step 2');
            
            // Pre-fill user data
            try {
                const user = JSON.parse(userData);
                console.log('👤 User data loaded:', user);
                
                // Pre-fill basic info if available
                setTimeout(() => {
                    if (type === 'business') {
                        const emailField = document.querySelector('#business-step-2 input[type="email"]');
                        if (emailField) emailField.value = user.email || '';
                    } else {
                        const firstNameField = document.querySelector('#professional-step-2 input[placeholder="John"]');
                        const lastNameField = document.querySelector('#professional-step-2 input[placeholder="Doe"]');
                        const emailField = document.querySelector('#professional-step-2 input[type="email"]');
                        if (firstNameField) firstNameField.value = user.firstName || '';
                        if (lastNameField) lastNameField.value = user.lastName || '';
                        if (emailField) emailField.value = user.email || '';
                    }
                }, 100);
            } catch (e) {
                console.error('Error parsing user data:', e);
            }
        } else {
            wizardState.isAuthenticated = false;
            wizardState.currentStep = 1; // Start at Authentication
            console.log('⚠️ User not authenticated, showing auth step');
        }
        
        // Hide profile type selection
        const profileTypeSection = document.getElementById('profile-type-section');
        if (profileTypeSection) {
            profileTypeSection.classList.add('hidden');
        }
        
        // Show appropriate wizard
        const wizardId = type === 'business' ? 'business-wizard' : 'professional-wizard';
        const wizard = document.getElementById(wizardId);
        if (wizard) {
            wizard.classList.remove('hidden');
            // Force display
            wizard.style.display = 'block';
            console.log('📋 Wizard displayed:', wizardId);
        } else {
            console.error('❌ Wizard element not found:', wizardId);
        }
        
        // Update URL
        const url = new URL(window.location);
        url.searchParams.set('type', type);
        window.history.replaceState({}, '', url);
        
        // Use setTimeout to ensure DOM is ready
        setTimeout(() => {
            showCurrentStep();
        }, 50);
    }

    function nextStep() {
        console.log('➡️ Next step requested. Current:', wizardState.currentStep);
        console.log('📋 Profile type:', wizardState.profileType);
        console.log('🔐 Is authenticated:', wizardState.isAuthenticated);
        
        // Visual feedback that button was clicked
        const event = new CustomEvent('wizard-next-clicked', { detail: { step: wizardState.currentStep } });
        document.dispatchEvent(event);
        
        // Special handling for step 1 (authentication)
        if (wizardState.currentStep === 1) {
            const token = localStorage.getItem('auth_token');
            if (!token) {
                console.log('⚠️ Not authenticated. Opening auth modal...');
                Utils.showNotification('Please sign in or create an account to continue', 'warning');
                
                // Open auth modal if available
                if (window.authModal) {
                    window.authModal.open('register');
                } else {
                    // Fallback - redirect to homepage
                    Utils.showNotification('Redirecting to registration...', 'info');
                    setTimeout(() => {
                        window.location.href = 'homepage.html';
                    }, 1500);
                }
                return;
            } else {
                console.log('✅ Authenticated, proceeding to step 2');
                wizardState.isAuthenticated = true;
            }
        }
        
        if (validateCurrentStep()) {
            saveCurrentStepData();
            wizardState.currentStep++;
            wizardState.maxStep = Math.max(wizardState.maxStep, wizardState.currentStep);
            console.log('✅ Moving to step:', wizardState.currentStep);
            showCurrentStep();
            scrollToTop();
        } else {
            console.log('❌ Validation failed for current step');
        }
    }

    function prevStep() {
        if (wizardState.currentStep > 1) {
            wizardState.currentStep--;
            showCurrentStep();
            scrollToTop();
        }
    }

    function showCurrentStep() {
        if (!wizardState.profileType) {
            // Show profile type selection
            const typeSection = document.getElementById('profile-type-section');
            if (typeSection) {
                typeSection.classList.remove('hidden');
            }
            console.log('📋 Showing profile type selection');
            return;
        }

        const wizardPrefix = wizardState.profileType;
        const totalSteps = getTotalSteps();
        
        console.log(`📄 Showing ${wizardPrefix} step ${wizardState.currentStep} of ${totalSteps}`);
        
        // Hide all wizard steps
        document.querySelectorAll('.wizard-step').forEach(step => {
            step.classList.add('hidden');
            step.style.display = 'none';
        });
        
        // Show current step
        const currentStepElement = document.getElementById(`${wizardPrefix}-step-${wizardState.currentStep}`);
        if (currentStepElement) {
            currentStepElement.classList.remove('hidden');
            currentStepElement.style.display = 'block';
            console.log('✅ Step element displayed:', currentStepElement.id);
            console.log('✅ Step has content:', currentStepElement.innerHTML.length > 0);
        } else {
            console.error('❌ Step element not found:', `${wizardPrefix}-step-${wizardState.currentStep}`);
            
            // List all available step elements for debugging
            const allSteps = document.querySelectorAll('.wizard-step');
            console.log('Available steps:', Array.from(allSteps).map(s => s.id));
            
            if (typeof Utils !== 'undefined' && Utils.showNotification) {
                Utils.showNotification('Error: Could not load form step', 'error');
            }
        }
        
        // Update progress indicator
        updateProgressIndicator();
        
        // Update navigation buttons
        updateNavigationButtons();
    }

    function validateCurrentStep() {
        const wizardPrefix = wizardState.profileType;
        const currentStepElement = document.getElementById(`${wizardPrefix}-step-${wizardState.currentStep}`);
        
        if (!currentStepElement) return true;
        
        const requiredFields = currentStepElement.querySelectorAll('[required]');
        let isValid = true;
        let invalidFields = [];
        
        console.log(`🔍 Validating step ${wizardState.currentStep}, found ${requiredFields.length} required fields`);
        
        requiredFields.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
                const fieldName = field.name || field.id || field.placeholder || 'Unknown field';
                invalidFields.push(fieldName);
                console.log('❌ Invalid field:', fieldName, 'Value:', field.value);
            } else {
                console.log('✅ Valid field:', field.name || field.placeholder);
            }
        });
        
        if (!isValid) {
            console.error('❌ Validation failed for fields:', invalidFields);
            
            // Create a shortened error message
            let errorMessage = 'Please fill in all required fields correctly.';
            if (invalidFields.length <= 3) {
                errorMessage += ` Check: ${invalidFields.join(', ')}`;
            } else {
                errorMessage += ` (${invalidFields.length} fields need attention)`;
            }
            
            Utils.showNotification(errorMessage, 'error');
            
            // Scroll to first invalid field
            const firstInvalidField = currentStepElement.querySelector('.border-red-500');
            if (firstInvalidField) {
                firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstInvalidField.focus();
            }
        } else {
            console.log('✅ All fields valid, proceeding to next step');
        }
        
        return isValid;
    }

    function validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name || field.id || field.placeholder;
        let isValid = true;
        let errorMessage = '';

        // Clear previous errors
        clearFieldError(field);

        // Required field validation
        if (field.hasAttribute('required') && !FormValidator.required(value)) {
            isValid = false;
            errorMessage = `${fieldName} is required.`;
        }
        // Email validation
        else if (field.type === 'email' && value && !FormValidator.email(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address.';
        }
        // Phone validation
        else if (field.type === 'tel' && value && !FormValidator.phone(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number.';
        }
        // URL validation
        else if (field.type === 'url' && value && !isValidUrl(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid URL.';
        }
        // Min length validation
        else if (field.dataset.minLength && !FormValidator.minLength(value, parseInt(field.dataset.minLength))) {
            isValid = false;
            errorMessage = `${fieldName} must be at least ${field.dataset.minLength} characters.`;
        }

        if (!isValid) {
            showFieldError(field, errorMessage);
        }

        return isValid;
    }

    function showFieldError(field, message) {
        field.classList.add('border-red-500', 'focus:border-red-500');
        
        // Create or update error message
        let errorElement = field.parentElement.querySelector('.field-error');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'field-error text-sm text-red-500 mt-1';
            field.parentElement.appendChild(errorElement);
        }
        errorElement.textContent = message;
    }

    function clearFieldError(field) {
        field.classList.remove('border-red-500', 'focus:border-red-500');
        const errorElement = field.parentElement.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    function saveCurrentStepData() {
        const wizardPrefix = wizardState.profileType;
        const currentStepElement = document.getElementById(`${wizardPrefix}-step-${wizardState.currentStep}`);
        
        if (!currentStepElement) return;
        
        const formElements = currentStepElement.querySelectorAll('input, textarea, select');
        const stepData = {};
        
        formElements.forEach(element => {
            const key = element.name || element.id || element.className;
            
            if (element.type === 'checkbox') {
                if (!stepData.checkboxes) stepData.checkboxes = [];
                if (element.checked) {
                    stepData.checkboxes.push(element.value);
                }
            } else if (element.type === 'radio') {
                if (element.checked) {
                    stepData[key] = element.value;
                }
            } else {
                stepData[key] = element.value;
            }
        });
        
        wizardState.formData[`step${wizardState.currentStep}`] = stepData;
        
        // Save to localStorage for persistence
        localStorage.setItem('wizardState', JSON.stringify(wizardState));
    }

    function updateProgressIndicator() {
        const totalSteps = getTotalSteps();
        const progressBar = document.querySelector('.progress-bar');
        const progressText = document.querySelector('.progress-text');
        
        if (progressBar) {
            const percentage = (wizardState.currentStep / totalSteps) * 100;
            progressBar.style.width = `${percentage}%`;
        }
        
        if (progressText) {
            progressText.textContent = `Step ${wizardState.currentStep} of ${totalSteps}`;
        }
        
        // Update step indicators
        document.querySelectorAll('.step-indicator').forEach((indicator, index) => {
            const stepNumber = index + 1;
            indicator.classList.remove('active', 'completed');
            
            if (stepNumber < wizardState.currentStep) {
                indicator.classList.add('completed');
            } else if (stepNumber === wizardState.currentStep) {
                indicator.classList.add('active');
            }
        });
    }

    function updateNavigationButtons() {
        const totalSteps = getTotalSteps();
        const prevButtons = document.querySelectorAll('[onclick*=\"prev\"]');
        const nextButtons = document.querySelectorAll('[onclick*=\"next\"]');
        
        // Update previous buttons
        prevButtons.forEach(button => {
            if (wizardState.currentStep <= 1) {
                button.style.display = 'none';
            } else {
                button.style.display = 'block';
            }
        });
        
        // Update next buttons
        nextButtons.forEach(button => {
            if (wizardState.currentStep >= totalSteps) {
                button.textContent = 'Complete Profile';
                button.onclick = function(e) {
                    e.preventDefault();
                    completeWizard();
                };
            } else {
                button.textContent = 'Continue';
            }
        });
    }

    function getTotalSteps() {
        const wizardPrefix = wizardState.profileType;
        const stepElements = document.querySelectorAll(`[id^=\"${wizardPrefix}-step-\"]`);
        return stepElements.length;
    }

    function completeWizard() {
        if (validateCurrentStep()) {
            saveCurrentStepData();
            
            // Show loading state
            const submitButton = document.querySelector('.btn-primary[onclick*=\"next\"], .btn-primary[onclick*=\"complete\"]');
            if (submitButton) {
                Utils.setLoading(submitButton, true);
            }
            
            // Simulate form submission
            setTimeout(() => {
                submitForm();
            }, 2000);
        }
    }

    async function submitForm() {
        const formData = wizardState.formData;
        const userType = wizardState.profileType; // 'business' or 'professional'
        
        console.log('Submitting form data:', formData);
        
        try {
            // Get auth token
            const token = localStorage.getItem('auth_token');
            if (!token) {
                Utils.showNotification('Please login to create your profile', 'error');
                window.location.href = 'homepage.html';
                return;
            }
            
            // Prepare API endpoint
            const endpoint = userType === 'business' 
                ? 'http://localhost:3000/api/profiles/business'
                : 'http://localhost:3000/api/profiles/professional';
            
            // Send data to backend
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            
            const result = await response.json();
            
            if (result.success) {
                Utils.showNotification('Profile created successfully!', 'success');
                
                // Clear saved state
                localStorage.removeItem('wizardState');
                
                // Store profile ID
                if (result.data && result.data.id) {
                    localStorage.setItem('profile_id', result.data.id);
                }
                
                // Redirect to appropriate page
                setTimeout(() => {
                    if (userType === 'business') {
                        window.location.href = 'business_directory.html';
                    } else {
                        window.location.href = 'professional_network.html';
                    }
                }, 2000);
            } else {
                Utils.showNotification(result.message || 'Failed to create profile', 'error');
            }
        } catch (error) {
            console.error('Profile submission error:', error);
            Utils.showNotification('Failed to create profile. Please try again.', 'error');
        }
    }

    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    function isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

    function setupValidation() {
        // Add custom validation attributes
        document.querySelectorAll('textarea[placeholder*=\"Describe\"]').forEach(textarea => {
            textarea.dataset.minLength = '20';
            // Add character counter
            if (!textarea.nextElementSibling || !textarea.nextElementSibling.classList.contains('char-counter')) {
                const counter = document.createElement('div');
                counter.className = 'char-counter text-sm text-text-secondary mt-1';
                counter.textContent = `Minimum 20 characters (Current: 0)`;
                textarea.parentElement.appendChild(counter);
                
                textarea.addEventListener('input', function() {
                    const length = this.value.trim().length;
                    counter.textContent = `Minimum 20 characters (Current: ${length})`;
                    if (length >= 20) {
                        counter.classList.remove('text-red-500');
                        counter.classList.add('text-green-500');
                    } else {
                        counter.classList.remove('text-green-500');
                        counter.classList.add('text-text-secondary');
                    }
                });
            }
        });
        
        // Format phone numbers on input
        document.querySelectorAll('input[type=\"tel\"]').forEach(input => {
            input.addEventListener('input', function() {
                this.value = formatPhoneNumber(this.value);
            });
        });
        
        // Setup photo upload functionality
        setupPhotoUploads();
    }
    
    function setupPhotoUploads() {
        console.log('📸 Setting up photo upload functionality...');
        
        // Business Logo Upload
        const logoUpload = document.getElementById('logo-upload');
        if (logoUpload) {
            logoUpload.addEventListener('click', function() {
                handlePhotoUpload('logo', (file, dataUrl) => {
                    // Update the logo upload area with preview
                    logoUpload.innerHTML = `
                        <img src="${dataUrl}" alt="Logo preview" class="max-h-32 mx-auto rounded-lg mb-2">
                        <p class="text-sm text-success">✓ Logo uploaded</p>
                        <p class="text-xs text-text-secondary mt-1">Click to change</p>
                    `;
                    wizardState.formData.businessLogo = dataUrl;
                    console.log('✅ Business logo uploaded');
                });
            });
        }
        
        // Business Photos (multiple upload areas)
        const photoAreas = document.querySelectorAll('#business-step-4 .cursor-pointer');
        photoAreas.forEach((area, index) => {
            if (area.id !== 'logo-upload' && area.querySelector('.text-sm')) {
                area.addEventListener('click', function() {
                    handlePhotoUpload(`business-photo-${index}`, (file, dataUrl) => {
                        area.innerHTML = `
                            <img src="${dataUrl}" alt="Photo ${index + 1}" class="w-full h-32 object-cover rounded-lg mb-2">
                            <p class="text-xs text-success">✓ Photo added</p>
                        `;
                        if (!wizardState.formData.businessPhotos) {
                            wizardState.formData.businessPhotos = [];
                        }
                        wizardState.formData.businessPhotos.push(dataUrl);
                        console.log(`✅ Business photo ${index + 1} uploaded`);
                    });
                });
            }
        });
        
        // Professional Profile Photo - find button by text content
        const allButtons = document.querySelectorAll('#professional-step-2 button');
        let profilePhotoBtn = null;
        allButtons.forEach(btn => {
            if (btn.textContent.includes('Upload Photo')) {
                profilePhotoBtn = btn;
            }
        });
        
        if (profilePhotoBtn) {
            profilePhotoBtn.addEventListener('click', function(e) {
                e.preventDefault();
                handlePhotoUpload('profile-photo', (file, dataUrl) => {
                    // Update the preview circle
                    const previewCircle = this.parentElement.previousElementSibling;
                    if (previewCircle) {
                        previewCircle.innerHTML = `
                            <img src="${dataUrl}" alt="Profile" class="w-full h-full rounded-full object-cover">
                        `;
                    }
                    this.textContent = '✓ Photo Uploaded';
                    this.classList.add('bg-success', 'text-white');
                    wizardState.formData.profilePhoto = dataUrl;
                    console.log('✅ Profile photo uploaded');
                });
            });
        }
        
        console.log('✅ Photo uploads configured (optional)');
    }
    
    function handlePhotoUpload(uploadId, callback) {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/jpeg,image/png,image/jpg,image/gif,image/webp';
        input.style.display = 'none';
        
        input.onchange = function(e) {
            const file = e.target.files[0];
            if (!file) return;
            
            // Validate file size (5MB max)
            if (file.size > 5 * 1024 * 1024) {
                if (typeof Utils !== 'undefined') {
                    Utils.showNotification('Image must be less than 5MB', 'error');
                } else {
                    alert('Image must be less than 5MB');
                }
                return;
            }
            
            // Validate file type
            if (!file.type.startsWith('image/')) {
                if (typeof Utils !== 'undefined') {
                    Utils.showNotification('Please select a valid image file', 'error');
                } else {
                    alert('Please select a valid image file');
                }
                return;
            }
            
            // Read and convert to base64
            const reader = new FileReader();
            reader.onload = function(event) {
                const dataUrl = event.target.result;
                callback(file, dataUrl);
                
                if (typeof Utils !== 'undefined') {
                    Utils.showNotification('Photo uploaded successfully!', 'success');
                }
            };
            reader.onerror = function() {
                if (typeof Utils !== 'undefined') {
                    Utils.showNotification('Failed to read image file', 'error');
                } else {
                    alert('Failed to read image file');
                }
            };
            reader.readAsDataURL(file);
        };
        
        document.body.appendChild(input);
        input.click();
        setTimeout(() => {
            document.body.removeChild(input);
        }, 1000);
    }

    function formatPhoneNumber(value) {
        // Remove all non-digits
        const digits = value.replace(/\D/g, '');
        
        // Format as (XXX) XXX-XXXX
        if (digits.length === 0) {
            return '';
        } else if (digits.length <= 3) {
            return `(${digits}`;
        } else if (digits.length <= 6) {
            return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
        } else if (digits.length <= 10) {
            return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
        } else {
            // Limit to 10 digits
            return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
        }
    }

    // Load saved state if available
    function loadSavedState() {
        const saved = localStorage.getItem('wizardState');
        if (saved) {
            try {
                const savedState = JSON.parse(saved);
                wizardState = { ...wizardState, ...savedState };
                
                // Restore form data
                Object.keys(savedState.formData).forEach(stepKey => {
                    const stepData = savedState.formData[stepKey];
                    // Restore field values (implementation would depend on specific form structure)
                });
            } catch (e) {
                console.error('Error loading saved wizard state:', e);
                localStorage.removeItem('wizardState');
            }
        }
    }

    // Global functions for onclick handlers (temporary compatibility)
    window.nextBusinessStep = nextStep;
    window.prevBusinessStep = prevStep;
    window.nextProfessionalStep = nextStep;
    window.prevProfessionalStep = prevStep;
    
    // Load saved state on initialization
    loadSavedState();
});
