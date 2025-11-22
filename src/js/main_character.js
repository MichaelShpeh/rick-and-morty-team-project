console.log('main_character.js');

const characterImage = document.querySelector('.main-characters__image');
const figure = document.querySelector('.main-characters__figure');
const items = document.querySelectorAll('.main-characters__item');

// Функція визначення планшету
function isTablet() {
  return window.matchMedia('(min-width: 768px)').matches;
}

// Конфіг: фото для мобілки і планшета, фон, розміри
const charactersConfig = {
  rick: {
    imageMobile: new URL('../images/rick-smart-1x.jpg', import.meta.url).href,
    imageTablet: new URL('../images/rick-tablet-1x.jpg', import.meta.url).href,
    bg: 'var(--green)',
    width: '205px',
    height: '308px',
    tabletWidth: '395px',
    tabletHeight: '627px',
  },

  morty: {
    imageMobile: new URL('../images/morty-smart-1x.jpg', import.meta.url).href,
    imageTablet: new URL('../images/morty-tablet-1x.jpg', import.meta.url).href,
    bg: '#0d171d',
    width: '113px',
    height: '279px',
    tabletWidth: '220px',
    tabletHeight: '565px',
  },

  summer: {
    imageMobile: new URL('../images/summer-smart-1x.jpg', import.meta.url).href,
    imageTablet: new URL('../images/summer-tablet-1x.jpg', import.meta.url).href,
    bg: '#daf836',
    width: '80px',
    height: '295px',
    tabletWidth: '152px',
    tabletHeight: '560px',
  },

  beth: {
    imageMobile: new URL('../images/bet-smart-1x.jpg', import.meta.url).href,
    imageTablet: new URL('../images/bet-tablet-1x.jpg', import.meta.url).href,
    bg: '#a1d737',
    width: '81px',
    height: '291px',
    tabletWidth: '150px',
    tabletHeight: '537px',
  },

  jerry: {
    imageMobile: new URL('../images/jerry-smart-1x.jpg', import.meta.url).href,
    imageTablet: new URL('../images/jerry-tablet-1x.jpg', import.meta.url).href,
    bg: '#0d171d',
    width: '78px',
    height: '287px',
    tabletWidth: '148px',
    tabletHeight: '537px',
  },
};

// Хелпер: оновити картинку + розміри для конкретного персонажа
function updateCharacterView(cfg) {
  if (!cfg) return;

  const src = isTablet() && cfg.imageTablet ? cfg.imageTablet : cfg.imageMobile;
  characterImage.src = src;
  figure.style.backgroundColor = cfg.bg;

  if (isTablet()) {
    characterImage.style.width = cfg.tabletWidth;
    characterImage.style.height = cfg.tabletHeight;
  } else {
    characterImage.style.width = cfg.width;
    characterImage.style.height = cfg.height;
  }
}

// Стартовий стан
const activeItem = document.querySelector('.main-characters__item--active');
if (activeItem) {
  const key = activeItem.dataset.character;
  const cfg = charactersConfig[key];
  updateCharacterView(cfg);
}

// Обробники кліку
items.forEach((item) => {
  item.addEventListener('click', () => {
    const currentActive = document.querySelector('.main-characters__item--active');
    if (currentActive) {
      currentActive.classList.remove('main-characters__item--active');
    }
    item.classList.add('main-characters__item--active');

    const key = item.dataset.character;
    const cfg = charactersConfig[key];
    updateCharacterView(cfg);
  });
});

// (опційно) якщо хочеш, щоб при ресайзі вікна
// з мобілки на планшет/десктоп теж підтягувались інші картинки/розміри:
window.addEventListener('resize', () => {
  const active = document.querySelector('.main-characters__item--active');
  if (!active) return;
  const key = active.dataset.character;
  const cfg = charactersConfig[key];
  updateCharacterView(cfg);
});
