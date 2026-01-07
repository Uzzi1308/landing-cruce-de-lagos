// FUNCIONALIDADES PRINCIPALES DE LA PÁGINA
// ult-mod: 08-01-2025
// Este archivo maneja carruseles, animaciones, modales y comportamientos de scroll
// Requiere: config.js cargado previamente

// ====================================
// INICIALIZACIÓN DE CARRUSELES (SWIPER)
// ====================================
const initSwipers = () => {
  // Carrusel de Reseñas - CORREGIDO
  if (document.querySelector(".reviewsSwiper")) {
    const reviewsContainer = document.querySelector(".reviewsSwiper .swiper-wrapper");
    const totalSlides = reviewsContainer ? reviewsContainer.children.length : 0;
    
    new Swiper(".reviewsSwiper", {
      slidesPerView: 1,
      spaceBetween: 30,
      loop: totalSlides > 3,
      allowTouchMove: true,
      autoplay: { 
        delay: 3500, 
        ...CONFIG.autoplay 
      },
      breakpoints: CONFIG.breakpoints.reviews
    });
  }
};

// ====================================
// COMPORTAMIENTOS DE SCROLL
// ====================================
const initScrollBehaviors = () => {
  const navbar = document.querySelector('nav');
  const scrollToTopBtn = document.getElementById('scrollToTop');

  window.addEventListener('scroll', () => {
    const scrollPos = window.pageYOffset;

    if (navbar) {
      navbar.classList.toggle('scrolled', scrollPos > CONFIG.scroll.navbarThreshold);
    }

    if (scrollToTopBtn) {
      scrollToTopBtn.classList.toggle('show', scrollPos > CONFIG.scroll.scrollToTopThreshold);
    }
  }, { passive: true });

  if (scrollToTopBtn) {
    scrollToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
};

// ====================================
// ANIMACIONES DE APARICIÓN (INTERSECTION OBSERVER)
// ====================================
const initScrollAnimations = () => {
  const observerOptions = {
    threshold: CONFIG.animations.threshold,
    rootMargin: CONFIG.animations.rootMargin
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('visible')) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  const elements = document.querySelectorAll(
    '.hero-text, .form-container, .experience-content, .experience-image-wrapper, ' +
    '.itinerary-card, .point, .featured-card, .destination-card, .review-card'
  );

  elements.forEach(el => observer.observe(el));
};

// ====================================
// MODAL DE RESERVA
// ====================================
const initModal = () => {
  const modal = document.getElementById('modalReserva');
  const btnOpen = document.getElementById('btnReservar');
  const btnClose = document.getElementById('btnCerrarModal');

  if (!modal) return;

  const openModal = () => {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (btnOpen) {
    btnOpen.addEventListener('click', openModal);
  }
  
  if (btnClose) {
    btnClose.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-reservar-inline');
    const priceCard = e.target.closest('.price-card');
    
    if (btn) {
      e.preventDefault();
      openModal();
    }
    
    if (priceCard) {
      openModal();
    }
  });
};

// ====================================
// EFECTOS DE HOVER EN TARJETAS DE PRECIO
// ====================================
const initPriceHover = () => {
  const priceCards = document.querySelectorAll('.price-card');
  
  priceCards.forEach(card => {
    const priceElement = card.querySelector('.price');
    const originalPrice = priceElement.innerHTML;
    
    card.addEventListener('mouseenter', () => {
      priceElement.innerHTML = '<span style="font-size: 0.8em;">¡Reserva Ahora!</span>';
      card.style.transform = 'translateY(-8px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
      priceElement.innerHTML = originalPrice;
      card.style.transform = '';
    });
    
    card.addEventListener('click', () => {
      const modal = document.getElementById('modalReserva');
      if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });
};

// ====================================
// SMOOTH SCROLL PARA ENLACES INTERNOS
// ====================================
const initSmoothScroll = () => {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      
      if (href === '#' || href === '#!') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
};

// ====================================
// MENÚ MÓVIL
// ====================================
const initMobileMenu = () => {
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  
  if (!menuToggle || !navMenu) return;
  
  menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    menuToggle.classList.toggle('active');
  });
  
  document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      menuToggle.classList.remove('active');
    });
  });
};

