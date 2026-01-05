
// FUNCIONALIDADES PRINCIPALES DE LA PÁGINA
//  ult-mod:24-11-2025 
// Este archivo maneja carruseles, animaciones, modales y comportamientos de scroll
// Requiere: config.js cargado previamente

// INICIALIZACIÓN DE CARRUSELES (SWIPER)

const initSwipers = () => {
  // Carrusel de Itinerario
  if (document.querySelector(".itinerarySwiper")) {
    new Swiper(".itinerarySwiper", {
      effect: "coverflow",
      centeredSlides: true,
      slidesPerView: "auto",
      loop: true,
      allowTouchMove: true,
      autoplay: { 
        delay: 4000, 
        ...CONFIG.autoplay 
      },
      coverflowEffect: {
        rotate: 20,
        stretch: 0,
        depth: 100,
        modifier: 1,
        slideShadows: false
      },
      pagination: { 
        el: ".swiper-pagination", 
        clickable: true 
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev"
      },
      breakpoints: CONFIG.breakpoints.itinerary
    });
  }

  // Carrusel de Reseñas
  if (document.querySelector(".reviewsSwiper")) {
    new Swiper(".reviewsSwiper", {
      slidesPerView: 1,
      spaceBetween: 30,
      loop: true,
      allowTouchMove: false,
      autoplay: { 
        delay: 3500, 
        ...CONFIG.autoplay 
      },
      breakpoints: CONFIG.breakpoints.reviews
    });
  }
};

// COMPORTAMIENTOS DE SCROLL

const initScrollBehaviors = () => {
  const navbar = document.querySelector('nav');
  const scrollToTopBtn = document.getElementById('scrollToTop');

  // Navbar contraído y botón Scroll to Top
  window.addEventListener('scroll', () => {
    const scrollPos = window.pageYOffset;

    // Navbar contraído al hacer scroll
    if (navbar) {
      navbar.classList.toggle('scrolled', scrollPos > CONFIG.scroll.navbarThreshold);
    }

    // Mostrar/ocultar botón Scroll to Top
    if (scrollToTopBtn) {
      scrollToTopBtn.classList.toggle('show', scrollPos > CONFIG.scroll.scrollToTopThreshold);
    }
  }, { passive: true });

  // Acción del botón Scroll to Top
  if (scrollToTopBtn) {
    scrollToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
};


// ANIMACIONES DE APARICIÓN (INTERSECTION OBSERVER)


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

  // Elementos a observar
  const elements = document.querySelectorAll(
    '.hero-text, .form-container, .experience-content, .experience-image-wrapper, ' +
    '.itinerary-card, .point, .featured-card, .destination-card, .review-card'
  );

  elements.forEach(el => observer.observe(el));
};

// MODAL DE RESERVA

const initModal = () => {
  const modal = document.getElementById('modalReserva');
  const btnOpen = document.getElementById('btnReservar');
  const btnClose = document.getElementById('btnCerrarModal');

  if (!modal) return;

  // Abrir modal
  const openModal = () => {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  // Cerrar modal
  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  // Event listeners básicos
  if (btnOpen) {
    btnOpen.addEventListener('click', openModal);
  }
  
  if (btnClose) {
    btnClose.addEventListener('click', closeModal);
  }

  // Cerrar con click fuera del contenido
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Cerrar con tecla ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  // Botones inline y tarjetas de precio que abren el modal
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

// EFECTOS DE HOVER EN TARJETAS DE PRECIO(migrar a css)

const initPriceHover = () => {
  const priceCards = document.querySelectorAll('.price-card');
  
  priceCards.forEach(card => {
    const priceElement = card.querySelector('.price');
    const originalPrice = priceElement.innerHTML;
    
    // Efecto al pasar el mouse
    card.addEventListener('mouseenter', () => {
      priceElement.innerHTML = '<span style="font-size: 0.8em;">¡Reserva Ahora!</span>';
      card.style.transform = 'translateY(-8px) scale(1.02)';
    });
    
    // Restaurar al salir
    card.addEventListener('mouseleave', () => {
      priceElement.innerHTML = originalPrice;
      card.style.transform = '';
    });
    
    // Click para abrir modal (ya manejado en initModal, pero por si acaso)
    card.addEventListener('click', () => {
      const modal = document.getElementById('modalReserva');
      if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });
};

// SMOOTH SCROLL PARA ENLACES INTERNOS

const initSmoothScroll = () => {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      
      // Ignorar si es solo "#" o "#!"
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

// MENÚ MÓVIL (si lo agrego)

const initMobileMenu = () => {
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  
  if (!menuToggle || !navMenu) return;
  
  menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    menuToggle.classList.toggle('active');
  });
  
  // Cerrar menú al hacer click en un enlace
  document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      menuToggle.classList.remove('active');
    });
  });
};

