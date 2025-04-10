document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Image Slider
    const slider = document.querySelector('.slider');
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    const paginationContainer = document.querySelector('.slider-pagination');
    const progressBar = document.querySelector('.progress-bar');
    let currentSlide = 0;
    let autoSlideInterval;
    let isTransitioning = false;

    // Create pagination dots
    slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.classList.add('pagination-dot');
        dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
        dot.addEventListener('click', () => goToSlide(index));
        paginationContainer.appendChild(dot);
    });

    function updateSlider(animate = true) {
        if (animate) {
            isTransitioning = true;
            slider.style.transition = 'transform 0.5s ease-in-out';
            setTimeout(() => {
                isTransitioning = false;
                slider.style.transition = '';
            }, 500);
        }

        slider.style.transform = `translateX(-${currentSlide * 100}%)`;
        
        // Update active states
        slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === currentSlide);
            paginationContainer.children[index].classList.toggle('active', index === currentSlide);
        });

        // Update progress bar
        const progress = ((currentSlide + 1) / slides.length) * 100;
        progressBar.style.width = `${progress}%`;

        // Reset auto slide timer
        resetAutoSlide();
    }

    function goToSlide(index) {
        if (isTransitioning || index === currentSlide) return;
        currentSlide = index;
        updateSlider();
    }

    function nextSlide() {
        if (isTransitioning) return;
        currentSlide = (currentSlide + 1) % slides.length;
        updateSlider();
    }

    function prevSlide() {
        if (isTransitioning) return;
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        updateSlider();
    }

    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        autoSlideInterval = setInterval(nextSlide, 5000);
    }

    // Event Listeners
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();
    });

    // Touch Events for Mobile Swipe
    let touchStartX = 0;
    let touchEndX = 0;
    let isDragging = false;

    slider.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        isDragging = true;
        slider.style.transition = 'none';
    }, { passive: true });

    slider.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const currentX = e.touches[0].clientX;
        const diff = currentX - touchStartX;
        const offset = (currentSlide * -100) + (diff / slider.offsetWidth * 100);
        slider.style.transform = `translateX(${offset}%)`;
    }, { passive: true });

    slider.addEventListener('touchend', (e) => {
        isDragging = false;
        touchEndX = e.changedTouches[0].clientX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const swipeDistance = touchEndX - touchStartX;

        if (Math.abs(swipeDistance) > swipeThreshold) {
            if (swipeDistance > 0) {
                prevSlide();
            } else {
                nextSlide();
            }
        } else {
            // Reset to current slide if swipe wasn't strong enough
            updateSlider();
        }
    }

    // Initialize slider
    updateSlider(false);
    resetAutoSlide();
});