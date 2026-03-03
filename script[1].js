/**
 * Gushwork Assignment Scripts
 * Functionality: Sticky Header, Image Carousel, Image Zoom
 */

document.addEventListener('DOMContentLoaded', () => {
    initStickyHeader();
    initCarousel();
    initZoom();
    initMobileMenu();
    initAuthForms();
});

/* --- Auth Forms Logic --- */
function initAuthForms() {
    const signinForm = document.getElementById('signin-form');
    const signupForm = document.getElementById('signup-form');

    if (signinForm) {
        signinForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = signinForm.querySelector('#email').value;
            const btn = signinForm.querySelector('button[type="submit"]');
            
            btn.textContent = 'Signing in...';
            btn.disabled = true;

            // Simulate API call
            setTimeout(() => {
                alert(`Welcome back! Signed in as ${email}`);
                window.location.href = 'index.html';
            }, 1000);
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const fullname = signupForm.querySelector('#fullname').value;
            const btn = signupForm.querySelector('button[type="submit"]');
            
            btn.textContent = 'Creating account...';
            btn.disabled = true;

            // Simulate API call
            setTimeout(() => {
                alert(`Account created successfully for ${fullname}!`);
                window.location.href = 'index.html';
            }, 1000);
        });
    }
}

/* --- Mobile Menu Logic --- */
function initMobileMenu() {
    const toggle = document.querySelector('.header__mobile-toggle');
    const nav = document.querySelector('.header__nav');
    const actions = document.querySelector('.header__actions');

    if (toggle) {
        toggle.addEventListener('click', () => {
            const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
            toggle.setAttribute('aria-expanded', !isExpanded);
            
            // Simple toggle for demo purposes
            // In a real app, we'd use a more robust mobile menu
            nav.style.display = isExpanded ? 'none' : 'flex';
            actions.style.display = isExpanded ? 'none' : 'flex';
            
            if (!isExpanded) {
                nav.style.flexDirection = 'column';
                nav.style.position = 'absolute';
                nav.style.top = '80px';
                nav.style.left = '0';
                nav.style.width = '100%';
                nav.style.backgroundColor = 'white';
                nav.style.padding = '20px';
                nav.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
            }
        });
    }
}

/* --- Sticky Header Logic --- */
function initStickyHeader() {
    const stickyHeader = document.getElementById('sticky-header');
    const heroSection = document.getElementById('hero');
    let lastScrollTop = 0;
    let isScrolling = false;

    /**
     * Using requestAnimationFrame for performant scroll handling
     */
    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            window.requestAnimationFrame(() => {
                handleScroll();
                isScrolling = false;
            });
            isScrolling = true;
        }
    });

    function handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const heroHeight = heroSection.offsetHeight;

        // Show sticky header only after scrolling past the first fold (hero section)
        if (scrollTop > heroHeight) {
            // Scrolling down
            if (scrollTop > lastScrollTop) {
                stickyHeader.classList.remove('is-visible');
            } else {
                // Scrolling up
                stickyHeader.classList.add('is-visible');
            }
        } else {
            // Above first fold
            stickyHeader.classList.remove('is-visible');
        }

        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }
}

/* --- Carousel Logic --- */
function initCarousel() {
    const track = document.querySelector('.carousel__track');
    const slides = Array.from(track.children);
    const nextBtn = document.querySelector('.carousel__btn--next');
    const prevBtn = document.querySelector('.carousel__btn--prev');
    const dots = Array.from(document.querySelectorAll('.carousel__dot'));
    
    let currentIndex = 0;

    const updateCarousel = (index) => {
        currentIndex = index;
        const slideWidth = slides[0].getBoundingClientRect().width;
        track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
        
        // Update dots
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });

        // Re-initialize zoom for the current slide if needed
        // (Zoom is already initialized for all, but this ensures focus)
    };

    nextBtn.addEventListener('click', () => {
        const nextIndex = (currentIndex + 1) % slides.length;
        updateCarousel(nextIndex);
    });

    prevBtn.addEventListener('click', () => {
        const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateCarousel(prevIndex);
    });

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => updateCarousel(index));
    });

    // Keyboard Navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') nextBtn.click();
        if (e.key === 'ArrowLeft') prevBtn.click();
    });

    // Handle window resize to keep carousel aligned
    window.addEventListener('resize', () => updateCarousel(currentIndex));
}

/* --- Zoom Functionality --- */
function initZoom() {
    const zoomContainers = document.querySelectorAll('.zoom-container');

    zoomContainers.forEach(container => {
        const img = container.querySelector('.zoom-image');
        const lens = container.querySelector('.zoom-lens');
        const result = container.querySelector('.zoom-result');

        // Set background image for result
        result.style.backgroundImage = `url('${img.src}')`;

        container.addEventListener('mousemove', (e) => {
            moveLens(e, container, img, lens, result);
        });

        container.addEventListener('touchmove', (e) => {
            moveLens(e, container, img, lens, result);
        });
    });

    function moveLens(e, container, img, lens, result) {
        e.preventDefault();
        
        const pos = getCursorPos(e, container);
        let x = pos.x - (lens.offsetWidth / 2);
        let y = pos.y - (lens.offsetHeight / 2);

        // Prevent lens from going outside image
        if (x > img.width - lens.offsetWidth) x = img.width - lens.offsetWidth;
        if (x < 0) x = 0;
        if (y > img.height - lens.offsetHeight) y = img.height - lens.offsetHeight;
        if (y < 0) y = 0;

        // Set lens position
        lens.style.left = x + 'px';
        lens.style.top = y + 'px';

        // Calculate zoom ratio
        const cx = result.offsetWidth / lens.offsetWidth;
        const cy = result.offsetHeight / lens.offsetHeight;

        // Set result background size and position
        result.style.backgroundSize = (img.width * cx) + 'px ' + (img.height * cy) + 'px';
        result.style.backgroundPosition = '-' + (x * cx) + 'px -' + (y * cy) + 'px';
    }

    function getCursorPos(e, container) {
        const rect = container.getBoundingClientRect();
        let x = 0, y = 0;
        
        // Handle touch or mouse
        if (e.type === 'touchmove') {
            x = e.touches[0].pageX - rect.left;
            y = e.touches[0].pageY - rect.top;
        } else {
            x = e.pageX - rect.left;
            y = e.pageY - rect.top;
        }

        // Consider page scrolling
        x = x - window.pageXOffset;
        y = y - window.pageYOffset;

        return { x, y };
    }
}
