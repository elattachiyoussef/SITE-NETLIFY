// Attendre que le DOM soit chargé
document.addEventListener('DOMContentLoaded', () => {
    // Optimisation des performances
    const performanceOptimizer = {
        init() {
            this.lazyLoadImages();
            this.deferNonCriticalCSS();
            this.setupIntersectionObserver();
            this.optimizeEventListeners();
            this.setupCDNFallbacks();
            this.optimizeLCP();
        },

        lazyLoadImages() {
            // Utilisation de loading="lazy" pour les images non critiques
            document.querySelectorAll('img:not([loading])').forEach(img => {
                if (!img.classList.contains('critical')) {
                    img.loading = 'lazy';
                }
            });

            // Préchargement des images critiques
            const criticalImages = ['logo.png'];
            criticalImages.forEach(img => {
                const link = document.createElement('link');
                link.rel = 'preload';
                link.as = 'image';
                link.href = `assets/images/${img}`;
                document.head.appendChild(link);
            });
        },

        deferNonCriticalCSS() {
            // Chargement différé des styles non critiques
            const nonCriticalCSS = [
                'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css'
            ];

            nonCriticalCSS.forEach(href => {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = href;
                link.media = 'print';
                link.onload = () => { link.media = 'all' };
                document.head.appendChild(link);
            });
        },

        setupIntersectionObserver() {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });

            document.querySelectorAll('.animate-on-scroll').forEach(el => {
                observer.observe(el);
            });
        },

        optimizeEventListeners() {
            // Debounce du scroll
            let scrollTimeout;
            const header = document.querySelector('.main-header');
            let lastScroll = 0;

            window.addEventListener('scroll', () => {
                if (!scrollTimeout) {
                    scrollTimeout = setTimeout(() => {
                        const currentScroll = window.pageYOffset;
                        if (currentScroll > 60) {
                            header.classList.add('sticky');
                            header.classList.toggle('header-hidden', currentScroll > lastScroll);
                        } else {
                            header.classList.remove('sticky', 'header-hidden');
                        }
                        lastScroll = currentScroll;
                        scrollTimeout = null;
                    }, 16); // ~60fps
                }
            }, { passive: true });
        },

        setupCDNFallbacks() {
            // Vérifier si les ressources CDN sont chargées correctement
            const cdnResources = [
                { type: 'css', url: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css', fallback: 'assets/vendor/fontawesome/css/all.min.css' },
                { type: 'font', url: 'https://fonts.googleapis.com/css2?family=Raleway:wght@400;600;700&display=swap', fallback: 'assets/vendor/fonts/raleway.css' }
            ];

            cdnResources.forEach(resource => {
                const link = document.querySelector(`link[href="${resource.url}"]`);
                if (link) {
                    link.onerror = () => {
                        console.warn(`CDN resource failed to load: ${resource.url}, using fallback`);
                        const fallbackLink = document.createElement('link');
                        fallbackLink.rel = 'stylesheet';
                        fallbackLink.href = resource.fallback;
                        document.head.appendChild(fallbackLink);
                    };
                }
            });
        },

        optimizeLCP() {
            // Charger l'image d'arrière-plan de manière optimisée
            const heroBg = document.querySelector('.hero-background');
            if (heroBg) {
                // S'assurer que l'image est chargée avec priorité élevée
                if ('loading' in HTMLImageElement.prototype) {
                    heroBg.loading = 'eager';
                }
                
                // Ajouter un gestionnaire pour mesurer le LCP
                if (window.performance && window.performance.mark) {
                    heroBg.onload = () => {
                        window.performance.mark('hero-image-loaded');
                    };
                }
            }
            
            // Précharger les polices critiques
            const fontPreload = document.createElement('link');
            fontPreload.rel = 'preload';
            fontPreload.as = 'font';
            fontPreload.href = 'https://fonts.gstatic.com/s/raleway/v28/1Ptug8zYS_SKggPNyC0ITw.woff2';
            fontPreload.type = 'font/woff2';
            fontPreload.crossOrigin = 'anonymous';
            document.head.appendChild(fontPreload);
        }
    };

    // Gestion du header
    const header = document.querySelector('.main-header');
    let lastScroll = 0;
    
    const handleScroll = () => {
        const currentScroll = window.pageYOffset;
        if (currentScroll > 60) {
            header.classList.add('sticky');
            header.classList.toggle('header-hidden', currentScroll > lastScroll);
        } else {
            header.classList.remove('sticky', 'header-hidden');
        }
        lastScroll = currentScroll;
    };

    // Animation des sections au scroll
    const animateOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                // Animation spéciale pour la timeline
                if (entry.target.classList.contains('timeline-item')) {
                    entry.target.classList.add('slide-in');
                }
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: "0px"
    });

    // Éléments à animer
    const elementsToAnimate = document.querySelectorAll(`
        .renovation-card,
        .service-column,
        .timeline-item,
        .value-card,
        .brands-slider,
        .history h2,
        .timeline,
        .how-to-card,
        .section-header
    `);
    
    elementsToAnimate.forEach(el => animateOnScroll.observe(el));

    // Navigation fluide
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Menu mobile
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const overlay = document.querySelector('.overlay');
    const body = document.body;
    
    if (menuToggle && mainNav && overlay) {
        function toggleMenu() {
            mainNav.classList.toggle('active');
            overlay.classList.toggle('active');
            body.style.overflow = mainNav.classList.contains('active') ? 'hidden' : '';
        }
        
        menuToggle.addEventListener('click', toggleMenu);
        overlay.addEventListener('click', toggleMenu);
        
        // Fermer le menu quand on clique sur un lien
        const menuLinks = mainNav.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (mainNav.classList.contains('active')) {
                    toggleMenu();
                }
            });
        });
        
        // Empêcher le défilement du body quand le menu est ouvert
        document.body.addEventListener('touchmove', function(e) {
            if (document.body.classList.contains('menu-open')) {
                e.preventDefault();
            }
        }, { passive: false });
        
        // Gestion du scroll
        window.addEventListener('scroll', function() {
            const currentScroll = window.pageYOffset;
            const header = document.querySelector('.main-header');
            const mobileMenu = document.querySelector('.mobile-menu-toggle');

            if (currentScroll > lastScroll && currentScroll > 70) {
                // Défilement vers le bas
                header.style.transform = 'translateY(-100%)';
                mobileMenu.style.top = '20px'; // Le menu hamburger reste visible
            } else {
                // Défilement vers le haut
                header.style.transform = 'translateY(0)';
                mobileMenu.style.top = '20px';
            }

            lastScroll = currentScroll;
        }, { passive: true });
    }
    
    // Ajouter la classe no-scroll au body
    document.head.insertAdjacentHTML('beforeend', `
        <style>
            body.no-scroll {
                overflow: hidden;
            }
        </style>
    `);

    // Lazy loading des images
    const lazyLoad = () => {
        const lazyImages = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    };

    // Styles pour les animations
    const addAnimationStyles = () => {
        const style = document.createElement('style');
        style.textContent = `
            .fade-in {
                animation: fadeIn 0.6s ease forwards;
            }

            .slide-in {
                animation: slideIn 0.8s ease forwards;
            }

            @keyframes fadeIn {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateX(-30px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }

            .sticky {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(5px);
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                animation: slideDown 0.3s ease;
                z-index: 1000;
            }

            .header-hidden {
                transform: translateY(-100%);
            }

            @media (max-width: 768px) {
                .menu-toggle {
                    display: block;
                }

                .main-nav {
                    position: fixed;
                    top: 80px;
                    left: 0;
                    right: 0;
                    background: var(--white);
                    padding: 20px;
                    transform: translateY(-100%);
                    opacity: 0;
                    transition: all 0.3s ease;
                    visibility: hidden;
                    z-index: 999;
                }

                .main-nav.active {
                    transform: translateY(0);
                    opacity: 1;
                    visibility: visible;
                }

                .main-nav ul {
                    flex-direction: column;
                    gap: 15px;
                }
            }
        `;
        document.head.appendChild(style);
    };

    // Initialisation
    const init = () => {
        performanceOptimizer.init();
        lazyLoad();
        addAnimationStyles();
        window.addEventListener('scroll', handleScroll, { passive: true });
    };

    init();

    // Frise chronologique horizontale
    const slider = document.querySelector('.timeline-slider');
    const prevBtn = document.querySelector('.timeline-nav.prev');
    const nextBtn = document.querySelector('.timeline-nav.next');
    const yearLinks = document.querySelectorAll('.year-link');
    
    if (slider && prevBtn && nextBtn) {
        // Navigation avec les boutons
        prevBtn.addEventListener('click', () => {
            slider.scrollBy({ left: -slider.offsetWidth, behavior: 'smooth' });
        });
        
        nextBtn.addEventListener('click', () => {
            slider.scrollBy({ left: slider.offsetWidth, behavior: 'smooth' });
        });
        
        // Mise à jour de l'année active lors du défilement
        slider.addEventListener('scroll', () => {
            const slides = document.querySelectorAll('.timeline-slide');
            const scrollPosition = slider.scrollLeft;
            const slideWidth = slider.offsetWidth;
            
            slides.forEach((slide, index) => {
                const slidePosition = index * slideWidth;
                if (scrollPosition >= slidePosition - slideWidth / 2 && 
                    scrollPosition < slidePosition + slideWidth / 2) {
                    // Mettre à jour la classe active
                    yearLinks.forEach(link => link.classList.remove('active'));
                    yearLinks[index].classList.add('active');
                }
            });
        });
        
        // Navigation avec les liens d'années
        yearLinks.forEach((link, index) => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const slideId = link.getAttribute('href');
                const targetSlide = document.querySelector(slideId);
                
                if (targetSlide) {
                    slider.scrollTo({
                        left: index * slider.offsetWidth,
                        behavior: 'smooth'
                    });
                    
                    // Mettre à jour la classe active
                    yearLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                }
            });
        });
    }

    // Optimisations pour mobile
    const mobileOptimizer = {
        init() {
            this.optimizeImages();
            this.improveScrollPerformance();
            this.optimizeAnimations();
            this.detectLowPowerMode();
        },
        
        optimizeImages() {
            // Adapter la qualité des images en fonction de la connexion
            if ('connection' in navigator) {
                const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
                if (connection) {
                    if (connection.saveData || connection.effectiveType.includes('2g') || connection.effectiveType.includes('slow')) {
                        // Réduire la qualité des images pour les connexions lentes
                        document.querySelectorAll('img:not(.critical)').forEach(img => {
                            if (img.src.includes('.jpg') || img.src.includes('.jpeg')) {
                                img.src = img.src.replace('.jpg', '-low.jpg').replace('.jpeg', '-low.jpeg');
                            }
                        });
                    }
                }
            }
            
            // Utiliser des images plus petites sur mobile
            if (window.innerWidth <= 768) {
                document.querySelectorAll('img[data-mobile-src]').forEach(img => {
                    img.src = img.getAttribute('data-mobile-src');
                });
            }
        },
        
        improveScrollPerformance() {
            // Réduire la fréquence des événements de défilement
            let ticking = false;
            let lastScrollY = window.scrollY;
            const header = document.querySelector('.main-header');

            window.addEventListener('scroll', function() {
                if (!ticking) {
                    window.requestAnimationFrame(function() {
                        if (window.scrollY > lastScrollY) {
                            header.style.transform = 'translateY(-100%)';
                        } else {
                            header.style.transform = 'translateY(0)';
                        }
                        lastScrollY = window.scrollY;
                        ticking = false;
                    });
                    ticking = true;
                }
            });
        },
        
        optimizeAnimations() {
            // Désactiver les animations complexes sur les appareils à faible puissance
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            if (isMobile) {
                document.body.classList.add('reduce-motion');
                
                // Ajouter des styles pour réduire les animations
                const style = document.createElement('style');
                style.textContent = `
                    .reduce-motion * {
                        transition-duration: 0.1s !important;
                        animation-duration: 0.1s !important;
                    }
                    
                    .reduce-motion .brands-slider-inner {
                        animation-duration: 60s !important;
                    }
                `;
                document.head.appendChild(style);
            }
        },
        
        detectLowPowerMode() {
            // Détecter le mode économie d'énergie si disponible
            if ('getBattery' in navigator) {
                navigator.getBattery().then(battery => {
                    if (battery.charging === false && battery.level < 0.2) {
                        document.body.classList.add('low-power-mode');
                        
                        // Désactiver les animations non essentielles
                        const animations = document.querySelectorAll('.brands-slider-inner, .animate-on-scroll');
                        animations.forEach(el => {
                            el.style.animationPlayState = 'paused';
                        });
                    }
                });
            }
        }
    };

    // Initialiser les optimisations pour mobile
    mobileOptimizer.init();

    // Carousel des avis Google
    const initReviewsCarousel = () => {
        const reviewsContainer = document.querySelector('.reviews-slider');
        if (!reviewsContainer) return;
        
        // Avis supplémentaires à ajouter dynamiquement
        const additionalReviews = [
            {
                name: "Sophie Durand",
                stars: 5,
                text: "Très satisfaite de l'installation de mes volets roulants. Travail soigné et équipe professionnelle."
            },
            {
                name: "Thomas Leroy",
                stars: 4,
                text: "Bon rapport qualité-prix et conseils avisés. Je recommande pour tous vos besoins en serrurerie."
            },
            {
                name: "Isabelle Moreau",
                stars: 5,
                text: "Service client exceptionnel. Ils ont su résoudre mon problème de serrure rapidement et efficacement."
            }
        ];
        
        // Fonction pour créer un élément d'avis
        const createReviewElement = (review) => {
            const reviewCard = document.createElement('div');
            reviewCard.className = 'review-card';
            
            const starsHTML = Array(5).fill('').map((_, i) => 
                `<i class="fas fa-${i < review.stars ? 'star' : 'star-o'}"></i>`
            ).join('');
            
            reviewCard.innerHTML = `
                <div class="review-header">
                    <div class="reviewer">
                        <span class="reviewer-name">${review.name}</span>
                    </div>
                    <div class="review-stars">
                        ${starsHTML}
                    </div>
                </div>
                <p class="review-text">"${review.text}"</p>
            `;
            
            return reviewCard;
        };
        
        // Ajouter les avis supplémentaires après un délai
        setTimeout(() => {
            // Masquer les avis actuels
            const currentReviews = reviewsContainer.querySelectorAll('.review-card');
            currentReviews.forEach(review => {
                review.style.opacity = '0';
                setTimeout(() => {
                    review.style.display = 'none';
                }, 500);
            });
            
            // Ajouter les nouveaux avis
            setTimeout(() => {
                reviewsContainer.innerHTML = '';
                additionalReviews.forEach(review => {
                    const reviewElement = createReviewElement(review);
                    reviewElement.style.opacity = '0';
                    reviewsContainer.appendChild(reviewElement);
                    
                    setTimeout(() => {
                        reviewElement.style.opacity = '1';
                    }, 100);
                });
                
                // Revenir aux avis originaux après un délai
                setTimeout(() => {
                    // Réinitialiser le carousel
                    initReviewsCarousel();
                }, 8000);
            }, 600);
        }, 8000);
    };

    // Initialiser le carousel des avis
    initReviewsCarousel();

    // Gestion du formulaire de contact
    const initContactForm = () => {
        const form = document.getElementById('contactForm');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Validation basique
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;

            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                } else {
                    field.classList.remove('error');
                }
            });

            if (!isValid) {
                alert('Veuillez remplir tous les champs obligatoires');
                return;
            }

            // Envoi du formulaire
            const submitButton = form.querySelector('.submit-button');
            const originalText = submitButton.innerHTML;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
            submitButton.disabled = true;

            try {
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: new FormData(form),
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    // Succès
                    form.reset();
                    alert('Message envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.');
                } else {
                    throw new Error('Erreur lors de l\'envoi');
                }
            } catch (error) {
                alert('Une erreur est survenue. Veuillez réessayer ou nous contacter par téléphone.');
            } finally {
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
            }
        });
    };

    // Initialiser le formulaire
    initContactForm();

    // Gestion des transitions entre les onglets
    const initTabTransitions = () => {
        // Sélectionner tous les liens de navigation
        const navLinks = document.querySelectorAll('.main-nav a');
        
        // Ajouter un écouteur d'événement sur chaque lien
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // Si c'est un lien interne (avec #)
                if (link.getAttribute('href').includes('#')) {
                    e.preventDefault();
                    
                    // Récupérer la cible
                    const targetId = link.getAttribute('href').split('#')[1];
                    const targetSection = document.getElementById(targetId);
                    
                    if (targetSection) {
                        // Ajouter la classe pour l'animation de sortie
                        document.querySelectorAll('section').forEach(section => {
                            section.classList.add('fade-out');
                        });
                        
                        // Attendre la fin de l'animation de sortie
                        setTimeout(() => {
                            // Faire défiler jusqu'à la section cible
                            targetSection.scrollIntoView({
                                behavior: 'smooth',
                                block: 'start'
                            });
                            
                            // Ajouter la classe pour l'animation d'entrée
                            targetSection.classList.add('fade-in');
                            targetSection.classList.remove('fade-out');
                            
                            // Mettre à jour l'URL
                            history.pushState(null, '', link.getAttribute('href'));
                            
                            // Mettre à jour la classe active
                            navLinks.forEach(navLink => navLink.classList.remove('active'));
                            link.classList.add('active');
                        }, 300);
                    }
                }
            });
        });
    };

    // Ajouter les styles CSS nécessaires
    const addTransitionStyles = () => {
        const style = document.createElement('style');
        style.textContent = `
            section {
                opacity: 1;
                transform: translateY(0);
                transition: opacity 0.3s ease, transform 0.3s ease;
            }
            
            section.fade-out {
                opacity: 0;
                transform: translateY(20px);
            }
            
            section.fade-in {
                animation: fadeInUp 0.5s ease forwards;
            }
            
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .main-nav a {
                position: relative;
                transition: color 0.3s ease;
            }
            
            .main-nav a::after {
                content: '';
                position: absolute;
                bottom: -2px;
                left: 0;
                width: 0;
                height: 2px;
                background: var(--primary-color);
                transition: width 0.3s ease;
            }
            
            .main-nav a:hover::after,
            .main-nav a.active::after {
                width: 100%;
            }
            
            .main-nav a.active {
                color: var(--primary-color);
            }
        `;
        document.head.appendChild(style);
    };

    // Initialiser les transitions
    document.addEventListener('DOMContentLoaded', () => {
        addTransitionStyles();
        initTabTransitions();
        
        // Gérer le retour en arrière du navigateur
        window.addEventListener('popstate', () => {
            const hash = window.location.hash;
            if (hash) {
                const targetSection = document.querySelector(hash);
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
        
        // Vérifier si une section est ciblée dans l'URL au chargement
        const hash = window.location.hash;
        if (hash) {
            const targetSection = document.querySelector(hash);
            if (targetSection) {
                setTimeout(() => {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Mettre à jour la classe active
                    const activeLink = document.querySelector(`.main-nav a[href*="${hash}"]`);
                    if (activeLink) {
                        document.querySelectorAll('.main-nav a').forEach(link => link.classList.remove('active'));
                        activeLink.classList.add('active');
                    }
                }, 100);
            }
        }
    });

    // Gestionnaire d'animations optimisé
    class AnimationManager {
        constructor() {
            this.animatedElements = document.querySelectorAll('.animate');
            this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            this.throttleDelay = 50;
            this.lastScrollTime = 0;
            
            this.init();
        }

        init() {
            if (this.isReducedMotion) {
                this.disableAnimations();
                return;
            }

            this.bindEvents();
            this.checkVisibility();
        }

        bindEvents() {
            // Utilisation de requestAnimationFrame et throttling pour les performances
            window.addEventListener('scroll', () => {
                if (Date.now() - this.lastScrollTime > this.throttleDelay) {
                    window.requestAnimationFrame(() => {
                        this.checkVisibility();
                        this.lastScrollTime = Date.now();
                    });
                }
            });

            window.addEventListener('resize', this.debounce(() => {
                this.checkVisibility();
            }, 150));
        }

        checkVisibility() {
            this.animatedElements.forEach(element => {
                if (this.isElementInViewport(element) && !element.classList.contains('visible')) {
                    element.classList.add('visible');
                }
            });
        }

        isElementInViewport(element) {
            const rect = element.getBoundingClientRect();
            const windowHeight = window.innerHeight || document.documentElement.clientHeight;
            
            return (
                rect.top <= windowHeight * 0.8 &&
                rect.bottom >= 0
            );
        }

        debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }

        disableAnimations() {
            this.animatedElements.forEach(element => {
                element.classList.add('visible');
                element.style.transition = 'none';
            });
        }
    }

    // Initialisation
    const animationManager = new AnimationManager();

    // Initialisation du carrousel
    function initCarousel() {
        const slides = document.querySelectorAll('.carousel-slide');
        const dots = document.querySelectorAll('.carousel-dot');
        const prevButton = document.querySelector('.carousel-arrow.prev');
        const nextButton = document.querySelector('.carousel-arrow.next');
        let currentSlide = 0;

        function showSlide(index) {
            slides.forEach(slide => slide.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));
            
            slides[index].classList.add('active');
            dots[index].classList.add('active');
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }

        function prevSlide() {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            showSlide(currentSlide);
        }

        // Événements des boutons
        if (prevButton && nextButton) {
            prevButton.addEventListener('click', prevSlide);
            nextButton.addEventListener('click', nextSlide);
        }

        // Événements des points
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentSlide = index;
                showSlide(currentSlide);
            });
        });

        // Ajout des événements clavier
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                prevSlide();
            } else if (e.key === 'ArrowRight') {
                nextSlide();
            }
        });

        // Ajout des événements tactiles (swipe)
        let touchStartX = 0;
        let touchEndX = 0;
        
        const carousel = document.querySelector('.hero-carousel');
        
        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        }, false);
        
        carousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].clientX;
            handleSwipe();
        }, false);
        
        function handleSwipe() {
            const swipeThreshold = 50;
            const swipeDistance = touchEndX - touchStartX;
            
            if (Math.abs(swipeDistance) > swipeThreshold) {
                if (swipeDistance > 0) {
                    prevSlide();
                } else {
                    nextSlide();
                }
            }
        }
    }

    // Initialiser le carrousel
    initCarousel();

    // Optimisation du scroll header
    function initHeaderScroll() {
        let lastScrollY = window.pageYOffset;
        let ticking = false;
        const header = document.querySelector('.main-header');
        const threshold = 5;

        function updateHeader() {
            const currentScrollY = window.pageYOffset;
            
            if (Math.abs(currentScrollY - lastScrollY) > threshold) {
                if (currentScrollY > lastScrollY) {
                    header.style.transform = 'translateY(-100%)';
                } else {
                    header.style.transform = 'translateY(0)';
                }
                lastScrollY = currentScrollY;
            }
            
            ticking = false;
        }

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(updateHeader);
                ticking = true;
            }
        }, { passive: true });
    }

    // Amélioration du menu mobile
    function initMobileMenu() {
        const menuToggle = document.querySelector('.mobile-menu-toggle');
        const mainNav = document.querySelector('.main-nav');
        const overlay = document.querySelector('.overlay');
        
        function toggleMenu(e) {
            if (e) e.preventDefault();
            
            const isOpen = mainNav.classList.contains('active');
            
            mainNav.classList.toggle('active');
            overlay.classList.toggle('active');
            document.body.classList.toggle('menu-open');
            
            // Empêcher le scroll sur iOS quand le menu est ouvert
            if (!isOpen) {
                document.body.style.top = `-${window.scrollY}px`;
            } else {
                const scrollY = document.body.style.top;
                document.body.style.top = '';
                window.scrollTo(0, parseInt(scrollY || '0') * -1);
            }
        }
        
        menuToggle.addEventListener('click', toggleMenu);
        overlay.addEventListener('click', toggleMenu);
        
        // Fermer le menu lors du clic sur un lien
        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', toggleMenu);
        });
    }

    // Initialisation
    document.addEventListener('DOMContentLoaded', () => {
        initHeaderScroll();
        initMobileMenu();
    });

    // Fonction pour créer une lightbox pour les images
    function initImageLightbox() {
        // Créer l'élément lightbox
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-close">&times;</div>
            <div class="lightbox-content">
                <img src="" alt="Image agrandie">
                <div class="lightbox-caption"></div>
            </div>
        `;
        document.body.appendChild(lightbox);
        
        // Récupérer les éléments
        const lightboxImg = lightbox.querySelector('img');
        const lightboxCaption = lightbox.querySelector('.lightbox-caption');
        const lightboxClose = lightbox.querySelector('.lightbox-close');
        
        // Ajouter les écouteurs d'événements pour les liens d'images
        document.querySelectorAll('.image-popup').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const imgSrc = this.getAttribute('href');
                const imgTitle = this.getAttribute('title');
                
                lightboxImg.src = imgSrc;
                lightboxImg.alt = imgTitle || 'Image agrandie';
                
                // Afficher le titre dans la lightbox
                if (imgTitle) {
                    lightboxCaption.textContent = imgTitle;
                    lightboxCaption.style.display = 'block';
                } else {
                    lightboxCaption.style.display = 'none';
                }
                
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden'; // Empêcher le défilement
            });
        });
        
        // Fermer la lightbox
        lightboxClose.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
        
        function closeLightbox() {
            lightbox.classList.remove('active');
            document.body.style.overflow = ''; // Réactiver le défilement
            setTimeout(() => {
                lightboxImg.src = '';
            }, 300);
        }
        
        // Fermer avec la touche Echap
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                closeLightbox();
            }
        });
    }

    // Initialiser la lightbox après le chargement du DOM
    document.addEventListener('DOMContentLoaded', function() {
        initImageLightbox();
    });

    // Gestion du menu flottant
    document.addEventListener('DOMContentLoaded', function() {
        // Créer le bouton toggle
        const toggleButton = document.createElement('div');
        toggleButton.className = 'floating-menu-toggle';
        toggleButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
        document.body.appendChild(toggleButton);

        const floatingNav = document.querySelector('.floating-nav');

        // Toggle du menu
        toggleButton.addEventListener('click', function() {
            floatingNav.classList.toggle('active');
            toggleButton.classList.toggle('active');
        });

        // Fermer le menu au clic sur un lien
        floatingNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                floatingNav.classList.remove('active');
                toggleButton.classList.remove('active');
            });
        });
    });

    // Fonction debounce utilitaire
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Ajouter la gestion du clic sur le CTA
    document.addEventListener('DOMContentLoaded', function() {
        const heroCta = document.querySelector('.hero-cta');
        
        if (heroCta) {
            heroCta.addEventListener('click', function(e) {
                e.preventDefault();
                const servicesSection = document.querySelector('#services');
                if (servicesSection) {
                    servicesSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        }
    });

    // Fix pour iOS : forcer le rafraîchissement du rendu
    window.addEventListener('scroll', function() {
        document.body.style.webkitTransform = 'translateZ(0)';
    });

    function scrollToContact() {
        const contactSection = document.querySelector('.contact-section');
        contactSection.scrollIntoView({ behavior: 'smooth' });
    }
}); 