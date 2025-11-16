const list = document.querySelector(".episodes__list");
const background = document.querySelector(".episodes__list-item");

background.style.backgroundImage =
    `url(${new URL("../images/background-1x.jpg", import.meta.url).href})`;

const baseUrl = "https://rickandmortyapi.com/api/episode";