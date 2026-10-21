/* ============================================
   HUNGRIEE — Premium Food Delivery JS
   ============================================ */

// ==================== DISH DATA ====================
const dishes = [
    {
        id: 1, name: "Hyderabadi Chicken Biryani", category: "biryani", type: "non-veg",
        price: 249, rating: 4.9, reviews: "2.3k",
        desc: "Fragrant long-grain basmati layered with tender chicken, saffron milk, caramelized onions & royal spices",
        image: "images/hyderabadi_biryani.jpg",
        calories: "550 kcal", prepTime: "25 min", spice: "Medium 🌶️🌶️", ingredients: "Basmati Rice, Chicken, Saffron, Ghee, Mint, Star Anise"
    },
    {
        id: 2, name: "Classic Butter Chicken", category: "curry", type: "non-veg",
        price: 299, rating: 4.8, reviews: "3.1k",
        desc: "Tender tandoori chicken cooked in a velvet tomato, cashew nut & fresh dairy butter gravy",
        image: "images/butter_chicken.jpg",
        calories: "480 kcal", prepTime: "20 min", spice: "Mild 🌶️", ingredients: "Chicken, Butter, Cream, Fresh Tomato Puree, Kasuri Methi"
    },
    {
        id: 3, name: "Smoky Paneer Tikka", category: "tandoori", type: "veg",
        price: 199, rating: 4.7, reviews: "1.8k",
        desc: "Thick marinated malai paneer cubes, bell peppers & onions roasted in clay tandoor",
        image: "images/paneer_tikka.jpg",
        calories: "320 kcal", prepTime: "18 min", spice: "Medium 🌶️🌶️", ingredients: "Cottage Cheese, Hung Curd, Mustard Oil, Ajwain, Bell Peppers"
    },
    {
        id: 4, name: "Mumbai Butter Pav Bhaji", category: "street", type: "veg",
        price: 129, rating: 4.6, reviews: "2.5k",
        desc: "Chowpatty style spiced mashed vegetables garnished with coriander, lemon and hot buttered pav",
        image: "images/pav_bhaji.jpg",
        calories: "390 kcal", prepTime: "15 min", spice: "Spicy 🌶️🌶️🌶️", ingredients: "Potatoes, Green Peas, Tomatoes, Special Bhaji Masala, Butter"
    },
    {
        id: 5, name: "Hot Shahi Gulab Jamun", category: "dessert", type: "veg",
        price: 99, rating: 4.9, reviews: "1.5k",
        desc: "Melt-in-mouth golden khoya dumplings simmered in warm rose-infused cardamom syrup",
        image: "images/gulab_jamun.jpg",
        calories: "280 kcal", prepTime: "10 min", spice: "Sweet 🍯", ingredients: "Mawa / Khoya, Rose Syrup, Cardamom, Pistachios, Saffron"
    },
    {
        id: 6, name: "Tandoori Chicken Full", category: "tandoori", type: "non-veg",
        price: 349, rating: 4.8, reviews: "2.0k",
        desc: "Whole chicken marinated 24h in Kashmiri red chili, yogurt and spices, chargrilled to perfection",
        image: "images/tandoori_chicken.jpg",
        calories: "520 kcal", prepTime: "25 min", spice: "Spicy 🌶️🌶️🌶️", ingredients: "Whole Chicken, Kashmiri Chili, Ginger-Garlic, Yogurt, Lemon"
    },
    {
        id: 7, name: "Lucknowi Dum Veg Biryani", category: "biryani", type: "veg",
        price: 199, rating: 4.5, reviews: "1.2k",
        desc: "Subz biryani cooked with royal saffron, paneer chunks, garden vegetables and aromatic herbs",
        image: "images/veg_biryani.jpg",
        calories: "420 kcal", prepTime: "20 min", spice: "Medium 🌶️🌶️", ingredients: "Basmati Rice, Paneer, Carrots, Beans, Saffron, Fried Onions"
    },
    {
        id: 8, name: "Delhi Amritsari Chole Bhature", category: "street", type: "veg",
        price: 149, rating: 4.7, reviews: "3.4k",
        desc: "Spicy dark kabuli chole slow cooked with tea decoction & spices, served with two balloon bhaturas",
        image: "images/chole_bhature.jpg",
        calories: "580 kcal", prepTime: "15 min", spice: "Spicy 🌶️🌶️🌶️", ingredients: "Chickpeas, Anardana, Spices, Flour Bhature, Pickled Onions"
    },
    {
        id: 9, name: "Dal Makhani Handi", category: "curry", type: "veg",
        price: 179, rating: 4.6, reviews: "1.9k",
        desc: "Overnight slow-simmered black urad lentils infused with smoked charcoal and white butter",
        image: "images/dal_makhani.jpg",
        calories: "380 kcal", prepTime: "15 min", spice: "Mild 🌶️", ingredients: "Black Lentils, Butter, Fresh Cream, Tomato Puree, Fenugreek"
    },
    {
        id: 10, name: "Kesar Pista Rasmalai", category: "dessert", type: "veg",
        price: 119, rating: 4.9, reviews: "2.1k",
        desc: "Delicate spongy chenna discs soaked in chilled saffron and pistachio condensed milk",
        image: "images/rasmalai.jpg",
        calories: "260 kcal", prepTime: "10 min", spice: "Sweet 🍯", ingredients: "Chenna, Condensed Milk, Saffron, Pistachio, Cardamom"
    },
    {
        id: 11, name: "Kashmiri Mutton Rogan Josh", category: "curry", type: "non-veg",
        price: 399, rating: 4.8, reviews: "1.7k",
        desc: "Authentic Kashmiri tender lamb cooked in aromatic gravy flavored with alkanet root & fennel",
        image: "images/rogan_josh.jpg",
        calories: "560 kcal", prepTime: "30 min", spice: "Spicy 🌶️🌶️🌶️", ingredients: "Tender Mutton, Ratan Jot, Fennel, Asafoetida, Mustard Oil"
    },
    {
        id: 12, name: "Crispy Samosa Platter (4 pcs)", category: "street", type: "veg",
        price: 89, rating: 4.5, reviews: "4.2k",
        desc: "Golden crust pastries stuffed with spiced potatoes and cashews, with mint & saunth chutneys",
        image: "images/samosa.jpg",
        calories: "310 kcal", prepTime: "10 min", spice: "Medium 🌶️🌶️", ingredients: "Potatoes, Green Peas, Cumin, Coriander Seeds, Tamarind"
    },
    {
        id: 13, name: "Alphonso Mango Lassi", category: "drinks", type: "veg",
        price: 89, rating: 4.9, reviews: "3.8k",
        desc: "Thick creamy churned yogurt blended with authentic Ratnagiri Alphonso mango pulp and cardamom",
        image: "images/mango_lassi.png",
        calories: "210 kcal", prepTime: "5 min", spice: "Sweet 🥭", ingredients: "Yogurt, Mango Pulp, Cardamom, Crushed Pistachios"
    },
    {
        id: 14, name: "Kulhad Masala Chai", category: "drinks", type: "veg",
        price: 59, rating: 4.8, reviews: "5.1k",
        desc: "Earthen clay cup brewed strong Assam tea with crushed fresh ginger, cardamom and cinnamon",
        image: "images/masala_chai.jpg",
        calories: "120 kcal", prepTime: "5 min", spice: "Aromatic ☕", ingredients: "Assam Tea Leaves, Full Cream Milk, Fresh Ginger, Cardamom"
    },
    {
        id: 15, name: "Garlic Butter Naan Basket", category: "tandoori", type: "veg",
        price: 99, rating: 4.7, reviews: "2.9k",
        desc: "Trio of charred garlic butter naan, laccha paratha and butter kulcha straight from tandoor",
        image: "images/garlic_naan.jpg",
        calories: "340 kcal", prepTime: "10 min", spice: "Mild 🧄", ingredients: "Flour, Butter, Minced Garlic, Nigella Seeds, Coriander"
    },
    {
        id: 16, name: "Pani Puri Royal Fiesta (8 pcs)", category: "street", type: "veg",
        price: 79, rating: 4.9, reviews: "6.4k",
        desc: "Crispy puris with spicy mint jaljeera, sweet sonth chutney, boondi and spiced ragda filling",
        image: "images/pani_puri.jpg",
        calories: "180 kcal", prepTime: "5 min", spice: "Tangy & Spicy 🌶️", ingredients: "Semolina Puris, Mint Water, Tamarind Water, Spiced Potatoes"
    },
    {
        id: 17, name: "Royal Kulfi Falooda", category: "dessert", type: "veg",
        price: 139, rating: 4.8, reviews: "1.9k",
        desc: "Dense rabri kulfi slice topped with handmade cornstarch falooda sev, rose syrup and sabja seeds",
        image: "images/kulfi_falooda.png",
        calories: "350 kcal", prepTime: "8 min", spice: "Sweet 🍧", ingredients: "Full Cream Milk, Pistachios, Rose Syrup, Falooda Sev, Sabja"
    },
    {
        id: 18, name: "Awadhi Mutton Dum Biryani", category: "biryani", type: "non-veg",
        price: 379, rating: 4.9, reviews: "2.6k",
        desc: "Royal Lucknow recipe: succulent mutton marinated in 32 spices, slow sealed-pot cooked with kewra essence",
        image: "images/mutton_biryani.jpg",
        calories: "620 kcal", prepTime: "30 min", spice: "Rich & Mild 👑", ingredients: "Mutton, Aged Basmati Rice, Kewra, Ghee, Shahi Jeera, Mace"
    }
];

// Special combo
const familyPackDish = {
    id: 100,
    name: "Royal Family Feast (Feeds 4)",
    category: "biryani",
    type: "non-veg",
    price: 499,
    rating: 4.9,
    reviews: "4.5k",
    desc: "1 Hyderabadi Biryani + 1 Butter Chicken + 4 Butter Naans + 4 Gulab Jamuns + 2 Mango Lassis",
    image: "images/family_feast.jpg",
    calories: "1800 kcal",
    prepTime: "35 min",
    spice: "Feast Combo ⭐",
    ingredients: "Biryani, Butter Chicken, Naan, Desserts, Mango Lassi"
};

// ==================== CART STATE & COUPONS ====================
let cart = (JSON.parse(localStorage.getItem('hungrieeCart')) || []).map(item => ({
    ...item,
    cartItemId: String(item.cartItemId || item.id),
    image: (Number(item.id) === 100 ? familyPackDish : dishes.find(dish => dish.id === Number(item.id)))?.image || item.image,
    qty: Math.max(1, Number(item.qty) || 1)
}));
let activeCoupon = null; // { code: 'HUNGRIEE50', type: 'percent', val: 50, max: 150 }
let pureVegOnly = false;

// ==================== DOM ELEMENTS ====================
const elements = {
    preloader: document.getElementById('preloader'),
    navbar: document.getElementById('navbar'),
    navLinks: document.getElementById('navLinks'),
    mobileMenuBtn: document.getElementById('mobileMenuBtn'),
    locationBtn: document.getElementById('locationBtn'),
    locationSummary: document.getElementById('locationSummary'),
    cartBtn: document.getElementById('cartBtn'),
    cartCount: document.getElementById('cartCount'),
    cartOverlay: document.getElementById('cartOverlay'),
    cartSidebar: document.getElementById('cartSidebar'),
    cartClose: document.getElementById('cartClose'),
    cartBody: document.getElementById('cartBody'),
    cartItems: document.getElementById('cartItems'),
    cartEmpty: document.getElementById('cartEmpty'),
    cartFooter: document.getElementById('cartFooter'),
    cartHeaderCount: document.getElementById('cartHeaderCount'),
    cartSubtotal: document.getElementById('cartSubtotal'),
    cartDelivery: document.getElementById('cartDelivery'),
    cartTotal: document.getElementById('cartTotal'),
    checkoutBtn: document.getElementById('checkoutBtn'),
    dishesGrid: document.getElementById('dishesGrid'),
    backToTop: document.getElementById('backToTop'),
    testiPrev: document.getElementById('testiPrev'),
    testiNext: document.getElementById('testiNext'),
    testiDots: document.getElementById('testiDots'),
    testimonialsTrack: document.getElementById('testimonialsTrack'),
    heroSearch: document.getElementById('heroSearch'),
    menuSearchInput: document.getElementById('menuSearchInput'),
    menuSort: document.getElementById('menuSort')
};

// ==================== PRELOADER ====================
window.addEventListener('load', () => {
    setTimeout(() => {
        if (elements.preloader) {
            elements.preloader.classList.add('hidden');
        }
        document.body.style.overflow = 'auto';
        animateHeroElements();
    }, 700);
});

