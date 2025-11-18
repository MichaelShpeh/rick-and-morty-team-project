console.log('main_character.js');
// src="../images/rick-desktop-1x.jpg"

const characterImage = document.querySelector('.main-characters__image');
console.log(characterImage);
// characterImage.src = '../images/rick-desktop-1x.jpg';

characterImage.src = new URL("../images/rick-desktop-1x.jpg", import.meta.url).href;