// ====================================
// FORMULARIO DINÁMICO
// ====================================
function initDynamicForm() {
  const bookingForm = document.getElementById('bookingForm');
  const additionalFields = document.getElementById('additionalFields');
  
  if (!bookingForm || !additionalFields) return;
  
  function showAdditionalFields() {
    if (additionalFields.style.display === 'none') {
      additionalFields.style.display = 'block';
      bookingForm.classList.add('expanded');
      
      setTimeout(() => {
        additionalFields.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'nearest' 
        });
      }, 300);
    }
  }
  
  const triggerInputs = bookingForm.querySelectorAll('.form-input-trigger');
  triggerInputs.forEach(input => {
    input.addEventListener('click', showAdditionalFields);
    input.addEventListener('focus', showAdditionalFields);
    input.addEventListener('touchstart', showAdditionalFields, { passive: true });
  });
  
  bookingForm.addEventListener('click', function(e) {
    if (e.target.type !== 'submit' && e.target.className !== 'btn-submit-modal') {
      showAdditionalFields();
    }
  });
  
  bookingForm.addEventListener('touchstart', function(e) {
    if (e.target.type !== 'submit' && e.target.className !== 'btn-submit-modal') {
      showAdditionalFields();
    }
  }, { passive: true });
  
}

// ====================================
// DATOS DE LOS DÍAS
// ====================================
const itineraryDays = [
  {
    day: 1,
    image: 'https://lacasadelviaje.com.mx/wp-content/uploads/2026/01/day-1.webp',
    title: 'Santiago de Chile',
    activities: [
      'Arribo, asistencia y recepción por nuestro personal en el aeropuerto internacional.',
      'Traslado en servicio privado al hotel.',
      'Resto del día libre para descansar o explorar por tu cuenta.',
      'Alojamiento en Santiago.'
    ]
  },
  {
    day: 2,
    image: 'https://lacasadelviaje.com.mx/wp-content/uploads/2026/01/day-2.webp',
    title: 'Santiago de Chile',
    activities: [
      'Desayuno en el hotel.',
      'Visita de la ciudad en tour regular: Palacio de la Moneda, Plaza de Armas, Cerro Santa Lucía, etc.',
      'Tarde libre para actividades personales.',
      'Alojamiento en Santiago.'
    ]
  },
  {
    day: 3,
    image: 'https://lacasadelviaje.com.mx/wp-content/uploads/2026/01/day-3.webp',
    title: 'Santiago – Valparaíso – Viña del Mar',
    activities: [
      'Desayuno en el hotel.',
      'Salida hacia la costa para visitar Valparaíso, ciudad patrimonial de la humanidad.',
      'Subida en ascensor tradicional, paseo por cerros Alegre y Concepción.',
      'Continuación a Viña del Mar: Casino, avenidas costeras y playa de Reñaca.',
      'Regreso a Santiago. Alojamiento.'
    ]
  },
  {
    day: 4,
    image: 'https://lacasadelviaje.com.mx/wp-content/uploads/2026/01/day-4.webp',
    title: 'Santiago – Puerto Montt – Puerto Varas',
    activities: [
      'Desayuno en el hotel.',
      'Traslado al aeropuerto para vuelo a Puerto Montt (no incluido).',
      'Resto del día libre en la "Ciudad de las Rosas".',
      'Vistas espectaculares del volcán Osorno y lago Llanquihue.',
      'Alojamiento en Puerto Varas.'
    ]
  },
  {
    day: 5,
    image: 'https://lacasadelviaje.com.mx/wp-content/uploads/2026/01/day-5.webp',
    title: 'Cruce Internacional de Lagos',
    activities: [
      'Desayuno en el hotel.',
      'Salida desde Puerto Varas hacia Petrohué, bordeando el Lago Llanquihue.',
      'Navegación por Lago Todos los Santos hasta Peulla.',
      'Cruce de la Cordillera de los Andes en bus y navegación por Lago Frías.',
      'Navegación final por Lago Nahuel Huapi hasta Puerto Pañuelo.',
      'Traslado a Bariloche. Alojamiento.'
    ]
  },
  {
    day: 6,
    image: 'https://lacasadelviaje.com.mx/wp-content/uploads/2026/01/day-6.webp',
    title: 'Bariloche - Circuito Chico',
    activities: [
      'Desayuno en el hotel.',
      'Excursión Circuito Chico: Av. Bustillo, Playa Bonita, cerro Campanario.',
      'Visita a península Llao Llao, hotel Llao Llao y capilla San Eduardo.',
      'Vistas panorámicas del lago Nahuel Huapi y lago Moreno.',
      'Tarde libre en Bariloche y alojamiento.'
    ]
  },
  {
    day: 7,
    image: 'https://lacasadelviaje.com.mx/wp-content/uploads/2026/01/day-7.webp',
    title: 'Bariloche – Buenos Aires',
    activities: [
      'Desayuno en el hotel.',
      'Traslado al aeropuerto para vuelo a Buenos Aires (no incluido).',
      'Arribo a la capital argentina, asistencia y traslado al hotel.',
      'Tarde libre para primer contacto con la ciudad.',
      'Alojamiento en Buenos Aires.'
    ]
  },
  {
    day: 8,
    image: 'https://lacasadelviaje.com.mx/wp-content/uploads/2026/01/day-8.webp',
    title: 'Buenos Aires',
    activities: [
      'Desayuno en el hotel.',
      'Visita de la ciudad: Plaza de Mayo, Casa Rosada, Catedral.',
      'Recorrido por San Telmo, La Boca y Caminito.',
      'Visita a Puerto Madero, Recoleta y Palermo.',
      'Alojamiento en Buenos Aires.'
    ]
  },
  {
    day: 9,
    image: 'https://lacasadelviaje.com.mx/wp-content/uploads/2026/01/day-9.webp',
    title: 'Buenos Aires - Día Libre',
    activities: [
      'Desayuno en el hotel.',
      'Día libre para actividades personales.',
      'Opciones recomendadas: Excursión al Tigre y Delta del Paraná, día de campo en estancia típica argentina o simplemente explorar barrios como Palermo Soho, Belgrano o Núñez.',
      'Última noche en la capital argentina. Alojamiento.'
    ]
  },
  {
    day: 10,
    image: 'https://lacasadelviaje.com.mx/wp-content/uploads/2026/01/day-10.webp',
    title: 'Buenos Aires - Regreso',
    activities: [
      'Desayuno en el hotel.',
      'Mañana libre para últimas compras o paseos.',
      'A la hora convenida, traslado al aeropuerto internacional.',
      'Fin de nuestros servicios.',
      'Regreso a casa con experiencias inolvidables de Chile y Argentina.'
    ]
  }
];

