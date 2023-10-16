import api from "../services/api";
import IMask from "imask";
/*
1. По дефолту:
param a.Добавляем массив форм к которым хотим, чтобы применилась функция отправки
param b.Ссылка куда отправляем данные
param c.Опциональный, это объект соообщений success/failure/loading
param e. timer {
	active: true,
	delay: 5000
}
Модуль у нас повесит на каждую форму события сабмита, которая остановит отправку
+ добавит по центру загрузку
+ отправит данные на сервер:
если придет код 200(типо норм), то добавится новое модальное окно с сообщением сакксесс
если придет код ошибка(400 и т.п.) проброс делаем в кэч и там откроется новое модальное окно с файлуре
далее finaly отчистим форму form.reset()

Само модальное окно будет создано автоматически через JS. По дефолту оно закрывается через 2 секунды
В модалке будет возможность закрыть крестиком, внутри будет сообщения, закрыть кликнув мимо
Опционально можно отключить таймер 2 секунды

2. Когда уже есть какое-то модальное окно и хотим просто работать с ним:
Нужен дополнительно парам d {
	active: true,
	modalContainerSelector: сюда класс самой модалки у нас .modal
	modalContentSelector: сюда класс modal__dialog или который отвечает за контент,
	prevModalHideClass: сюда класс, который будет делать display: none,
	functionPrevModalOpen: сюда функция, которая открывает предыдущее окно,
	functionPrevModalClose: сюда функция, которая закрывает предыдущую модалку
}

Суть такая:
Мы прячем предыдущий контент modalContentSelector через класс prevModalHideClass
Открываем модалку ченрез functionPrevModalOpen
Внутри нее создаем уже наш нужный код
const thanksModal = document.createElement('div');
		  thanksModal.classList.add('modal__dialog');
		  thanksModal.innerHTML = `
				<div class="modal__content">
					 <div class="modal__close" data-close>×</div>
					 <div class="modal__title">${message}</div>
				</div>
		  `;
Помещаем это в modalContainerSelector через append
И тут уже если стоит закрыть по таймеру, то через таймер мы удаляем наш созданный блок кода
Убираем класс prevModalHideClass с предыдущей модалки
Закрываем модалку через functionPrevModalClose

*/



