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
                
                // Update URL without page jump
                history.pushState(null, null, this.getAttribute('href'));
            }
        });
    });

    // Language management
    const languageSelector = document.getElementById('language-selector');
    let currentLanguage = 'en';
    let translations = {};

    // Load translations with performance optimization
    async function loadTranslations(lang) {
        if (translations[lang]) {
            return translations[lang];
        }

        try {
            const response = await fetch('i18n.json', {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
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
        
        // Update meta description
        let metaDescription = document.querySelector('meta[name="description"]');
        if (!metaDescription) {
            metaDescription = document.createElement('meta');
            metaDescription.name = 'description';
            document.head.appendChild(metaDescription);
        }
        metaDescription.setAttribute('content', translations.meta.description);

        // Update Open Graph tags
        let ogTitle = document.querySelector('meta[property="og:title"]');
        let ogDescription = document.querySelector('meta[property="og:description"]');
        let ogLocale = document.querySelector('meta[property="og:locale"]');
        
        if (!ogTitle) {
            ogTitle = document.createElement('meta');
            ogTitle.setAttribute('property', 'og:title');
            document.head.appendChild(ogTitle);
        }
        if (!ogDescription) {
            ogDescription = document.createElement('meta');
            ogDescription.setAttribute('property', 'og:description');
            document.head.appendChild(ogDescription);
        }
        if (!ogLocale) {
            ogLocale = document.createElement('meta');
            ogLocale.setAttribute('property', 'og:locale');
            document.head.appendChild(ogLocale);
        }
        
        ogTitle.setAttribute('content', translations.meta.title);
        ogDescription.setAttribute('content', translations.meta.description);
        ogLocale.setAttribute('content', currentLanguage === 'fr' ? 'fr_FR' : 'en_US');
        
        // Update all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const value = getNestedValue(translations, key);
            
            if (value !== undefined && value !== null) {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    // For form elements, update placeholder if it has data-i18n-placeholder
                    const placeholderKey = element.getAttribute('data-i18n-placeholder');
                    if (placeholderKey) {
                        const placeholderValue = getNestedValue(translations, placeholderKey);
                        if (placeholderValue) {
                            element.setAttribute('placeholder', placeholderValue);
                        }
                    }
                    // Also set value if empty
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
        
        // Update structured data for current language
        updateStructuredData(currentLanguage);
    }

    // Update structured data based on language
    function updateStructuredData(lang) {
        // Update service description in structured data if needed
        const serviceSchema = document.querySelector('script[type="application/ld+json"]');
        if (serviceSchema && translations[lang]?.meta?.description) {
            try {
                const schemaData = JSON.parse(serviceSchema.textContent);
                if (schemaData.description) {
                    schemaData.description = translations[lang].meta.description;
                    serviceSchema.textContent = JSON.stringify(schemaData);
                }
            } catch (e) {
                console.warn('Could not update structured data:', e);
            }
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
        // Get browser language or user preference
        const browserLang = navigator.language || navigator.userLanguage;
        const userLang = browserLang.startsWith('fr') ? 'fr' : 'en';
        
        // Check for stored preference or use browser language
        currentLanguage = localStorage.getItem('preferredLanguage') || userLang;
        
        // Load translations and update content
        const loadedTranslations = await loadTranslations(currentLanguage);
        updateContent(loadedTranslations);
        
        // Preload the other language for better performance
        const otherLang = currentLanguage === 'fr' ? 'en' : 'fr';
        loadTranslations(otherLang).catch(() => {
            console.warn(`Failed to preload ${otherLang} translations`);
        });
    }

    // Language selector change event
    if (languageSelector) {
        languageSelector.addEventListener('change', async function(e) {
            currentLanguage = e.target.value;
            localStorage.setItem('preferredLanguage', currentLanguage);
            
            try {
                const loadedTranslations = await loadTranslations(currentLanguage);
                updateContent(loadedTranslations);
                
                // Track language change for analytics
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'language_change', {
                        'event_category': 'engagement',
                        'event_label': currentLanguage
                    });
                }
            } catch (error) {
                console.error('Error updating language:', error);
            }
            
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
                    
                    // Track form interaction
                    trackConversion('form_opened', {
                        location: 'mobile_contact',
                        language: currentLanguage
                    });
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

    // Enhanced form submission for events with better validation
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
                    showError(name, currentLanguage === 'fr' ? 'Le nom est requis' : 'Name is required');
                    isValid = false;
                }

                if (!email?.value.trim()) {
                    showError(email, currentLanguage === 'fr' ? 'L\'email est requis' : 'Email is required');
                    isValid = false;
                } else if (!isValidEmail(email.value)) {
                    showError(email, currentLanguage === 'fr' ? 'Veuillez entrer une adresse email valide' : 'Please enter a valid email address');
                    isValid = false;
                }

                if (!message?.value.trim()) {
                    showError(message, currentLanguage === 'fr' ? 'Veuillez nous parler de votre événement' : 'Please tell us about your event');
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
                        btnLoading.textContent = currentLanguage === 'fr' ? 'Envoi en cours...' : 'Sending...';
                    }

                    try {
                        const formData = new FormData(form);
                        
                        // Add language information to form data
                        formData.append('_language', currentLanguage);
                        formData.append('_page_language', document.documentElement.lang);
                        
                        const response = await fetch(form.action, {
                            method: 'POST',
                            body: formData,
                            headers: {
                                'Accept': 'application/json'
                            }
                        });

                        if (response.ok) {
                            // Track successful form submission
                            trackConversion('form_submitted', {
                                form_type: 'event_lead',
                                language: currentLanguage,
                                event_type: document.getElementById('event-type')?.value || 'unknown'
                            });
                            
                            // Show success message
                            showSuccessMessage();
                        } else {
                            throw new Error('Form submission failed');
                        }
                        
                    } catch (error) {
                        console.error('Form submission error:', error);
                        
                        // Track form error
                        trackConversion('form_error', {
                            form_type: 'event_lead',
                            error: error.message,
                            language: currentLanguage
                        });
                        
                        alert(currentLanguage === 'fr' 
                            ? 'Désolé, une erreur s\'est produite lors de l\'envoi de votre message. Veuillez réessayer ou nous envoyer un email directement.'
                            : 'Sorry, there was an error sending your message. Please try again or email us directly.');
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
            
            // Track successful conversion
            trackConversion('lead_captured', {
                source: 'contact_form',
                language: currentLanguage
            });
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
        
        // Focus the errored field
        field.focus();
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
                    btnText.textContent = currentLanguage === 'fr' ? 'Ouverture...' : 'Opening...';
                    
                    // Reset text after a delay
                    setTimeout(() => {
                        btnText.textContent = originalText;
                    }, 2000);
                }
                
                // Track conversion event
                trackConversion('calendly_click', {
                    button_location: this.closest('.cta-container') ? 'hero' : 
                                   this.closest('.contact-option-card') ? 'contact_option' : 'other',
                    text: this.textContent.trim(),
                    language: currentLanguage
                });
            });
        });

        // Track email link clicks
        const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
        emailLinks.forEach(link => {
            link.addEventListener('click', function() {
                trackConversion('email_click', {
                    location: this.closest('.contact-option-card') ? 'contact_option' : 'other',
                    language: currentLanguage
                });
            });
        });

        // Track pricing card interactions
        const pricingButtons = document.querySelectorAll('.pricing-card .btn');
        pricingButtons.forEach(button => {
            button.addEventListener('click', function() {
                const card = this.closest('.pricing-card');
                const plan = card.querySelector('h3')?.textContent || 'unknown';
                trackConversion('pricing_click', {
                    plan: plan,
                    featured: card.classList.contains('featured'),
                    language: currentLanguage
                });
            });
        });
    }

    // Track conversion events
    function trackConversion(event, data = {}) {
        // Here you can integrate with Google Analytics, Facebook Pixel, etc.
        console.log('Conversion event:', event, data);
        
        // Example: Google Analytics 4 event tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', event, data);
        }
        
        // Example: Facebook Pixel
        if (typeof fbq !== 'undefined') {
            fbq('track', event, data);
        }
        
        // Example: LinkedIn Insights
        if (typeof lintrk !== 'undefined') {
            lintrk('track', { conversion_id: event });
        }
    }

    // Live counter animation for demo with performance optimization
    function animateCounter() {
        const counter = document.getElementById('liveCounter');
        if (counter && 'IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        startCounterAnimation();
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(counter);
        } else if (counter) {
            // Fallback for browsers without IntersectionObserver
            startCounterAnimation();
        }
    }

    function startCounterAnimation() {
        const counter = document.getElementById('liveCounter');
        if (!counter) return;
        
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

    // Performance optimization: Preload critical images
    function preloadCriticalImages() {
        if ('loading' in HTMLImageElement.prototype) {
            // Browser supports native lazy loading
            const criticalImages = document.querySelectorAll('img[loading="eager"]');
            criticalImages.forEach(img => {
                // These will load immediately due to loading="eager"
            });
        } else {
            // Fallback for older browsers
            const criticalImages = document.querySelectorAll('.nav-logo img, .hero img');
            criticalImages.forEach(img => {
                const src = img.getAttribute('src');
                if (src) {
                    const link = document.createElement('link');
                    link.rel = 'preload';
                    link.as = 'image';
                    link.href = src;
                    document.head.appendChild(link);
                }
            });
        }
    }

    // Initialize the page
    initLanguage();
    initContactSection();
    initContactForm();
    initConversionTracking();
    preloadCriticalImages();

    // Start counter animation after a short delay
    setTimeout(animateCounter, 1000);

    // Performance monitoring
    if ('performance' in window) {
        window.addEventListener('load', () => {
            // Report Core Web Vitals or other performance metrics
            setTimeout(() => {
                const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
                if (loadTime < 3000) {
                    trackConversion('fast_load', { load_time: loadTime });
                }
            }, 0);
        });
    }
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
        
        // Track form reset
        if (typeof gtag !== 'undefined') {
            gtag('event', 'form_reset', {
                'event_category': 'engagement'
            });
        }
    }
};

// Service Worker registration for PWA capabilities (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
