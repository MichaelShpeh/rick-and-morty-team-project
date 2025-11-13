const header = document.querySelector('.header')
const headerList = document.querySelector('.header__list')
const headerLogo = document.querySelector('.header__logo')

//? Міняє стан навігації хедера при змінні url
function changeHeaderNavStatus() {
	if (
		window.location.href.includes('characters.html') ||
		window.location.href.includes('episodes.html')
	) {
		headerList.classList.remove('active')
		headerLogo.classList.add('active')
	} else {
		headerLogo.classList.remove('active')
		headerList.classList.add('active')
	}
}

changeHeaderNavStatus()
