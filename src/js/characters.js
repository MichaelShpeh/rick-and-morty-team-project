// src/js/characters.js

const API_URL = "https://rickandmortyapi.com/api/character";

const partialUrl = new URL("../partials/characters.html", import.meta.url);
const cardTemplateUrl = new URL(
    "../templates/character-card.hbs",
    import.meta.url
);

let cardTemplate = null;
let currentPage = 1;
let totalPages = null;
let isLoading = false;

/* ====================== DROPDOWNS ======================= */

// закриває всі відкриті дропдауни
function closeAllDropdowns() {
    document
        .querySelectorAll(".dropdown.dropdown--open")
        .forEach((dd) => dd.classList.remove("dropdown--open"));
}

// ініціалізація всіх кастомних дропдаунів у формі фільтрів
function initDropdowns() {
    const dropdowns = document.querySelectorAll(".dropdown");
    if (!dropdowns.length) return;

    dropdowns.forEach((dropdown) => {
        const selectName = dropdown.dataset.select; // "status", "species", "type", "gender"

        const trigger = dropdown.querySelector(".dropdown__trigger");
        const valueEl = dropdown.querySelector(".dropdown__value");
        const items = dropdown.querySelectorAll(".dropdown__item");
        const nativeSelect = document.getElementById(`filter-${selectName}`);

        if (!trigger || !valueEl || !items.length || !nativeSelect) return;

        // --- Початкове значення з прихованого select ---
        const selectedOption = nativeSelect.options[nativeSelect.selectedIndex];
        if (selectedOption) {
            const initialVal = selectedOption.value;
            const initialText = selectedOption.textContent.trim();

            valueEl.textContent = initialText;
            items.forEach((item) => {
                item.classList.toggle(
                    "dropdown__item--selected",
                    item.dataset.value === initialVal
                );
            });
        }

        // --- Відкрити / закрити по кліку на тригер ---
        trigger.addEventListener("click", (e) => {
            e.stopPropagation();
            const isOpen = dropdown.classList.contains("dropdown--open");
            closeAllDropdowns(); // закриваємо інші
            if (!isOpen) {
                dropdown.classList.add("dropdown--open");
            }
        });

        // --- Вибір опції ---
        items.forEach((item) => {
            item.addEventListener("click", () => {
                const val = item.dataset.value;
                const text = item.textContent.trim();

                // текст у верхній кнопці
                valueEl.textContent = text;

                // виділяємо вибраний пункт
                items.forEach((i) =>
                    i.classList.toggle("dropdown__item--selected", i === item)
                );

                // оновлюємо прихований select + тригеримо change (на майбутні фільтри)
                nativeSelect.value = val;
                nativeSelect.dispatchEvent(new Event("change", { bubbles: true }));

                closeAllDropdowns();
            });
        });
    });

    // --- Закриття всіх дропдаунів по кліку поза ними ---
    document.addEventListener("click", (e) => {
        if (!e.target.closest(".dropdown")) {
            closeAllDropdowns();
        }
    });
}

/* ================== CHARACTERS + LOAD MORE ================== */

// 1. Підставляємо partial у <main id="characters-root">
async function loadCharactersPartial() {
    const root = document.getElementById("characters-root");
    const res = await fetch(partialUrl);
    const html = await res.text();
    root.innerHTML = html;
}

// 2. Завантажуємо і компілюємо шаблон картки
async function loadCardTemplate() {
    const res = await fetch(cardTemplateUrl);
    const source = await res.text();
    cardTemplate = Handlebars.compile(source);
}

// 3. Запит до API конкретної сторінки
async function fetchCharactersPage(page) {
    const url = `${API_URL}?page=${page}`;
    const res = await fetch(url);

    if (!res.ok) {
        throw new Error("Failed to load characters");
    }

    const data = await res.json();
    return data;
}

// 4. Рендер карток (зображення + name + Origin + Location)
function renderCharacters(results, append = false) {
    const listEl = document.getElementById("characters-list");

    const html = results
        .map((ch) =>
            cardTemplate({
                name: ch.name,
                image: ch.image,
                origin: ch.origin?.name || "Unknown",
                location: ch.location?.name || "Unknown",
            })
        )
        .join("");

    if (append) {
        listEl.insertAdjacentHTML("beforeend", html);
    } else {
        listEl.innerHTML = html;
    }
}

// 5. Кнопка Load more (показуємо / ховаємо)
function updateLoadMoreButton() {
    const btn = document.getElementById("characters-load-more");
    if (!btn) return;

    const noMorePages = totalPages !== null && currentPage >= totalPages;

    btn.style.display = noMorePages ? "none" : "inline-block";
    btn.disabled = noMorePages || isLoading;
}

// 6. Завантаження першої сторінки
async function loadFirstPage() {
    currentPage = 1;
    await loadPage(currentPage, false);
}

// 7. Завантаження наступної сторінки (для Load more)
async function loadNextPage() {
    if (isLoading) return;
    if (totalPages !== null && currentPage >= totalPages) return;

    currentPage += 1;
    await loadPage(currentPage, true);
}

