// script.js - Simple UI animations and utility functions for Aluminios Leo Landing

document.addEventListener('DOMContentLoaded', () => {
    // 1. Dynamic Year in Footer
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // 2. Intersection Observer for Fade-in effects
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Trigger when 15% of the element is visible
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                // Re-prepare for animation if it goes out of view (as requested)
                entry.target.classList.remove('visible');
            }
        });
    }, observerOptions);

    const animateElements = document.querySelectorAll('.fade-in, .drop-in');
    animateElements.forEach(el => observer.observe(el));

    // 3. Navbar scroll effect (add shadow when scrolling down)
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.5)';
            navbar.style.background = 'rgba(23, 18, 15, 0.95)';
        } else {
            navbar.style.boxShadow = 'none';
            navbar.style.background = 'rgba(23, 18, 15, 0.7)';
        }
    });

    // 4. Contact Modal Logic
    const openModalBtn = document.getElementById('open-menu');
    const modal = document.getElementById('contact-modal');
    const closeModalBtn = document.querySelector('.close-modal');

    if (openModalBtn && modal && closeModalBtn) {
        openModalBtn.addEventListener('click', (e) => {
            e.preventDefault();
            modal.classList.add('show');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        });

        const closeModal = () => {
            modal.classList.remove('show');
            document.body.style.overflow = ''; // Restore scrolling
        };

        closeModalBtn.addEventListener('click', closeModal);

        // Close on clicking outside the content
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });

        // Close on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('show')) {
                closeModal();
            }
        });
    }
});
