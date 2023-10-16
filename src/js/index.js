import '../scss/main.scss';
import tabs from './modules/tabs';
import promoTimer from './modules/timerPromotion'
import calcActivity from './modules/calcActivity';
import modal, { openModal, closeModal, modalTimer } from './modules/modal';
import api from './services/api';
import renderMenuCard from './modules/renderMenuCards';
import { feedBackforms } from './modules/forms';
import Swiper from 'swiper';
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';
// import 'swiper/css';
import IMask from 'imask';

window.addEventListener('DOMContentLoaded', function () {
	let modalTimerId = setTimeout(() => openModal(document.querySelector('[data-modal]'), 'modal_show', modalTimerId), 4000)


	new Swiper('.offer__slider', {
		modules: [Navigation, Pagination, EffectFade, Autoplay],
		direction: 'horizontal',
		loop: true,
		slidesPerView: 1,
		speed: 400,
		spaceBetween: 100,
		autoplay: {
			delay: 3000,
			disableOnInteraction: false,
		},
		// pagination: {
		// 	el: ".swiper-pagination",
		// 	clickable: true,
		// },
		navigation: {
			nextEl: ".offer__next",
			prevEl: ".offer__prev",
		},
		pagination: {
			el: '.offer__count',
			currentClass: 'offer__count-current',
			totalClass: 'offer__count-total',
			type: 'fraction',
		},
		effect: 'fade',
		// fadeEffect: {
		// 	crossFade: true,
		// }
		// // If we need pagination
		// pagination: {
		// 	el: '.swiper-pagination',
		// },

		// // Navigation arrows
		// navigation: {
		// 	nextEl: '.swiper-button-next',
		// 	prevEl: '.swiper-button-prev',
		// },
	})


	// tabs
	tabs('.tabheader__item', '.tabcontent', '.tabheader__items', '.tabheader__item_active');
	// My Timer Promotion
	promoTimer({
		timePromotionEnd: '2024-01-01Z+03',
		timerSelector: '.promotion__timer',
		clockSelectors: {
			days: '#days',
			hours: '#hours',
			minutes: '#minutes',
			seconds: '#seconds',
		}
	})

	// calcActivity
	calcActivity('#gender', '#activity-choise', '#param-choise', '.calculating__result span', '.calculating__choose-item_active')
	modal({
		container: '[data-modal]',
		openButton: '[data-modal-open]',
		closeButton: '[data-modal-close]',
		showClass: '.modal_show',
		closeByKeyboardButton: {
			active: true,
			button: 'Escape'
		},
		activeModalByScroll: {
			active: true,
			pxFromDown: 100
		},
		modalTimerId

	})

	renderMenuCard({
		parentSelector: '.menu__field .container'
	})

	feedBackforms({
		arrayFormNames: ['order', 'modal'],
		// urlSendData: ' http://localhost:3000/requests',
		// messages: {
		// 	success: 'Спасибо! Мы скоро с вами свяжемся123',
		// 	failure: 'Что-то пошло не так... Попробуйте позже!',
		// 	loading: '../img/form/spinner.svg'
		// },
		closeTimer: {
			active: true,
			delay: 2000
		},
		usageOldModal: {
			active: true,
			modalSelector: ".modal",
			modalContainerSelector: ".modal__dialog",
			prevModalHideClass: ".hide",
			functionPrevModalOpen: openModal,
			functionPrevModalClose: closeModal
		},
		modalTimerId
	})
	


























});



/*



ДРУГОЙ УРОК
Webpack, создать отдельный doc
Webpack - сборщик модулей, скриптов, формирует папки, стили и т.д.
Gulp - task runner, планировщик задач. Не умеет собирать скрипты, обрабатывать изображения и т.д.





Webpack

Установка
npm install webpack webpack-cli --save-dev
Создаем структуру файлов
|- package.json
|- package-lock.json
|- index.html
|- /src
	|- index.js



Создаем файл вне src webpack.config.js с настройками
const path = require('path'); // техническая переменная

module.exports = {
	mode: 'development', // режим в котором работает вебпак
	// продакшн режим нужен для конечной сборки продукта
	// девелопмент сборка будет быстрее и мало плагинов используется
	entry: './src/index.js', // файл с которого начинаем, все зависимости requier и import
	// если надо несколько файлов, то нужно создать объект
	output: { // файл выхода
		filename: 'main.js', // название
		path: path.resolve(__dirname, 'dist'), // куда положить
	},
	watch: true, // после того как запустим webpack будет слежить за изменениями файлов и собирать каждый раз
	devtool: "source-map", // при сборке проекта позволит отследить что к чему отсылается
	module: {} // тут модули вебпака и их настройка. Например babel
};

*/


















