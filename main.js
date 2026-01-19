const teamMembers = [
  {
    id: 1,
    nombre: 'Carlos Mauricio Valadez Espinoza',
    info: 'Estudiante de Desarrollo Web, enfocado en frontend.',
    lenguajes: [
      'Lenguajes de Programación',
      'HTML',
      'CSS',
      'JavaScript',
      'React'
    ],
    facebook: 'https://www.facebook.com/MauricioValadezEspinoza/',
    instagram: 'https://www.instagram.com/mau22_ve/',
    github: '',
    linkedin: '',
    imagen: null
  },
  {
    id: 2,
    nombre: 'Jose Angel Cambranis',
    info: 'Desarrollador web Full Stack',
    lenguajes: [
      'Lenguajes de Programación',
      'Python',
      'C',
      'JavaScript',
      'TypeScript',
      'Kotlin',
      'Bases de Datos',
      'MySQL',
      'SQL Server',
      'Entornos y Dependencias',
      'Composer',
      'XAMPP',
      'Docker',
      'Git',
      'Maquetación y Diseño Web',
      'HTML5',
      'CSS3',
      'Bootstrap',
      'SweetAlert2'
    ],
    facebook: '',
    instagram: '',
    github: 'https://github.com/Jose-Angel-Sanchez',
    linkedin: '',
    imagen: null
  },
  {
    id: 3,
    nombre: 'Angel Desiderio Hernandez Sanchez',
    info: 'Integrante del equipo',
    lenguajes: [
      'Lenguajes de Programación',

      'Bases de Datos',
      
      'Entornos y Dependencias',
     
      'Maquetación y Diseño Web',
     
    ],
    facebook: '',
    instagram: '',
    github: '',
    linkedin: '',
    imagen: null
  },
  {
    id: 4,
    nombre: 'Gonzalo Montiel Santos',
    info: 'Estudiante de Desarrollo Web',
     lenguajes: [
      'Lenguajes de Programación',
      'Python',
      'C',
      'JavaScript'

    
    ],
    facebook: '',
    instagram: 'https://www.instagram.com/gonza_2508/',
    github: 'https://github.com/gonza1701',
    linkedin: '',
    imagen: null
  },
  {
    id: 5,
    nombre: 'Carlo Oswaldo Lopez Rojas',
    info: 'Estudiante de desarrollo web',
     lenguajes: [
      'Lenguajes de Programación',
      'Java', 'C++', 'Python',

      'Bases de Datos',
      
      'Entornos y Dependencias',
     
      'Maquetación y Diseño Web',
     
    ],
    facebook: '',
    instagram: 'https://www.instagram.com/carlo_rojz/',
    github: 'https://github.com/car-roj',
    linkedin: '',
    imagen: null
  }
];

const links = [
  { name: 'Stack Overflow', url: 'https://stackoverflow.com' },
  { name: 'MDN', url: 'https://mdn.org' },
  { name: 'GitHub', url: 'https://github.com' },
  { name: 'CodePen', url: 'https://codepen.io' },
  { name: 'Dev.to', url: 'https://dev.to' },
  { name: 'Hashnode', url: 'https://hashnode.com' },
  { name: 'CSS-Tricks', url: 'https://css-tricks.com' },
  { name: 'Smashing Magazine', url: 'https://smashingmagazine.com' },
  { name: 'FreeCodeCamp', url: 'https://freecodecamp.org' },
  { name: 'Udemy', url: 'https://udemy.com' },
  { name: 'Coursera', url: 'https://coursera.org' },
  { name: 'Frontend Masters', url: 'https://frontendmasters.com' },
  { name: 'Secretaría Académica BUAP', url: 'https://secreacademica.cs.buap.mx/' },
  { name: 'WebDevWorld', url: 'https://webdevworld.org' }
];

const modal = document.getElementById('modal');
const closeBtn = document.getElementById('closeModal');
const chromaGridEl = document.getElementById('chromaGrid');
const carouselTrack = document.getElementById('carouselTrack');
const btnBienvenida = document.getElementById('btnBienvenida');
const toastContainer = document.getElementById('toastContainer');
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

