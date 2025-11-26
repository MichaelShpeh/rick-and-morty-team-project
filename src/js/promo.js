console.log('promo.js');

// ===== ПІДСТАНОВКА КАРТИНОК =====

const imagesConfig = [
  { selector: '.RickAndMortyUsingAfuturisticDevice', src: new URL('../images/RickAndMortyUsingAfuturisticDevice-1x.png', import.meta.url).href },
  { selector: '.ricAndMorty', src: new URL('../images/ricAndMorty-1x.png', import.meta.url).href },
  { selector: '.ricAndMortyAndBabochka', src: new URL('../images/ricAndMortyAndBabochka-1x.png', import.meta.url).href },
  { selector: '.RicAndBethAndJerry', src: new URL('../images/RicAndBethAndJerry-1x.png', import.meta.url).href },
  { selector: '.MortyAndSummerInSpace', src: new URL('../images/MortyAndSummerInSpace-1x.png', import.meta.url).href },
];

imagesConfig.forEach(({ selector, src }) => {
  const img = document.querySelector(selector);
  if (!img) return;
  img.src = src;
});

// ===== СЛАЙДЕР =====

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

    const isDesktop = () => window.innerWidth >= 768;

    function updateSliderPosition() {
      if (isDesktop()) {
        // desktop / tablet: 3 слайди в ряд
        const visibleSlides = 3;
        const slideWidth = slider.clientWidth / visibleSlides;
        const offset = -currentIndex * slideWidth;
        track.style.transform = `translateX(${offset}px)`;
      } else {
        // mobile: центруємо активний слайд, сусіди обрізані (0.5 / 1 / 0.5)
        const slide = slides[0];
        const slideWidth = slide.clientWidth;
        const gap =
          parseFloat(getComputedStyle(slide).marginRight) || 0;
        const sliderWidth = slider.clientWidth;

        const leftEdgeOfCurrent = (slideWidth + gap) * currentIndex;
        const centerOffset = (sliderWidth - slideWidth) / 2;

        const offset = -leftEdgeOfCurrent + centerOffset;
        track.style.transform = `translateX(${offset}px)`;
      }
    }

    function goNext() {
      if (isDesktop()) {
        const visibleSlides = 3;
        const maxIndex = slides.length - visibleSlides;
        currentIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;
      } else {
        const maxIndex = slides.length - 1;
        currentIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;
      }
      updateSliderPosition();
    }

    // стартова позиція
    updateSliderPosition();

    // автоперегортання
    setInterval(goNext, 5000);

    // реакція на зміну ширини
    window.addEventListener('resize', updateSliderPosition);
  }
}