// ==================== NAVBAR ====================
function initNavbar() {
    if (!elements.navbar) return;

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        if (currentScroll > 40) {
            elements.navbar.classList.add('scrolled');
        } else {
            elements.navbar.classList.remove('scrolled');
        }

        if (elements.backToTop) {
            if (currentScroll > 400) {
                elements.backToTop.classList.add('visible');
            } else {
                elements.backToTop.classList.remove('visible');
            }
        }
    });

    if (elements.mobileMenuBtn && elements.navLinks) {
        elements.mobileMenuBtn.addEventListener('click', () => {
            elements.mobileMenuBtn.classList.toggle('active');
            elements.navLinks.classList.toggle('active');
            document.body.style.overflow = elements.navLinks.classList.contains('active') ? 'hidden' : 'auto';
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                elements.mobileMenuBtn.classList.remove('active');
                elements.navLinks.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        });
    }

    if (elements.backToTop) {
        elements.backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

// ==================== SCROLL ANIMATIONS ====================
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-delay') || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px'
    });

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
}

// ==================== HERO ANIMATIONS ====================
function animateHeroElements() {
    const heroElements = document.querySelectorAll('.hero .animate-on-scroll, .page-hero .animate-on-scroll');
    heroElements.forEach((el, i) => {
        setTimeout(() => {
            el.classList.add('visible');
        }, i * 140);
    });

    animateCounters('.hero-stats .stat-number');
}

// ==================== COUNTER ANIMATION ====================
function animateCounters(selector) {
    document.querySelectorAll(selector).forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        if (isNaN(target)) return;

        const duration = 1800;
        const start = performance.now();

        function updateCounter(currentTime) {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(target * eased);

            if (target >= 10000) {
                counter.textContent = (current / 1000).toFixed(current < target ? 1 : 0) + 'k';
            } else {
                counter.textContent = current.toLocaleString();
            }

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        }
        requestAnimationFrame(updateCounter);
    });
}

function initStatCounters() {
    const statsBanner = document.getElementById('statsBanner');
    if (!statsBanner) return;
    let animated = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animated = true;
                animateCounters('.stats-grid .counter');
            }
        });
    }, { threshold: 0.25 });

    observer.observe(statsBanner);
}

// ==================== DISH RENDERING & FILTERING ====================
function renderDishes(filter = 'all', searchQuery = '', sortBy = 'popular') {
    const grid = elements.dishesGrid;
    if (!grid) return;

    let list = [...dishes];

    // Filter by category
    if (filter !== 'all') {
        list = list.filter(d => d.category === filter);
    }

    // Pure Veg filter
    if (pureVegOnly) {
        list = list.filter(d => d.type === 'veg');
    }

    // Search query
    if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        list = list.filter(d =>
            d.name.toLowerCase().includes(q) ||
            d.desc.toLowerCase().includes(q) ||
            d.category.toLowerCase().includes(q)
        );
    }

    // Sorting
    switch (sortBy) {
        case 'price-low':
            list.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            list.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            list.sort((a, b) => b.rating - a.rating);
            break;
        default:
            // popular default order
            break;
    }

    grid.innerHTML = '';

    if (list.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: var(--text-muted);">
                <p style="font-size: 3.5rem; margin-bottom: 16px;">🍛</p>
                <h3 style="color: var(--text-primary); margin-bottom: 8px;">No dishes found</h3>
                <p>Try searching for biryani, butter chicken, paneer, or switch off Pure Veg filter.</p>
                <button class="btn-primary" style="margin-top: 18px;" onclick="resetDishFilters()">Reset Filters</button>
            </div>
        `;
        return;
    }

    list.forEach((dish, i) => {
        const card = document.createElement('div');
        card.className = 'dish-card';
        card.style.animationDelay = `${Math.min(i, 11) * 0.06}s`;
        card.style.cursor = 'pointer';

        card.innerHTML = `
            <div class="dish-image-wrapper">
                <img src="${dish.image}" alt="${dish.name}" loading="lazy" onerror="this.onerror=null;this.src='images/family_feast.jpg'">
                <span class="dish-badge ${dish.type}">${dish.type === 'veg' ? 'VEG' : 'NON-VEG'}</span>
                <span class="dish-rating"><span class="dish-rating-star" aria-hidden="true">★</span> ${dish.rating}</span>
            </div>
            <div class="dish-info">
                <h3 class="dish-name">${dish.name}</h3>
                <p class="dish-desc">${dish.desc}</p>
                <div class="dish-meta">
                    <span class="dish-prep-time"><span aria-hidden="true">◷</span> ${dish.prepTime}</span>
                    <span class="dish-reviews"><span class="dish-reviews-star" aria-hidden="true">★</span> ${dish.reviews} reviews</span>
                </div>
                <div class="dish-bottom">
                    <span class="dish-price">₹${dish.price}</span>
                    <div class="dish-card-action" data-dish-id="${dish.id}">
                        <button class="dish-add-btn" data-id="${dish.id}">
                            <span aria-hidden="true">+</span><span>Add</span>
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Click card to open Quick View Modal
        card.addEventListener('click', (e) => {
            const action = e.target.closest('.dish-add-btn, .dish-card-qty-btn');
            if (action) {
                e.preventDefault();
                e.stopPropagation();
                if (action.classList.contains('dish-card-qty-btn')) {
                    updateQty(dish.id, Number(action.dataset.delta));
                } else {
                    addToCart(dish.id);
                }
            } else {
                openQuickView(dish.id);
            }
        });

        grid.appendChild(card);
    });
}

function resetDishFilters() {
    pureVegOnly = false;
    const vegSwitch = document.getElementById('vegFilterSwitch');
    if (vegSwitch) vegSwitch.classList.remove('active');

    if (elements.menuSearchInput) elements.menuSearchInput.value = '';
    if (elements.menuSort) {
        elements.menuSort.value = 'popular';
        syncSortMenu();
    }

    document.querySelectorAll('.filter-btn').forEach(b => {
        b.classList.toggle('active', b.getAttribute('data-filter') === 'all');
    });

    renderDishes('all');
}

function syncSortMenu() {
    const select = elements.menuSort;
    const trigger = document.querySelector('.menu-sort-trigger');
    const options = document.querySelectorAll('.menu-sort-options [data-value]');
    if (!select || !trigger) return;

    const selected = select.options[select.selectedIndex];
    const value = selected?.value || 'popular';
    const label = selected?.textContent || 'Most Popular';
    const valueElement = trigger.querySelector('.menu-sort-value');
    if (valueElement) valueElement.textContent = label;
    options.forEach(option => {
        option.setAttribute('aria-selected', String(option.dataset.value === value));
    });
}

function initSortMenu() {
    const select = elements.menuSort;
    const trigger = document.querySelector('.menu-sort-trigger');
    const menu = document.querySelector('.menu-sort-options');
    const sortContainer = document.querySelector('.menu-sort');
const controls = sortContainer?.closest('.menu-secondary-controls')
    || sortContainer?.parentElement;
    if (!select || !trigger || !menu) return;

    const closeMenu = () => {
    trigger.setAttribute('aria-expanded', 'false');
    menu.classList.remove('is-open');
    sortContainer?.classList.remove('is-open');
    controls?.classList.remove('sort-menu-open');
    document.body.classList.remove('sort-dropdown-open');
};

    trigger.addEventListener('click', () => {
    const isOpen = trigger.getAttribute('aria-expanded') === 'true';

    trigger.setAttribute('aria-expanded', String(!isOpen));
    menu.classList.toggle('is-open', !isOpen);
    sortContainer?.classList.toggle('is-open', !isOpen);
    controls?.classList.toggle('sort-menu-open', !isOpen);
    document.body.classList.toggle('sort-dropdown-open', !isOpen);
});

    menu.querySelectorAll('[data-value]').forEach(option => {
        option.addEventListener('click', () => {
            select.value = option.dataset.value;
            syncSortMenu();
            closeMenu();
            select.dispatchEvent(new Event('change', { bubbles: true }));
        });
    });

    document.addEventListener('click', event => {
        if (!event.target.closest('.menu-sort')) closeMenu();
    });

    select.addEventListener('change', syncSortMenu);
    syncSortMenu();
}

function initDishFilters() {
    initSortMenu();
    // Category pill buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const category = btn.getAttribute('data-filter');
            const searchVal = (elements.menuSearchInput?.value || '').trim();
            const sortVal = elements.menuSort?.value || 'popular';
            renderDishes(category, searchVal, sortVal);
        });
    });

    // Menu search input
    if (elements.menuSearchInput) {
        initMenuSearchTypewriter();
        elements.menuSearchInput.addEventListener('input', () => {
            const activeFilter = document.querySelector('.filter-btn.active')?.getAttribute('data-filter') || 'all';
            const sortVal = elements.menuSort?.value || 'popular';
            renderDishes(activeFilter, elements.menuSearchInput.value, sortVal);
        });
    }

    // Menu sort dropdown
    if (elements.menuSort) {
        elements.menuSort.addEventListener('change', () => {
            const activeFilter = document.querySelector('.filter-btn.active')?.getAttribute('data-filter') || 'all';
            const searchVal = (elements.menuSearchInput?.value || '').trim();
            renderDishes(activeFilter, searchVal, elements.menuSort.value);
        });
    }

    // Check URL parameters (e.g. /menu?filter=biryani or ?search=paneer)
    const urlParams = new URLSearchParams(window.location.search);
    const filterParam = urlParams.get('filter');
    const searchParam = urlParams.get('search');

    if (filterParam) {
        const targetBtn = document.querySelector(`.filter-btn[data-filter="${filterParam}"]`);
        if (targetBtn) {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            targetBtn.classList.add('active');
        }
    }

    if (searchParam && elements.menuSearchInput) {
        elements.menuSearchInput.value = searchParam;
    }

    // Pure veg switch if present in container
    initVegSwitch();
}

function initMenuSearchTypewriter() {
    const searchInput = elements.menuSearchInput;
    if (!searchInput) return;

    const prompts = [
        'Search biryani, butter chicken, dosa...',
        'Try “Hyderabadi biryani”...',
        'Find your next favorite dish...'
    ];
    const defaultPrompt = prompts[0];
    let promptIndex = 0;
    let promptPosition = 0;
    let promptTimer = null;
    let paused = false;

    const stop = () => {
        if (promptTimer) {
            clearTimeout(promptTimer);
            promptTimer = null;
        }
    };

    const type = () => {
        if (paused || searchInput.value) return;

        const prompt = prompts[promptIndex];
        searchInput.placeholder = prompt.slice(0, promptPosition);
        promptPosition += 1;

        if (promptPosition <= prompt.length) {
            promptTimer = setTimeout(type, 58);
            return;
        }

        promptTimer = setTimeout(() => {
            promptIndex = (promptIndex + 1) % prompts.length;
            promptPosition = 0;
            type();
        }, 1800);
    };

    const pause = () => {
        paused = true;
        stop();
        searchInput.placeholder = prompts[promptIndex];
    };

    const resume = () => {
        if (searchInput.value) return;
        paused = false;
        promptPosition = 0;
        stop();
        promptTimer = setTimeout(type, 450);
    };

    searchInput.addEventListener('focus', pause);
    searchInput.addEventListener('input', () => {
        if (searchInput.value) {
            paused = true;
            stop();
            searchInput.placeholder = defaultPrompt;
        } else {
            resume();
        }
    });
    searchInput.addEventListener('blur', resume);
    type();
}

function initVegSwitch() {
    const controls = document.querySelector('.menu-secondary-controls') || document.querySelector('.menu-controls');
    if (controls && !document.getElementById('vegFilterSwitch')) {
        const switchWrap = document.createElement('div');
        switchWrap.id = 'vegFilterSwitch';
        switchWrap.className = 'veg-filter-switch';
        switchWrap.innerHTML = `
            <div class="switch-toggle"></div>
            <span class="veg-label">🌱 Pure Veg</span>
        `;
        switchWrap.addEventListener('click', () => {
            pureVegOnly = !pureVegOnly;
            switchWrap.classList.toggle('active', pureVegOnly);
            const activeFilter = document.querySelector('.filter-btn.active')?.getAttribute('data-filter') || 'all';
            const searchVal = (elements.menuSearchInput?.value || '').trim();
            const sortVal = elements.menuSort?.value || 'popular';
            renderDishes(activeFilter, searchVal, sortVal);
            showToast(pureVegOnly ? 'Showing Pure Veg dishes only 🟢' : 'Showing all delicious dishes');
        });
        controls.appendChild(switchWrap);
    }

    const vegSwitch = document.getElementById('vegFilterSwitch');
    const secondaryControls = document.querySelector('.menu-secondary-controls');
    if (vegSwitch && secondaryControls && vegSwitch.parentElement !== secondaryControls) {
        secondaryControls.appendChild(vegSwitch);
    }
}

