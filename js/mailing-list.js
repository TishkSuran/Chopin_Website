/**
 * Mailing List JavaScript
 * Features:
 * - Form validation
 * - Success/error messages
 * - Testimonial slider
 */

document.addEventListener('DOMContentLoaded', function() {
    // Mailing list form
    const mailingListForm = document.getElementById('mailing-list-form');
    const subscriptionMessage = document.getElementById('subscription-message');
    
    // Testimonial slider elements
    const testimonialSlides = document.querySelectorAll('.testimonial-slide');
    const sliderDots = document.querySelectorAll('.slider-dot');
    const prevButton = document.querySelector('.slider-arrow.prev');
    const nextButton = document.querySelector('.slider-arrow.next');
    
    // Form submission handling
    if (mailingListForm) {
        mailingListForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic validation
            const emailInput = document.getElementById('email');
            const nameInput = document.getElementById('name');
            const privacyCheckbox = document.querySelector('input[name="privacy"]');
            
            // Validate email
            if (!validateEmail(emailInput.value)) {
                showValidationError(emailInput, 'Please enter a valid email address');
                return;
            } else {
                clearValidationError(emailInput);
            }
            
            // Validate name
            if (nameInput.value.trim() === '') {
                showValidationError(nameInput, 'Please enter your name');
                return;
            } else {
                clearValidationError(nameInput);
            }
            
            // Validate privacy consent
            if (!privacyCheckbox.checked) {
                showValidationError(privacyCheckbox.parentElement, 'You must agree to the privacy policy');
                return;
            } else {
                clearValidationError(privacyCheckbox.parentElement);
            }
            
            // If all validations pass, show success message
            showSuccessMessage();
            
            // Reset form
            mailingListForm.reset();
        });
    }
    
    // Email validation helper
    function validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    
    // Show validation error
    function showValidationError(element, message) {
        // Remove any existing error
        clearValidationError(element);
        
        // Create error message
        const errorElement = document.createElement('div');
        errorElement.className = 'validation-error';
        errorElement.textContent = message;
        errorElement.style.color = '#f44336';
        errorElement.style.fontSize = '12px';
        errorElement.style.marginTop = '5px';
        
        // Add error border
        element.style.border = '1px solid #f44336';
        
        // Add error message after the element
        element.parentNode.appendChild(errorElement);
    }
    
    // Clear validation error
    function clearValidationError(element) {
        // Remove error border
        element.style.border = '';
        
        // Remove any existing error message
        const errorElement = element.parentNode.querySelector('.validation-error');
        if (errorElement) {
            element.parentNode.removeChild(errorElement);
        }
    }
    
    // Show success message
    function showSuccessMessage() {
        // Update message content
        const messageContent = subscriptionMessage.querySelector('.message-content');
        messageContent.innerHTML = `
            <svg class="message-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor"/>
            </svg>
            <p>Thank you for subscribing! Please check your email for confirmation.</p>
        `;
        messageContent.classList.add('success');
        messageContent.classList.remove('error');
        
        // Show message
        subscriptionMessage.classList.remove('hidden');
        
        // Scroll to message
        subscriptionMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Hide message after a few seconds
        setTimeout(() => {
            subscriptionMessage.classList.add('hidden');
        }, 5000);
    }
    
    // Testimonial slider functionality
    let currentSlide = 0;
    
    // Hide all slides initially except the first one
    testimonialSlides.forEach((slide, index) => {
        if (index !== 0) {
            slide.style.display = 'none';
        }
    });
    
    // Update active dot
    function updateActiveDot() {
        sliderDots.forEach((dot, index) => {
            if (index === currentSlide) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    // Show specific slide
    function showSlide(index) {
        // Hide all slides
        testimonialSlides.forEach(slide => {
            slide.style.display = 'none';
        });
        
        // Show selected slide
        testimonialSlides[index].style.display = 'block';
        
        // Update current slide index
        currentSlide = index;
        
        // Update active dot
        updateActiveDot();
    }
    
    // Next slide
    function nextSlide() {
        let newIndex = currentSlide + 1;
        
        // Reset to first slide if at the end
        if (newIndex >= testimonialSlides.length) {
            newIndex = 0;
        }
        
        showSlide(newIndex);
    }
    
    // Previous slide
    function prevSlide() {
        let newIndex = currentSlide - 1;
        
        // Go to last slide if at the beginning
        if (newIndex < 0) {
            newIndex = testimonialSlides.length - 1;
        }
        
        showSlide(newIndex);
    }
    
    // Set up event listeners for slider controls
    if (nextButton) {
        nextButton.addEventListener('click', nextSlide);
    }
    
    if (prevButton) {
        prevButton.addEventListener('click', prevSlide);
    }
    
    // Dot navigation
    sliderDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
        });
    });
    
    // Auto-advance slides every 5 seconds
    setInterval(nextSlide, 5000);
});