/**
 * Contact Form Validation
 * Validates name, email, phone, address, subject, and message fields
 */

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contact-form');

    if (!form) return; // Exit if form doesn't exist on this page

    const fields = {
        name: document.getElementById('name'),
        email: document.getElementById('email'),
        phone: document.getElementById('phone'),
        address: document.getElementById('address'),
        subject: document.getElementById('subject'),
        message: document.getElementById('message')
    };

    const errors = {
        name: document.getElementById('name-error'),
        email: document.getElementById('email-error'),
        phone: document.getElementById('phone-error'),
        address: document.getElementById('address-error'),
        subject: document.getElementById('subject-error'),
        message: document.getElementById('message-error')
    };

    const submitBtn = document.getElementById('submit-btn');
    const successMessage = document.getElementById('success-message');

    // Validation patterns
    const patterns = {
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        phone: /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/,
        name: /^[a-zA-Z\s]{2,50}$/
    };

    // Validation functions
    function validateName(value) {
        if (!value.trim()) {
            return 'Name is required';
        }
        if (value.trim().length < 2) {
            return 'Name must be at least 2 characters';
        }
        if (!patterns.name.test(value)) {
            return 'Name can only contain letters and spaces';
        }
        return '';
    }

    function validateEmail(value) {
        if (!value.trim()) {
            return 'Email is required';
        }
        if (!patterns.email.test(value)) {
            return 'Please enter a valid email address';
        }
        return '';
    }

    function validatePhone(value) {
        if (!value.trim()) {
            return 'Phone number is required';
        }
        if (!patterns.phone.test(value)) {
            return 'Please enter a valid phone number';
        }
        return '';
    }

    function validateAddress(value) {
        if (!value.trim()) {
            return 'Address is required';
        }
        if (value.trim().length < 5) {
            return 'Please enter a complete address';
        }
        return '';
    }

    function validateSubject(value) {
        if (!value) {
            return 'Please select a subject';
        }
        return '';
    }

    function validateMessage(value) {
        if (!value.trim()) {
            return 'Message is required';
        }
        if (value.trim().length < 10) {
            return 'Message must be at least 10 characters';
        }
        return '';
    }

    // Show error message
    function showError(fieldName, message) {
        const errorElement = errors[fieldName];
        const inputElement = fields[fieldName];

        if (errorElement && inputElement) {
            errorElement.textContent = message;
            errorElement.classList.add('active');
            inputElement.classList.add('error');
            inputElement.classList.remove('success');
            inputElement.setAttribute('aria-invalid', 'true');
        }
    }

    // Clear error message
    function clearError(fieldName) {
        const errorElement = errors[fieldName];
        const inputElement = fields[fieldName];

        if (errorElement && inputElement) {
            errorElement.textContent = '';
            errorElement.classList.remove('active');
            inputElement.classList.remove('error');
            inputElement.classList.add('success');
            inputElement.setAttribute('aria-invalid', 'false');
        }
    }

    // Validate single field
    function validateField(fieldName) {
        const value = fields[fieldName].value;
        let errorMessage = '';

        switch(fieldName) {
            case 'name':
                errorMessage = validateName(value);
                break;
            case 'email':
                errorMessage = validateEmail(value);
                break;
            case 'phone':
                errorMessage = validatePhone(value);
                break;
            case 'address':
                errorMessage = validateAddress(value);
                break;
            case 'subject':
                errorMessage = validateSubject(value);
                break;
            case 'message':
                errorMessage = validateMessage(value);
                break;
        }

        if (errorMessage) {
            showError(fieldName, errorMessage);
            return false;
        } else {
            clearError(fieldName);
            return true;
        }
    }

    // Real-time validation on blur
    Object.keys(fields).forEach(fieldName => {
        if (fields[fieldName]) {
            fields[fieldName].addEventListener('blur', function() {
                validateField(fieldName);
            });

            // Clear error on input
            fields[fieldName].addEventListener('input', function() {
                if (errors[fieldName].classList.contains('active')) {
                    validateField(fieldName);
                }
            });
        }
    });

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Validate all fields
        let isValid = true;
        Object.keys(fields).forEach(fieldName => {
            if (!validateField(fieldName)) {
                isValid = false;
            }
        });

        if (isValid) {
            // Disable submit button
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';

            // Simulate form submission (replace with actual AJAX call)
            setTimeout(function() {
                // Show success message
                successMessage.classList.remove('hidden');

                // Reset form
                form.reset();

                // Clear all success states
                Object.keys(fields).forEach(fieldName => {
                    fields[fieldName].classList.remove('success');
                    fields[fieldName].classList.remove('error');
                });

                // Re-enable submit button
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Message';

                // Hide success message after 5 seconds
                setTimeout(function() {
                    successMessage.classList.add('hidden');
                }, 5000);

                // Scroll to success message
                successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

            }, 1500); // Simulate network delay
        } else {
            // Focus on first error field
            const firstErrorField = Object.keys(fields).find(fieldName =>
                errors[fieldName].classList.contains('active')
            );
            if (firstErrorField && fields[firstErrorField]) {
                fields[firstErrorField].focus();
            }
        }
    });

    // Optional: Character counter for message field
    if (fields.message) {
        const maxLength = 500;
        const counterDiv = document.createElement('div');
        counterDiv.className = 'text-sm text-gray-500 mt-1 text-right';
        counterDiv.id = 'message-counter';
        fields.message.setAttribute('maxlength', maxLength);
        fields.message.parentNode.appendChild(counterDiv);

        function updateCounter() {
            const remaining = maxLength - fields.message.value.length;
            counterDiv.textContent = `${fields.message.value.length}/${maxLength} characters`;

            if (remaining < 50) {
                counterDiv.classList.add('text-orange-500');
            } else {
                counterDiv.classList.remove('text-orange-500');
            }
        }

        fields.message.addEventListener('input', updateCounter);
        updateCounter(); // Initial count
    }
});
