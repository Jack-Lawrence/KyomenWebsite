/* --- NAVIGATION & SCROLLING --- */

document.querySelectorAll('a[href="#home"]').forEach(function(el) {
    el.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});

const navToggle = document.querySelector('.nav-toggle');
const floatingNav = document.querySelector('.floating-nav');
const navLinks = document.querySelectorAll('.nav-left a, .visit-btn');

navToggle.addEventListener('click', () => {
    floatingNav.classList.toggle('open');
    const icon = navToggle.querySelector('i');
    if (floatingNav.classList.contains('open')) {
        icon.classList.replace('fa-bars', 'fa-xmark');
    } else {
        icon.classList.replace('fa-xmark', 'fa-bars');
    }
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            floatingNav.classList.remove('open');
            navToggle.querySelector('i').classList.replace('fa-xmark', 'fa-bars');
        }
    });
});

/* --- MEDIA GALLERY & MODAL --- */

(function() {
    const IMAGES = Array.from({
        length: 28
    }).map((_, i) => ({
        src: 'images/kyomen.jpg',
        alt: 'Media image ' + (i + 1)
    }));

    function getPageSize() {
        return window.innerWidth <= 1024 ? 3 : 4;
    }

    let pageSize = getPageSize();
    const grid = document.querySelector('.media-grid');
    const leftBtn = document.querySelector('.carousel-btn.left');
    const rightBtn = document.querySelector('.carousel-btn.right');
    const dotsContainer = document.querySelector('.carousel-dots');
    let currentPage = 0;

    function renderPage() {
        grid.innerHTML = '';
        const start = currentPage * pageSize;
        const pageItems = IMAGES.slice(start, start + pageSize);
        pageItems.forEach((img, idx) => {
            const globalIndex = start + idx;
            const item = document.createElement('div');
            item.className = 'media-item';
            item.innerHTML = `<img src="${img.src}" alt="${img.alt}" data-index="${globalIndex}" />`;
            item.querySelector('img').addEventListener('click', () => openModal(globalIndex));
            grid.appendChild(item);
        });
        updateDots();
    }

    function updateDots() {
        dotsContainer.innerHTML = '';
        const numPages = Math.ceil(IMAGES.length / pageSize);
        for (let i = 0; i < numPages; i++) {
            const dot = document.createElement('button');
            dot.className = 'carousel-dot' + (i === currentPage ? ' active' : '');
            dot.addEventListener('click', () => {
                currentPage = i;
                renderPage();
            });
            dotsContainer.appendChild(dot);
        }
    }

    window.addEventListener('resize', () => {
        const newSize = getPageSize();
        if (newSize !== pageSize) {
            pageSize = newSize;
            currentPage = 0;
            renderPage();
        }
    });

    leftBtn.addEventListener('click', () => {
        currentPage = (currentPage - 1 + Math.ceil(IMAGES.length / pageSize)) % Math.ceil(IMAGES.length / pageSize);
        renderPage();
    });

    rightBtn.addEventListener('click', () => {
        currentPage = (currentPage + 1) % Math.ceil(IMAGES.length / pageSize);
        renderPage();
    });

    const modal = document.createElement('div');
    modal.className = 'media-modal';
    modal.innerHTML = `
    <div class="modal-inner">
      <button class="modal-close" aria-label="Close">&times;</button>
      <button class="modal-prev" aria-label="Previous"><i class="fa-solid fa-chevron-left"></i></button>
      <div class="modal-content">
        <img class="modal-img" src="" alt="" />
        <div class="modal-caption"></div>
      </div>
      <button class="modal-next" aria-label="Next"><i class="fa-solid fa-chevron-right"></i></button>
    </div>`;
    document.body.appendChild(modal);

    const modalImg = modal.querySelector('.modal-img');
    const modalCaption = modal.querySelector('.modal-caption');
    const modalClose = modal.querySelector('.modal-close');
    const modalPrev = modal.querySelector('.modal-prev');
    const modalNext = modal.querySelector('.modal-next');
    let modalIndex = 0;

    function openModal(index) {
        modalIndex = index;
        updateModal();
        modal.classList.add('open');
    }

    function closeModal() {
        modal.classList.remove('open');
    }

    function updateModal() {
        const data = IMAGES[modalIndex];
        modalImg.src = data.src;
        modalImg.alt = data.alt;
        modalCaption.textContent = `${modalIndex + 1}/${IMAGES.length}`;
    }

    modalClose.addEventListener('click', closeModal);

    modalPrev.addEventListener('click', () => {
        modalIndex = (modalIndex - 1 + IMAGES.length) % IMAGES.length;
        updateModal();
    });

    modalNext.addEventListener('click', () => {
        modalIndex = (modalIndex + 1) % IMAGES.length;
        updateModal();
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    window.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('open')) return;
        if (e.key === 'ArrowLeft') modalPrev.click();
        if (e.key === 'ArrowRight') modalNext.click();
        if (e.key === 'Escape') closeModal();
    });

    renderPage();
})();

/* --- BLOG & FEATURES LOGIC --- */

const blogItems = document.querySelectorAll('.blog-item');

blogItems.forEach(item => {
    item.addEventListener('click', () => {
        item.classList.toggle('expanded');
    });
});

(function() {
    const featuresList = document.querySelector('.features');
    if (!featuresList) return;
    const items = featuresList.querySelectorAll('li');
    if (items.length === 0) return;

    items[0].classList.add('active');

    featuresList.addEventListener('click', () => {
        if (window.innerWidth <= 900) {
            let activeIndex = -1;
            items.forEach((item, index) => {
                if (item.classList.contains('active')) {
                    activeIndex = index;
                    item.classList.remove('active');
                }
            });

            const nextIndex = (activeIndex + 1) % items.length;
            items[nextIndex].classList.add('active');
        }
    });
})();