// INICIALIZACIÓN PRINCIPAL

const init = () => {
  console.log('Inicializando funcionalidades de la página...');
  
  initSwipers();
  initScrollBehaviors();
  initScrollAnimations();
  initModal();
  initPriceHover();
  initSmoothScroll();
  initMobileMenu();
  initDynamicForm();

  console.log('Página inicializada correctamente');
};

// Ejecutar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}



// CARRUSEL INFINITO OPTIMIZADO
// Reemplaza tu sección de itinerario actual manteniendo el mismo diseño
// Este código duplica las tarjetas dinámicamente en lugar de tenerlas hardcodeadas

// ====================================
// CONFIGURACIÓN
// ====================================
const CAROUSEL_CONFIG = {
  slideWidth: 300, // Ancho de cada slide en px
  gap: 0,          // Espacio entre slides
  animationSpeed: 60, // Duración en segundos
  slideWidthMobile: 250,
  slideWidthTablet: 280
};

// ====================================
// DATOS DE LOS DÍAS (Solo una vez)
// ====================================
const itineraryDays = [
  {
    day: 1,
    image: 'https://lacasadelviaje.com.mx/wp-content/uploads/2025/11/day1.png',
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
    image: 'https://lacasadelviaje.com.mx/wp-content/uploads/2025/11/day2.png',
    title: 'Santiago de Chile',
    activities: [
      'Desayuno en el hotel.',
      'Visita de la ciudad en tour regular: Palacio de la Moneda, Plaza de Armas, Cerro Santa Lucía.',
      'Recorrido por el Barrio Lastarria y Bellavista.',
      'Visita a las comunas modernas de Providencia, Las Condes y Vitacura.',
      'Tarde libre para actividades personales.',
      'Alojamiento en Santiago.'
    ]
  },
  {
    day: 3,
    image: 'https://lacasadelviaje.com.mx/wp-content/uploads/2025/11/day3.png',
    title: 'Santiago – Valparaíso – Viña del Mar',
    activities: [
      'Desayuno en el hotel.',
      'Salida hacia la costa para visitar Valparaíso, ciudad patrimonial de la humanidad.',
      'Subida en ascensor tradicional, paseo por cerros Alegre y Concepción.',
      'Visita a La Sebastiana, casa-museo de Pablo Neruda.',
      'Continuación a Viña del Mar: Casino, avenidas costeras y playa de Reñaca.',
      'Regreso a Santiago. Alojamiento.'
    ]
  },
  {
    day: 4,
    image: 'https://lacasadelviaje.com.mx/wp-content/uploads/2025/11/day4.png',
    title: 'Santiago – Puerto Montt – Puerto Varas',
    activities: [
      'Desayuno en el hotel.',
      'Traslado al aeropuerto para vuelo a Puerto Montt (no incluido).',
      'Llegada a Puerto Montt, asistencia y traslado a Puerto Varas.',
      'Resto del día libre en la "Ciudad de las Rosas".',
      'Vistas espectaculares del volcán Osorno y lago Llanquihue.',
      'Alojamiento en Puerto Varas.'
    ]
  },
  {
    day: 5,
    image: 'https://lacasadelviaje.com.mx/wp-content/uploads/2025/11/day5.png',
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
    image: 'https://lacasadelviaje.com.mx/wp-content/uploads/2025/11/day1.png',
    title: 'Bariloche - Circuito Chico',
    activities: [
      'Desayuno en el hotel.',
      'Excursión Circuito Chico: Av. Bustillo, Playa Bonita, cerro Campanario.',
      'Visita a península Llao Llao, hotel Llao Llao y capilla San Eduardo.',
      'Vistas panorámicas del lago Nahuel Huapi y lago Moreno.',
      'Tarde libre en Bariloche para disfrutar de chocolates y cervezas artesanales.',
      'Alojamiento en Bariloche.'
    ]
  },
  {
    day: 7,
    image: 'https://lacasadelviaje.com.mx/wp-content/uploads/2025/11/day2.png',
    title: 'Bariloche – Buenos Aires',
    activities: [
      'Desayuno en el hotel.',
      'Traslado al aeropuerto para vuelo a Buenos Aires (no incluido).',
      'Arribo a la capital argentina, asistencia y traslado al hotel.',
      'Tarde libre para primer contacto con la ciudad.',
      'Recomendación: paseo por Puerto Madero al atardecer.',
      'Alojamiento en Buenos Aires.'
    ]
  },
  {
    day: 8,
    image: 'https://lacasadelviaje.com.mx/wp-content/uploads/2025/11/day3.png',
    title: 'Buenos Aires',
    activities: [
      'Desayuno en el hotel.',
      'Visita de la ciudad: Plaza de Mayo, Casa Rosada, Catedral.',
      'Recorrido por San Telmo, La Boca y Caminito.',
      'Visita a Puerto Madero, Recoleta y Palermo.',
      'Tarde libre para compras o actividades opcionales.',
      'Noche: sugerencia opcional de cena con espectáculo de tango.',
      'Alojamiento en Buenos Aires.'
    ]
  },
  {
    day: 9,
    image: 'https://lacasadelviaje.com.mx/wp-content/uploads/2025/11/day4.png',
    title: 'Buenos Aires - Día Libre',
    activities: [
      'Desayuno en el hotel.',
      'Día libre para actividades personales.',
      'Opciones recomendadas: Excursión al Tigre y Delta del Paraná.',
      'Otra opción: día de campo en estancia típica argentina.',
      'O simplemente explorar barrios como Palermo Soho, Belgrano o Núñez.',
      'Última noche en la capital argentina. Alojamiento.'
    ]
  },
  {
    day: 10,
    image: 'https://lacasadelviaje.com.mx/wp-content/uploads/2025/11/day5.png',
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
// FUNCIÓN PARA CREAR HTML DE UN SLIDE
// ====================================
function createSlideHTML(day) {
  return `
    <div class="infinite-slide">
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
    </div>
  `;
}

// ====================================
// INICIALIZACIÓN DEL CARRUSEL
// ====================================
function initInfiniteCarousel() {
  const track = document.querySelector('.infinite-carousel-track');
  
  if (!track) {
    console.error('No se encontró .infinite-carousel-track');
    return;
  }

  // Limpiar contenido existente
  track.innerHTML = '';

  // Crear slides originales
  const originalSlides = itineraryDays.map(day => createSlideHTML(day)).join('');
  
  // Duplicar para efecto infinito (3 copias es suficiente)
  track.innerHTML = originalSlides + originalSlides + originalSlides;

  // Configurar ancho del slide según viewport
  updateSlideWidth();

  // Calcular duración de animación basada en cantidad de slides
  const totalSlides = itineraryDays.length;
  const slideWidth = getSlideWidth();
  const totalWidth = slideWidth * totalSlides;
  
  // Ajustar animación CSS dinámicamente
  updateAnimationKeyframes(slideWidth, totalSlides);
  
  console.log(`✅ Carrusel optimizado: ${totalSlides} días originales, ${totalSlides * 3} slides totales`);
}

// ====================================
// FUNCIÓN PARA OBTENER ANCHO DE SLIDE
// ====================================
function getSlideWidth() {
  if (window.innerWidth <= 480) {
    return CAROUSEL_CONFIG.slideWidthMobile;
  } else if (window.innerWidth <= 768) {
    return CAROUSEL_CONFIG.slideWidthTablet;
  }
  return CAROUSEL_CONFIG.slideWidth;
}

// ====================================
// ACTUALIZAR ANCHO DE SLIDES
// ====================================
function updateSlideWidth() {
  const slides = document.querySelectorAll('.infinite-slide');
  const width = getSlideWidth();
  
  slides.forEach(slide => {
    slide.style.width = `${width}px`;
    slide.style.height = `${width < 250 ? 320 : width < 280 ? 350 : 400}px`;
  });
}

// ====================================
// ACTUALIZAR KEYFRAMES DE ANIMACIÓN
// ====================================
function updateAnimationKeyframes(slideWidth, totalSlides) {
  const totalDistance = slideWidth * totalSlides;
  
  // Remover keyframe anterior si existe
  const styleSheet = document.styleSheets[0];
  for (let i = styleSheet.cssRules.length - 1; i >= 0; i--) {
    const rule = styleSheet.cssRules[i];
    if (rule.name === 'infinite-scroll') {
      styleSheet.deleteRule(i);
      break;
    }
  }
  
  // Crear nuevo keyframe
  const keyframes = `
    @keyframes infinite-scroll {
      0% {
        transform: translateX(0);
      }
      100% {
        transform: translateX(-${totalDistance}px);
      }
    }
  `;
  
  styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
  
  // Aplicar animación al track
  const track = document.querySelector('.infinite-carousel-track');
  track.style.animation = `infinite-scroll ${CAROUSEL_CONFIG.animationSpeed}s linear infinite`;
}

// ====================================
// OPTIMIZACIÓN: LAZY LOADING INTELIGENTE
// ====================================
function setupLazyLoading() {
  const images = document.querySelectorAll('.infinite-slide img');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px' // Cargar 50px antes de que sea visible
    });

    images.forEach(img => imageObserver.observe(img));
  }
}