// ====================================
// NUEVA IMPLEMENTACIÓN: CARRUSEL INFINITO DE ITINERARIO
// ====================================

class InfiniteItineraryCarousel {
  constructor() {
    this.container = document.querySelector('.infinite-carousel-container');
    this.track = document.querySelector('.infinite-carousel-track');
    
    if (!this.container || !this.track) {
      console.error('No se encontró el carrusel de itinerario');
      return;
    }
    
    this.slides = [];
    this.currentPosition = 0;
    this.isPlaying = true;
    this.isUserInteracting = false;
    this.resumeTimeout = null;
    this.animationId = null;
    this.currentIndex = 0;
    
    // Configuración
    this.config = {
      slideWidth: 300,
      gap: 8,
      speed: 40,
      mobileSpeed: 50,
      resumeDelay: 3000
    };
    
    this.init();
  }
  
  init() {
    this.createSlides();
    this.setupEvents();
    this.createNavigationButtons();
    this.updateDimensions();
    this.startAutoPlay();
    
    // Añadir indicadores de posición
    this.createIndicators();
  }
  
  createSlides() {
    this.track.innerHTML = '';
    this.slides = [];
    
    // Crear 3 sets de slides para efecto infinito suave
    for (let copy = 0; copy < 3; copy++) {
      itineraryDays.forEach((day, index) => {
        const slide = document.createElement('div');
        slide.className = 'infinite-slide';
        slide.dataset.day = day.day;
        slide.dataset.index = index;
        slide.dataset.copy = copy;
        slide.innerHTML = this.createSlideHTML(day);
        this.track.appendChild(slide);
        this.slides.push(slide);
      });
    }
  }
  
