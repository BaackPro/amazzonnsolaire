
// Menu mobile et navigation - Version améliorée
document.addEventListener('DOMContentLoaded', function() {
    // Éléments du DOM
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const header = document.querySelector('.header');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const body = document.body;

    // Gestion du menu mobile améliorée
    if (menuToggle && mainNav) {
        const toggleMenu = function() {
            const isActive = menuToggle.classList.toggle('active');
            mainNav.classList.toggle('active');
            body.style.overflow = isActive ? 'hidden' : '';
            menuToggle.setAttribute('aria-expanded', isActive);
            
            // Animation des lignes du burger menu
            const spans = menuToggle.querySelectorAll('span');
            if (isActive) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                spans[0].style.transform = '';
                spans[1].style.opacity = '';
                spans[2].style.transform = '';
            }
        };

        menuToggle.addEventListener('click', toggleMenu);

        // Fermer le menu quand on clique sur un lien
        const navLinks = document.querySelectorAll('.main-nav a');
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                // Vérifier si c'est un lien anchor de la même page
                const href = this.getAttribute('href');
                if (href.startsWith('#')) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth' });
                    }
                }
                
                // Fermer le menu mobile après un court délai pour l'animation
                setTimeout(() => {
                    menuToggle.classList.remove('active');
                    mainNav.classList.remove('active');
                    body.style.overflow = '';
                    menuToggle.setAttribute('aria-expanded', 'false');
                    
                    // Réinitialiser l'animation du burger menu
                    const spans = menuToggle.querySelectorAll('span');
                    spans[0].style.transform = '';
                    spans[1].style.opacity = '';
                    spans[2].style.transform = '';
                }, 300);
            });

            // Mettre en surbrillance la page active avec vérification précise
            const linkHref = link.getAttribute('href');
            if (linkHref === currentPage || 
                (currentPage === '' && linkHref === 'index.html') ||
                (linkHref === 'index.html' && currentPage === '')) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            }
        });
    }

    // Animation du header au scroll avec effet de fondu
    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', function() {
        if (header) {
            const scrollY = window.scrollY;
            
            // Effet de réduction du header
            header.classList.toggle('scrolled', scrollY > 50);
            
            // Cacher le header lors du défilement vers le bas
            if (scrollY > lastScrollY && scrollY > 100) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
            
            lastScrollY = scrollY;
        }
    });

    // Ajouter la classe scrolled si on recharge la page en milieu de page
    if (window.scrollY > 50 && header) {
        header.classList.add('scrolled');
    }

    // Initialiser les animations des cartes avec options avancées
    initCardAnimations();
    
    // Gestion du formulaire de contact avec validation améliorée
    initContactForm();
    
    // Gestion des onglets/catégories de produits
    initProductTabs();
    
    // Gestion du compteur de produits dans le panier
    initCartCounter();
    
    // Animation au scroll pour tous les éléments avec la classe .animate-on-scroll
    initScrollAnimations();
    
    // Gestion du lazy loading des images
    initLazyLoading();
    
    // Gestion des modales
    initModals();
});

// Animation des cartes au scroll avec Intersection Observer amélioré
function initCardAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                // Observer une seule fois
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observer les cartes mais aussi d'autres éléments
    const elementsToAnimate = document.querySelectorAll('.card, .service, .gallery-item, .spec-card');
    elementsToAnimate.forEach(element => {
        observer.observe(element);
    });
}

// Gestion du formulaire de contact avec validation avancée
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        // Ajouter des validateurs en temps réel
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                if (this.classList.contains('invalid')) {
                    validateField(this);
                }
            });
        });

        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Valider tous les champs avant soumission
            let isValid = true;
            inputs.forEach(input => {
                if (!validateField(input)) {
                    isValid = false;
                }
            });
            
            if (!isValid) {
                // Animer le premier champ invalide
                const firstInvalid = contactForm.querySelector('.invalid');
                if (firstInvalid) {
                    firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    firstInvalid.focus();
                }
                return;
            }
            
            // Afficher l'indicateur de chargement
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Envoi en cours...';
            submitBtn.disabled = true;
            
            try {
                // Simulation d'envoi du formulaire (remplacer par un vrai appel API)
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                console.log('Formulaire soumis:', {
                    nom: this.nom.value,
                    email: this.email.value,
                    telephone: this.telephone?.value,
                    service: this.service?.value,
                    message: this.message.value
                });
                
                // Afficher le message de succès
                showNotification('Merci pour votre message! Nous vous contacterons bientôt.', 'success');
                
                // Réinitialiser le formulaire
                this.reset();
            } catch (error) {
                console.error('Erreur lors de l\'envoi:', error);
                showNotification('Une erreur s\'est produite. Veuillez réessayer.', 'error');
            } finally {
                // Restaurer le bouton
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }
}

// Validation de champ individuel
function validateField(field) {
    let isValid = true;
    let errorMessage = '';
    
    // Réinitialiser les états précédents
    field.classList.remove('invalid', 'valid');
    
    // Supprimer le message d'erreur existant
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Validation selon le type de champ
    if (field.hasAttribute('required') && !field.value.trim()) {
        isValid = false;
        errorMessage = 'Ce champ est obligatoire';
    } else if (field.type === 'email' && field.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value)) {
            isValid = false;
            errorMessage = 'Veuillez entrer une adresse email valide';
        }
    } else if (field.type === 'tel' && field.value) {
        const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/;
        if (!phoneRegex.test(field.value)) {
            isValid = false;
            errorMessage = 'Veuillez entrer un numéro de téléphone valide';
        }
    }
    
    // Appliquer les classes et messages
    if (!isValid && field.value) {
        field.classList.add('invalid');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = errorMessage;
        errorDiv.style.color = '#e74c3c';
        errorDiv.style.fontSize = '0.8rem';
        errorDiv.style.marginTop = '0.3rem';
        field.parentNode.appendChild(errorDiv);
    } else if (field.value) {
        field.classList.add('valid');
    }
    
    return isValid;
}