// ==================== CART FUNCTIONALITY ====================
function addToCart(id, qty = 1, portion = 'Regular') {
    let dish = dishes.find(d => d.id === Number(id) || String(d.id) === String(id));
    if (!dish && (id === 100 || id === '100')) dish = familyPackDish;
    if (!dish) return;

    // Adjust price for jumbo portion if selected
    const priceAdjustment = portion === 'Jumbo (+₹60)' ? 60 : 0;
    const finalPrice = dish.price + priceAdjustment;
    const cartItemId = portion === 'Regular' ? String(dish.id) : `${dish.id}-jumbo`;
    const cartItemName = portion === 'Regular' ? dish.name : `${dish.name} (Jumbo)`;

    const existing = cart.find(item => String(item.cartItemId) === String(cartItemId));
    if (existing) {
        existing.qty += qty;
    } else {
        cart.push({
            ...dish,
            cartItemId,
            name: cartItemName,
            price: finalPrice,
            qty
        });
    }

    updateCart();
    syncDishCardControls();
    bounceCartIcon();
    showToast(`${cartItemName} added to cart!`);
}

function removeFromCart(cartItemId) {
    const targetId = String(cartItemId);
    cart = cart.filter(item => String(item.cartItemId || item.id) !== targetId);
    updateCart();
    syncDishCardControls();
    showToast('Item removed from cart');
}

function updateQty(cartItemId, delta) {
    const targetId = String(cartItemId);
    const item = cart.find(i => String(i.cartItemId || i.id) === targetId);
    if (!item) return;

    item.qty += delta;
    if (item.qty <= 0) {
        removeFromCart(targetId);
        return;
    }
    updateCart();
    syncDishCardControls();
}