  createSlideHTML(day) {
    return `
      <div class="slide-image">
        <img src="${day.image}" alt="${day.title}" loading="lazy">
        <div class="day-overlay">Día ${day.day}</div>
      </div>
      <div class="slide-info">
        <h3>${day.title}</h3>
        <ul>
          ${day.activities.map(activity => `<li>${activity}</li>`).join('')}
        </ul>
      </div>
    `;
  }
  
  updateDimensions() {
    const slideWidth = this.getSlideWidth();
    const gap = this.config.gap;
    
    this.slides.forEach(slide => {
      slide.style.width = `${slideWidth}px`;
      slide.style.marginRight = `${gap}px`;
      slide.style.flexShrink = '0';
    });
    
    // Calcular ancho total del track
    const totalWidth = (slideWidth + gap) * this.slides.length;
    this.track.style.width = `${totalWidth}px`;
    this.track.style.display = 'flex';
    
    // Posicionar en el centro del primer set
    const totalDays = itineraryDays.length;
    const totalSlideWidth = slideWidth + gap;
    const offset = totalSlideWidth * totalDays; // Posicionar en el segundo set
    
    this.currentPosition = -offset;
    this.track.style.transform = `translateX(${this.currentPosition}px)`;
  }
  
  getSlideWidth() {
    if (window.innerWidth <= 480) {
      return 250;
    } else if (window.innerWidth <= 768) {
      return 280;
    }
    return this.config.slideWidth;
  }
  
  getCurrentSpeed() {
    return window.innerWidth <= 768 ? this.config.mobileSpeed : this.config.speed;
  }
  
  setupEvents() {
    // Pausar al hacer hover
    this.container.addEventListener('mouseenter', () => {
      if (this.isPlaying && !this.isUserInteracting) {
        this.pause();
      }
    });
    
    this.container.addEventListener('mouseleave', () => {
      if (!this.isPlaying && !this.isUserInteracting) {
        this.resume();
      }
    });
    
    // Eventos táctiles
    this.track.addEventListener('touchstart', this.handleTouchStart.bind(this));
    this.track.addEventListener('touchmove', this.handleTouchMove.bind(this));
    this.track.addEventListener('touchend', this.handleTouchEnd.bind(this));
    
    // Eventos de ratón
    this.track.addEventListener('mousedown', this.handleMouseDown.bind(this));
    this.track.addEventListener('mousemove', this.handleMouseMove.bind(this));
    this.track.addEventListener('mouseup', this.handleMouseUp.bind(this));
    this.track.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
    
    // Redimensionar ventana
    window.addEventListener('resize', () => {
      clearTimeout(this.resizeTimer);
      this.resizeTimer = setTimeout(() => {
        this.updateDimensions();
      }, 250);
    });
  }
  
