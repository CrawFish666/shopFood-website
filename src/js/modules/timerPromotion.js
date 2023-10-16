// .promotion__timer


function promoTimer({ timePromotionEnd, timerSelector, clockSelectors }) {
	try {
		// Задаем конец промо акции


		// В этой функции получаем сколько времени нам осталось до конца промо акции
		// Передаем конец акции
		function getRemainingTime(endTimePromo) {


			// сколько осталось акции в MS
			const timeStampRemain = +new Date(endTimePromo) - Date.now();


			// если время акции истекло, то отправит все значения равные 0
			if (timeStampRemain <= 0) {
				return {
					'timestamp': timeStampRemain,
					days: 0,
					hours: 0,
					minutes: 0,
					seconds: 0
				}
			}


			// сколько дней до окончания акции
			const days = Math.trunc(timeStampRemain / (1000 * 60 * 60 * 24));

			// сколько часов до окончания акции
			const hours = Math.trunc((timeStampRemain / 1000 / 60 / 60) % 24);

			// сколько минут до окончания акции
			const minutes = Math.trunc((timeStampRemain / 1000 / 60) % 60);

			// сколько секунд до окончания акции
			const seconds = Math.floor((timeStampRemain / 1000) % 60);





			return {
				'timestamp': timeStampRemain,
				days,
				hours,
				minutes,
				seconds
			}
		}

		function setClock(selector, endTimePromo, clockSelectors) {
			const timer = document.querySelector(selector);
			const days = timer.querySelector(clockSelectors?.days);
			const hours = timer.querySelector(clockSelectors?.hours);
			const minutes = timer.querySelector(clockSelectors?.minutes);
			const seconds = timer.querySelector(clockSelectors?.seconds);
			const timerInterval = setInterval(updateTimerPromo, 1000)

			updateTimerPromo()

			function updateTimerPromo() {
				const timeStampRemain = getRemainingTime(endTimePromo);

				days ? days.innerHTML = setZero(timeStampRemain.days) : null;
				hours ? hours.innerHTML = setZero(timeStampRemain.hours) : null;
				minutes ? minutes.innerHTML = setZero(timeStampRemain.minutes) : null;
				seconds ? seconds.innerHTML = setZero(timeStampRemain.seconds) : null;

				// если акция истекла, то останавливаем интервал и вызов обновления таймера
				if (timeStampRemain.timestamp <= 0) {
					clearInterval(timerInterval);
				}
			}

		}
		// функция которая проставляет 0 перед числом если оно от 0 до 9
		function setZero(num) {
			return num >= 0 && num < 10 ? `0${num}` : num;
		}
		setClock(timerSelector, timePromotionEnd, clockSelectors)
	} catch (error) {
		console.error(`Возникла ошибка в таймере \n${error.stack}`);
	}
}

export default promoTimer;