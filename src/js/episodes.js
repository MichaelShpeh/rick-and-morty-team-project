//! імпорти
import Handlebars from 'handlebars'
import episodes from '../templates/episodes.hbs?raw'

const newsTemplate = Handlebars.compile(episodes)

//! усі змінні
const dropdownInpt = document.querySelector(".episodes__filters-input");
const searchInpt = document.querySelector(".episodes__input")
const list = document.querySelector('.episodes__list');
const filtInpt = document.querySelector('.episodes__filters-input');
const filtBut = document.querySelector('.episodes__filters-button');
const dropdown = document.querySelector('.episodes__dropdown');
const loadMoreButt = document.querySelector('.episodes__load-button');

let page = 0

const baseUrl = 'https://rickandmortyapi.com/api/';
const endPoint = 'episode/?';
let pagination;
let dataArray;

//! фунція запиту на сервер
async function fetchEpisodes() {
	try {
		pagination = `page=${page}`

		const url = `${baseUrl}${endPoint}${pagination}`
		const response = await fetch(url)
		const data = await response.json()
		const articles = Array.isArray(data.results) ? data.results : []

		//!перебираємо об'єкти та витягуємо інформацію
		dataArray = articles.map(article => ({
			name: article.name,
			season: article.episode.slice(1, 3),
			airDate: article.air_date
		}))
		console.log("dataArray: ", dataArray);
		renderList(dataArray)
		page++

		//! слухач на інпуті пошуку
		searchInpt.addEventListener("input", inputFilterData);

		//! фунція фільтрації карток тобто пошук
		function filterCards(value) {
			const filteredData = dataArray.filter(item => item.name.toLowerCase().trim().includes(value));
			console.log("filteredData", filteredData)
			renderListFiltered(filteredData);
			fetchEpisodes()

			renderList(filteredData)
		}

		//! фунція отримання значення з інпута пошуку та її обробка
		function inputFilterData() {
			const value = searchInpt.value.toLowerCase().trim()
			filterCards(value)
		}

		dropdown.addEventListener("click", element => {
			const li = element.target.closest('.episodes__dropdown-item');
			dropdownInpt.value = li.textContent;
			dropdownInpt.dataset.value = li.dataset.value;
			//! чистимо клас active у всіх елементів
			document.querySelectorAll(".episodes__dropdown-item.active").forEach(element => element.classList.remove("active"));

			dropdownFilterData()

			li.classList.toggle('active');
		});

		function dropdownFilterData() {
			const value = dropdownInpt.dataset.value
			filterCardsDropdown(value)
		}

		function filterCardsDropdown(value) {
			const filteredData = dataArray.filter(item => item.season.slice(2, 3).includes(value));
			console.log("filteredData", filteredData)
			renderListFiltered(filteredData);
		}



		// console.log("response: ", response);
		// console.log("data: ", data);
		// console.log("articles: ", articles);
		// console.log(": ",);
	} catch (err) {
		console.error('Помилка завантаження:', err)
	}
}
//! функція рендеру списку
function renderList(data) {
	data.forEach(item => {
		const markup = newsTemplate(item)
		list.innerHTML += markup
		const backgrounds = document.querySelectorAll('.episodes__list-item')

		backgrounds.forEach(bg => {
			bg.style.backgroundImage = `url(${new URL('../images/background-1x.png', import.meta.url).href})`
		})
	})
}

//! функція рендеру списку для фільтрації
function renderListFiltered(data) {
	let markup = "";
	data.forEach(item => {
		markup += newsTemplate(item);
		list.innerHTML = markup
		const backgrounds = document.querySelectorAll('.episodes__list-item')

		backgrounds.forEach(bg => {
			bg.style.backgroundImage = `url(${new URL('../images/background-1x.png', import.meta.url).href})`
		})
	})
}

//! завантаження елементів при запуску
document.addEventListener('DOMContentLoaded', function () {
	fetchEpisodes()
})

//! кнопка відкриття dropdown
filtBut.addEventListener("click", () => {
	dropdown.classList.toggle('is-hidden');
	filtBut.classList.toggle('rotated');
});

//! слухач нв кнопці завантажити ще
loadMoreButt.addEventListener("click", () => {
	fetchEpisodes()
	page++
}
)

//! слухач на елементах списку dropdow
// dropdown.addEventListener("click", element => {
// 	const li = element.target.closest('.episodes__dropdown-item');
// 	dropdownInpt.value = li.textContent;
// 	dropdownInpt.dataset.value = li.dataset.value;
// 	//! чистимо клас active у всіх елементів
// 	document.querySelectorAll(".episodes__dropdown-item.active").forEach(element => element.classList.remove("active"));

// 	dropdownFilterData()

// 	li.classList.toggle('active');
// });
// );