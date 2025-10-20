// Language management and mobile menu functionality for event management page
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', !isExpanded);
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu?.classList.contains('active') && 
            !e.target.closest('.nav-menu') && 
            !e.target.closest('.hamburger') &&
            !e.target.closest('.language-selector')) {
            closeMobileMenu();
        }
    });
    
    // Close mobile menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu?.classList.contains('active')) {
            closeMobileMenu();
            hamburger?.focus();
        }
    });
    
    function closeMobileMenu() {
        hamburger?.classList.remove('active');
        navMenu?.classList.remove('active');
        hamburger?.setAttribute('aria-expanded', 'false');
        document.activeElement?.blur();
    }
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(element => {
        element.addEventListener('click', () => {
            closeMobileMenu();
        });
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Language management
    const languageSelector = document.getElementById('language-selector');
    let currentLanguage = 'en';
    let translations = {};

    // Load translations
    async function loadTranslations(lang) {
        if (translations[lang]) {
            return translations[lang];
        }

        try {
            const response = await fetch('i18n.json');
            if (!response.ok) throw new Error('Network response was not ok');
            
            const allTranslations = await response.json();
            translations = allTranslations;
            
            return translations[lang] || {};
        } catch (error) {
            console.error('Error loading translations:', error);
            return {};
        }
    }

    // Update page content with translations
    function updateContent(translations) {
        if (!translations.meta) return;

        // Update meta tags
        document.title = translations.meta.title;
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', translations.meta.description);
        }

        // Update Open Graph tags
        const ogTitle = document.querySelector('meta[property="og:title"]');
        const ogDescription = document.querySelector('meta[property="og:description"]');
        if (ogTitle) ogTitle.setAttribute('content', translations.meta.title);
        if (ogDescription) ogDescription.setAttribute('content', translations.meta.description);
        
        // Update all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const value = getNestedValue(translations, key);
            
            if (value !== undefined && value !== null) {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.setAttribute('placeholder', value);
                    if (!element.value) {
                        element.value = value;
                    }
                } else if (element.tagName === 'IMG' && element.hasAttribute('alt')) {
                    element.setAttribute('alt', value);
                } else if (element.hasAttribute('aria-label')) {
                    element.setAttribute('aria-label', value);
                } else {
                    element.textContent = value;
                }
            }
        });

        // Update HTML lang attribute
        document.documentElement.setAttribute('lang', currentLanguage);
        
        // Update language selector
        if (languageSelector) {
            languageSelector.value = currentLanguage;
        }
    }

    // Helper function to get nested object values
    function getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) => {
            return current && current[key] !== undefined ? current[key] : undefined;
        }, obj);
    }

    // Initialize language
    async function initLanguage() {
        const browserLang = navigator.language || navigator.userLanguage;
        const userLang = browserLang.startsWith('fr') ? 'fr' : 'en';
        
        currentLanguage = localStorage.getItem('preferredLanguage') || userLang;
        
        const loadedTranslations = await loadTranslations(currentLanguage);
        updateContent(loadedTranslations);
    }

    // Language selector change event
    if (languageSelector) {
        languageSelector.addEventListener('change', async function(e) {
            currentLanguage = e.target.value;
            localStorage.setItem('preferredLanguage', currentLanguage);
            
            const loadedTranslations = await loadTranslations(currentLanguage);
            updateContent(loadedTranslations);
            
            // Close mobile menu after language change on mobile
            if (window.innerWidth <= 768 && navMenu?.classList.contains('active')) {
                closeMobileMenu();
            }
        });
    }

    // Mobile contact section interactions
    function initContactSection() {
        const showFormBtn = document.querySelector('.show-form-btn');
        const backToOptions = document.querySelector('.back-to-options');
        const contactFormAndTrust = document.querySelector('.contact-form-and-trust');
        const contactOptions = document.querySelector('.contact-options');
        
        if (showFormBtn && contactFormAndTrust && contactOptions) {
            showFormBtn.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    contactOptions.style.display = 'none';
                    contactFormAndTrust.classList.add('active');
                    // Smooth scroll to form
                    contactFormAndTrust.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            });
        }
        
        if (backToOptions && contactFormAndTrust && contactOptions) {
            backToOptions.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    contactFormAndTrust.classList.remove('active');
                    contactOptions.style.display = 'grid';
                    // Smooth scroll back to options
                    contactOptions.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            });
        }
    }

    // Enhanced form submission for events
    function initContactForm() {
        const contactForm = document.getElementById('event-lead-form');
        if (contactForm) {
            contactForm.addEventListener('submit', async function(e) {
                e.preventDefault();
                
                // Basic validation
                const name = document.getElementById('name');
                const email = document.getElementById('email');
                const message = document.getElementById('message');
                let isValid = true;

                // Reset previous errors
                contactForm.querySelectorAll('.error-message').forEach(msg => msg.remove());
                contactForm.querySelectorAll('.error').forEach(field => field.classList.remove('error'));

                // Validate required fields
                if (!name?.value.trim()) {
                    showError(name, 'Name is required');
                    isValid = false;
                }

                if (!email?.value.trim()) {
                    showError(email, 'Email is required');
                    isValid = false;
                } else if (!isValidEmail(email.value)) {
                    showError(email, 'Please enter a valid email address');
                    isValid = false;
                }

                if (!message?.value.trim()) {
                    showError(message, 'Please tell us about your event');
                    isValid = false;
                }

                if (isValid) {
                    // Show loading state
                    const submitBtn = contactForm.querySelector('button[type="submit"]');
                    const form = contactForm;
                    submitBtn.disabled = true;
                    const btnText = submitBtn.querySelector('.btn-text');
                    const btnLoading = submitBtn.querySelector('.btn-loading');
                    
                    if (btnText && btnLoading) {
                        btnText.style.display = 'none';
                        btnLoading.style.display = 'inline';
                    }

                    try {
                        const formData = new FormData(form);
                        
                        const response = await fetch(form.action, {
                            method: 'POST',
                            body: formData,
                            headers: {
                                'Accept': 'application/json'
                            }
                        });

                        if (response.ok) {
                            // Show success message
                            showSuccessMessage();
                        } else {
                            throw new Error('Form submission failed');
                        }
                        
                    } catch (error) {
                        console.error('Form submission error:', error);
                        alert('Sorry, there was an error sending your message. Please try again or email us directly.');
                    } finally {
                        submitBtn.disabled = false;
                        if (btnText && btnLoading) {
                            btnText.style.display = 'inline';
                            btnLoading.style.display = 'none';
                        }
                    }
                }
            });
        }
    }

    function showSuccessMessage() {
        const form = document.getElementById('event-lead-form');
        const successMessage = document.getElementById('form-success');
        
        if (form && successMessage) {
            // Hide form, show success message
            form.style.display = 'none';
            successMessage.style.display = 'block';
            
            // Smooth scroll to success message
            successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }

    function showError(field, message) {
        if (!field) return;
        
        field.classList.add('error');
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.style.cssText = 'color: #E74C3C; font-size: 0.875rem; margin-top: 0.25rem;';
        errorElement.textContent = message;
        field.parentNode.appendChild(errorElement);
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Conversion tracking and optimization
    function initConversionTracking() {
        // Track Calendly link clicks
        const calendlyLinks = document.querySelectorAll('a[href*="calendly.com"]');
        
        calendlyLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                // Add loading state
                const btnText = this.querySelector('.btn-text');
                if (btnText) {
                    const originalText = btnText.textContent;
                    btnText.textContent = 'Opening...';
                    
                    // Reset text after a delay
                    setTimeout(() => {
                        btnText.textContent = originalText;
                    }, 2000);
                }
                
                // Track conversion event
                trackConversion('calendly_click', {
                    button_location: this.closest('.cta-container') ? 'hero' : 
                                   this.closest('.contact-option-card') ? 'contact_option' : 'other',
                    text: this.textContent.trim()
                });
            });
        });
        
        // Add trust indicators to Calendly links in hero
        const heroCalendlyLink = document.querySelector('.hero a[href*="calendly.com"]');
        if (heroCalendlyLink) {
            const trustIndicator = document.createElement('div');
            trustIndicator.className = 'calendly-trust';
            trustIndicator.innerHTML = `
                <span>✅ No credit card required</span>
                <span>•</span>
                <span>🎯 15-minute call</span>
            `;
            heroCalendlyLink.parentNode.insertBefore(trustIndicator, heroCalendlyLink.nextSibling);
        }
    }

    // Track conversion events
    function trackConversion(event, data = {}) {
        // Here you can integrate with Google Analytics, Facebook Pixel, etc.
        console.log('Conversion event:', event, data);
        
        // Example: Google Analytics event tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', event, data);
        }
        
        // Example: Facebook Pixel
        if (typeof fbq !== 'undefined') {
            fbq('track', event, data);
        }
    }

    // Live counter animation for demo
    function animateCounter() {
        const counter = document.getElementById('liveCounter');
        if (counter) {
            let current = 127;
            const target = 142;
            const duration = 3000;
            const steps = 60;
            const increment = (target - current) / steps;
            const stepTime = duration / steps;
            
            let step = 0;
            const timer = setInterval(() => {
                step++;
                current += increment;
                counter.textContent = Math.floor(current);
                
                if (step >= steps) {
                    clearInterval(timer);
                    counter.textContent = target;
                    
                    // Continue subtle animation to simulate live updates
                    setInterval(() => {
                        const variation = Math.floor(Math.random() * 3) - 1; // -1, 0, or +1
                        const newValue = Math.max(140, Math.min(145, target + variation));
                        counter.textContent = newValue;
                    }, 5000);
                }
            }, stepTime);
        }
    }

    // Initialize the page
    initLanguage();
    initContactSection();
    initContactForm();
    initConversionTracking();

    // Start counter animation after a short delay
    setTimeout(animateCounter, 1000);

    // Preload other language for better performance
    const browserLang = navigator.language || navigator.userLanguage;
    const otherLang = browserLang.startsWith('fr') ? 'en' : 'fr';
    loadTranslations(otherLang);
});

// Make resetEventForm globally available for the success message button
window.resetEventForm = function() {
    const form = document.getElementById('event-lead-form');
    const successMessage = document.getElementById('form-success');
    
    if (form && successMessage) {
        // Show form, hide success message
        form.style.display = 'block';
        successMessage.style.display = 'none';
        
        // Reset form fields
        form.reset();
        
        // Scroll to form
        form.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
};
