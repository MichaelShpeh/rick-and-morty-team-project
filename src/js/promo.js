console.log('promo.js');

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
    const isDesktop = () => window.innerWidth >= 768;
    function updateSliderPosition() {
      if (isDesktop()) {
        const visibleSlides = 3;
        const slideWidth = slider.clientWidth / visibleSlides;
        const offset = -currentIndex * slideWidth;
        track.style.transform = `translateX(${offset}px)`;
      } else {
        const slide = slides[0];
        const slideWidth = slide.clientWidth;
        const gap = parseFloat(getComputedStyle(slide).marginRight) || 0;
        const sliderWidth = slider.clientWidth;
        const leftEdgeOfCurrent = (slideWidth + gap) * currentIndex;
        const centerOffset = (sliderWidth - slideWidth) / 2;
        const offset = -leftEdgeOfCurrent + centerOffset;
        track.style.transform = `translateX(${offset}px)`;
      }
    }
    function stepSlider() {
      if (isDesktop()) {
        const visibleSlides = 3;
        const maxIndex = Math.max(slides.length - visibleSlides, 0);
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
      } else {
        const maxIndex = slides.length - 1;

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
      }
      updateSliderPosition();
    }
    updateSliderPosition();
    setInterval(stepSlider, 5000);
    window.addEventListener('resize', () => {
      if (isDesktop()) {
        const visibleSlides = 3;
        const maxIndex = Math.max(slides.length - visibleSlides, 0);
        if (currentIndex > maxIndex) currentIndex = maxIndex;
      } else {
        const maxIndex = slides.length - 1;
        if (currentIndex > maxIndex) currentIndex = maxIndex;
      }
      updateSliderPosition();
    });
  }
}