  createNavigationButtons() {
    // Eliminar botones existentes si los hay
    const existingBtns = this.container.querySelectorAll('.band-nav-btn');
    existingBtns.forEach(btn => btn.remove());
    
    // Crear botones de navegación
    const prevBtn = document.createElement('button');
    const nextBtn = document.createElement('button');
    
    prevBtn.className = 'band-nav-btn band-prev-btn';
    nextBtn.className = 'band-nav-btn band-next-btn';
    
    prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
    nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
    
    prevBtn.setAttribute('aria-label', 'Día anterior');
    nextBtn.setAttribute('aria-label', 'Siguiente día');
    
    this.container.appendChild(prevBtn);
    this.container.appendChild(nextBtn);
    
    // Eventos de navegación
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.prevSlide();
    });
    
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.nextSlide();
    });
    
    // Pausar al interactuar con botones
    [prevBtn, nextBtn].forEach(btn => {
      btn.addEventListener('mouseenter', () => {
        if (this.isPlaying && !this.isUserInteracting) {
          this.pause();
        }
      });
    });
  }
  
  createIndicators() {
    // Crear contenedor de indicadores
    const indicatorsContainer = document.createElement('div');
    indicatorsContainer.className = 'carousel-indicators';
    indicatorsContainer.style.cssText = `
      display: flex;
      justify-content: center;
      gap: 10px;
      margin-top: 20px;
      position: absolute;
      bottom: 20px;
      left: 0;
      right: 0;
      z-index: 10;
    `;
    
    // Crear indicadores para cada día
    itineraryDays.forEach((day, index) => {
      const indicator = document.createElement('button');
      indicator.className = 'carousel-indicator';
      indicator.dataset.index = index;
      indicator.setAttribute('aria-label', `Ir al día ${day.day}`);
      indicator.style.cssText = `
        width: 10px;
        height: 10px;
        border-radius: 50%;
        border: none;
        background: ${index === 0 ? 'var(--primary)' : '#ddd'};
        cursor: pointer;
        transition: background 0.3s ease;
      `;
      
      indicator.addEventListener('click', () => {
        this.goToSlide(index);
      });
      
      indicatorsContainer.appendChild(indicator);
    });
    
    this.container.appendChild(indicatorsContainer);
    this.indicators = indicatorsContainer.querySelectorAll('.carousel-indicator');
  }
  
  updateIndicators() {
    if (!this.indicators) return;
    
    this.indicators.forEach((indicator, index) => {
      indicator.style.background = index === this.currentIndex ? 'var(--primary)' : '#ddd';
    });
  }
  
  startAutoPlay() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    
    const slideWidth = this.getSlideWidth();
    const gap = this.config.gap;
    const totalSlideWidth = slideWidth + gap;
    const totalDays = itineraryDays.length;
    const totalDistance = totalSlideWidth * totalDays;
    
    let lastTime = null;
    const speed = this.getCurrentSpeed();
    const pixelsPerSecond = totalDistance / speed;
    
    const animate = (currentTime) => {
      if (!lastTime) lastTime = currentTime;
      
      if (this.isPlaying && !this.isUserInteracting) {
        const delta = currentTime - lastTime;
        const moveAmount = (delta / 1000) * pixelsPerSecond;
        
        this.currentPosition -= moveAmount;
        
        // Si hemos pasado un set completo, resetear suavemente
        if (Math.abs(this.currentPosition) >= totalDistance * 2) {
          this.currentPosition += totalDistance;
        }
        
        // Calcular índice actual basado en la posición
        const slideIndex = Math.floor(Math.abs(this.currentPosition + totalDistance) / totalSlideWidth) % totalDays;
        if (slideIndex !== this.currentIndex) {
          this.currentIndex = slideIndex;
          this.updateIndicators();
        }
        
        this.track.style.transform = `translateX(${this.currentPosition}px)`;
      }
      
      lastTime = currentTime;
      this.animationId = requestAnimationFrame(animate);
    };
    
    this.animationId = requestAnimationFrame(animate);
  }
  
  pause() {
    this.isPlaying = false;
    this.track.style.cursor = 'default';
  }
  
  resume() {
    if (this.isUserInteracting) return;
    
    this.isPlaying = true;
    this.track.style.cursor = 'grab';
  }
  
  nextSlide() {
    this.isUserInteracting = true;
    this.pause();
    
    const slideWidth = this.getSlideWidth();
    const gap = this.config.gap;
    const totalSlideWidth = slideWidth + gap;
    
    this.currentPosition -= totalSlideWidth;
    this.currentIndex = (this.currentIndex + 1) % itineraryDays.length;
    
    // Si llegamos al final del segundo set, resetear al principio del segundo set
    const totalDays = itineraryDays.length;
    const totalDistance = totalSlideWidth * totalDays;
    
    if (Math.abs(this.currentPosition) >= totalDistance * 2) {
      this.currentPosition += totalDistance;
    }
    
    this.track.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    this.track.style.transform = `translateX(${this.currentPosition}px)`;
    
    this.updateIndicators();
    this.scheduleResume();
  }
  
  prevSlide() {
    this.isUserInteracting = true;
    this.pause();
    
    const slideWidth = this.getSlideWidth();
    const gap = this.config.gap;
    const totalSlideWidth = slideWidth + gap;
    
    this.currentPosition += totalSlideWidth;
    this.currentIndex = (this.currentIndex - 1 + itineraryDays.length) % itineraryDays.length;
    
    // Si retrocedemos al inicio del primer set, saltar al final del segundo set
    const totalDays = itineraryDays.length;
    const totalDistance = totalSlideWidth * totalDays;
    
    if (this.currentPosition > -totalDistance) {
      this.currentPosition -= totalDistance;
    }
    
    this.track.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    this.track.style.transform = `translateX(${this.currentPosition}px)`;
    
    this.updateIndicators();
    this.scheduleResume();
  }
  
  goToSlide(index) {
    this.isUserInteracting = true;
    this.pause();
    
    const slideWidth = this.getSlideWidth();
    const gap = this.config.gap;
    const totalSlideWidth = slideWidth + gap;
    const totalDays = itineraryDays.length;
    const totalDistance = totalSlideWidth * totalDays;
    
    // Calcular posición para el índice deseado en el segundo set
    this.currentIndex = index;
    this.currentPosition = -(totalDistance + (totalSlideWidth * index));
    
    this.track.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    this.track.style.transform = `translateX(${this.currentPosition}px)`;
    
    this.updateIndicators();
    this.scheduleResume();
  }
  
  scheduleResume() {
    if (this.resumeTimeout) {
      clearTimeout(this.resumeTimeout);
    }
    
    this.resumeTimeout = setTimeout(() => {
      this.isUserInteracting = false;
      this.resume();
    }, this.config.resumeDelay);
  }
  
  // Manejo de touch
  handleTouchStart(e) {
    e.preventDefault();
    this.isUserInteracting = true;
    this.pause();
    
    this.startX = e.touches[0].clientX;
    this.startPosition = this.currentPosition;
    this.track.style.transition = 'none';
    this.track.style.cursor = 'grabbing';
  }
  
  handleTouchMove(e) {
    if (!this.isUserInteracting) return;
    e.preventDefault();
    
    const currentX = e.touches[0].clientX;
    const diff = currentX - this.startX;
    this.currentPosition = this.startPosition + diff;
    this.track.style.transform = `translateX(${this.currentPosition}px)`;
  }
  
  handleTouchEnd() {
    if (!this.isUserInteracting) return;
    
    this.track.style.cursor = 'grab';
    this.track.style.transition = 'transform 0.3s ease-out';
    
    // Aplicar inercia y determinar si debemos cambiar de slide
    const moveDiff = this.currentPosition - this.startPosition;
    const slideWidth = this.getSlideWidth();
    
    if (Math.abs(moveDiff) > slideWidth * 0.3) {
      // Mover un slide completo en la dirección del arrastre
      if (moveDiff > 0) {
        this.prevSlide();
      } else {
        this.nextSlide();
      }
    } else {
      // Volver a la posición original
      this.currentPosition = this.startPosition;
      this.track.style.transform = `translateX(${this.currentPosition}px)`;
    }
    
    this.scheduleResume();
  }
  
  // Manejo de ratón
  handleMouseDown(e) {
    e.preventDefault();
    this.isUserInteracting = true;
    this.pause();
    
    this.startX = e.clientX;
    this.startPosition = this.currentPosition;
    this.track.style.transition = 'none';
    this.track.style.cursor = 'grabbing';
  }
  
  handleMouseMove(e) {
    if (!this.isUserInteracting) return;
    
    const currentX = e.clientX;
    const diff = currentX - this.startX;
    this.currentPosition = this.startPosition + diff;
    this.track.style.transform = `translateX(${this.currentPosition}px)`;
  }
  
  handleMouseUp() {
    if (!this.isUserInteracting) return;
    
    this.track.style.cursor = 'grab';
    this.track.style.transition = 'transform 0.3s ease-out';
    
    // Aplicar inercia y determinar si debemos cambiar de slide
    const moveDiff = this.currentPosition - this.startPosition;
    const slideWidth = this.getSlideWidth();
    
    if (Math.abs(moveDiff) > slideWidth * 0.3) {
      // Mover un slide completo en la dirección del arrastre
      if (moveDiff > 0) {
        this.prevSlide();
      } else {
        this.nextSlide();
      }
    } else {
      // Volver a la posición original
      this.currentPosition = this.startPosition;
      this.track.style.transform = `translateX(${this.currentPosition}px)`;
    }
    
    this.scheduleResume();
  }
  
  handleMouseLeave() {
    if (this.isUserInteracting) {
      this.track.style.cursor = 'grab';
      this.track.style.transition = 'transform 0.3s ease-out';
      this.scheduleResume();
    }
  }
  
  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    
    if (this.resumeTimeout) {
      clearTimeout(this.resumeTimeout);
    }
    
    // Remover event listeners
    window.removeEventListener('resize', this.handleResize);
  }
}

