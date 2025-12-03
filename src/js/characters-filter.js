// characters-filter.js
console.log("Скрипт фильтров загружен.");

function initCharactersFilter() {
  const filtersForm = document.getElementById('characters-filters');
  const charactersList = document.getElementById('characters-list');

  if (!filtersForm || !charactersList) {
    console.warn("Элемент фильтров или списка персонажей не найден. Скрипт остановлен.");
    return;
  }

  console.log("Секция героев загружена.");

  // Функция для получения значений фильтров
  const getFilterValues = () => {
    const status = filtersForm.querySelector('#filter-status').value;
    const species = filtersForm.querySelector('#filter-species').value;
    const type = filtersForm.querySelector('#filter-type').value;
    const gender = filtersForm.querySelector('#filter-gender').value;

    return { status, species, type, gender };
  };

  // Функция для отрисовки карточек
  async function fetchAndRender() {
    const { status, species, type, gender } = getFilterValues();
    const url = new URL('https://rickandmortyapi.com/api/character/');
    const params = { status, species, type };
    if (gender && gender !== 'all') params.gender = gender;

    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

    console.log("Fetching:", url.toString());

    try {
      const res = await fetch(url.toString());
      if (!res.ok) {
        console.warn("Персонажи не найдены для текущих фильтров.");
        charactersList.innerHTML = "<p>No characters found.</p>";
        return;
      }
      const data = await res.json();
      renderCharacters(data.results);
    } catch (err) {
      console.error("Ошибка при загрузке персонажей:", err);
    }
  }

  // Отрисовка карточек
  function renderCharacters(characters) {
    charactersList.innerHTML = '';
    characters.forEach(c => {
      const card = document.createElement('div');
      card.classList.add('character-card');
      card.innerHTML = `
        <img src="${c.image}" alt="${c.name}" />
        <h3>${c.name}</h3>
        <p>Status: ${c.status}</p>
        <p>Species: ${c.species}</p>
        <p>Gender: ${c.gender}</p>
      `;
      charactersList.appendChild(card);
    });
  }

  // Слушатели на изменения фильтров
  const selects = filtersForm.querySelectorAll('select');
  selects.forEach(select => {
    select.addEventListener('change', fetchAndRender);
  });

  // Слушатель для поиска по имени
  const searchInput = filtersForm.querySelector('#filter-name');
  const searchButton = filtersForm.querySelector('.filters__button--search');

  const handleSearch = (e) => {
    e.preventDefault();
    fetchAndRender();
  };

  searchButton.addEventListener('click', handleSearch);
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleSearch(e);
  });

  // Первоначальная загрузка
  fetchAndRender();
  console.log("Фильтры и события инициализированы.");
}

// Ждём появления секции героев
const observer = new MutationObserver((mutationsList, observer) => {
  const filtersForm = document.getElementById('characters-filters');
  const charactersList = document.getElementById('characters-list');

  if (filtersForm && charactersList) {
    initCharactersFilter();
    observer.disconnect();
  }
});

observer.observe(document.body, { childList: true, subtree: true });