// ====================================
// PAUSAR ANIMACIÓN AL HACER HOVER
// ====================================
function setupHoverPause() {
  const container = document.querySelector('.infinite-carousel-container');
  const track = document.querySelector('.infinite-carousel-track');
  
  if (container && track) {
    container.addEventListener('mouseenter', () => {
      track.style.animationPlayState = 'paused';
    });
    
    container.addEventListener('mouseleave', () => {
      track.style.animationPlayState = 'running';
    });
  }
}

// ====================================
// RESPONSIVE: RECALCULAR EN RESIZE
// ====================================
let resizeTimer;
function handleResize() {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    updateSlideWidth();
    const slideWidth = getSlideWidth();
    updateAnimationKeyframes(slideWidth, itineraryDays.length);
  }, 250); // Debounce de 250ms
}

// ====================================
// INICIALIZACIÓN COMPLETA
// ====================================
function initOptimizedCarousel() {
  // Esperar a que el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  function init() {
    initInfiniteCarousel();
    setupLazyLoading();
    setupHoverPause();
    
    // Listener para resize
    window.addEventListener('resize', handleResize);
    
    console.log('🎨 Carrusel infinito optimizado inicializado correctamente');
  }
}

// ====================================
// EJECUTAR
// ====================================
initOptimizedCarousel();

