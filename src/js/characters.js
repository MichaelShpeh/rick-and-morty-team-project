// src/js/characters.js

// === 1) Rick & Morty JS client ===
// npm i rickmortyapi  (Node 18+)
// Docs: https://javascript.rickandmortyapi.com/
import { getCharacters } from 'rickmortyapi' // ← тепер працюємо через офіційний клієнт

const partialUrl = new URL('../partials/characters.html', import.meta.url)
const cardTemplateUrl = new URL(
	'../templates/character-card.hbs',
	import.meta.url
)

let cardTemplate = null

// ===== Параметри батча =====
// За замовчуванням 10; на lg (≥1440px) автоматично робимо 20
const getBatchSize = () =>
	window.matchMedia('(min-width: 1440px)').matches ? 20 : 10

// ===== Стан пагінації/буфера =====
let buffer = [] // локальний буфер персонажів (чекає на рендер)
let currentPage = 0 // яку сторінку API вже завантажили (0 = ще жодну)
let totalPages = null // скільки всього сторінок на API
let isLoading = false

/* ====================== DROPDOWNS ======================= */

function closeAllDropdowns() {
	document
		.querySelectorAll('.dropdown.dropdown--open')
		.forEach(dd => dd.classList.remove('dropdown--open'))
}

function initDropdowns() {
	const dropdowns = document.querySelectorAll('.dropdown')
	if (!dropdowns.length) return

	dropdowns.forEach(dropdown => {
		const selectName = dropdown.dataset.select // "status" | "species" | "type" | "gender"
		const trigger = dropdown.querySelector('.dropdown__trigger')
		const valueEl = dropdown.querySelector('.dropdown__value')
		const items = dropdown.querySelectorAll('.dropdown__item')
		const nativeSelect = document.getElementById(`filter-${selectName}`)

		if (!trigger || !valueEl || !items.length || !nativeSelect) return

		const selectedOption = nativeSelect.options[nativeSelect.selectedIndex]
		if (selectedOption) {
			const initialVal = selectedOption.value
			const initialText = selectedOption.textContent.trim()
			valueEl.textContent = initialText
			items.forEach(item =>
				item.classList.toggle(
					'dropdown__item--selected',
					item.dataset.value === initialVal
				)
			)
		}

		trigger.addEventListener('click', e => {
			e.stopPropagation()
			const isOpen = dropdown.classList.contains('dropdown--open')
			closeAllDropdowns()
			if (!isOpen) dropdown.classList.add('dropdown--open')
		})

		items.forEach(item => {
			item.addEventListener('click', () => {
				const val = item.dataset.value
				const text = item.textContent.trim()

				valueEl.textContent = text
				items.forEach(i =>
					i.classList.toggle('dropdown__item--selected', i === item)
				)

				nativeSelect.value = val
				nativeSelect.dispatchEvent(new Event('change', { bubbles: true }))

				closeAllDropdowns()
			})
		})
	})

	document.addEventListener('click', e => {
		if (!e.target.closest('.dropdown')) closeAllDropdowns()
	})
}

/* ================== PARTIAL + HBS ================== */

// Підставляємо partial у <main id="characters-root">
async function loadCharactersPartial() {
	const root = document.getElementById('characters-root')
	const res = await fetch(partialUrl)
	const html = await res.text()
	root.innerHTML += html
}

// Завантажуємо і компілюємо шаблон картки
async function loadCardTemplate() {
	const res = await fetch(cardTemplateUrl)
	const source = await res.text()
	cardTemplate = Handlebars.compile(source)
}

/* ================== API через rickmortyapi ================== */

// Запит до API сторінки (через клієнт)
async function fetchCharactersPage(page, filters = {}) {
	// getCharacters приймає об'єкт з параметрами: page, name, status, species, type, gender
	// Повертає { data, status, statusMessage }
	// data має звичну структуру API: { info: { pages, ... }, results: [...] }
	const res = await getCharacters({ page, ...filters }) // офіційний метод пагінації
	if (res.status !== 200) {
		throw new Error(res.statusMessage || 'Failed to load characters')
	}
	return res.data // { info, results }
}

// Дотягнути у буфер ще одну сторінку з API
async function fetchAndAppendNextPage(filters = {}) {
	const nextPage = currentPage + 1
	const data = await fetchCharactersPage(nextPage, filters)
	totalPages = data.info?.pages ?? null
	currentPage = nextPage
	buffer = buffer.concat(data.results || [])
}

// Гарантуємо, що в буфері є щонайменше `min` елементів (або все, що можемо)
async function ensureBuffer(min, filters = {}) {
	while (
		buffer.length < min &&
		(totalPages === null || currentPage < totalPages)
	) {
		await fetchAndAppendNextPage(filters)
	}
}

/* ================== РЕНДЕР ================== */

function renderCharacters(results, append = false) {
	const listEl = document.getElementById('characters-list')
	const html = results
		.map(ch =>
			cardTemplate({
				name: ch.name,
				image: ch.image,
				origin: ch.origin?.name || 'Unknown',
				location: ch.location?.name || 'Unknown',
				id: ch.id
			})
		)
		.join('')

	if (append) listEl.insertAdjacentHTML('beforeend', html)
	else listEl.innerHTML = html
}

// Кнопка Load more
function updateLoadMoreButton() {
	const btn = document.getElementById('characters-load-more')
	if (!btn) return

	const morePossible =
		buffer.length > 0 || totalPages === null || currentPage < totalPages
	const canShow = morePossible && !isLoading

	btn.style.display = canShow ? 'inline-block' : 'none'
	btn.disabled = !canShow
}

// Рендер наступного батча (10 або 20). Якщо буфер порожній — дотягуємо сторінку(и)
async function renderNextBatch(append, filters = {}) {
	const BATCH_SIZE = getBatchSize()
	await ensureBuffer(BATCH_SIZE, filters)
	const batch = buffer.splice(0, BATCH_SIZE)
	if (batch.length === 0) {
		updateLoadMoreButton()
		return
	}
	renderCharacters(batch, append)
	updateLoadMoreButton()
}

// Перше завантаження (батч 10 або 20 за брейкпоінтом)
async function loadFirstBatch(filters = {}) {
	currentPage = 0
	totalPages = null
	buffer = []
	await renderNextBatch(false, filters)
}

// Обробник Load more: завжди додаємо ще батч 10/20
async function loadMore() {
	if (isLoading) return
	try {
		isLoading = true
		updateLoadMoreButton()
		await renderNextBatch(true)
	} catch (e) {
		console.error(e)
	} finally {
		isLoading = false
		updateLoadMoreButton()
	}
}

function setupLoadMore() {
	const btn = document.getElementById('characters-load-more')
	if (!btn) return
	btn.addEventListener('click', loadMore)
}

/* ================== INIT ================== */

async function init() {
	await loadCharactersPartial() // секція + форма
	initDropdowns() // логіка кастомних дропдаунів
	await loadCardTemplate() // HBS-картки
	setupLoadMore() // кнопка Load more
	await loadFirstBatch() // перший батч (10 або 20)
}

document.addEventListener('DOMContentLoaded', init)
