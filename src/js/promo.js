console.log('promo.js');

const imagesConfig = [
  { selector: '.RickAndMortyUsingAfuturisticDevice', src: new URL('../images/RickAndMortyUsingAfuturisticDevice-1x.png', import.meta.url).href },
  { selector: '.ricAndMorty', src: new URL('../images/ricAndMorty-1x.png', import.meta.url).href },
  { selector: '.ricAndMortyAndBabochka', src: new URL('../images/ricAndMortyAndBabochka-1x.png', import.meta.url).href },
  { selector: '.RicAndBethAndJerry', src: new URL('../images/RicAndBethAndJerry-1x.png', import.meta.url).href },
  { selector: '.MortyAndSummerInSpace', src: new URL('../images/MortyAndSummerInSpace-1x.png', import.meta.url).href },
];

// ==== ПІДСТАНОВКА КАРТИНОК ====
imagesConfig.forEach(({ selector, src }) => {
  const img = document.querySelector(selector);
  if (!img) return;
  img.src = src;
});

// ==== СЛАЙДЕР ====
const slider = document.querySelector('[data-rnm-slider="auto"]');

if (!slider) {
  console.warn('Slider not found');
} else {
  const track = slider.querySelector('.rnm-promo__slider--track');
  const slides = Array.from(track.querySelectorAll('.rnm-slider__slide'));

  if (!track || slides.length === 0) {
    console.warn('No track or slides found');
  } else {
    let currentIndex = 0;
    let direction = 1;

    const isMobile = () => window.innerWidth < 768;
    const isTablet = () => window.innerWidth >= 768 && window.innerWidth < 1200;
    const isDesktop = () => window.innerWidth >= 1200 && window.innerWidth <= 1440;

    function getSlideMetrics() {
      const slide = slides[0];
      const slideWidth = slide.clientWidth;
      const gap = parseFloat(getComputedStyle(slide).marginRight) || 0;
      return { slideWidth, gap, total: slideWidth + gap };
    }

    function updateSliderPosition() {
      if (isMobile()) {
        // === МОБІЛКА: 0.5 – 1 – 0.5, центримо активний слайд ===
        const { slideWidth, gap } = getSlideMetrics();
        const sliderWidth = slider.clientWidth;

        const leftEdgeOfCurrent = (slideWidth + gap) * currentIndex;
        const centerOffset = (sliderWidth - slideWidth) / 2;

        const offset = -leftEdgeOfCurrent + centerOffset;
        track.style.transform = `translateX(${offset}px)`;
      } else if (isTablet()) {
        // === TABLET: 3 слайди на ширину ===
        const visibleSlides = 3;
        const slideWidth = slider.clientWidth / visibleSlides;
        const offset = -currentIndex * slideWidth;
        track.style.transform = `translateX(${offset}px)`;
      } else if (isDesktop()) {
        // === DESKTOP: ряд як на скріні, їде просто вліво ===
        const { total } = getSlideMetrics();
        const offset = -(total * currentIndex);
        track.style.transform = `translateX(${offset}px)`;
      } else {
        // >1440px – поведінка як desktop (можеш змінити, якщо треба інше)
        const { total } = getSlideMetrics();
        const offset = -(total * currentIndex);
        track.style.transform = `translateX(${offset}px)`;
      }
    }

    function stepSlider() {
      let maxIndex = 0;

      if (isMobile()) {
        maxIndex = slides.length - 1;
      } else if (isTablet()) {
        const visibleSlides = 3;
        maxIndex = Math.max(slides.length - visibleSlides, 0);
      } else if (isDesktop()) {
        // рахуємо скільки слайдів реально влазить у вікно
        const { total } = getSlideMetrics();
        const visibleSlidesDesktop =
          Math.max(Math.floor(slider.clientWidth / total), 1);
        maxIndex = Math.max(slides.length - visibleSlidesDesktop, 0);
      } else {
        const { total } = getSlideMetrics();
        const visibleSlidesDesktop =
          Math.max(Math.floor(slider.clientWidth / total), 1);
        maxIndex = Math.max(slides.length - visibleSlidesDesktop, 0);
      }

      if (direction === 1) {
        if (currentIndex >= maxIndex) {
          direction = -1;
          currentIndex = Math.max(currentIndex - 1, 0);
        } else {
          currentIndex++;
        }
      } else {
        if (currentIndex <= 0) {
          direction = 1;
          currentIndex = Math.min(currentIndex + 1, maxIndex);
        } else {
          currentIndex--;
        }
      }

      updateSliderPosition();
    }

    // стартова позиція
    updateSliderPosition();

    // автоплей
    setInterval(stepSlider, 5000);

    // адаптація при зміні ширини
    window.addEventListener('resize', () => {
      let maxIndex;

      if (isMobile()) {
        maxIndex = slides.length - 1;
      } else if (isTablet()) {
        const visibleSlides = 3;
        maxIndex = Math.max(slides.length - visibleSlides, 0);
      } else {
        const { total } = getSlideMetrics();
        const visibleSlidesDesktop =
          Math.max(Math.floor(slider.clientWidth / total), 1);
        maxIndex = Math.max(slides.length - visibleSlidesDesktop, 0);
      }

      if (currentIndex > maxIndex) currentIndex = maxIndex;
      updateSliderPosition();
    });
  }
}
