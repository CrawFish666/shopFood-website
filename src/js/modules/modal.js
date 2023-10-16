
function modal({ container, openButton, closeButton, showClass, closeByKeyboardButton, activeModalByScroll, modalTimerId }) {
	// modal window functional

	const modal = document.querySelector(container);
	showClass = showClass.slice(1, showClass.length);


	// проверяем на че кликнули
	document.addEventListener('click', function (e) {
		if (e.target.closest(openButton)) {
			openModal(modal, showClass, modalTimerId);
		} else if (e.target.closest(closeButton)) {
			closeModal(modal, showClass)
		}
	})

	// закрытие модалки через кнопку на клаве
	function closeModalByKeyboardButton(modal) {
		if (closeByKeyboardButton.active && closeByKeyboardButton?.button) {
			document.addEventListener('keydown', function (e) {
				if (e.code === closeByKeyboardButton.button && modal.classList.contains(showClass)) {
					closeModal(modal, showClass);
				}
			})
		}
	}
	closeModalByKeyboardButton(modal);


	// если включили опцию, то при скорлле вниз страницы будет открываться модалка + еще указываем сколько px не хватает снизу
	if (activeModalByScroll?.active && (activeModalByScroll?.pxFromDown && activeModalByScroll.pxFromDown >= 0)) {
		document.addEventListener('scroll', showModalByScroll);
	}

	function showModalByScroll() {
		// размер всего полотна страницы
		let scrollHeight = Math.max(
			document.body.scrollHeight, document.documentElement.scrollHeight,
			document.body.offsetHeight, document.documentElement.offsetHeight,
			document.body.clientHeight, document.documentElement.clientHeight
		);
		let coordsWereWeNow = window.scrollY + document.documentElement.clientHeight

		if (scrollHeight - coordsWereWeNow <= +activeModalByScroll.pxFromDown) {
			openModal(modal, showClass, modalTimerId);
			document.removeEventListener('scroll', showModalByScroll);



		}
	}







}
// открытие модалки через добавление класса + зафризит задний фон и нельзя будет скроллить + сброс таймера
function openModal(modal, showClass, modalTimerId) {
	// modal.classList.toggle(showClass);
	modal.classList.add(showClass);
	document.body.style.overflow = 'hidden';
	if (modalTimerId) {
		console.log('У вас есть таймер на открытие модалки и мы его сбросили ;)');
		clearTimeout(modalTimerId)
	} else {
		console.log('Вы не пользуетесь таймером для открытия модалки ;)');
	}
}

// закрытие модалки + убираем фриз заднего фона
function closeModal(modal, showClass) {

	modal.classList.remove(showClass)
	document.body.style.overflow = '';
}

// export const modalTimer = (function (showByTimer) {
// 	console.log(showByTimer);
// 	if (showByTimer?.active && (showByTimer?.delay && showByTimer?.delay >= 0)) {
// 		return setTimeout(() => openModal(modal, showClass, modalTimer), showByTimer.delay)
// 	} else {
// 		return null
// 	}
// })()
// export const modalTimer = (showByTimer, modal, showClass, modalTimer) => {
// 	console.log(showByTimer);
// 	if (showByTimer?.active && (showByTimer?.delay && showByTimer?.delay >= 0)) {
// 		return setTimeout(() => openModal(modal, showClass, modalTimer), showByTimer.delay)
// 	} else {
// 		return null
// 	}
// }

export default modal;
export { openModal, closeModal }