// Variable global para la instancia
let itineraryCarouselInstance = null;

// ====================================
// SECCIÓN RECORRIDO INTERACTIVO
// ====================================
const initJourneySection = () => {
  const points = document.querySelectorAll('.point');
  const dots = document.querySelectorAll('.dot');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');
  const pointTitle = document.getElementById('point-title');
  const pointDays = document.getElementById('point-days');
  const pointImage = document.getElementById('point-image');
  const pointDetails = document.getElementById('point-details');
  
  const pointData = [
    {
      title: "Santiago de Chile",
      days: "Días 1-3",
      image: "https://lacasadelviaje.com.mx/wp-content/uploads/2026/01/recorrido-1.webp",
      details: `
        <ul>
          <li><i class="fas fa-check"></i> City tour histórico y moderno</li>
          <li><i class="fas fa-check"></i> Excursión a Valparaíso y Viña del Mar</li>
          <li><i class="fas fa-check"></i> Alojamiento en hotel céntrico</li>
          <li><i class="fas fa-check"></i> Visita Palacio de la Moneda</li>
          <li><i class="fas fa-check"></i> Tour por barrios típicos</li>
        </ul>
      `
    },
    {
      title: "Puerto Varas",
      days: "Día 4",
      image: "https://lacasadelviaje.com.mx/wp-content/uploads/2026/01/recorrido-2.webp",
      details: `
        <ul>
          <li><i class="fas fa-check"></i> Vistas al volcán Osorno</li>
          <li><i class="fas fa-check"></i> Lago Llanquihue</li>
          <li><i class="fas fa-check"></i> Punto inicio Cruce de Lagos</li>
          <li><i class="fas fa-check"></i> La 'Ciudad de las Rosas'</li>
          <li><i class="fas fa-check"></i> Descanso en la Patagonia chilena</li>
        </ul>
      `
    },
    {
      title: "Cruce Internacional de Lagos",
      days: "Día 5",
      image: "https://lacasadelviaje.com.mx/wp-content/uploads/2026/01/recorrido-3.webp",
      details: `
        <ul>
          <li><i class="fas fa-check"></i> Cruce fronterizo más bello del mundo</li>
          <li><i class="fas fa-check"></i> Navegación por Lago Todos los Santos</li>
          <li><i class="fas fa-check"></i> Cruce de la Cordillera de los Andes</li>
          <li><i class="fas fa-check"></i> De Chile a Argentina por lagos</li>
          <li><i class="fas fa-check"></i> Paisajes espectaculares</li>
        </ul>
      `
    },
    {
      title: "San Carlos de Bariloche",
      days: "Día 6",
      image: "https://lacasadelviaje.com.mx/wp-content/uploads/2026/01/recorrido-4.webp",
      details: `
        <ul>
          <li><i class="fas fa-check"></i> Circuito Chico incluido</li>
          <li><i class="fas fa-check"></i> Lagos Nahuel Huapi y Moreno</li>
          <li><i class="fas fa-check"></i> Capital del chocolate</li>
          <li><i class="fas fa-check"></i> Cerro Campanario y vistas panorámicas</li>
          <li><i class="fas fa-check"></i> Cervezas artesanales patagónicas</li>
        </ul>
      `
    },
    {
      title: "Buenos Aires",
      days: "Días 7-10",
      image: "https://lacasadelviaje.com.mx/wp-content/uploads/2026/01/recorrido-5.webp",
      details: `
        <ul>
          <li><i class="fas fa-check"></i> City tour completo</li>
          <li><i class="fas fa-check"></i> Barrios típicos: La Boca, San Telmo</li>
          <li><i class="fas fa-check"></i> Opcional: show de tango</li>
          <li><i class="fas fa-check"></i> Puerto Madero y Recoleta</li>
          <li><i class="fas fa-check"></i> Fin del viaje inolvidable</li>
        </ul>
      `
    }
  ];
  
  let currentPoint = 0;
  
  const updatePointInfo = (index) => {
    if (index < 0 || index >= pointData.length) return;
    
    pointTitle.textContent = pointData[index].title;
    pointDays.textContent = pointData[index].days;
    pointImage.src = pointData[index].image;
    pointImage.alt = pointData[index].title;
    pointDetails.innerHTML = pointData[index].details;
    
    if (prevBtn) prevBtn.disabled = index === 0;
    if (nextBtn) nextBtn.disabled = index === pointData.length - 1;
    
    points.forEach((point, i) => {
      if (i === index) {
        point.classList.add('active');
      } else {
        point.classList.remove('active');
      }
    });
    
    dots.forEach((dot, i) => {
      if (i === index) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
    
    currentPoint = index;
  };
  
  points.forEach((point, index) => {
    point.addEventListener('click', () => {
      updatePointInfo(index);
    });
  });
  
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      updatePointInfo(index);
    });
  });
  
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentPoint > 0) {
        updatePointInfo(currentPoint - 1);
      }
    });
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (currentPoint < pointData.length - 1) {
        updatePointInfo(currentPoint + 1);
      }
    });
  }
  
  updatePointInfo(0);
  
};

