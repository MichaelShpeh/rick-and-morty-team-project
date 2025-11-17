import Handlebars from 'handlebars'
import episodes from '../templates/episodes.hbs?raw'

const newsTemplate = Handlebars.compile(episodes)

const list = document.querySelector('.episodes__list')


const baseUrl = 'https://rickandmortyapi.com/api/'
const endPoint = 'episode/?'
const pagination = 'page=1'

async function fetchEpisodes() {
	try {
		const url = `${baseUrl}${endPoint}${pagination}`
		const response = await fetch(url)
		const data = await response.json()
        const articles = Array.isArray(data.results) ? data.results : []

		const dataArray = articles.map(article => ({
			name: article.name,
			airDate: article.air_date
		}))
		renderList(dataArray)

		console.log(response)
		console.log(data)
		console.log(articles)
		console.log(dataArray)
	} catch (err) {
		console.error('Помилка завантаження:', err)
	}
}

function renderList(data) {
	data.forEach(item => {
		const markup = newsTemplate(item)
        list.insertAdjacentHTML('beforeend', markup);
	})
}

document.addEventListener('DOMContentLoaded', function () {
	fetchEpisodes()
})
