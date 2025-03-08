/**
 * Works Page JavaScript Functionality
 * Features:
 * - Category navigation
 * - Smooth scrolling to categories
 */

document.addEventListener('DOMContentLoaded', function() {
    // Category navigation
    const categoryButtons = document.querySelectorAll('.category-btn');
    const categoryContents = document.querySelectorAll('.works-category');
    
    // Set up category navigation
    categoryButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the category ID
            const category = this.getAttribute('data-category');
            
            // Remove active class from all buttons and contents
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            categoryContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            this.classList.add('active');
            document.getElementById(category).classList.add('active');
            
            // Smooth scroll to the category content (for mobile)
            const isMobile = window.innerWidth <= 992;
            if (isMobile) {
                document.getElementById(category).scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Handle hash links for direct category access
    if (window.location.hash) {
        const categoryId = window.location.hash.substring(1);
        const categoryBtn = document.querySelector(`.category-btn[data-category="${categoryId}"]`);
        
        if (categoryBtn) {
            // Simulate a click on the category button
            categoryBtn.click();
            
            // Scroll to the category after a short delay (to ensure content is visible)
            setTimeout(() => {
                document.getElementById(categoryId).scrollIntoView({
                    behavior: 'smooth'
                });
            }, 100);
        }
    }
    
    // Add URL hash when clicking on category links
    categoryButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const category = this.getAttribute('data-category');
            history.pushState(null, null, `#${category}`);
        });
    });
    
    // Update active category on scroll (for desktop)
    window.addEventListener('scroll', function() {
        if (window.innerWidth <= 992) return; // Skip on mobile
        
        const scrollPosition = window.scrollY;
        
        // Find the currently visible category section
        categoryContents.forEach(content => {
            if (content.classList.contains('active')) {
                const contentTop = content.offsetTop;
                const contentHeight = content.offsetHeight;
                
                if (scrollPosition >= contentTop && scrollPosition < contentTop + contentHeight) {
                    const categoryId = content.getAttribute('id');
                    
                    // Update active button without triggering a click
                    categoryButtons.forEach(btn => {
                        if (btn.getAttribute('data-category') === categoryId) {
                            btn.classList.add('active');
                        } else {
                            btn.classList.remove('active');
                        }
                    });
                }
            }
        });
    });
});