function openCartSidebar() {
    if (elements.cartSidebar) {
        elements.cartSidebar.classList.add('active');
        if (elements.cartOverlay) elements.cartOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function reloadCartFromStorage() {
    try {
        const raw = JSON.parse(localStorage.getItem('hungrieeCart') || '[]');
        cart = (Array.isArray(raw) ? raw : []).map(item => ({
            ...item,
            cartItemId: String(item.cartItemId || item.id),
            image: (Number(item.id) === 100 ? familyPackDish : dishes.find(dish => dish.id === Number(item.id)))?.image || item.image || 'images/family_feast.jpg',
            qty: Math.max(1, Number(item.qty) || 1)
        }));
    } catch {
        cart = [];
    }
    updateCart();
}

function clearCart() {
    cart = [];
    updateCart();
}

function addItemsToCart(items) {
    if (!Array.isArray(items) || !items.length) return;
    items.forEach(it => {
        const dishId = Number(it.dishId || it.id);
        const qty = Math.max(1, Number(it.qty) || 1);
        const existing = cart.find(entry => String(entry.cartItemId || entry.id) === String(dishId));
        if (existing) {
            existing.qty += qty;
        } else {
            let dish = dishes.find(d => d.id === dishId);
            if (!dish && dishId === 100) dish = familyPackDish;
            if (dish) {
                cart.push({
                    ...dish,
                    cartItemId: String(dish.id),
                    qty
                });
            } else {
                cart.push({
                    id: dishId || Date.now(),
                    cartItemId: String(dishId || Date.now()),
                    name: it.name || 'Dish',
                    price: Number(it.price) || 0,
                    image: it.image || 'images/family_feast.jpg',
                    qty
                });
            }
        }
    });
    updateCart();
    bounceCartIcon();
    openCartSidebar();
}

// Make functions globally available
window.addToCart = addToCart;
window.addItemsToCart = addItemsToCart;
window.removeFromCart = removeFromCart;
window.updateQty = updateQty;
window.openCartSidebar = openCartSidebar;
window.reloadCartFromStorage = reloadCartFromStorage;
window.clearCart = clearCart;

function calculateCartTotals() {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

    // Base delivery fee
    let delivery = subtotal >= 299 || subtotal === 0 ? 0 : 40;

    // Apply Coupon
    let discount = 0;
    if (activeCoupon && subtotal > 0) {
        if (activeCoupon.code === 'HUNGRIEE50') {
            discount = Math.min(Math.round(subtotal * 0.5), 150);
        } else if (activeCoupon.code === 'HUNGRY100') {
            discount = subtotal >= 300 ? 100 : 0;
        } else if (activeCoupon.code === 'FREEDEL') {
            delivery = 0;
        }
    }

    const total = Math.max(0, subtotal + delivery - discount);

    return { subtotal, delivery, discount, total };
}

function updateCart() {
    localStorage.setItem('hungrieeCart', JSON.stringify(cart));

    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    if (elements.cartCount) elements.cartCount.textContent = totalItems;
    if (elements.cartHeaderCount) elements.cartHeaderCount.textContent = `(${totalItems})`;

    if (!elements.cartItems) return;

    if (cart.length === 0) {
        if (elements.cartEmpty) elements.cartEmpty.style.display = 'flex';
        elements.cartItems.innerHTML = '';
        if (elements.cartFooter) elements.cartFooter.style.display = 'none';
    } else {
        if (elements.cartEmpty) elements.cartEmpty.style.display = 'none';
        if (elements.cartFooter) elements.cartFooter.style.display = 'block';

        elements.cartItems.innerHTML = cart.map(item => {
            const safeItemId = String(item.cartItemId || item.id);
            return `
                <div class="cart-item" data-id="${safeItemId}">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-img" onerror="this.onerror=null;this.src='images/family_feast.jpg'">
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">₹${item.price * item.qty}</div>
                        <div class="cart-item-controls">
                            <button class="cart-qty-btn" type="button" data-action="decrease" data-id="${safeItemId}">−</button>
                            <span class="cart-qty">${item.qty}</span>
                            <button class="cart-qty-btn" type="button" data-action="increase" data-id="${safeItemId}">+</button>
                            <button class="cart-item-remove" type="button" data-action="remove" data-id="${safeItemId}">Remove</button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        const totals = calculateCartTotals();
        if (elements.cartSubtotal) elements.cartSubtotal.textContent = `₹${totals.subtotal}`;
        if (elements.cartDelivery) elements.cartDelivery.textContent = totals.delivery === 0 ? 'FREE' : `₹${totals.delivery}`;
        if (elements.cartTotal) elements.cartTotal.textContent = `₹${totals.total}`;
    }

    syncDishCardControls();
}

function syncDishCardControls() {
    document.querySelectorAll('.dish-card-action[data-dish-id]').forEach(action => {
        const dishId = action.dataset.dishId;
        const item = cart.find(entry => String(entry.cartItemId || entry.id) === String(dishId));
        const quantity = item?.qty || 0;

        if (quantity > 0) {
            action.innerHTML = `
                <div class="dish-card-quantity" aria-label="${quantity} in cart">
                    <button class="dish-card-qty-btn" type="button" data-delta="-1" aria-label="Decrease quantity">−</button>
                    <span>${quantity}</span>
                    <button class="dish-card-qty-btn" type="button" data-delta="1" aria-label="Increase quantity">+</button>
                </div>
            `;
        } else {
            action.innerHTML = `
                <button class="dish-add-btn" data-id="${dishId}">
                    <span aria-hidden="true">+</span><span>Add</span>
                </button>
            `;
        }
    });
}

function bounceCartIcon() {
    if (!elements.cartCount) return;
    elements.cartCount.classList.add('bounce');
    setTimeout(() => elements.cartCount.classList.remove('bounce'), 500);
}

function getSavedDeliveryLocation() {
    try {
        const location = JSON.parse(localStorage.getItem('hungrieeDeliveryLocation') || 'null');
        return location?.valid && /^[0-9]{6}$/.test(location.pinCode || '') ? location : null;
    } catch {
        return null;
    }
}



function requireDeliveryLocation() {
    if (getSavedDeliveryLocation()) return true;

    // Close the cart sidebar and overlay
    elements.cartSidebar?.classList.remove('active');
    elements.cartOverlay?.classList.remove('active');
    document.body.style.overflow = 'auto';

    // Open the delivery PIN dialog
    const dialog = document.getElementById('deliveryLocationDialog');

    if (dialog && !dialog.open) {
        elements.locationBtn?.click();
    }

    showToast('Please set your delivery PIN code before checkout.');
    return false;
}


function initHomeLocationSummary() {
    const areaLabel = document.getElementById('homeDeliveryArea');
    const pinLabel = document.getElementById('homeDeliveryPin');
    if (!areaLabel || !pinLabel) return;

    const renderLocation = () => {
        const location = getSavedDeliveryLocation();
        if (location) {
            areaLabel.textContent = [location.district, location.state].filter(Boolean).join(', ') || 'Delivery area saved';
            pinLabel.textContent = `PIN ${location.pinCode}`;
        } else {
            areaLabel.textContent = 'No area set yet';
            pinLabel.textContent = 'Add a PIN to see your area';
        }
    };

    renderLocation();
    window.addEventListener('storage', event => {
        if (event.key === 'hungrieeDeliveryLocation') renderLocation();
    });
}

function initCart() {
    updateCart();

    if (elements.cartBtn && elements.cartSidebar && elements.cartOverlay) {
        elements.cartBtn.addEventListener('click', () => {
            elements.cartSidebar.classList.add('active');
            elements.cartOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        const closeCart = () => {
            elements.cartSidebar.classList.remove('active');
            elements.cartOverlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        };

        if (elements.cartClose) elements.cartClose.addEventListener('click', closeCart);
        elements.cartOverlay.addEventListener('click', closeCart);
    }

    // Delegated click listener for cart controls
    if (elements.cartItems) {
        elements.cartItems.addEventListener('click', (e) => {
            const btn = e.target.closest('button');
            if (!btn) return;
            const action = btn.getAttribute('data-action');
            const id = btn.getAttribute('data-id');
            if (!id) return;

            e.preventDefault();
            e.stopPropagation();

            if (action === 'decrease') {
                updateQty(id, -1);
            } else if (action === 'increase') {
                updateQty(id, 1);
            } else if (action === 'remove') {
                removeFromCart(id);
            }
        });
    }

    // Checkout button listener — login required
    
    // Checkout button listener — login and delivery PIN required
    if (elements.checkoutBtn) {
        elements.checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                showToast('Your cart is empty! Add dishes to proceed.');
                return;
            }

            // Require login first
            const session = localStorage.getItem('hungrieeSession');

            if (!session) {
                localStorage.setItem('hungrieeReturnToCheckout', '1');
                window.location.href = '/profile?redirect=checkout';
                return;
            }

            // If PIN is missing, close cart and ask for it
            if (!requireDeliveryLocation()) {
                return;
            }

            // PIN exists, so close cart and open checkout
            elements.cartSidebar?.classList.remove('active');
            elements.cartOverlay?.classList.remove('active');
            document.body.style.overflow = 'auto';

            openCheckoutModal();
        });
    }

}

// ==================== TOAST NOTIFICATIONS DISABLED ====================
// Keep this function defined for existing callers, but suppress transient toast popups.
function showToast(_message) {
    return;
}

// ==================== DYNAMIC MODALS ====================
function ensureModalsExist() {
    if (document.getElementById('hungrieeModalOverlay')) return;

    const modalOverlay = document.createElement('div');
    modalOverlay.id = 'hungrieeModalOverlay';
    modalOverlay.className = 'modal-overlay';
    modalOverlay.innerHTML = `
        <div class="modal-container" id="hungrieeModalContainer">
            <button class="modal-close" id="hungrieeModalClose">&times;</button>
            <div id="hungrieeModalContent"></div>
        </div>
    `;

    document.body.appendChild(modalOverlay);

    const closeBtn = modalOverlay.querySelector('#hungrieeModalClose');
    closeBtn.addEventListener('click', closeModal);

    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
}

function openModal(contentHtml) {
    ensureModalsExist();
    const overlay = document.getElementById('hungrieeModalOverlay');
    const container = document.getElementById('hungrieeModalContainer');
    container.classList.remove('tracking-modal');
    const content = document.getElementById('hungrieeModalContent');
    content.innerHTML = contentHtml;
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const overlay = document.getElementById('hungrieeModalOverlay');
    const container = document.getElementById('hungrieeModalContainer');
    if (container) container.classList.remove('tracking-modal');
    if (overlay) {
        overlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// ---------- Quick View Modal ----------
function openQuickView(dishId) {
    let dish = dishes.find(d => d.id === dishId);
    if (!dish && dishId === 100) dish = familyPackDish;
    if (!dish) return;

    let selectedPortion = 'Regular';

    const html = `
        <div class="quickview-body">
            <div class="quickview-image-box">
                <img src="${dish.image}" alt="${dish.name}" onerror="this.onerror=null;this.src='images/family_feast.jpg'">
                <span class="dish-badge ${dish.type}" style="position: absolute; top: 12px; left: 12px;">${dish.type === 'veg' ? '🟢 Veg' : '🔴 Non-Veg'}</span>
                <span class="dish-rating" style="position: absolute; top: 12px; right: 12px;">⭐ ${dish.rating} (${dish.reviews})</span>
            </div>
            <div class="quickview-details">
                <div class="quickview-header">
                    <span class="section-tag" style="margin-bottom: 8px;">Authentic Delicacy</span>
                    <h2 class="quickview-title">${dish.name}</h2>
                </div>
                <p class="quickview-desc">${dish.desc}</p>
                <div class="quickview-meta-grid">
                    <div class="meta-item">
                        <span>SPICE LEVEL</span>
                        <strong>${dish.spice || 'Medium 🌶️'}</strong>
                    </div>
                    <div class="meta-item">
                        <span>CALORIES</span>
                        <strong>${dish.calories || '450 kcal'}</strong>
                    </div>
                    <div class="meta-item">
                        <span>PREP TIME</span>
                        <strong>${dish.prepTime || '20 min'}</strong>
                    </div>
                </div>
                <div class="portion-selector">
                    <div class="portion-title">CHOOSE PORTION SIZE</div>
                    <div class="portion-options">
                        <button class="portion-btn active" data-portion="Regular">Regular Serving</button>
                        <button class="portion-btn" data-portion="Jumbo (+₹60)">Jumbo (+₹60)</button>
                    </div>
                </div>
                <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 16px;">
                    <strong>Ingredients:</strong> ${dish.ingredients || 'Hand-picked spices, fresh farm produce'}
                </div>
                <div class="quickview-footer">
                    <div>
                        <span style="font-size: 0.8rem; color: var(--text-muted); display: block;">PRICE</span>
                        <span class="quickview-price" id="qvPriceDisplay">₹${dish.price}</span>
                    </div>
                    <button class="quickview-add-btn" id="qvAddToCartBtn">
                        <span>+ Add to Cart</span>
                    </button>
                </div>
            </div>
        </div>
    `;

    openModal(html);

    // Portion switcher
    const portionBtns = document.querySelectorAll('.portion-btn');
    const priceDisplay = document.getElementById('qvPriceDisplay');

    portionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            portionBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedPortion = btn.getAttribute('data-portion');
            const adj = selectedPortion === 'Jumbo (+₹60)' ? 60 : 0;
            priceDisplay.textContent = `₹${dish.price + adj}`;
        });
    });

    document.getElementById('qvAddToCartBtn').addEventListener('click', () => {
        addToCart(dish.id, 1, selectedPortion);
        closeModal();
    });
}

// ---------- Checkout Modal ----------
function openCheckoutModal() {
    const totals = calculateCartTotals();

        const ico = (paths, size = 16) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
    const icons = {
        lock: ico('<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>', 13),
        pin: ico('<path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>', 18),
        clock: ico('<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>', 13),
        upi: ico('<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>', 18),
        card: ico('<rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>', 18),
        cash: ico('<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/>', 18),
    };
    const savedLoc = getSavedDeliveryLocation();
    const locLabel = savedLoc ? ([savedLoc.district, savedLoc.state].filter(Boolean).join(', ') || 'Saved area') : 'No location set';
    const locPin = savedLoc ? `PIN ${savedLoc.pinCode}` : 'Set a PIN to continue';
    const totalItems = cart.reduce((s, i) => s + i.qty, 0);

    const itemsHtml = cart.map(item => `
        <div class="co-item">
            <img src="${item.image}" alt="" onerror="this.onerror=null;this.src='images/family_feast.jpg'">
            <div class="co-item-info">
                <span class="co-item-name">${item.name}</span>
                <span class="co-item-qty">Qty ${item.qty}</span>
            </div>
            <span class="co-item-price">₹${item.price * item.qty}</span>
        </div>
    `).join('');

    const html = `
        <div class="checkout-modal-content co">
            <header class="co-header">
                <div>
                    <span class="co-eyebrow">${icons.lock} Secure checkout</span>
                    <h2 class="co-title">Complete your <span class="accent">order</span></h2>
                </div>
                <div class="co-deliver-chip">
                    ${icons.pin}
                    <span>${locLabel}<small>${locPin}</small></span>
                </div>
            </header>

            <div class="co-grid">
                <div class="co-form">
                    <section class="co-section">
                        <div class="co-section-head"><span class="co-step">01</span><h3 class="co-section-title">Contact details</h3></div>
                        <div class="co-row">
                            <div class="co-field">
                                <label class="co-label" for="orderName">Full name *</label>
                                <input type="text" class="checkout-input" id="orderName" placeholder="e.g. Rahul Sharma" autocomplete="name" required>
                            </div>
                            <div class="co-field">
                                <label class="co-label" for="orderPhone">Phone number *</label>
                                <input type="tel" class="checkout-input" id="orderPhone" placeholder="+91 98765 43210" autocomplete="tel" required>
                            </div>
                        </div>
                    </section>

                    <section class="co-section">
                        <div class="co-section-head"><span class="co-step">02</span><h3 class="co-section-title">Delivery address</h3></div>
                        <div class="co-field address-autocomplete-group">
                            <label class="co-label" for="orderAddress">Street address * <span style="color:var(--text-muted);font-weight:500">(auto-filled if you use your location)</span></label>
                            <div class="address-autocomplete-wrap">
                                <input type="text" class="checkout-input" id="orderAddress" placeholder="Flat no., building, street name" autocomplete="off" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="addressSuggestions" required>
                                <div class="address-suggestions" id="addressSuggestions" role="listbox" hidden></div>
                            </div>
                        </div>
                        <div class="co-field current-location-group">
                            <button type="button" class="use-current-location-btn" id="useCurrentLocationBtn">
                                <span aria-hidden="true">◎</span> Use my current location
                            </button>
                            <p class="current-location-status" id="currentLocationStatus" role="status" aria-live="polite">Your browser will ask before sharing your location.</p>
                        </div>
                        <div class="co-field">
                            <label class="co-label" for="orderCity">City &amp; landmark</label>
                            <input type="text" class="checkout-input" id="orderCity" placeholder="City, near a landmark">
                        </div>
                    </section>

                    <section class="co-section">
                        <div class="co-section-head"><span class="co-step">03</span><h3 class="co-section-title">Payment method</h3></div>
                        <div class="co-pay">
                            <button type="button" class="payment-btn active" data-pay="UPI">
                                <span class="pay-icon">${icons.upi}</span>
                                <span class="pay-text"><strong>UPI</strong><small>GPay, PhonePe, Paytm</small></span>
                                <span class="pay-radio"></span>
                            </button>
                            <button type="button" class="payment-btn" data-pay="Card">
                                <span class="pay-icon">${icons.card}</span>
                                <span class="pay-text"><strong>Credit / Debit card</strong><small>Visa, Mastercard, RuPay</small></span>
                                <span class="pay-radio"></span>
                            </button>
                            <button type="button" class="payment-btn" data-pay="COD">
                                <span class="pay-icon">${icons.cash}</span>
                                <span class="pay-text"><strong>Cash on delivery</strong><small>Pay when your order arrives</small></span>
                                <span class="pay-radio"></span>
                            </button>
                        </div>
                    </section>
                </div>

                <aside class="co-summary">
                    <div class="co-summary-title">
                        <h3>Order summary</h3>
                        <small>${totalItems} item${totalItems === 1 ? '' : 's'}</small>
                    </div>
                    <div class="co-items">${itemsHtml}</div>

                    <div class="coupon-box">
                        <input type="text" class="coupon-input" id="couponCodeInput" placeholder="Coupon code" value="${activeCoupon ? activeCoupon.code : ''}">
                        <button type="button" class="coupon-apply-btn" id="applyCouponBtn">${activeCoupon ? 'Applied' : 'Apply'}</button>
                    </div>
                    ${activeCoupon ? `<div class="applied-coupon-pill" id="appliedCouponTag"><span>✓ ${activeCoupon.code} applied</span> <button type="button" onclick="removeCoupon()">&times;</button></div>` : ''}

                    <div class="checkout-total-rows">
                        <div class="checkout-total-row"><span>Subtotal</span><span>₹${totals.subtotal}</span></div>
                        <div class="checkout-total-row"><span>Delivery fee</span><span>${totals.delivery === 0 ? 'FREE' : '₹' + totals.delivery}</span></div>
                        ${totals.discount > 0 ? `<div class="checkout-total-row discount-row"><span>Coupon discount</span><span>−₹${totals.discount}</span></div>` : ''}
                        <div class="checkout-total-row grand-total"><span>To pay</span><span class="accent">₹${totals.total}</span></div>
                    </div>

                    <button type="button" class="place-order-btn" id="confirmPlaceOrderBtn">
                        <span>Place order · ₹${totals.total}</span>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </button>
                    <div class="co-assure">
                        <span>${icons.clock} Arrives in 25–30 min</span>
                        <span>${icons.lock} Secure checkout</span>
                    </div>
                </aside>
            </div>
        </div>
    `;

    openModal(html);

    const deliveryLocation = getSavedDeliveryLocation();
    let selectedAddressSuggestion = null;
    let selectedAddressText = '';
    let selectedDeviceLocation = null;
    initAddressAutocomplete(deliveryLocation, suggestion => {
        selectedDeviceLocation = null;
        selectedAddressSuggestion = suggestion;
        selectedAddressText = `${suggestion.title}${suggestion.detail ? `, ${suggestion.detail}` : ''}`;
        const addressInput = document.getElementById('orderAddress');
        const cityInput = document.getElementById('orderCity');
        addressInput.value = selectedAddressText;
        if (suggestion.city || suggestion.state) {
            cityInput.value = [suggestion.city, suggestion.state].filter(Boolean).join(', ');
        }
        if (locationStatus) {
            locationStatus.textContent = 'Place selected from address suggestions.';
            locationStatus.dataset.state = '';
        }
        addressInput.focus();
    }, () => {
        selectedAddressSuggestion = null;
        selectedAddressText = '';
    });

    const locationButton = document.getElementById('useCurrentLocationBtn');
    const locationStatus = document.getElementById('currentLocationStatus');
    const addressInput = document.getElementById('orderAddress');
    const cityInput = document.getElementById('orderCity');

    // Auto-fill from signed-in user session if available
    try {
        const storedUser = JSON.parse(localStorage.getItem('hungrieeUser') || 'null');
        if (storedUser) {
            const nameInput = document.getElementById('orderName');
            const phoneInput = document.getElementById('orderPhone');
            if (nameInput && storedUser.name && !nameInput.value) nameInput.value = storedUser.name;
            if (phoneInput && storedUser.phone && !phoneInput.value) phoneInput.value = storedUser.phone;
        }
    } catch {}

    locationButton?.addEventListener('click', () => {
        if (!navigator.geolocation) {
            locationStatus.textContent = 'Location is unavailable in this browser. Enter your address instead.';
            locationStatus.dataset.state = 'error';
            return;
        }

        locationButton.disabled = true;
        locationStatus.textContent = 'Finding your location…';
        locationStatus.dataset.state = 'pending';
        navigator.geolocation.getCurrentPosition(position => {
            const latitude = Number(position.coords.latitude);
            const longitude = Number(position.coords.longitude);
            const isWithinIndia = latitude >= 6 && latitude <= 38 && longitude >= 68 && longitude <= 98;
            if (!isWithinIndia) {
                locationStatus.textContent = 'This location is outside our delivery region. Enter an Indian delivery address instead.';
                locationStatus.dataset.state = 'error';
                locationButton.disabled = false;
                return;
            }

                        selectedAddressSuggestion = null;
            selectedAddressText = '';
            selectedDeviceLocation = {
                latitude,
                longitude,
                coordinateSource: 'Device geolocation',
                selectedPlace: 'Current device location',
            };

            // Fill the field right away so nothing more is required
            const fallbackAddress = 'Current location (pinned on map)';
            addressInput.value = fallbackAddress;
            cityInput.value = [deliveryLocation?.district, deliveryLocation?.state].filter(Boolean).join(', ')
                || 'Current location';
            locationStatus.textContent = 'Location pinned. Looking up your address…';
            locationStatus.dataset.state = 'success';
            locationButton.disabled = false;

            // Try to turn the coordinates into a readable address (optional nicety)
            fetch(`https://photon.komoot.io/reverse?lat=${latitude}&lon=${longitude}`, {
                headers: { Accept: 'application/geo+json, application/json' },
                signal: AbortSignal.timeout(8000),
            })
                .then(res => res.ok ? res.json() : Promise.reject())
                .then(payload => {
                    const p = payload?.features?.[0]?.properties;
                    if (!p) return;
                    const readable = [p.housenumber && p.street ? `${p.housenumber} ${p.street}` : (p.name || p.street),
                        p.district, p.city, p.state, p.postcode]
                        .filter((v, i, arr) => v && arr.indexOf(v) === i)
                        .join(', ');
                    // Only overwrite if the user hasn't typed something else meanwhile
                    if (readable && addressInput.value === fallbackAddress) {
                        addressInput.value = readable;
                        const place = [p.city || p.district, p.state].filter(Boolean).join(', ');
                        if (place) cityInput.value = place;
                    }
                    locationStatus.textContent = 'Location pinned and address filled in. You can edit it if you like.';
                })
                .catch(() => {
                    locationStatus.textContent = 'Location pinned. You don\u2019t need to enter anything else.';
                });
        }, error => {
            const message = error.code === error.PERMISSION_DENIED
                ? 'Location permission was denied. Allow access in your browser or enter the address manually.'
                : error.code === error.POSITION_UNAVAILABLE
                    ? 'Your device could not determine its location. Enter the address manually.'
                    : 'Location request timed out. Try again or enter the address manually.';
            locationStatus.textContent = message;
            locationStatus.dataset.state = 'error';
            locationButton.disabled = false;
        }, { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 });
    });

    // Payment option clicks
    let chosenPayment = 'UPI';
    document.querySelectorAll('.payment-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.payment-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            chosenPayment = btn.getAttribute('data-pay');
        });
    });

    // Coupon Apply button
    const applyBtn = document.getElementById('applyCouponBtn');
    if (applyBtn) {
        applyBtn.addEventListener('click', () => {
            const code = document.getElementById('couponCodeInput').value.trim().toUpperCase();
            if (code === 'HUNGRIEE50') {
                activeCoupon = { code: 'HUNGRIEE50', type: 'percent', val: 50 };
                showToast('🎉 Coupon HUNGRIEE50 applied! 50% discount applied.');
                openCheckoutModal();
            } else if (code === 'HUNGRY100') {
                if (totals.subtotal >= 300) {
                    activeCoupon = { code: 'HUNGRY100', type: 'flat', val: 100 };
                    showToast('🎉 Coupon HUNGRY100 applied! ₹100 flat discount.');
                    openCheckoutModal();
                } else {
                    showToast('Coupon HUNGRY100 requires minimum order of ₹300');
                }
            } else if (code === 'FREEDEL') {
                activeCoupon = { code: 'FREEDEL', type: 'delivery', val: 40 };
                showToast('🛵 Coupon FREEDEL applied! Free delivery unlocked.');
                openCheckoutModal();
            } else {
                showToast('Invalid coupon code. Try HUNGRIEE50 or FREEDEL');
            }
        });
    }

    // Clear checkout field highlighting as soon as the customer corrects it.
    document.addEventListener('input', event => {
        const input = event.target;
        if (!input.matches('#orderName, #orderPhone, #orderAddress') || !input.classList.contains('field-invalid')) return;
        input.classList.remove('field-invalid');
        input.removeAttribute('aria-invalid');
        input.closest('.co-field')?.querySelector('.field-validation-message')?.remove();
    });

    // Place Order button
    document.getElementById('confirmPlaceOrderBtn').addEventListener('click', () => {
        // SMS verification was retired; checkout requires a signed-in session only.
        const checkoutSessionToken = localStorage.getItem('hungrieeSession');
        if (!checkoutSessionToken) {
            localStorage.setItem('hungrieeReturnToCheckout', '1');
            window.location.href = '/profile?redirect=checkout';
            return;
        }
        const deliveryLocation = getSavedDeliveryLocation();
        if (!deliveryLocation) {
    closeModal();

    // Close the cart sidebar and its overlay
    if (elements.cartSidebar) {
        elements.cartSidebar.classList.remove('active');
    }

    if (elements.cartOverlay) {
        elements.cartOverlay.classList.remove('active');
    }

    document.body.style.overflow = 'auto';

    // Open the location popover using its existing button handler
    elements.locationBtn?.click();

    showToast('Please enter your delivery PIN code to place your order.');
    return;
}

        const name = document.getElementById('orderName').value.trim();
        const phone = document.getElementById('orderPhone').value.trim();
        const address = document.getElementById('orderAddress').value.trim()
            || (selectedDeviceLocation ? 'Current location (pinned on map)' : '');

        const requiredCheckoutFields = [
            { id: 'orderName', value: name, message: 'Enter your full name.' },
            { id: 'orderPhone', value: phone, message: 'Enter your phone number.' },
            { id: 'orderAddress', value: address, message: 'Enter a delivery address or use your current location.' },
        ];
        document.querySelectorAll('#orderName, #orderPhone, #orderAddress').forEach(input => {
            input.classList.remove('field-invalid');
            input.removeAttribute('aria-invalid');
            const field = input.closest('.co-field');
            field?.querySelector('.field-validation-message')?.remove();
        });
        const missingCheckoutFields = requiredCheckoutFields.filter(field => !String(field.value || '').trim());
        if (missingCheckoutFields.length) {
            missingCheckoutFields.forEach(field => {
                const input = document.getElementById(field.id);
                input.classList.add('field-invalid');
                input.setAttribute('aria-invalid', 'true');
                const wrap = input.closest('.co-field');
                const message = document.createElement('small');
                message.className = 'field-validation-message';
                message.textContent = field.message;
                wrap?.appendChild(message);
            });
            const firstMissing = document.getElementById(missingCheckoutFields[0].id);
            firstMissing?.focus({ preventScroll: false });
            firstMissing?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        // Generate Order ID & Save
        const orderId = 'HNG-' + Math.floor(100000 + Math.random() * 900000);
        const orderDeliveryLocation = selectedDeviceLocation ? {
            ...deliveryLocation,
            ...selectedDeviceLocation,
        } : selectedAddressSuggestion ? {
            ...deliveryLocation,
            latitude: selectedAddressSuggestion.latitude,
            longitude: selectedAddressSuggestion.longitude,
            coordinateSource: 'Photon address search',
            selectedPlace: selectedAddressText,
        } : deliveryLocation;
        const orderData = {
            id: orderId,
            customer: name,
            phone,
            address,
            rider: createDemoRider(orderId),
            deliveryLocation: orderDeliveryLocation,
            payment: chosenPayment,
            items: [...cart],
            total: totals.total,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        localStorage.setItem('hungrieeLastOrder', JSON.stringify(orderData));

        // Save order to MongoDB Atlas if user is signed in
        const sessionToken = localStorage.getItem('hungrieeSession');
        if (sessionToken) {
            const apiItems = cart.map(item => ({
                dishId: Number(item.id),
                name: item.name,
                image: item.image || '',
                price: item.price,
                qty: item.qty,
            }));
            fetch('/api/orders/place', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Session': sessionToken,
                },
                body: JSON.stringify({
                    items: apiItems,
                    subtotal: totals.subtotal,
                    delivery: totals.delivery,
                    discount: totals.discount,
                    total: totals.total,
                    coupon: activeCoupon?.code || '',
                    address: {
                        line1: address,
                        city: deliveryLocation?.district || deliveryLocation?.state || '',
                        state: deliveryLocation?.state || '',
                        pinCode: deliveryLocation?.pinCode || '',
                        phone,
                    },
                }),
            }).catch(err => console.error('Failed to sync order to MongoDB:', err));
        }

        // Clear Cart
        cart = [];
        activeCoupon = null;
        updateCart();

        // Open Live Tracker
        openOrderSuccessModal(orderData);
    });
}