// Gestion des onglets de produits
function initProductTabs() {
    const tabButtons = document.querySelectorAll('.category-btn');
    const productCards = document.querySelectorAll('.product-card');
    
    if (tabButtons.length && productCards.length) {
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Retirer la classe active de tous les boutons
                tabButtons.forEach(btn => btn.classList.remove('active'));
                
                // Ajouter la classe active au bouton cliqué
                this.classList.add('active');
                
                // Filtrer les produits
                const category = this.dataset.category;
                
                productCards.forEach(card => {
                    if (category === 'all' || card.dataset.category === category) {
                        card.style.display = 'block';
                        // Animation d'apparition
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 50);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }
}

// Compteur de produits dans le panier
function initCartCounter() {
    const cartButtons = document.querySelectorAll('.add-to-cart');
    const cartCounter = document.createElement('span');
    cartCounter.className = 'cart-counter';
    cartCounter.style.cssText = `
        position: absolute;
        top: -8px;
        right: -8px;
        background: #e74c3c;
        color: white;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.7rem;
        font-weight: bold;
    `;
    
    let count = parseInt(localStorage.getItem('cartCount') || '0');
    
    // Mettre à jour le compteur
    function updateCounter() {
        cartCounter.textContent = count;
        localStorage.setItem('cartCount', count);
    }
    
    // Ajouter le compteur au premier bouton panier trouvé
    if (cartButtons.length) {
        const firstCartButton = cartButtons[0].closest('.product-price') || cartButtons[0].parentNode;
        firstCartButton.style.position = 'relative';
        firstCartButton.appendChild(cartCounter);
        updateCounter();
    }
    
    // Gérer les clics sur les boutons d'ajout au panier
    cartButtons.forEach(button => {
        button.addEventListener('click', function() {
            count++;
            updateCounter();
            
            // Animation de confirmation
            const originalHtml = this.innerHTML;
            this.innerHTML = '<i class="fas fa-check"></i> Ajouté';
            this.style.backgroundColor = '#27ae60';
            
            setTimeout(() => {
                this.innerHTML = originalHtml;
                this.style.backgroundColor = '';
            }, 1500);
            
            // Ajouter l'article au panier (logique simplifiée)
            const productId = this.dataset.id;
            const productName = this.dataset.name;
            const productPrice = this.dataset.price;
            
            // Ici, vous ajouteriez normalement le produit au panier dans le localStorage
            console.log('Produit ajouté:', { productId, productName, productPrice });
        });
    });
}

// Animation au scroll pour tous les éléments
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
}

// Lazy loading des images
function initLazyLoading() {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => {
            // Stocker la source originale dans data-src si ce n'est pas déjà fait
            if (!img.dataset.src && img.src) {
                img.dataset.src = img.src;
                // Optionnel: utiliser une image de placeholder
                img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E';
            }
            imageObserver.observe(img);
        });
    }
}

// Gestion des modales
function initModals() {
    const modals = document.querySelectorAll('.modal');
    
    modals.forEach(modal => {
        const closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => closeModal(modal));
        }
    });
    
    // Fermer la modale en cliquant à l'extérieur
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target);
        }
    });
    
    // Fermer avec la touche Échap
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.modal.open');
            if (openModal) closeModal(openModal);
        }
    });
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
}

// Afficher une notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        z-index: 10000;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    // Couleurs selon le type
    const colors = {
        success: '#27ae60',
        error: '#e74c3c',
        info: '#3498db',
        warning: '#f39c12'
    };
    
    notification.style.backgroundColor = colors[type] || colors.info;
    
    document.body.appendChild(notification);
    
    // Animation d'entrée
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Supprimer après 5 secondes
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Gestion des réseaux sociaux dans le footer
document.addEventListener('DOMContentLoaded', function() {
    const socialLinks = [
        { 
            name: 'Facebook', 
            url: 'https://facebook.com/AmazzonnSolaire', 
            icon: 'fa-facebook-f' 
        },
        { 
            name: 'Twitter', 
            url: 'https://twitter.com/AmazzonnSolaire', 
            icon: 'fa-twitter' 
        },
        { 
            name: 'Instagram', 
            url: 'https://instagram.com/AmazzonnSolaire', 
            icon: 'fa-instagram' 
        },
        { 
            name: 'LinkedIn', 
            url: 'https://linkedin.com/company/AmazzonnSolaire', 
            icon: 'fa-linkedin-in' 
        },
        { 
            name: 'WhatsApp', 
            url: 'https://wa.me/22992810213', 
            icon: 'fa-whatsapp' 
        }
    ];

    const socialContainer = document.querySelector('.social-links');
    
    if (socialContainer) {
        // Vider le conteneur existant (au cas où il y aurait du contenu statique)
        socialContainer.innerHTML = '';
        
        socialLinks.forEach(link => {
            const a = document.createElement('a');
            a.href = link.url;
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
            a.setAttribute('aria-label', link.name);
            a.innerHTML = `<i class="fab ${link.icon}"></i>`;
            socialContainer.appendChild(a);
        });
    }
});

// Fonction utilitaire pour le formatage des prix
function formatPrice(price, currency = 'FCFA') {
    return new Intl.NumberFormat('fr-FR').format(price) + ' ' + currency;
}

// Export des fonctions pour une utilisation globale (si nécessaire)
window.App = {
    openModal,
    closeModal,
    showNotification,
    formatPrice
};