import spritesURL from '../images/sprites.svg'

const charactersPopUpMarkUp = async data => {
	const backdrop = document.createElement('div')
	backdrop.className = 'backdrop'

	const episodesData = await renderEpisodesList(data.episode)
	const episodesItems = (
		Array.isArray(episodesData) ? episodesData : [episodesData]
	)
		.map(episode => {
			const match = (episode.episode || '').match(/S0*?(\d+)E0*?(\d+)/i)
			const season = match ? match[1] : '—'
			return `
				<li>
					<h3>${episode.name}</h3>
					<div class="characters__modal--episodes-list-season">
						<h4>Season</h4>
						<p>${season}</p>
					</div>
					<div class="characters__modal--episodes-list-airdate">
						<h4>Air date</h4>
						<p>${episode.air_date}</p>
					</div>
				</li>
			`
		})
		.join('')

	backdrop.innerHTML = `
        <div class="characters__modal">
            <button class="characters__modal--close">
                <svg class="icon" width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <use xlink:href="${spritesURL}#close"></use>
                </svg>
            </button>

            <div>
							<div class="characters__modal--image">
									<img src="${data.image}" alt="${data.name}" />
							</div>

							<div class="characters__modal--about">
									<ul class="characters__modal--about-list">
											<li>
													<h2>Status</h2>
													<p>${data.status}</p>
											</li>
											<li>
													<h2>Species</h2>
													<p>${data.species}</p>
											</li>
											<li>
													<h2>Gender</h2>
													<p>${data.gender}</p>
											</li>
											<li>
													<h2>Origin</h2>
													<p>${data.origin.name}</p>
											</li>
											<li>
													<h2>Location</h2>
													<p>${data.location.name}</p>
											</li>
											<li>
													<h2>Episodes</h2>
													<p>${data.episode
														.slice(0, 4)
														.map(url => url.split('/').pop())
														.join(', ')}</p>
											</li>
											<li>
													<h2>Type</h2>
													<p>${data.type || 'Unknown'}</p>
											</li>
									</ul>
							</div>
						</div>

            <div class="characters__modal--episodes">
                <h2>Episodes</h2>
                <ul class="characters__modal--episodes-list">
                    ${episodesItems}
                </ul>
            </div>
        </div>
    `

	return backdrop
}

const charactersSection = document.querySelector('main')
const apiUrl = 'https://rickandmortyapi.com/api'
const apiBreakpoint = '/character/'

charactersSection.addEventListener('click', async e => {
	const characterCard = e.target.closest('.character-card')
	if (!characterCard) return

	const characterId = characterCard.dataset.id

	const response = await fetch(`${apiUrl}${apiBreakpoint}${characterId}`).then(
		res => res.json()
	)
	console.log(response)

	if (!response) {
		throw new Error('Failed to load character data')
	}

	const backdrop = await charactersPopUpMarkUp(response)
	const modal = backdrop.querySelector('.characters__modal--window')
	document.body.appendChild(backdrop)
	document.body.classList.add('no-scroll')

	const closeButton = backdrop.querySelector('.characters__modal--close')
	closeButton.addEventListener('click', () => {
		document.body.removeChild(backdrop)
		document.body.classList.remove('no-scroll')
	})

	window.addEventListener('keydown', e => {
		if (e.key === 'Escape') {
			document.body.removeChild(backdrop)
			document.body.classList.remove('no-scroll')
		}
	})

	backdrop.addEventListener('click', e => {
		if (e.target === backdrop) {
			document.body.removeChild(backdrop)
			document.body.classList.remove('no-scroll')
		}
	})

	modal.addEventListener('click', e => {
		e.stopPropagation()
	})
})

async function renderEpisodesList(episodes) {
	const episodeItems = episodes.splice(0, 5).map(url => url.split('/').pop())

	const episode = await fetch(
		`${apiUrl}/episode/${episodeItems.join(',')}`
	).then(res => res.json())

	return episode
}