function initAddressAutocomplete(deliveryLocation, onSelect, onClearSelection) {
    const input = document.getElementById('orderAddress');
    const list = document.getElementById('addressSuggestions');
    if (!input || !list) return;
    const searchLocation = deliveryLocation || {};

    let debounceTimer;
    let activeRequest = null;
    let activeIndex = -1;
    let currentSuggestions = [];
    let chosenAddressText = '';

    const closeList = () => {
        clearTimeout(debounceTimer);
        activeRequest?.abort();
        activeRequest = null;
        list.hidden = true;
        list.style.display = 'none';
        input.setAttribute('aria-expanded', 'false');
        activeIndex = -1;
    };
    const showMessage = message => {
        list.replaceChildren();
        const row = document.createElement('div');
        row.className = 'address-suggestion-message';
        row.textContent = message;
        list.appendChild(row);
        list.hidden = false;
        list.style.display = 'block';
        input.setAttribute('aria-expanded', 'true');
    };
    const chooseSuggestion = suggestion => {
        closeList();
        currentSuggestions = [];
        chosenAddressText = `${suggestion.title}${suggestion.detail ? `, ${suggestion.detail}` : ''}`;
        onSelect(suggestion);
    };
    const renderSuggestions = suggestions => {
        currentSuggestions = suggestions;
        activeIndex = -1;
        list.replaceChildren();
        suggestions.forEach((suggestion, index) => {
            const option = document.createElement('button');
            option.type = 'button';
            option.className = 'address-suggestion-option';
            option.setAttribute('role', 'option');
            option.dataset.index = String(index);
            option.addEventListener('pointerdown', event => event.preventDefault());
            const title = document.createElement('strong');
            title.textContent = suggestion.title;
            const detail = document.createElement('span');
            detail.textContent = suggestion.detail;
            option.append(title, detail);
            option.addEventListener('click', () => chooseSuggestion(suggestion));
            list.appendChild(option);
        });
        const attribution = document.createElement('div');
        attribution.className = 'address-suggestion-attribution';
        attribution.textContent = 'Place suggestions by OpenStreetMap';
        list.appendChild(attribution);
        list.hidden = false;
        list.style.display = 'block';
        input.setAttribute('aria-expanded', 'true');
    };

    const requestAddressSuggestions = async (query, signal) => {
        try {
            const response = await fetch('/api/address-suggestions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query,
                    pinCode: searchLocation.pinCode,
                    district: searchLocation.district,
                    state: searchLocation.state,
                    latitude: searchLocation.latitude,
                    longitude: searchLocation.longitude,
                }),
                signal,
            });
            const result = await response.json();
            if (response.ok && Array.isArray(result.suggestions)) return result.suggestions;
        } catch (error) {
            if (error.name === 'AbortError') throw error;
            // Older local servers don't know the suggestions API, so use Photon directly.
        }

        let latitude = Number(searchLocation.latitude);
        let longitude = Number(searchLocation.longitude);
        const hasCoordinates = () => Number.isFinite(latitude) && Number.isFinite(longitude)
            && latitude >= 6 && latitude <= 38 && longitude >= 68 && longitude <= 98;
        if (!hasCoordinates()) {
            try {
                const pinResponse = await fetch('/api/check-coverage', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ pinCode: searchLocation.pinCode }),
                    signal,
                });
                const pinResult = await pinResponse.json();
                latitude = Number(pinResult.latitude);
                longitude = Number(pinResult.longitude);
            } catch (error) {
                if (error.name === 'AbortError') throw error;
            }
        }

        const searchText = hasCoordinates()
            ? query
            : [query, searchLocation.pinCode, searchLocation.district, searchLocation.state, 'India'].filter(Boolean).join(', ');
        const params = new URLSearchParams({ q: searchText, countrycode: 'IN', limit: '6' });
        if (hasCoordinates()) {
            params.set('lat', String(latitude));
            params.set('lon', String(longitude));
            params.set('location_bias_scale', '0.15');
        }
        const response = await fetch(`https://photon.komoot.io/api/?${params}`, {
            headers: { Accept: 'application/geo+json, application/json' },
            signal,
        });
        if (!response.ok) throw new Error('Place search unavailable.');
        const payload = await response.json();
        return (payload.features || []).flatMap(feature => {
            const coordinates = feature?.geometry?.coordinates;
            const properties = feature?.properties || {};
            if (!Array.isArray(coordinates) || coordinates.length < 2) return [];
            const [placeLongitude, placeLatitude] = coordinates.map(Number);
            if (!Number.isFinite(placeLatitude) || !Number.isFinite(placeLongitude)
                || placeLatitude < 6 || placeLatitude > 38 || placeLongitude < 68 || placeLongitude > 98) return [];
            if (properties.countrycode && properties.countrycode.toUpperCase() !== 'IN') return [];
            const title = properties.name || properties.street || properties.city || properties.county;
            if (!title) return [];
            const detail = [properties.street && properties.street !== title ? properties.street : '',
                properties.city, properties.county, properties.state]
                .filter((value, index, values) => value && values.indexOf(value) === index && value !== title)
                .join(', ');
            return [{
                title: String(title),
                detail: String(detail || 'India'),
                latitude: placeLatitude,
                longitude: placeLongitude,
                city: String(properties.city || properties.county || searchLocation.district || ''),
                state: String(properties.state || searchLocation.state || ''),
            }];
        });
    };

    input.addEventListener('input', () => {
        const currentValue = input.value.trim();
        if (chosenAddressText && !currentValue.startsWith(chosenAddressText)) {
            chosenAddressText = '';
            onClearSelection?.();
        }
        clearTimeout(debounceTimer);
        activeRequest?.abort();
        activeRequest = null;
        if (currentValue.length < 2) {
            closeList();
            return;
        }

        showMessage('Searching nearby places…');
        debounceTimer = setTimeout(async () => {
            const requestController = new AbortController();
            activeRequest = requestController;
            try {
                const suggestions = await requestAddressSuggestions(currentValue, requestController.signal);
                if (activeRequest !== requestController || document.activeElement !== input || input.value.trim() !== currentValue) return;
                if (suggestions.length) {
                    renderSuggestions(suggestions);
                } else {
                    showMessage('No nearby matches. Keep typing or enter the address manually.');
                }
            } catch (error) {
                if (error.name === 'AbortError') return;
                showMessage('Place search is unavailable right now. You can enter the address manually.');
            }
        }, 320);
    });

    input.addEventListener('keydown', event => {
        if (list.hidden || !currentSuggestions.length) return;
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            const delta = event.key === 'ArrowDown' ? 1 : -1;
            activeIndex = (activeIndex + delta + currentSuggestions.length) % currentSuggestions.length;
            list.querySelectorAll('.address-suggestion-option').forEach((option, index) => {
                option.classList.toggle('active', index === activeIndex);
            });
        } else if (event.key === 'Enter' && activeIndex >= 0) {
            event.preventDefault();
            chooseSuggestion(currentSuggestions[activeIndex]);
        } else if (event.key === 'Escape') {
            closeList();
        }
    });

    input.addEventListener('blur', () => {
        setTimeout(() => {
            if (!list.contains(document.activeElement)) closeList();
        }, 0);
    });
}
function refreshCheckout() {
    const ids = ['orderName', 'orderPhone', 'orderAddress', 'orderCity'];
    const saved = Object.fromEntries(ids.map(id => [id, document.getElementById(id)?.value || '']));
    const pay = document.querySelector('.payment-btn.active')?.dataset.pay;
    openCheckoutModal();
    ids.forEach(id => { const el = document.getElementById(id); if (el) el.value = saved[id]; });
    if (pay) document.querySelector(`.payment-btn[data-pay="${pay}"]`)?.click();
}

