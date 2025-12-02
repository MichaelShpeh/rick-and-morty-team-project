import Handlebars from 'handlebars';
import episodeModalSource from '../templates/episode-modal.hbs?raw';
const episodeModalTpl = Handlebars.compile(episodeModalSource);
const baseUrl = 'https://rickandmortyapi.com/api/';
const list = document.querySelector('.episodes__list');
const modalRoot = document.createElement('div');
modalRoot.id = 'episode-modal-root';
document.body.appendChild(modalRoot);
async function attachIdsToCards() {
  if (!list) return;
  if (list.children.length === 0) {
    setTimeout(attachIdsToCards, 200);
    return;
  }

  try {
    const res = await fetch(`${baseUrl}episode/?page=1`);
    const data = await res.json();
    const results = Array.isArray(data.results) ? data.results : [];

    const items = list.querySelectorAll('.episodes__list-item');

    items.forEach((item, index) => {
      const episode = results[index];
      if (!episode) return;

      item.dataset.episodeId = episode.id;
    });
  } catch (error) {
    console.error('Не вдалося привʼязати id до карток:', error);
  }
}
async function getEpisode(id) {
  const res = await fetch(`${baseUrl}episode/${id}`);
  if (!res.ok) throw new Error('Episode fetch error');
  return res.json();
}

async function getCharacters(urls) {
  const res = await Promise.all(urls.map(url => fetch(url)));
  return Promise.all(res.map(r => r.json()));
}
async function openEpisodeModal(episodeId) {
  try {
    const episode = await getEpisode(episodeId);
    const chars = await getCharacters(episode.characters.slice(0, 5));

    const data = {
      title: episode.name,
      id: String(episode.id).padStart(3, '0'),
      air_date: episode.air_date,
      characters: chars.map(c => ({
        name: c.name.split(" ")[0],
        image: c.image,
      })),
    };

    modalRoot.innerHTML = episodeModalTpl(data);

    const modal = modalRoot.querySelector('.episode-modal');
    modal.classList.add('is-open');

    const overlay = modal.querySelector('.episode-modal__overlay');
    const closeBtn = modal.querySelector('[data-modal-close]');

    const closeModal = () => {
      modalRoot.innerHTML = '';
      document.removeEventListener('keydown', onEsc);
    };

    const onEsc = e => {
      if (e.key === 'Escape') closeModal();
    };

    overlay.addEventListener('click', e => {
      if (e.target === overlay) closeModal();
    });

    closeBtn.addEventListener('click', closeModal);
    document.addEventListener('keydown', onEsc);
  } catch (error) {
    console.error('Помилка модального вікна:', error);
  }
}
document.addEventListener('DOMContentLoaded', () => {
  attachIdsToCards();
});
document.addEventListener('click', e => {
  const card = e.target.closest('.episodes__list-item');
  if (!card) return;

  const id = card.dataset.episodeId;
  if (!id) return;

  openEpisodeModal(id);
});
