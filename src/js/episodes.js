//! імпорти
import Handlebars from 'handlebars'
import episodes from '../templates/episodes.hbs?raw'
import { getCharacter, getCharacters, getLocation, getEpisode } from 'rickmortyapi';

const newsTemplate = Handlebars.compile(episodes);

//!
const list = document.querySelector('.episodes__list');
const filtInpt = document.querySelector('.episodes__filters-input');
const filtBut = document.querySelector('.episodes__filters-button');
const dropdown = document.querySelector('.episodes__dropdown');
const loadMoreButt = document.querySelector('.episodes__load-button');

let page = 0;

const baseUrl = 'https://rickandmortyapi.com/api/';
const endPoint = 'episode/?';
let pagination;

//! фунція запиту на сервер
async function fetchEpisodes() {
	try {
		pagination = `page=${page}`

		const url = `${baseUrl}${endPoint}${pagination}`
		const response = await fetch(url)
		const data = await response.json()
		const articles = Array.isArray(data.results) ? data.results : []

		const dataArray = articles.map(article => ({
			name: article.name,
			airDate: article.air_date
		}))
		renderList(dataArray)
		page++;

		// console.log(response)
		console.log(data)
		// console.log(articles)
		// console.log(dataArray)
	} catch (err) {
		console.error('Помилка завантаження:', err)
	}
}
//! функція рендеру списку
function renderList(data) {
	data.forEach(item => {
		const markup = newsTemplate(item)
		list.innerHTML += markup;
		const backgrounds = document.querySelectorAll('.episodes__list-item');

		backgrounds.forEach(bg => {
			bg.style.backgroundImage = `url(${new URL('../images/background-1x.png', import.meta.url).href})`;
		});
	})
}

document.addEventListener('DOMContentLoaded', function () {
	fetchEpisodes()
})


filtBut.addEventListener("click", () => {
	dropdown.classList.toggle('is-hidden');
	filtBut.classList.toggle('rotated');
});

loadMoreButt.addEventListener("click", () => {
	fetchEpisodes()
	page++
}
)