function removeCoupon() {
    activeCoupon = null;
    showToast('Coupon removed');
    openCheckoutModal();
}

// ---------- Live Order Tracker Modal ----------
function createDemoRider(orderId) {
    const riders = [
        { name: 'Amanpreet Singh', vehicle: 'Honda Activa', initials: 'AS' },
        { name: 'Gurpreet Singh', vehicle: 'Hero Splendor', initials: 'GS' },
        { name: 'Jaspreet Kaur', vehicle: 'TVS Jupiter', initials: 'JK' },
        { name: 'Simranjit Singh', vehicle: 'Honda Shine', initials: 'SS' },
        { name: 'Harpreet Singh', vehicle: 'Bajaj Platina', initials: 'HS' },
    ];
    const index = Math.floor(Math.random() * riders.length);
    return { ...riders[index], rating: (4.7 + Math.random() * 0.3).toFixed(1) };
}

function openOrderSuccessModal(order) {
    const rider = order.rider || createDemoRider(order.id);
    const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const firstName = esc((order.customer || '').split(' ')[0] || 'there');
    const checkSvg = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';
    const itemCount = order.items.reduce((s, i) => s + i.qty, 0);

    const itemsHtml = order.items.map(item => `
        <div class="od-item">
            <span>${esc(item.name)} <small>× ${item.qty}</small></span>
            <span>₹${item.price * item.qty}</span>
        </div>
    `).join('');

    const html = `
        <div class="success-modal-content od">
            <header class="od-head">
                <div class="od-check">
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>
                </div>
                <div class="od-head-text">
                    <span class="od-eyebrow">Order confirmed</span>
                    <h2 class="od-title">Thanks, ${firstName}!</h2>
                    <p class="od-sub">Your meal is being freshly prepared.</p>
                </div>
                <div class="od-id"><small>Order ID</small><strong>#${esc(order.id)}</strong></div>
            </header>

            <div class="od-grid">
                <div class="od-main">
                    <section class="tracking-map-card" aria-label="Order map tracker">
                        <div class="tracking-map-header">
                            <div>
                                <span class="tracking-map-kicker"><i></i> LIVE TRACKER</span>
                                <strong id="trackingMapStatus">Kitchen is preparing your order</strong>
                            </div>
                            <span class="tracking-distance" id="trackingDistance">Finding route…</span>
                        </div>
                        <div id="orderTrackingMap" class="order-tracking-map">
                            <div class="tracking-map-loading">📍 Preparing your delivery map…</div>
                        </div>
                        <p class="tracking-map-note" id="trackingMapNote">Your delivery location and estimated rider route will appear here.</p>
                    </section>

                    <section class="tracking-rider-card" aria-label="Assigned delivery rider">
                        <div class="tracking-rider-avatar" aria-hidden="true">${esc(rider.initials)}</div>
                        <div class="tracking-rider-details">
                            <span class="tracking-rider-label">YOUR RIDER</span>
                            <strong>${esc(rider.name)}</strong>
                            <small>${esc(rider.vehicle)}</small>
                        </div>
                        <div class="tracking-rider-rating"
     aria-label="Rating ${esc(rider.rating)} out of 5">
    <div class="tracking-rider-score">
        <span aria-hidden="true">★</span>
        <strong>${esc(rider.rating)}</strong>
    </div>
    <small>rating</small>
</div>
                    </section>
                </div>

                <aside class="od-side">
                    <div class="od-eta">
                        <div>
                            <span class="od-label">Estimated arrival</span>
                            <strong class="od-eta-val" id="etaTimeDisplay">25 – 30 min</strong>
                        </div>
                        <span class="od-eta-time">Placed ${esc(order.time || '')}</span>
                    </div>

                    <ol class="trk" aria-label="Order progress">
                        <li class="trk-step done" id="trackNode1"><span class="trk-dot">${checkSvg}</span><div><strong>Confirmed</strong><small>We've got your order</small></div></li>
                        <li class="trk-step active" id="trackNode2"><span class="trk-dot">${checkSvg}</span><div><strong>Kitchen prep</strong><small>Cooking fresh for you</small></div></li>
                        <li class="trk-step" id="trackNode3"><span class="trk-dot">${checkSvg}</span><div><strong>Out for delivery</strong><small>Rider is on the way</small></div></li>
                        <li class="trk-step" id="trackNode4"><span class="trk-dot">${checkSvg}</span><div><strong>Delivered</strong><small>Enjoy your meal</small></div></li>
                    </ol>

                    <div class="od-summary">
                        <div class="od-summary-head"><h3>Order summary</h3><small>${itemCount} item${itemCount === 1 ? '' : 's'}</small></div>
                        <div class="od-items">${itemsHtml}</div>
                        <div class="od-meta">
                            <div><span class="od-label">Deliver to</span><p>${esc(order.address)}</p></div>
                            <div><span class="od-label">Payment</span><p>${esc(order.payment)}</p></div>
                        </div>
                        <div class="od-total"><span>Total</span><strong>₹${order.total}</strong></div>
                    </div>
                </aside>
            </div>

            <div class="order-modal-actions">
                <a href="/menu" class="btn-primary" onclick="closeModal()">Keep browsing</a>
                <button type="button" class="order-btn" onclick="closeModal()">Close</button>
            </div>
        </div>
    `;

    openModal(html);
    document.getElementById('hungrieeModalContainer').classList.add('tracking-modal');
    startOrderTracking(order);
}

function loadLeaflet() {
    if (window.L) return Promise.resolve(window.L);

    if (!document.getElementById('leaflet-css')) {
        const stylesheet = document.createElement('link');
        stylesheet.id = 'leaflet-css';
        stylesheet.rel = 'stylesheet';
        stylesheet.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(stylesheet);
    }

    return new Promise((resolve, reject) => {
        let script = document.getElementById('leaflet-js');
        if (!script) {
            script = document.createElement('script');
            script.id = 'leaflet-js';
            script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
            script.async = true;
            document.head.appendChild(script);
        }
        script.addEventListener('load', () => window.L ? resolve(window.L) : reject(new Error('Map library unavailable.')), { once: true });
        script.addEventListener('error', () => reject(new Error('Map library could not load.')), { once: true });
        if (window.L) resolve(window.L);
    });
}

async function resolveOrderCoordinates(order) {
    const isIndianCoordinate = location =>
        Number.isFinite(location?.latitude) && Number.isFinite(location?.longitude)
        && location.latitude >= 6 && location.latitude <= 38
        && location.longitude >= 68 && location.longitude <= 98;

    if (isIndianCoordinate(order.deliveryLocation)) return order.deliveryLocation;

    const pinCode = String(order.deliveryLocation?.pinCode || '').trim();
    if (!pinCode) return null;

    // The postal lookup can omit coordinates for PINs with multiple post offices.
    // Use Batala Head Office as an approximate area point for this college-project demo.
    if (pinCode === '143505') {
        const batalaArea = {
            ...order.deliveryLocation,
            valid: true,
            district: order.deliveryLocation?.district || 'Gurdaspur',
            state: order.deliveryLocation?.state || 'Punjab',
            latitude: 31.8075,
            longitude: 75.1956,
            coordinateSource: 'Batala PIN-area fallback',
        };
        order.deliveryLocation = batalaArea;
        localStorage.setItem('hungrieeDeliveryLocation', JSON.stringify(batalaArea));
        localStorage.setItem('hungrieeLastOrder', JSON.stringify(order));
        return batalaArea;
    }

    let response;
    try {
        response = await fetch('/api/check-coverage', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pinCode }),
        });
    } catch {
        throw new Error('The PIN map lookup could not connect. Start the updated site with “node server.js”, then re-save your PIN on the Menu page.');
    }

    const result = await response.json().catch(() => null);
    if (!response.ok || !result?.valid) {
        throw new Error('The PIN lookup failed. Re-save a valid PIN on the Menu page and try again.');
    }
    if (!Number.isFinite(result.latitude) || !Number.isFinite(result.longitude)) {
        throw new Error('No area coordinates were returned. Restart with “node server.js” to enable the backup PIN source, then re-save your PIN and place a new order.');
    }

    order.deliveryLocation = {
        ...order.deliveryLocation,
        latitude: result.latitude,
        longitude: result.longitude,
        coordinateSource: result.coordinateSource || 'PIN directory',
    };
    localStorage.setItem('hungrieeDeliveryLocation', JSON.stringify(order.deliveryLocation));
    localStorage.setItem('hungrieeLastOrder', JSON.stringify(order));
    return order.deliveryLocation;
}