// ====================================
// INICIALIZACIÓN PRINCIPAL
// ====================================
const init = () => {
  
  initSwipers();
  initScrollBehaviors();
  initScrollAnimations();
  initModal();
  initPriceHover();
  initSmoothScroll();
  initMobileMenu();
  initDynamicForm();
  initJourneySection();

  // Inicializar carrusel de itinerario infinito
  if (document.querySelector('.infinite-carousel-container')) {
    itineraryCarouselInstance = new InfiniteItineraryCarousel();
  }

};

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Observador para reiniciar carrusel si el contenido se carga dinámicamente
if (typeof MutationObserver !== 'undefined') {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length) {
        const hasCarousel = Array.from(mutation.addedNodes).some(node => 
          node.nodeType === 1 && node.querySelector('.infinite-carousel-track')
        );
        if (hasCarousel && !itineraryCarouselInstance) {
          itineraryCarouselInstance = new InfiniteItineraryCarousel();
        }
      }
    });
  });
  
  observer.observe(document.body, { childList: true, subtree: true });
}

// Manejar redimensionamiento para el carrusel
window.addEventListener('resize', () => {
  if (itineraryCarouselInstance) {
    itineraryCarouselInstance.updateDimensions();
  }
});

// Exportar para uso global
window.LCDV = window.LCDV || {};
window.LCDV.restartItineraryCarousel = function() {
  if (itineraryCarouselInstance) {
    itineraryCarouselInstance.destroy();
    itineraryCarouselInstance = null;
  }
  
  if (document.querySelector('.infinite-carousel-container')) {
    itineraryCarouselInstance = new InfiniteItineraryCarousel();
  }
  
  return itineraryCarouselInstance;
};