// ====================================
// CLEANUP (opcional - para SPAs)
// ====================================
function destroyCarousel() {
  window.removeEventListener('resize', handleResize);
  const container = document.querySelector('.infinite-carousel-container');
  if (container) {
    container.removeEventListener('mouseenter', () => {});
    container.removeEventListener('mouseleave', () => {});
  }
  console.log('🧹 Carrusel destruido');
}

// Exportar para uso en otros scripts si es necesario
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initOptimizedCarousel, destroyCarousel };
}











// ====================================
// SECCIÓN RECORRIDO INTERACTIVO
// ====================================

const initJourneySection = () => {
  // Elementos del DOM
  const points = document.querySelectorAll('.point');
  const dots = document.querySelectorAll('.dot');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');
  const pointTitle = document.getElementById('point-title');
  const pointDays = document.getElementById('point-days');
  const pointImage = document.getElementById('point-image');
  const pointDetails = document.getElementById('point-details');
  
  // Datos de cada punto
  const pointData = [
    {
      title: "Santiago de Chile",
      days: "Días 1-3",
      image: "https://lacasadelviaje.com.mx/wp-content/uploads/2025/11/line-chihuahua.png",
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
      image: "https://lacasadelviaje.com.mx/wp-content/uploads/2025/11/line-creel.png",
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
      image: "https://lacasadelviaje.com.mx/wp-content/uploads/2025/11/line-divisadero.png",
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
      image: "https://lacasadelviaje.com.mx/wp-content/uploads/2025/11/line-fuerte.png",
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
      image: "https://lacasadelviaje.com.mx/wp-content/uploads/2025/11/line-fuerte.png",
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
  
  // Función para actualizar la información
  const updatePointInfo = (index) => {
    // Validar índice
    if (index < 0 || index >= pointData.length) return;
    
    // Actualizar datos
    pointTitle.textContent = pointData[index].title;
    pointDays.textContent = pointData[index].days;
    pointImage.src = pointData[index].image;
    pointImage.alt = pointData[index].title;
    pointDetails.innerHTML = pointData[index].details;
    
    // Actualizar estado de botones
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === pointData.length - 1;
    
    // Actualizar puntos activos
    points.forEach((point, i) => {
      if (i === index) {
        point.classList.add('active');
      } else {
        point.classList.remove('active');
      }
    });
    
    // Actualizar dots de navegación
    dots.forEach((dot, i) => {
      if (i === index) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
    
    currentPoint = index;
  };
  
  // Event listeners para los puntos
  points.forEach((point, index) => {
    point.addEventListener('click', () => {
      updatePointInfo(index);
    });
  });
  
  // Event listeners para los dots
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      updatePointInfo(index);
    });
  });
  
  // Event listeners para los botones de navegación
  prevBtn.addEventListener('click', () => {
    if (currentPoint > 0) {
      updatePointInfo(currentPoint - 1);
    }
  });
  
  nextBtn.addEventListener('click', () => {
    if (currentPoint < pointData.length - 1) {
      updatePointInfo(currentPoint + 1);
    }
  });
  
  // Navegación con teclado
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && currentPoint > 0) {
      updatePointInfo(currentPoint - 1);
    } else if (e.key === 'ArrowRight' && currentPoint < pointData.length - 1) {
      updatePointInfo(currentPoint + 1);
    }
  });
  
  // Inicializar con el primer punto
  updatePointInfo(0);
  
  console.log('✅ Sección de recorrido inicializada');
};

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initJourneySection);
} else {
  initJourneySection();
}