async function initializeTrackingMap(order) {
    const mapElement = document.getElementById('orderTrackingMap');
    const statusElement = document.getElementById('trackingMapStatus');
    const distanceElement = document.getElementById('trackingDistance');
    if (!mapElement) return null;

    try {
        const location = await resolveOrderCoordinates(order);
        if (!location) throw new Error('No map coordinates were found for this PIN.');

        const mapNote = document.getElementById('trackingMapNote');
        if (mapNote) {
            const isDeviceLocation = location.coordinateSource === 'Device geolocation';
            const sourceNote = location.coordinateSource === 'Pincodez'
                ? ' Postal coordinates: <a href="https://pincodez.info/developers" target="_blank" rel="noopener">Pincodez.info</a>.'
                : location.coordinateSource?.startsWith('OpenStreetMap/Photon')
                    ? ' PIN-area lookup: <a href="https://github.com/komoot/photon" target="_blank" rel="noopener">Photon / OpenStreetMap</a>.'
                    : '';
            mapNote.innerHTML = isDeviceLocation
                ? 'Map shows the current location shared for this order. Rider movement and progress are estimated, not live GPS.'
                : `Map shows the approximate PIN area; rider route and progress are estimated, not live GPS.${sourceNote}`;
        }

        const L = await loadLeaflet();
        const destination = [location.latitude, location.longitude];
        // Use a nearby demo origin since this project does not have restaurant or courier GPS feeds.
               // Demo points: the project has no real kitchen or courier GPS feeds
        const kitchenGuess = [location.latitude + 0.012, location.longitude - 0.014];
        const riderGuess = [location.latitude + 0.024, location.longitude - 0.034];

        const fetchLeg = async (from, to) => {
            try {
                const url = `https://router.project-osrm.org/route/v1/driving/${from[1]},${from[0]};${to[1]},${to[0]}?overview=full&geometries=geojson`;
                const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
                const data = await res.json();
                const route = data.routes?.[0];
                if (res.ok && data.code === 'Ok' && route?.geometry?.coordinates?.length) {
                    return { points: route.geometry.coordinates.map(([lng, lat]) => [lat, lng]), distance: route.distance };
                }
            } catch { /* fall back to a straight line */ }
            return { points: [from, to], distance: null };
        };
        const [leg1, leg2] = await Promise.all([
            fetchLeg(riderGuess, kitchenGuess),   // rider -> kitchen
            fetchLeg(kitchenGuess, destination),  // kitchen -> your home
        ]);
        const riderStart = leg1.points[0];
        const kitchenPoint = leg2.points[0];

        mapElement.innerHTML = '';
        const map = L.map(mapElement, { scrollWheelZoom: false, zoomControl: true });
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors · Route demo <a href="https://project-osrm.org/" target="_blank" rel="noopener">OSRM</a>',
        }).addTo(map);

        const svgAttrs = 'viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';

        // Dotted guides for both legs
        const guide = { color: 'rgba(247, 241, 233, 0.45)', weight: 5, dashArray: '1 11', lineCap: 'round', lineJoin: 'round' };
        L.polyline(leg1.points, guide).addTo(map);
        L.polyline(leg2.points, guide).addTo(map);
        // Travelled parts fill in behind the rider (gold to the kitchen, orange to your home)
        const travelled2 = L.polyline(leg2.points, {
            color: '#f26b3a',
            weight: 6,
            opacity: 0.95,
            lineCap: 'round',
            lineJoin: 'round'
        }).addTo(map);

        // Destination
        L.marker(destination, {
            icon: L.divIcon({ className: 'tracking-destination-icon', html: '<span>⌂</span>', iconSize: [38, 38], iconAnchor: [19, 34] }),
            title: location.coordinateSource === 'Device geolocation'
                ? 'Your delivery location'
                : `${location.district || 'Delivery'} PIN area`,
        }).addTo(map);

        // Kitchen
        L.marker(kitchenPoint, {
            icon: L.divIcon({
                className: 'tk-icon',
                html: `<div class="tk-kitchen">
                    <svg width="22" height="22" ${svgAttrs}><path d="M3 2v7a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6a2 2 0 0 0 2 2h3Zm0 0v7"/></svg>
                    <em>Kitchen</em>
                </div>`,
                iconSize: [42, 42], iconAnchor: [21, 21],
            }),
            title: 'Hungriee Kitchen',
            zIndexOffset: 400,
        }).addTo(map);

                const bikeSvg = `
            <svg class="tk-bike" width="64" height="43" viewBox="0 0 120 80" aria-hidden="true">
                <ellipse cx="60" cy="76" rx="46" ry="3.5" fill="rgba(0,0,0,0.35)"/>
                <!-- delivery box -->
                <rect x="4" y="10" width="32" height="26" rx="5" fill="#e9b85c"/>
                <rect x="4" y="10" width="32" height="7" rx="3.5" fill="#d9a548"/>
                <rect x="14" y="21" width="12" height="8" rx="2" fill="#151210" opacity="0.75"/>
                <!-- body -->
                <path d="M14 56C14 42 26 38 40 38L66 40L72 56L56 60L28 60Z" fill="#f26b3a"/>
                <path d="M74 58L80 28L92 28L90 58Z" fill="#f26b3a"/>
                <rect x="48" y="55" width="30" height="6" rx="3" fill="#2a2420"/>
                <rect x="26" y="34" width="34" height="7" rx="3.5" fill="#2a2420"/>
                <!-- fork, handlebar, headlight -->
                <path d="M90 34L98 62" stroke="#2a2420" stroke-width="4" stroke-linecap="round"/>
                <path d="M88 30L86 20L95 19" fill="none" stroke="#2a2420" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                <circle cx="97" cy="32" r="4" fill="#ffd889"/>
                <!-- rider -->
                <path d="M46 38L66 46L70 60" fill="none" stroke="#151210" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M48 38L60 22" stroke="#3a2e28" stroke-width="11" stroke-linecap="round"/>
                <path d="M60 22L86 21" stroke="#3a2e28" stroke-width="5" stroke-linecap="round"/>
                <circle cx="62" cy="12" r="8" fill="#fffaf5"/>
                <rect x="63" y="8" width="9" height="6" rx="3" fill="#151210" opacity="0.8"/>
                <!-- wheels -->
                <g class="tk-wheel"><circle cx="28" cy="62" r="13" fill="#1b1512"/><circle cx="28" cy="62" r="7" fill="#8a7f77"/><path d="M28 55v14M21 62h14M23 57l10 10M33 57l-10 10" stroke="#1b1512" stroke-width="1.4"/><circle cx="28" cy="62" r="2.5" fill="#1b1512"/></g>
                <g class="tk-wheel"><circle cx="98" cy="62" r="13" fill="#1b1512"/><circle cx="98" cy="62" r="7" fill="#8a7f77"/><path d="M98 55v14M91 62h14M93 57l10 10M103 57l-10 10" stroke="#1b1512" stroke-width="1.4"/><circle cx="98" cy="62" r="2.5" fill="#1b1512"/></g>
            </svg>`;

        // Rider starts away from the kitchen
        const riderMarker = L.marker(riderStart, {
            icon: L.divIcon({
                className: 'tk-icon',
                html: `<div class="tk-rider is-idle">
                    <span class="tk-rider-pulse"></span>
                    <div class="tk-rider-flip"><div class="tk-rider-bob">${bikeSvg}</div></div>
                </div>`,
                iconSize: [64, 43], iconAnchor: [32, 37],
            }),
            title: order.rider?.name ? `Rider: ${order.rider.name}` : 'Delivery rider',
            zIndexOffset: 1000,
        }).addTo(map);

        const riderState = riderMarker.getElement()?.querySelector('.tk-rider');
        const riderFlip = riderMarker.getElement()?.querySelector('.tk-rider-flip');

        map.fitBounds(L.latLngBounds([...leg1.points, ...leg2.points]), { padding: [40, 40], maxZoom: 15 });
        setTimeout(() => map.invalidateSize(), 120);
        distanceElement.textContent = leg2.distance ? `~${(leg2.distance / 1000).toFixed(1)} km` : 'Approx. route';
        if (statusElement) statusElement.textContent = 'Rider is heading to the kitchen';

        let facingLeft = false;
        const ease = t => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

        // Builds a function that rides the scooter along one leg
        const makeMover = (points, travelledLine, duration, onFinish) => {
            const lengths = [];
            let total = 0;

            for (let i = 1; i < points.length; i += 1) {
                const len = map.distance(points[i - 1], points[i]);
                lengths.push(len);
                total += len;
            }

            return callback => {
                const startedAt = performance.now();

                riderState?.classList.remove('is-idle');

                const animate = now => {
                    if (!mapElement.isConnected) return;

                    const progress = Math.min((now - startedAt) / duration, 1);
                    let remaining = total * ease(progress);
                    let position = points[points.length - 1];
                    let segIndex = lengths.length - 1;

                    for (let i = 0; i < lengths.length; i += 1) {
                        if (remaining <= lengths[i]) {
                            const f = lengths[i]
                                ? remaining / lengths[i]
                                : 1;

                            position = [
                                points[i][0] +
                                    (points[i + 1][0] - points[i][0]) * f,
                                points[i][1] +
                                    (points[i + 1][1] - points[i][1]) * f
                            ];

                            segIndex = i;
                            break;
                        }

                        remaining -= lengths[i];
                    }

                    const dLng =
                        points[segIndex + 1][1] - points[segIndex][1];

                    if (
                        riderFlip &&
                        Math.abs(dLng) > 1e-6 &&
                        (dLng < 0) !== facingLeft
                    ) {
                        facingLeft = dLng < 0;
                        riderFlip.style.transform = facingLeft
                            ? 'scaleX(-1)'
                            : 'scaleX(1)';
                    }

                    riderMarker.setLatLng(position);

                    // Draw a travelled trail only when a line was supplied.
                    

                    if (progress < 1) {
                        requestAnimationFrame(animate);
                    } else {
                        onFinish?.();
                        callback?.();
                    }
                };

                requestAnimationFrame(animate);
            };
        };

        return {
            // Rider -> kitchen, then park and wait for pickup
            toKitchen: makeMover(leg1.points, null, 15000, () => riderState?.classList.add('is-idle')),
            // Kitchen -> your home, then stop
            toHome: makeMover(leg2.points, null, 30000, () => riderState?.classList.add('is-arrived')),
        };
    } catch (error) {
        console.warn('Real tracking map unavailable.', error);
        mapElement.innerHTML = '<div class="tracking-map-loading">A real map could not be loaded for this order. Check your internet connection and try again.</div>';
        if (statusElement) statusElement.textContent = 'Map unavailable';
        if (distanceElement) distanceElement.textContent = '—';
        return null;
    }
}

function updateOrderTracker(stage) {
    ['trackNode1', 'trackNode2', 'trackNode3', 'trackNode4'].forEach((id, index) => {
        const node = document.getElementById(id);
        if (!node) return;
        const done = index < stage || (stage === 3 && index === 3);
        const active = !done && index === stage;
        node.className = `trk-step${done ? ' done' : active ? ' active' : ''}`;
    });
}

async function startOrderTracking(order) {
    updateOrderTracker(1);
    const setStatus = text => {
        const el = document.getElementById('trackingMapStatus');
        if (el) el.textContent = text;
    };
    const markDelivered = () => {
        updateOrderTracker(3);
        setStatus('Demo delivery complete');
        const eta = document.getElementById('etaTimeDisplay');
        if (eta) eta.textContent = 'Delivered';
    };

    const tracker = await initializeTrackingMap(order);

    // Map failed to load: fall back to simple timed status changes
    if (!tracker) {
        setTimeout(() => { updateOrderTracker(2); setStatus('Your rider is on the way'); }, 9000);
        setTimeout(markDelivered, 42000);
        return;
    }

    setStatus('Rider is heading to the kitchen');
    tracker.toKitchen(() => {
        setStatus('Rider is picking up your order');
        setTimeout(() => {
            updateOrderTracker(2);
            setStatus('Your rider is on the way');
            tracker.toHome(() => {
                setStatus('Your rider has arrived');
                setTimeout(markDelivered, 1500);
            });
        }, 2500);
    });
}

// ==================== HERO SEARCH & BUTTONS ====================
function initDeliveryLocation() {
    const form = document.getElementById('deliveryLocationForm');
    if (!form) return;

    const dialog = document.getElementById('deliveryLocationDialog');
    const pinInput = document.getElementById('deliveryPin');
    const status = document.getElementById('deliveryLocationStatus');
    const currentLabel = document.getElementById('currentDeliveryLocation');
    const submitButton = form.querySelector('[type="submit"]');

    const updateLocationSummary = location => {
        if (!elements.locationSummary) return;
        const name = location?.district || location?.state || location?.pinCode;
        elements.locationSummary.textContent = name || '';
        elements.locationSummary.classList.toggle('visible', Boolean(name));
        if (name) {
            elements.locationSummary.title = `${location.district || ''}${location.district && location.state ? ', ' : ''}${location.state || ''} · ${location.pinCode || ''}`;
        } else {
            elements.locationSummary.removeAttribute('title');
        }
    };

    const positionDialog = () => {
        if (!dialog || !elements.locationBtn) return;
        const buttonRect = elements.locationBtn.getBoundingClientRect();
        const dialogWidth = Math.min(280, window.innerWidth - 32);
        const left = buttonRect.left + (buttonRect.width / 2) - (dialogWidth / 2);
        dialog.style.setProperty('--location-popover-top', `${buttonRect.bottom + 8}px`);
        dialog.style.setProperty(
            '--location-popover-left',
            `${Math.min(Math.max(16, left), window.innerWidth - dialogWidth - 16)}px`
        );
    };

   elements.locationBtn?.addEventListener('click', () => {
    if (!dialog) return;

    if (dialog.open) {
        dialog.close();
        return;
    }

    positionDialog();
    dialog.show();
    pinInput.focus();
});

// Close the dialog when clicking or tapping outside it
document.addEventListener('pointerdown', event => {
    if (
        dialog?.open &&
        !dialog.contains(event.target) &&
        !elements.locationBtn?.contains(event.target)
    ) {
        dialog.close();
    }
});

dialog?.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
});

window.addEventListener('resize', () => {
    if (dialog?.open) positionDialog();
});