// 8. Загальна функція завантаження сторінки
async function loadPage(page, append) {
    try {
        isLoading = true;
        updateLoadMoreButton();

        const data = await fetchCharactersPage(page);

        totalPages = data.info?.pages ?? null;
        renderCharacters(data.results, append);
    } catch (err) {
        console.error(err);
    } finally {
        isLoading = false;
        updateLoadMoreButton();
    }
}

// 9. Навішуємо обробник на кнопку
function setupLoadMore() {
    const btn = document.getElementById("characters-load-more");
    if (!btn) return;

    btn.addEventListener("click", loadNextPage);
}

// 10. Старт
async function init() {
    await loadCharactersPartial();   // вставили секцію з картками + дропдаунами
    initDropdowns();                 // підʼєднали логіку відкриття/закриття
    await loadCardTemplate();        // підготували шаблон картки
    setupLoadMore();                 // привʼязали кнопку Load more
    await loadFirstPage();           // завантажили першу сторінку
}

document.addEventListener("DOMContentLoaded", init);


document.addEventListener('DOMContentLoaded', () => {
    const filtersForm = document.getElementById('characters-filters');
    const dropdowns = document.querySelectorAll('.dropdown');

    /**
     * Инициализирует функциональность кастомных дропдаунов.
     * Синхронизирует выбор в кастомном дропдауне с нативным <select>.
     */
    function initializeDropdowns() {
        dropdowns.forEach(dropdown => {
            const selectName = dropdown.getAttribute('data-select');
            const nativeSelect = document.querySelector(`select[name="${selectName}"]`);
            const trigger = dropdown.querySelector('.dropdown__trigger');
            const valueSpan = dropdown.querySelector('.dropdown__value');
            const menu = dropdown.querySelector('.dropdown__menu');
            const items = dropdown.querySelectorAll('.dropdown__item');

            if (!nativeSelect || !trigger || !menu) return; // Проверка на наличие необходимых элементов

            // Переключение меню
            trigger.addEventListener('click', () => {
                dropdown.classList.toggle('dropdown--active');
            });

            // Обработка выбора элемента
            items.forEach(item => {
                item.addEventListener('click', (event) => {
                    const newValue = event.currentTarget.getAttribute('data-value');
                    const newText = event.currentTarget.textContent.trim();

                    // 1. Обновление нативного <select>
                    nativeSelect.value = newValue;

                    // 2. Обновление отображаемого значения
                    valueSpan.textContent = newText;

                    // 3. Обновление активного элемента в кастомном списке
                    items.forEach(i => i.classList.remove('dropdown__item--selected'));
                    event.currentTarget.classList.add('dropdown__item--selected');

                    // 4. Закрытие дропдауна
                    dropdown.classList.remove('dropdown--active');

                    // 5. Опционально: автоматический вызов функции фильтрации после выбора
                    // В зависимости от вашей логики, вы можете автоматически отправлять форму
                    // или вызывать функцию applyFilters() здесь.
                    // applyFilters();
                });
            });

            // Закрытие дропдауна при клике вне его
            document.addEventListener('click', (event) => {
                if (!dropdown.contains(event.target)) {
                    dropdown.classList.remove('dropdown--active');
                }
            });
        });
    }

    /**
     * Собирает все параметры фильтрации из формы.
     * @returns {Object} Объект с параметрами фильтра.
     */
    function getFilterParams() {
        const formData = new FormData(filtersForm);
        const params = {};

        // Получаем значения из нативных (скрытых) элементов <select> и input[type="search"]
        for (const [key, value] of formData.entries()) {
            if (value && value.trim() !== '' && value.trim().toLowerCase() !== 'all') {
                params[key] = value.trim();
            }
        }
        
        // Дополнительная обработка для полей, где 'all' или пустая строка не должны быть параметрами
        // (Это уже учтено в цикле выше, если вы используете 'all' только для gender)
        if (params.gender && params.gender.toLowerCase() === 'all') {
            delete params.gender;
        }

        return params;
    }

    /**
     * Основная функция для применения фильтров (замените на свою логику).
     * @param {Object} filters - Объект с параметрами фильтра.
     */
    function applyFilters(filters) {
        console.log('Применение фильтров с параметрами:', filters);
        
        // --- ЗАМЕНИТЕ ЭТО СВОЕЙ ЛОГИКОЙ ---
        // Например: 
        // 1. Отправка AJAX-запроса к API:
        //    fetch(`/api/characters?${new URLSearchParams(filters)}`)
        //        .then(response => response.json())
        //        .then(data => updateCharacterList(data)); 
        // 2. Или фильтрация элементов на стороне клиента (если их немного).
        // --- -------------------------- ---

        // Здесь должен быть ваш код для получения и отображения отфильтрованных данных.
        
        // Пример для отображения в консоли
        const queryString = new URLSearchParams(filters).toString();
        console.log(`Полный Query String для API: ?${queryString}`);
    }

    /**
     * Обработка отправки формы.
     */
    filtersForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Предотвращаем стандартную отправку формы
        
        const filters = getFilterParams();
        applyFilters(filters);
    });

    // Инициализация функционала
    initializeDropdowns();
    
    // Опционально: Вызов applyFilters() при загрузке страницы с начальными значениями
    // applyFilters(getFilterParams());
});