// ====================================
// FORMULARIO DINÁMICO - Campos expandibles
// ====================================
function initDynamicForm() {
  const bookingForm = document.getElementById('bookingForm');
  const additionalFields = document.getElementById('additionalFields');
  
  if (!bookingForm || !additionalFields) return;
  
  // Función para mostrar campos adicionales
  function showAdditionalFields() {
    if (additionalFields.style.display === 'none') {
      additionalFields.style.display = 'block';
      bookingForm.classList.add('expanded');
      
      // Desplazamiento suave al primer campo adicional
      setTimeout(() => {
        additionalFields.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'nearest' 
        });
      }, 300);
    }
  }
  
  // Event listeners para inputs principales
  const triggerInputs = bookingForm.querySelectorAll('.form-input-trigger');
  triggerInputs.forEach(input => {
    input.addEventListener('click', showAdditionalFields);
    input.addEventListener('focus', showAdditionalFields);
    input.addEventListener('touchstart', showAdditionalFields, { passive: true });
  });
  
  // También mostrar al hacer clic en cualquier parte del formulario
  bookingForm.addEventListener('click', function(e) {
    // Solo activar si el clic no es en el botón de submit
    if (e.target.type !== 'submit' && e.target.className !== 'btn-submit-modal') {
      showAdditionalFields();
    }
  });
  
  // Para móviles, también activar con toque
  bookingForm.addEventListener('touchstart', function(e) {
    if (e.target.type !== 'submit' && e.target.className !== 'btn-submit-modal') {
      showAdditionalFields();
    }
  }, { passive: true });
  
  console.log('✅ Formulario dinámico inicializado');
}


