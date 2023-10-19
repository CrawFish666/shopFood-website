import '../scss/main.scss';
import tabs from './modules/tabs';
import promoTimer from './modules/timerPromotion'
import calcActivity from './modules/calcActivity';
import modal, { openModal, closeModal} from './modules/modal';
import renderMenuCard from './modules/renderMenuCards';
import { feedBackforms } from './modules/forms';
import Swiper from 'swiper';
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';


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