function initLiquidBackground() {
  const canvas = document.getElementById('floatingLinesCanvas');
  
  const checkLiquidBackground = setInterval(() => {
    if (typeof window.LiquidBackground !== 'undefined') {
      clearInterval(checkLiquidBackground);
      
      try {
        const app = window.LiquidBackground(canvas);
        window.liquidApp = app;
        
        if (app.liquidPlane && app.liquidPlane.material) {
          app.liquidPlane.material.metalness = 0.5;
          app.liquidPlane.material.roughness = 0.4;
        }
        
        if (app.liquidPlane && app.liquidPlane.uniforms && app.liquidPlane.uniforms.displacementScale) {
          app.liquidPlane.uniforms.displacementScale.value = 3;
        }
        
        if (app.setRain) {
          app.setRain(false);
        }

        if (app.renderer && app.renderer.setClearColor) {
          app.renderer.setClearColor(0xf8f9fc, 1);
        }
      } catch (error) {
        console.error('Error al inicializar LiquidBackground:', error);

        try {
          const ctx = canvas.getContext('2d');
          if (ctx) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            ctx.fillStyle = '#f8f9fc';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }
        } catch (e) {
        }
      }
    }
  }, 100);
}

function initCarousel() {
  const track = document.getElementById('carouselTrack');
  const carousel = document.querySelector('.infinite-carousel');
  
  const allLinks = [...links, ...links, ...links];
  
  track.innerHTML = allLinks.map(link => `
    <div class="carousel-item">
      <a href="${link.url}" target="_blank" rel="noopener noreferrer">
        ${link.name}
      </a>
    </div>
  `).join('');

  carousel.addEventListener('wheel', (e) => {
    e.preventDefault();
    carousel.scrollLeft += e.deltaY * 2;
  });
}

function groupTecnologiesByCategory(lenguajes) {
  const categories = [];
  let currentCategory = { name: '', items: [] };

  lenguajes.forEach((lang) => {
    const isCategory = lang.includes('Lenguajes') || lang.includes('Bases') || lang.includes('Entornos') || lang.includes('Maquetación');
    if (isCategory) {
      if (currentCategory.items.length > 0) {
        categories.push(currentCategory);
      }
      currentCategory = { name: lang, items: [] };
    } else {
      currentCategory.items.push(lang);
    }
  });

  if (currentCategory.items.length > 0) {
    categories.push(currentCategory);
  }

  return categories;
}

function createSocialIcon(type) {
  const icons = {
    facebook: `<svg class="social-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 2h-3a6 6 0 0 0-6 6v3H7v4h3v8h4v-8h3l1-4h-4V8a2 2 0 0 1 2-2h1z"></path></svg>`,
    instagram: `<svg class="social-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><circle cx="17.5" cy="6.5" r="1.5"></circle></svg>`,
    github: `<svg class="social-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>`,
    linkedin: `<svg class="social-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"></path><circle cx="4" cy="4" r="2"></circle></svg>`
  };
  return icons[type] || '';
}