try {
    const saved = JSON.parse(
        localStorage.getItem('hungrieeDeliveryLocation') || 'null'
    );

    if (saved?.valid && saved.pinCode) {
        currentLabel.textContent =
            `${saved.district}, ${saved.state} · ${saved.pinCode}`;

        pinInput.value = saved.pinCode;
        status.textContent =
            `Location saved: ${saved.district}, ${saved.state}.`;

        status.dataset.state = 'success';
        updateLocationSummary(saved);
    }
} catch {
    localStorage.removeItem('hungrieeDeliveryLocation');
}

    async function checkLocation(pinCode) {
        submitButton.disabled = true;
        status.dataset.state = '';
        status.textContent = 'Verifying PIN code…';

        try {
            const response = await fetch('/api/check-coverage', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pinCode }),
            });
            const result = await response.json();

            if (!response.ok) throw new Error(result.error || 'Could not check that location.');

            if (result.valid) {
                const saved = {
                    valid: true,
                    pinCode: result.pinCode,
                    district: result.district,
                    state: result.state,
                    officeCount: result.officeCount,
                    latitude: Number.isFinite(result.latitude) ? result.latitude : null,
                    longitude: Number.isFinite(result.longitude) ? result.longitude : null,
                    coordinateSource: result.coordinateSource || 'PIN directory',
                };
                localStorage.setItem('hungrieeDeliveryLocation', JSON.stringify(saved));
                currentLabel.textContent = `${saved.district}, ${saved.state} · ${saved.pinCode}`;
                status.textContent = `Location saved: ${saved.district}, ${saved.state}.`;
                status.dataset.state = 'success';
                updateLocationSummary(saved);
                dialog?.close();
            } else {
                localStorage.removeItem('hungrieeDeliveryLocation');
                currentLabel.textContent = 'No location selected';
                status.textContent = result.message;
                status.dataset.state = 'error';
                updateLocationSummary(null);
            }
        } catch (error) {
            status.textContent = error instanceof TypeError
                ? 'Start the website with “node server.js” to look up PIN codes.'
                : error.message;
            status.dataset.state = 'error';
        } finally {
            submitButton.disabled = false;
        }
    }

    form.addEventListener('submit', event => {
        event.preventDefault();
        checkLocation(pinInput.value.trim());
    });
}

function initHeroSearchAndCtas() {
    // Hero Search
    const heroSearchInput = document.getElementById('heroSearch');
    const heroSearchBtn = document.querySelector('.hero-search .search-btn');

    if (heroSearchInput) {
        const searchPrompts = [
            'Search for biryani, butter chicken, dosa...',
            'Try “Hyderabadi biryani”...',
            'Find your next favorite dish...'
        ];
        let promptIndex = 0;
        let promptPosition = 0;
        let promptTimer = null;
        let promptPaused = false;
        const defaultPrompt = searchPrompts[0];

        const stopPromptAnimation = () => {
            if (promptTimer) {
                clearTimeout(promptTimer);
                promptTimer = null;
            }
        };

        const typePrompt = () => {
            if (promptPaused || heroSearchInput.value) return;

            const prompt = searchPrompts[promptIndex];
            heroSearchInput.placeholder = prompt.slice(0, promptPosition);
            promptPosition += 1;

            if (promptPosition <= prompt.length) {
                promptTimer = setTimeout(typePrompt, 58);
                return;
            }

            promptTimer = setTimeout(() => {
                promptIndex = (promptIndex + 1) % searchPrompts.length;
                promptPosition = 0;
                typePrompt();
            }, 1800);
        };

        const pausePromptAnimation = () => {
            promptPaused = true;
            stopPromptAnimation();
            heroSearchInput.placeholder = searchPrompts[promptIndex];
        };

        const resumePromptAnimation = () => {
            if (heroSearchInput.value) return;
            promptPaused = false;
            promptPosition = 0;
            stopPromptAnimation();
            promptTimer = setTimeout(typePrompt, 450);
        };

        heroSearchInput.addEventListener('focus', pausePromptAnimation);
        heroSearchInput.addEventListener('input', () => {
            if (heroSearchInput.value) {
                promptPaused = true;
                stopPromptAnimation();
                heroSearchInput.placeholder = defaultPrompt;
            } else {
                resumePromptAnimation();
            }
        });
        heroSearchInput.addEventListener('blur', resumePromptAnimation);
        typePrompt();
    }

    const handleSearch = () => {
        const query = (heroSearchInput?.value || '').trim();
        if (window.location.pathname === '/' || window.location.pathname === '/home') {
            const dishesSection = document.getElementById('popularDishes');
            if (dishesSection) {
                dishesSection.scrollIntoView({ behavior: 'smooth' });
                if (query) {
                    renderDishes('all', query);
                    showToast(`Showing results for "${query}"`);
                }
            }
        } else {
            // Navigate to menu with query
            window.location.href = `/menu?search=${encodeURIComponent(query)}`;
        }
    };

    if (heroSearchBtn) {
        heroSearchBtn.addEventListener('click', handleSearch);
    }
    if (heroSearchInput) {
        heroSearchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') handleSearch();
        });
    }

    // Scroll Down indicator
    const scrollIndicator = document.querySelector('.hero-scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const howItWorks = document.getElementById('howItWorks');
            if (howItWorks) howItWorks.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // Navbar "Order Now" buttons
    document.querySelectorAll('.order-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (cart.length > 0) {
                if (elements.cartSidebar) {
                    elements.cartSidebar.classList.add('active');
                    if (elements.cartOverlay) elements.cartOverlay.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            } else {
                const popular = document.getElementById('popularDishes');
                if (popular) {
                    popular.scrollIntoView({ behavior: 'smooth' });
                } else {
                    window.location.href = '/menu';
                }
            }
        });
    });

    // Special Offers Buttons
    const offerCards = document.querySelectorAll('.offer-card');
    if (offerCards.length >= 3) {
        // Card 1: 50% OFF (HUNGRIEE50)
        offerCards[0].querySelector('.offer-btn')?.addEventListener('click', () => {
            activeCoupon = { code: 'HUNGRIEE50', type: 'percent', val: 50 };
            showToast('🎉 Code HUNGRIEE50 copied & applied! Choose dishes below.');
            const popular = document.getElementById('popularDishes');
            if (popular) popular.scrollIntoView({ behavior: 'smooth' });
        });

        // Card 2: Free Delivery
        offerCards[1].querySelector('.offer-btn')?.addEventListener('click', () => {
            showToast('🛵 Free delivery activated on orders above ₹299!');
            const popular = document.getElementById('popularDishes');
            if (popular) popular.scrollIntoView({ behavior: 'smooth' });
        });

        // Card 3: Family Combo Pack
        offerCards[2].querySelector('.offer-btn')?.addEventListener('click', () => {
            addToCart(100, 1);
            if (elements.cartSidebar) {
                elements.cartSidebar.classList.add('active');
                if (elements.cartOverlay) elements.cartOverlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    }
}

// ==================== TESTIMONIALS SLIDER ====================
function initTestimonials() {
    const track = elements.testimonialsTrack;
    const prevBtn = elements.testiPrev;
    const nextBtn = elements.testiNext;
    const dotsContainer = elements.testiDots;

    if (!track || !prevBtn || !nextBtn || !dotsContainer) return;

    const cards = track.querySelectorAll('.testimonial-card');
    let currentIndex = 0;
    const total = cards.length;

    dotsContainer.innerHTML = '';
    for (let i = 0; i < total; i++) {
        const dot = document.createElement('div');
        dot.className = `testi-dot ${i === 0 ? 'active' : ''}`;
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    }

    function goToSlide(index) {
        currentIndex = index;
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        document.querySelectorAll('.testi-dot').forEach((d, i) => {
            d.classList.toggle('active', i === currentIndex);
        });
    }

    prevBtn.addEventListener('click', () => {
        goToSlide(currentIndex === 0 ? total - 1 : currentIndex - 1);
    });

    nextBtn.addEventListener('click', () => {
        goToSlide(currentIndex === total - 1 ? 0 : currentIndex + 1);
    });

    setInterval(() => {
        goToSlide(currentIndex === total - 1 ? 0 : currentIndex + 1);
    }, 5500);
}

// ==================== PARALLAX EFFECTS ====================
function initParallax() {
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        const heroVisual = document.querySelector('.hero-visual');
        if (heroVisual) {
            heroVisual.style.transform = `translateY(${scrollY * 0.08}px)`;
        }

        document.querySelectorAll('.floating-element').forEach((el, i) => {
            const speed = 0.02 + (i * 0.01);
            el.style.transform = `translateY(${scrollY * speed}px)`;
        });

        const orb1 = document.querySelector('.orb-1');
        const orb2 = document.querySelector('.orb-2');
        if (orb1) orb1.style.transform = `translate(${scrollY * 0.03}px, ${scrollY * 0.05}px)`;
        if (orb2) orb2.style.transform = `translate(-${scrollY * 0.02}px, -${scrollY * 0.03}px)`;
    });
}

function randomizeHeroFoodAccents() {
    const accents = [...document.querySelectorAll('.hero-bg-elements .floating-element')];
    if (!accents.length) return;

    const randomBetween = (min, max) => Math.round(min + Math.random() * (max - min));
    const foodEmojis = ['🍛', '🥟', '🌶️', '🫓', '🍜', '🥭', '🍣', '🍕', '🍔', '🥘', '🍢', '🧆'];
    const shuffledEmojis = [...foodEmojis].sort(() => Math.random() - 0.5);
    const setPosition = (element, position) => {
        element.style.top = position.top ? `${position.top}%` : 'auto';
        element.style.right = position.right ? `${position.right}%` : 'auto';
        element.style.bottom = position.bottom ? `${position.bottom}%` : 'auto';
        element.style.left = position.left ? `${position.left}%` : 'auto';
    };

    accents.forEach((accent, index) => {
        accent.dataset.emoji = shuffledEmojis[index];
    });

    if (window.matchMedia('(max-width: 680px)').matches) {
        const lowerOnLeft = Math.random() > 0.5;

        setPosition(accents[0], {
            top: randomBetween(5, 9),
            left: null,
            right: randomBetween(4, 12)
        });
        setPosition(accents[3], {
            top: randomBetween(95, 99),
            left: lowerOnLeft ? randomBetween(3, 12) : null,
            right: lowerOnLeft ? null : randomBetween(3, 12)
        });
        return;
    }

    const positions = [
        { top: randomBetween(11, 18), left: randomBetween(4, 10) },
        { bottom: randomBetween(17, 25), left: randomBetween(6, 13) },
        { top: randomBetween(12, 20), right: randomBetween(6, 12) },
        { bottom: randomBetween(21, 29), right: randomBetween(4, 10) },
        { top: randomBetween(33, 43), right: randomBetween(27, 35) },
        { bottom: randomBetween(20, 29), right: randomBetween(25, 33) }
    ];

    accents.forEach((accent, index) => setPosition(accent, positions[index]));
}

// ==================== SMOOTH REVEAL ON SCROLL ====================
function initSmoothReveal() {
    const dishObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.dish-card').forEach(card => {
        card.style.animationPlayState = 'paused';
        dishObserver.observe(card);
    });
}

// ==================== TILT EFFECT ON CARDS ====================
function initTiltEffect() {
    document.querySelectorAll('.step-card, .offer-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
}

// ==================== MAGNETIC BUTTON EFFECT ====================
function initMagneticButtons() {
    document.querySelectorAll('.order-btn, .search-btn, .btn-primary').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });
}

function initNavAuthStatus() {
    try {
        const session = localStorage.getItem('hungrieeSession');
        const user = JSON.parse(localStorage.getItem('hungrieeUser') || 'null');
        const profileBtn = document.getElementById('profileNavBtn');
        if (profileBtn) {
            if (session && user) {
                profileBtn.classList.add('logged-in');
                profileBtn.setAttribute('title', `${user.name} — My Account`);
                profileBtn.setAttribute('aria-label', `${user.name} — My Account`);
            } else {
                profileBtn.classList.remove('logged-in');
                profileBtn.setAttribute('title', 'Sign In / Account');
                profileBtn.setAttribute('aria-label', 'Sign In / Account');
            }
        }
    } catch {}
}

// ==================== INITIALIZE EVERYTHING ====================
document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initHomeLocationSummary();
    initDeliveryLocation();
    initScrollAnimations();
    renderDishes();
    initDishFilters();
    initCart();
    if (new URLSearchParams(window.location.search).get('checkout') === '1') {
        history.replaceState({}, '', window.location.pathname);

        setTimeout(() => {
            elements.checkoutBtn?.click();
        }, 300);
    }
    initHeroSearchAndCtas();
    initTestimonials();
    randomizeHeroFoodAccents();
    initParallax();
    initStatCounters();
    initTiltEffect();
    initMagneticButtons();
    ensureModalsExist();
    initNavAuthStatus();

    setTimeout(initSmoothReveal, 400);
});
