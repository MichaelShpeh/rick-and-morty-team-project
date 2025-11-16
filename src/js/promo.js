console.log('promo.js');

const characterImage1 = document.querySelector('.ricAndMorty');
const characterImage2 = document.querySelector('.ricAndMortyAndBabochka');
const characterImage3 = document.querySelector('.RicAndBethAndJerry');


// console.log(characterImage);

characterImage1.src = new URL("../images/ricAndMorty-1x.png", import.meta.url).href;
characterImage2.src = new URL("../images/ricAndMortyAndBabochka-1x.png", import.meta.url).href;
characterImage3.src = new URL("../images/RicAndBethAndJerry-1x.png", import.meta.url).href;


