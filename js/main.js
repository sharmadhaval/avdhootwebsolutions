/* ==========================================================================
   Avdhoot Web Solutions - Master JavaScript File
   Interactive UI components, animations, sliders, accordions & form handlers
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ------------------------------------------------------------------------
     1. Sticky Navigation & Header Scrolled Class
     ------------------------------------------------------------------------ */
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });

  /* ------------------------------------------------------------------------
     2. Mobile Navigation Drawer Toggle
     ------------------------------------------------------------------------ */
  const mobileToggleBtn = document.querySelector('.mobile-toggle');
  const mobileDrawer = document.querySelector('.mobile-menu-drawer');
  const mobileOverlay = document.querySelector('.mobile-drawer-overlay');
  const mobileCloseBtn = document.querySelector('.mobile-drawer-close');

  function openMobileMenu() {
    mobileDrawer?.classList.add('active');
    mobileOverlay?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    mobileDrawer?.classList.remove('active');
    mobileOverlay?.classList.remove('active');
    document.body.style.overflow = '';
  }

  mobileToggleBtn?.addEventListener('click', openMobileMenu);
  mobileOverlay?.addEventListener('click', closeMobileMenu);
  mobileCloseBtn?.addEventListener('click', closeMobileMenu);

  /* ------------------------------------------------------------------------
     2b. 5-Slide Interactive Hero Header Section Handler
     ------------------------------------------------------------------------ */
  const heroSliderSection = document.querySelector('#hero-slider-section');
  const heroSlides = document.querySelectorAll('.hero-slide');
  const heroTabBtns = document.querySelectorAll('.hero-tab-btn');
  const slideCardsGroups = document.querySelectorAll('.slide-cards-group');
  const currentSlideNumEl = document.querySelector('.current-slide-num');
  const heroProgressFill = document.querySelector('.hero-progress-fill');
  const heroPrevBtn = document.querySelector('.hero-prev-btn');
  const heroNextBtn = document.querySelector('.hero-next-btn');

  if (heroSlides.length > 0) {
    let currentHeroIndex = 0;
    const totalHeroSlides = heroSlides.length;
    let heroAutoPlayTimer = null;

    function goToHeroSlide(index) {
      if (index >= totalHeroSlides) currentHeroIndex = 0;
      else if (index < 0) currentHeroIndex = totalHeroSlides - 1;
      else currentHeroIndex = index;

      // Update Slides
      heroSlides.forEach((slide, idx) => {
        if (idx === currentHeroIndex) {
          slide.classList.add('active');
        } else {
          slide.classList.remove('active');
        }
      });

      // Update Tabs
      heroTabBtns.forEach((tab, idx) => {
        if (idx === currentHeroIndex) {
          tab.classList.add('active');
          tab.setAttribute('aria-selected', 'true');
          tab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        } else {
          tab.classList.remove('active');
          tab.setAttribute('aria-selected', 'false');
        }
      });

      // Update 3D Floating Cards
      slideCardsGroups.forEach((group, idx) => {
        if (idx === currentHeroIndex) {
          group.classList.add('active');
        } else {
          group.classList.remove('active');
        }
      });

      // Update Counter
      if (currentSlideNumEl) {
        currentSlideNumEl.textContent = String(currentHeroIndex + 1).padStart(2, '0');
      }

      // Update Progress Fill
      if (heroProgressFill) {
        const fillPercentage = ((currentHeroIndex + 1) / totalHeroSlides) * 100;
        heroProgressFill.style.width = `${fillPercentage}%`;
      }
    }

    // Event Listeners
    heroTabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const slideIdx = parseInt(btn.getAttribute('data-slide'), 10);
        goToHeroSlide(slideIdx);
        resetHeroAutoPlay();
      });
    });

    heroPrevBtn?.addEventListener('click', () => {
      goToHeroSlide(currentHeroIndex - 1);
      resetHeroAutoPlay();
    });

    heroNextBtn?.addEventListener('click', () => {
      goToHeroSlide(currentHeroIndex + 1);
      resetHeroAutoPlay();
    });

    // Auto Play with Pause on Hover
    function startHeroAutoPlay() {
      stopHeroAutoPlay();
      heroAutoPlayTimer = setInterval(() => {
        goToHeroSlide(currentHeroIndex + 1);
      }, 5000);
    }

    function stopHeroAutoPlay() {
      if (heroAutoPlayTimer) clearInterval(heroAutoPlayTimer);
    }

    function resetHeroAutoPlay() {
      stopHeroAutoPlay();
      startHeroAutoPlay();
    }

    heroSliderSection?.addEventListener('mouseenter', stopHeroAutoPlay);
    heroSliderSection?.addEventListener('mouseleave', startHeroAutoPlay);

    // Initial setup
    goToHeroSlide(0);
    startHeroAutoPlay();
  }

  /* ------------------------------------------------------------------------
     3. Animated Stat Counters (IntersectionObserver)
     ------------------------------------------------------------------------ */
  const statNumbers = document.querySelectorAll('.stat-number');
  
  if (statNumbers.length > 0) {
    const observerOptions = {
      root: null,
      threshold: 0.5
    };

    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;
          const countTo = parseInt(target.getAttribute('data-count'), 10);
          const suffix = target.getAttribute('data-suffix') || '';
          let count = 0;
          const duration = 2000;
          const stepTime = Math.max(Math.floor(duration / countTo), 20);

          const timer = setInterval(() => {
            count += Math.ceil(countTo / (duration / stepTime));
            if (count >= countTo) {
              target.innerText = countTo + suffix;
              clearInterval(timer);
            } else {
              target.innerText = count + suffix;
            }
          }, stepTime);

          observer.unobserve(target);
        }
      });
    }, observerOptions);

    statNumbers.forEach(stat => counterObserver.observe(stat));
  }

  /* ------------------------------------------------------------------------
     4. FAQ Accordion System
     ------------------------------------------------------------------------ */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const button = item.querySelector('.faq-button');
    button?.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all active items
      faqItems.forEach(other => {
        other.classList.remove('active');
        const otherBtn = other.querySelector('.faq-button');
        otherBtn?.setAttribute('aria-expanded', 'false');
      });

      // Toggle current
      if (!isActive) {
        item.classList.add('active');
        button.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ------------------------------------------------------------------------
     5. Testimonials Slider
     ------------------------------------------------------------------------ */
  const testimonialCards = document.querySelectorAll('.testimonial-card');
  const prevBtn = document.querySelector('.slider-prev');
  const nextBtn = document.querySelector('.slider-next');
  let currentSlide = 0;

  function showSlide(index) {
    if (testimonialCards.length === 0) return;
    if (index >= testimonialCards.length) currentSlide = 0;
    else if (index < 0) currentSlide = testimonialCards.length - 1;
    else currentSlide = index;

    testimonialCards.forEach((card, idx) => {
      if (idx === currentSlide) {
        card.style.display = 'block';
        card.style.opacity = '1';
      } else {
        card.style.display = 'none';
        card.style.opacity = '0';
      }
    });
  }

  if (testimonialCards.length > 0) {
    showSlide(currentSlide);
    prevBtn?.addEventListener('click', () => showSlide(currentSlide - 1));
    nextBtn?.addEventListener('click', () => showSlide(currentSlide + 1));
  }

  /* ------------------------------------------------------------------------
     6. Case Studies Category Filter & Services Slider
     ------------------------------------------------------------------------ */
  const serviceSliderTrack = document.querySelector('.services-slider-track');
  const serviceSliderPrev = document.querySelector('.service-slider-prev');
  const serviceSliderNext = document.querySelector('.service-slider-next');
  const serviceCategoryBtns = document.querySelectorAll('.service-cat-btn');

  if (serviceSliderTrack) {
    serviceSliderPrev?.addEventListener('click', () => {
      serviceSliderTrack.scrollBy({ left: -360, behavior: 'smooth' });
    });

    serviceSliderNext?.addEventListener('click', () => {
      serviceSliderTrack.scrollBy({ left: 360, behavior: 'smooth' });
    });

    serviceCategoryBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        serviceCategoryBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const cat = btn.getAttribute('data-category');
        const cards = serviceSliderTrack.querySelectorAll('.service-card');

        cards.forEach(card => {
          if (cat === 'all' || card.getAttribute('data-cat') === cat) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
        serviceSliderTrack.scrollTo({ left: 0, behavior: 'smooth' });
      });
    });
  }

  const filterBtns = document.querySelectorAll('.filter-btn');
  const caseCards = document.querySelectorAll('.case-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');

      caseCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterVal === 'all' || category === filterVal) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  /* ------------------------------------------------------------------------
     7. Video Player Modal
     ------------------------------------------------------------------------ */
  const videoPlayBtn = document.querySelector('.play-btn');
  const videoModal = document.querySelector('.video-modal');
  const videoModalClose = document.querySelector('.video-modal-close');
  const iframePlayer = document.querySelector('#video-iframe');

  videoPlayBtn?.addEventListener('click', () => {
    if (videoModal && iframePlayer) {
      iframePlayer.setAttribute('src', 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1');
      videoModal.classList.add('active');
    }
  });

  videoModalClose?.addEventListener('click', () => {
    if (videoModal && iframePlayer) {
      iframePlayer.setAttribute('src', '');
      videoModal.classList.remove('active');
    }
  });

  videoModal?.addEventListener('click', (e) => {
    if (e.target === videoModal) {
      iframePlayer?.setAttribute('src', '');
      videoModal.classList.remove('active');
    }
  });

  /* ------------------------------------------------------------------------
     8. Contact Form Validator
     ------------------------------------------------------------------------ */
  const contactForm = document.querySelector('#contactForm');
  const formStatus = document.querySelector('#formStatus');

  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (formStatus) {
      formStatus.innerHTML = `<div style="padding:1rem; background:#dcfce7; color:#15803d; border-radius:8px; font-weight:600;"><i class="fas fa-check-circle"></i> Thank you! Your consultation request has been submitted successfully. An SEO expert from Avdhoot Web Solutions will call/WhatsApp you shortly.</div>`;
      contactForm.reset();
    }
  });

});
