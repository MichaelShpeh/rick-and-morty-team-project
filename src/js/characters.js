// src/js/characters.js

const API_URL = "https://rickandmortyapi.com/api/character";

const partialUrl = new URL("../partials/characters.html", import.meta.url);
const cardTemplateUrl = new URL(
    "../templates/character-card.hbs",
    import.meta.url
);

let cardTemplate = null;

// ===== Параметри батча =====
const BATCH_SIZE = 10;

// ===== Стан пагінації/буфера =====
let buffer = [];        // локальний буфер персонажів (чекає на рендер)
let currentPage = 0;    // яку сторінку API вже завантажили (0 = ще жодну)
let totalPages = null;  // скільки всього сторінок на API
let isLoading = false;

/* ====================== DROPDOWNS ======================= */

function closeAllDropdowns() {
    document
        .querySelectorAll(".dropdown.dropdown--open")
        .forEach((dd) => dd.classList.remove("dropdown--open"));
}

function initDropdowns() {
    const dropdowns = document.querySelectorAll(".dropdown");
    if (!dropdowns.length) return;

    dropdowns.forEach((dropdown) => {
        const selectName = dropdown.dataset.select; // "status" | "species" | "type" | "gender"
        const trigger = dropdown.querySelector(".dropdown__trigger");
        const valueEl = dropdown.querySelector(".dropdown__value");
        const items = dropdown.querySelectorAll(".dropdown__item");
        const nativeSelect = document.getElementById(`filter-${selectName}`);

        if (!trigger || !valueEl || !items.length || !nativeSelect) return;

        const selectedOption = nativeSelect.options[nativeSelect.selectedIndex];
        if (selectedOption) {
            const initialVal = selectedOption.value;
            const initialText = selectedOption.textContent.trim();
            valueEl.textContent = initialText;
            items.forEach((item) =>
                item.classList.toggle(
                    "dropdown__item--selected",
                    item.dataset.value === initialVal
                )
            );
        }

        trigger.addEventListener("click", (e) => {
            e.stopPropagation();
            const isOpen = dropdown.classList.contains("dropdown--open");
            closeAllDropdowns();
            if (!isOpen) dropdown.classList.add("dropdown--open");
        });

        items.forEach((item) => {
            item.addEventListener("click", () => {
                const val = item.dataset.value;
                const text = item.textContent.trim();

                valueEl.textContent = text;
                items.forEach((i) =>
                    i.classList.toggle("dropdown__item--selected", i === item)
                );

                nativeSelect.value = val;
                nativeSelect.dispatchEvent(new Event("change", { bubbles: true }));

                closeAllDropdowns();
            });
        });
    });

    document.addEventListener("click", (e) => {
        if (!e.target.closest(".dropdown")) closeAllDropdowns();
    });
}

/* ================== CHARACTERS + LOAD MORE ================== */

// Підставляємо partial у <main id="characters-root">
async function loadCharactersPartial() {
    const root = document.getElementById("characters-root");
    const res = await fetch(partialUrl);
    const html = await res.text();
    root.innerHTML = html;
}

// Завантажуємо і компілюємо шаблон картки
async function loadCardTemplate() {
    const res = await fetch(cardTemplateUrl);
    const source = await res.text();
    cardTemplate = Handlebars.compile(source);
}

// Запит до API сторінки
async function fetchCharactersPage(page) {
    const url = `${API_URL}?page=${page}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to load characters");
    return res.json();
}

// Дотягнути у буфер ще одну сторінку з API
async function fetchAndAppendNextPage() {
    const nextPage = currentPage + 1;
    const data = await fetchCharactersPage(nextPage);
    totalPages = data.info?.pages ?? null;
    currentPage = nextPage;
    buffer = buffer.concat(data.results || []);
}

// Гарантуємо, що в буфері є щонайменше `min` елементів (або все, що можемо)
async function ensureBuffer(min) {
    // Якщо ми вже накачали всі сторінки і буфер порожній — нічого не зробимо
    while (buffer.length < min && (totalPages === null || currentPage < totalPages)) {
        await fetchAndAppendNextPage();
    }
}

// Рендер карток
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

    if (append) listEl.insertAdjacentHTML("beforeend", html);
    else listEl.innerHTML = html;
}

// Кнопка Load more
function updateLoadMoreButton() {
    const btn = document.getElementById("characters-load-more");
    if (!btn) return;

    const morePossible = buffer.length > 0 || (totalPages === null || currentPage < totalPages);
    const canShow = morePossible && !isLoading;

    btn.style.display = canShow ? "inline-block" : "none";
    btn.disabled = !canShow;
}

// Рендер наступного батча (10 шт). Якщо буфер порожній — дотягуємо сторінку(и)
async function renderNextBatch(append) {
    await ensureBuffer(BATCH_SIZE);
    const batch = buffer.splice(0, BATCH_SIZE);
    if (batch.length === 0) {
        updateLoadMoreButton();
        return;
    }
    renderCharacters(batch, append);
    updateLoadMoreButton();
}

// Перше завантаження (10 карток)
async function loadFirstBatch() {
    currentPage = 0;
    totalPages = null;
    buffer = [];
    await renderNextBatch(false);
}

// Обробник Load more: завжди додаємо ще 10
async function loadMore() {
    if (isLoading) return;
    try {
        isLoading = true;
        updateLoadMoreButton();
        await renderNextBatch(true);
    } catch (e) {
        console.error(e);
    } finally {
        isLoading = false;
        updateLoadMoreButton();
    }
}

function setupLoadMore() {
    const btn = document.getElementById("characters-load-more");
    if (!btn) return;
    btn.addEventListener("click", loadMore);
}

/* ======================== INIT ======================== */

async function init() {
    await loadCharactersPartial();   // секція + форма
    initDropdowns();                 // логіка кастомних дропдаунів
    await loadCardTemplate();        // HBS-картки
    setupLoadMore();                 // кнопка Load more
    await loadFirstBatch();          // перші 10 карток
}

document.addEventListener("DOMContentLoaded", init);
