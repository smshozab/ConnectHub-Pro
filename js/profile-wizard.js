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
        validationErrors: {}
    };

    // Initialize wizard
    initializeWizard();

    function initializeWizard() {
        // Check URL parameters for profile type
        const urlParams = new URLSearchParams(window.location.search);
        const typeParam = urlParams.get('type');
        
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
        // Profile type selection buttons
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

        // Navigation buttons
        document.querySelectorAll('[onclick*="next"]').forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                nextStep();
            });
        });

        document.querySelectorAll('[onclick*="prev"]').forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                prevStep();
            });
        });
    }

    function selectProfileType(type) {
        wizardState.profileType = type;
        wizardState.currentStep = 1;
        
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
        }
        
        // Update URL
        const url = new URL(window.location);
        url.searchParams.set('type', type);
        window.history.replaceState({}, '', url);
        
        showCurrentStep();
    }

    function nextStep() {
        if (validateCurrentStep()) {
            saveCurrentStepData();
            wizardState.currentStep++;
            wizardState.maxStep = Math.max(wizardState.maxStep, wizardState.currentStep);
            showCurrentStep();
            scrollToTop();
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
            document.getElementById('profile-type-section')?.classList.remove('hidden');
            return;
        }

        const wizardPrefix = wizardState.profileType;
        const totalSteps = getTotalSteps();
        
        // Hide all steps
        document.querySelectorAll('.wizard-step').forEach(step => {
            step.classList.add('hidden');
        });
        
        // Show current step
        const currentStepElement = document.getElementById(`${wizardPrefix}-step-${wizardState.currentStep}`);
        if (currentStepElement) {
            currentStepElement.classList.remove('hidden');
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
        
        requiredFields.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            Utils.showNotification('Please fill in all required fields correctly.', 'error');
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

    function submitForm() {
        const formData = wizardState.formData;
        
        // Here you would normally send data to your backend
        console.log('Submitting form data:', formData);
        
        // Simulate success
        Utils.showNotification('Profile created successfully!', 'success');
        
        // Clear saved state
        localStorage.removeItem('wizardState');
        
        // Redirect to appropriate page
        setTimeout(() => {
            if (wizardState.profileType === 'business') {
                window.location.href = 'business_directory.html';
            } else {
                window.location.href = 'professional_network.html';
            }
        }, 2000);
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
            textarea.dataset.minLength = '50';
        });
        
        // Format phone numbers on input
        document.querySelectorAll('input[type=\"tel\"]').forEach(input => {
            input.addEventListener('input', function() {
                this.value = formatPhoneNumber(this.value);
            });
        });
    }

    function formatPhoneNumber(value) {
        // Remove all non-digits
        const digits = value.replace(/\\D/g, '');
        
        // Format as (XXX) XXX-XXXX
        if (digits.length >= 10) {
            return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
        } else if (digits.length >= 6) {
            return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
        } else if (digits.length >= 3) {
            return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
        } else {
            return digits;
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