function renderChromaGrid() {
  chromaGridEl.innerHTML = teamMembers.map(member => `
    <div class="chroma-grid-item" data-member-id="${member.id}">
      <div class="chroma-card">
        <div class="card-image">
          ${member.imagen ? `<img src="${member.imagen}" alt="${member.nombre}" class="profile-image">` : `
            <svg class="default-profile-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          `}
        </div>
        <div class="card-content">
          <div>
            <h3>${member.nombre}</h3>
            <p class="subtitle">${member.info}</p>
          </div>
          ${(member.facebook || member.instagram || member.github || member.linkedin) ? `
            <div class="social-links">
              ${member.facebook ? `<a href="${member.facebook}" target="_blank" rel="noopener noreferrer" class="social-btn" title="Facebook">${createSocialIcon('facebook')}</a>` : ''}
              ${member.instagram ? `<a href="${member.instagram}" target="_blank" rel="noopener noreferrer" class="social-btn" title="Instagram">${createSocialIcon('instagram')}</a>` : ''}
              ${member.github ? `<a href="${member.github}" target="_blank" rel="noopener noreferrer" class="social-btn" title="GitHub">${createSocialIcon('github')}</a>` : ''}
              ${member.linkedin ? `<a href="${member.linkedin}" target="_blank" rel="noopener noreferrer" class="social-btn" title="LinkedIn">${createSocialIcon('linkedin')}</a>` : ''}
            </div>
          ` : ''}
        </div>
      </div>
    </div>
  `).join('');

  document.querySelectorAll('.chroma-grid-item').forEach(item => {
    item.addEventListener('click', () => {
      const memberId = parseInt(item.dataset.memberId);
      const member = teamMembers.find(m => m.id === memberId);
      if (member) showModal(member);
    });
  });
}

let selectedCategoryIdx = null;

function showModal(member) {
  const categories = member.lenguajes.length > 0 ? groupTecnologiesByCategory(member.lenguajes) : [];
  selectedCategoryIdx = null;

  document.getElementById('modalTitulo').textContent = member.nombre;
  document.getElementById('modalTexto').textContent = member.info;

  const modalImage = document.getElementById('modalImage');
  const modalIcon = document.getElementById('modalDefaultIcon');
  if (member.imagen) {
    modalImage.src = member.imagen;
    modalImage.style.display = 'block';
    modalIcon.style.display = 'none';
  } else {
    modalImage.style.display = 'none';
    modalIcon.style.display = 'block';
  }

  const modalLenguajes = document.getElementById('modalLenguajes');
  if (categories.length > 0) {
    modalLenguajes.style.display = 'block';

    const techTabs = document.getElementById('techTabs');
    techTabs.innerHTML = categories.map((cat, idx) => `
      <div class="tech-category">
        <button class="tech-tab" data-cat-idx="${idx}">
          ${cat.name}
        </button>
        <div class="tech-items" data-cat-idx="${idx}" style="display: none;">
          ${cat.items.map(item => `<div class="tech-item">${item}</div>`).join('')}
        </div>
      </div>
    `).join('');

    techTabs.querySelectorAll('.tech-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        const idx = tab.dataset.catIdx;
        const itemsContainer = techTabs.querySelector(`[data-cat-idx="${idx}"].tech-items`);

        techTabs.querySelectorAll('.tech-items').forEach(items => {
          if (items.dataset.catIdx !== idx) {
            items.style.display = 'none';
          }
        });
        
        if (itemsContainer.style.display === 'none') {
          itemsContainer.style.display = 'block';
          tab.classList.add('active');
        } else {
          itemsContainer.style.display = 'none';
          tab.classList.remove('active');
        }
      });
    });
  } else {
    modalLenguajes.style.display = 'none';
  }

  const modalRedes = document.getElementById('modalRedes');
  const socials = [];
  if (member.facebook) socials.push({ name: 'facebook', url: member.facebook });
  if (member.instagram) socials.push({ name: 'instagram', url: member.instagram });
  if (member.github) socials.push({ name: 'github', url: member.github });
  if (member.linkedin) socials.push({ name: 'linkedin', url: member.linkedin });

  modalRedes.innerHTML = socials.map(social => `
    <a href="${social.url}" target="_blank" rel="noopener noreferrer" class="social-link" title="${social.name}">
      ${createSocialIcon(social.name)}
    </a>
  `).join('');

  modal.classList.add('show');
}

function closeModal() {
  modal.classList.remove('show');
  selectedCategoryIdx = null;
}

function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 4000);
}

function setupAutoClicksForMobile() {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  if (isMobile) {
    const canvas = document.getElementById('floatingLinesCanvas');
    
    setInterval(() => {
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;

      const clickEvent = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true,
        clientX: x,
        clientY: y
      });
      
      canvas.dispatchEvent(clickEvent);
    }, 4000); 
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initCarousel();
  renderChromaGrid();
  setupAutoClicksForMobile();
  initLiquidBackground();
  initLiteYouTube();
  
  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  let welcomeToastActive = false;
  btnBienvenida.addEventListener('click', () => {
    if (!welcomeToastActive) {
      welcomeToastActive = true;
      showToast('¡Bienvenido a la materia Desarrollo de aplicaciones Web');
      setTimeout(() => {
        welcomeToastActive = false;
      }, 4000);
    }
  });
});

function initLiteYouTube() {
  const liteEls = document.querySelectorAll('.lite-yt');
  liteEls.forEach((el) => {
    const id = el.getAttribute('data-ytid');
    const thumbUrl = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

    const thumb = document.createElement('div');
    thumb.className = 'yt-thumb';
    thumb.style.backgroundImage = `url(${thumbUrl})`;
    el.appendChild(thumb);

    const play = document.createElement('div');
    play.className = 'yt-play';
    el.appendChild(play);

    el.addEventListener('click', () => {
      const iframe = document.createElement('iframe');
      iframe.width = '560';
      iframe.height = '315';
      iframe.src = `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
      iframe.title = 'YouTube video player';
      iframe.frameBorder = '0';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      iframe.allowFullscreen = true;

      el.innerHTML = '';
      el.appendChild(iframe);
    }, { once: true });
  });
}