async function feedBackforms({ arrayFormNames, urlSendData, messages, closeTimer, usageOldModal, modalTimerId }) {
	// объявляем сообщения. Либо их передают, либо они используются по стандарту

	// предзагружаем картинку загрузки
	async function getImg(urlImg) {
		return await fetch(urlImg).then(data => {
			return data.blob();
		}).then(response => {
			return URL.createObjectURL(response)
		})
	}


	const message = {
		success: messages?.success || 'Спасибо! Мы скоро с вами свяжемся',
		failure: messages?.failure || 'Что-то пошло не так... Попробуйте позже!',
		loading: await getImg(messages?.loading || './img/form/spinner.svg')
	}

	const URLs = urlSendData


	arrayFormNames.forEach(item => {
		let mask = new IMask(
			document.forms[`${item}`].phone,
			{
				mask: '+{7}(000)000-00-00',
				lazy: false,  // make placeholder always visible
				placeholderChar: '_',

			}
		)

		let maskName = new IMask(
			document.forms[`${item}`].name,
			{
				// mask: /^[A-Za-zа-яА-Я]*$/,
				// mask: /^[A-Za-zа-яА-Я]{0,15}$/,
				// mask: value => /^[A-Za-zа-яА-Я]{1,15}$/.test(value),
				mask: value => /^[A-Za-zа-яА-Я]{1,15}$/.test(value),
				commit: (value, masked) => {
					// if (/^[A-Za-zа-яА-Я]{3,15}$/.test(value)) {
					// 	masked.isComplete = true;
					// } else {
					// 	masked.isComplete = false;
					// }
					if (value.length > 0) {
						let test = value.split('');
						test = test[0].toUpperCase()
						let kek;
						kek = test.concat(value.slice(1))
						masked._value = kek
						value = kek
					}
					// masked._value = value
					// masked._value = value[0].toLowerCase();  // Don't do it
				},
				// mask: /^[A-Za-zа-яА-Я]{2,15}$/,
			}
		)
		document.forms[`${item}`].phone.addEventListener('input', function (e) {
			document.forms[`${item}`].phone.style.cssText = `
				border: none`
			if (!mask.masked.isComplete) {
				document.forms[`${item}`].phone.style.cssText = `
				border: 1px solid red`
			}
		})


		document.forms[`${item}`].addEventListener('submit', function (e) {
			e.preventDefault()
			if (maskName.masked.isComplete) {
				console.log('Имя верно');
			} else {
				console.log('Имя неверно');
				return;
			}

			// let errorMes = document.createElement('div');
			// errorMes.textContent = 'Введен неверный номер'
			document.forms[`${item}`].phone.style.cssText = `
			border: none`
			if (!mask.masked.isComplete) {
				// document.forms[`${item}`].phone.after(errorMes)
				document.forms[`${item}`].phone.style.cssText = `
				border: 1px solid red`;
				return;
			}

			let statusMessage = createStatusMessage()
			document.forms[`${item}`].append(statusMessage.statusMessage, statusMessage.testDiv);
			const formData = new FormData(document.forms[`${item}`]);
			// отправляем телефон без маски!
			formData.set('phone', mask.masked.unmaskedValue)
			const json = JSON.stringify(Object.fromEntries(formData.entries()));



			api.postDataModalFeedback(json, URLs)
				.then(data => {
					showSendModal(message.success);
					statusMessage.testDiv.remove();
					statusMessage.statusMessage.remove();
				})
				.catch(data => {
					showSendModal(message.failure)
					statusMessage.testDiv.remove();
					statusMessage.statusMessage.remove();
				})
				.finally(() => {

					document.forms[`${item}`].reset()
					mask.masked.reset()
					// maskName.value = ''
					maskName.masked.reset()
				})

			// form.parentElement.parentElement.style.cssText = `
			// 	background-color: black;
			// `


		})
	})
	function createStatusMessage() {
		let statusMessage = document.createElement('img');
		statusMessage.src = message.loading;
		statusMessage.style.cssText = `
display: block;
margin: 0 auto;
position: absolute;
top: 50%;
left: 50%;
transform: translate(-50%, -50%) scale(2);
z-index: 11;
`;
		let testDiv = document.createElement('div');
		testDiv.classList.add('testsss')
		testDiv.style.cssText = `
		display: block;
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.4);
		z-index: 10;
		`;
		// testDiv.insertAdjacentElement('beforeend', statusMessage);
		return {
			testDiv,
			statusMessage
		};
	}
	// forms.forEach(form => {
	// 	form.addEventListener('submit', function (e) {
	// 		e.preventDefault()
	// 		let statusMessage = document.createElement('img');
	// 		statusMessage.src = message.loading;
	// 		statusMessage.style.cssText = `
	//              display: block;
	//              margin: 0 auto;
	// 				 position: absolute;
	// 				 top: 50%;
	// 				 left: 50%;
	// 				 transform: translate(-50%, -50%) scale(2);

	//          `;
	// 		const formData = new FormData(form);
	// 		const json = JSON.stringify(Object.fromEntries(formData.entries()));
	// 		api.postDataModalFeedback(json)
	// 		// form.parentElement.parentElement.style.cssText = `
	// 		// 	background-color: black;
	// 		// `
	// 		form.insertAdjacentElement('beforeend', statusMessage);
	// 	})
	// })

	function createModal(message) {
		const modalContainer = document.createElement('div');
		const modalDialog = document.createElement('div');
		const modalContent = document.createElement('div');

		// <div data-modal-close class="modal__close">&times;</div>
		modalContent.textContent = message
		modalContainer.style.cssText = `
		display: block;
			position: fixed;
	top: 0;
	left: 0;

	width: 100%;
	height: 100%;
	overflow: hidden;
	background-color: rgba(0, 0, 0, 0.5);
	z-index: 9999;
		`
		modalDialog.style.cssText = `
			max-width: 500px;
	margin: 40px auto;
		`
		modalContent.style.cssText = `
			position: relative;
	width: 100%;
	padding: 40px;
	background-color: #fff;
	border: 1px solid rgba(0, 0, 0, 0.2);
	border-radius: 4px;
	max-height: 80vh;
	overflow-y: auto;
	    text-align: center;
    font-size: 22px;
    text-transform: uppercase;
	`

		document.body.style.overflow = 'hidden';
		modalContent.setAttribute('data-modal-content', '')

		modalDialog.insertAdjacentElement('beforeend', modalContent)
		modalContainer.insertAdjacentElement('beforeend', modalDialog)

		// если у нас стоит закрытие по таймеру и указан делей, то мы не создаем даже
		// крестик
		if (closeTimer?.active == true && closeTimer?.delay > 0) {
			return {
				modalContainer
			}
		}
		const modalClose = document.createElement('div');
		modalClose.setAttribute('data-modal-close', '');
		modalContent.insertAdjacentElement('beforeend', modalClose);
		modalClose.innerHTML = '&times';
		modalClose.style.cssText = `
			position: absolute;
	top: 8px;
	right: 14px;
	font-size: 30px;
	color: #000;
	opacity: 0.5;
	font-weight: 700;
	border: none;
	background-color: transparent;
	cursor: pointer;
		`
		return {
			modalContainer,
			modalClose
		};
	}
	function showSendModal(message) {
		if (usageOldModal?.active != true) {
			const modal = createModal(message)
			document.body.insertAdjacentElement('beforeend', modal.modalContainer);

			// если стаит флаг closeTimer.active = true и указан delay, то закроет через это время
			if (closeTimer?.active == true && closeTimer?.delay > 0) {
				setTimeout(() => {
					modal.modalContainer.remove()
				}, +closeTimer.delay);
				// или если таймера нет, то создадим крестик + закрытие по нажатию мимо
			} else {
				modal.modalContainer.addEventListener('click', function (e) {
					if (!e.target.closest('[data-modal-content]')) {
						modal.modalContainer.remove()
					}
					if (e.target.closest('[data-modal-close]')) {
						modal.modalContainer.remove()
					}
				})
			}
		} else {

			const prevModalContainer = document.querySelector(`${usageOldModal.modalContainerSelector}`);
			prevModalContainer.classList.add('hide');
			usageOldModal.functionPrevModalOpen(document.querySelector('.modal'), 'modal_show', modalTimerId)
			// openModal('.modal', modalTimerId);
			const thanksModal = document.createElement('div');
			thanksModal.classList.add(`${usageOldModal.modalContainerSelector.slice(1, usageOldModal.modalContainerSelector.length)}`);
			thanksModal.innerHTML = `
            <div class="modal__content">
                
                <div class="modal__title">${message}</div>
            </div>
        `;
			// если closeTimer.active false или если delay отсутствует или <=0, то будет дополнено крестиком
			closeTimer?.active != true || (closeTimer?.delay == undefined || closeTimer.delay <= 0) ? thanksModal.firstElementChild.insertAdjacentHTML('afterbegin', '<div data-modal-close class="modal__close" data-close>×</div>') : null;
			document.querySelector(`${usageOldModal.modalSelector}`).append(thanksModal);

			if (closeTimer?.active == true && closeTimer?.delay && closeTimer?.delay > 0) {
				setTimeout(() => {
					thanksModal.remove();
					prevModalContainer.classList.remove('hide');
					usageOldModal.functionPrevModalClose(document.querySelector('.modal'), 'modal_show')
				}, +closeTimer.delay);
				// или если таймера нет, то создадим крестик + закрытие по нажатию мимо
			} else {
				thanksModal.addEventListener('click', function (e) {
					if (e.target.closest(`[data-modal-close]`)) {
						thanksModal.remove();
						prevModalContainer.classList.remove('hide');
						usageOldModal.functionPrevModalClose(document.querySelector('.modal'), 'modal_show')
					}
				})
			}


			// setTimeout(() => {
			// 	thanksModal.remove();
			// 	// prevModalContainer.classList.add('show');
			// 	prevModalContainer.classList.remove('hide');
			// 	usageOldModal.functionPrevModalClose(document.querySelector('.modal'), 'modal_show')
			// }, 2000);
		}

		// let modal = usageOldModal?.active ? createModal(message, timer) : null;
		// console.log(modal);
		// document.body.insertAdjacentElement('beforeend', modal);

		// <div data-modal class="modal">
		// 	<div class="modal__dialog">
		// 		<div class="modal__content">
		// 			<form name="modal" action="#">
		// 				<div data-modal-close class="modal__close">&times;</div>
		// 				<div class="modal__title">Мы свяжемся с вами как можно быстрее!</div>
		// 				<input required placeholder="Ваше имя" name="name" type="text" class="modal__input">
		// 					<input required placeholder="Ваш номер телефона" name="phone" type="phone" class="modal__input">
		// 						<button class="btn btn_dark btn_min">Перезвонить мне</button>
		// 					</form>
		// 				</div>
		// 		</div>
		// 	</div>
		// должна быть модалка со статусом отправки
		// если все ок, то саксесс
		// при загрузке спиннер крутится
		// при ошибка файлур
		// модалка закрывается автоматически через 2 секунды
	}
}

// function showThanksModal(message) {
// 	const prevModalDialog = document.querySelector('.modal__dialog');

// 	prevModalDialog.classList.add('hide');
// 	openModal('.modal', modalTimerId);

// 	const thanksModal = document.createElement('div');
// 	thanksModal.classList.add('modal__dialog');
// 	thanksModal.innerHTML = `
//             <div class="modal__content">
//                 <div class="modal__close" data-close>×</div>
//                 <div class="modal__title">${message}</div>
//             </div>
//         `;
// 	document.querySelector('.modal').append(thanksModal);
// 	setTimeout(() => {
// 		thanksModal.remove();
// 		prevModalDialog.classList.add('show');
// 		prevModalDialog.classList.remove('hide');
// 		closeModal('.modal');
// 	}, 4000);
// }

export { feedBackforms }