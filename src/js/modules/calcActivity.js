// calculating__choose-item_active
function calcActivity(genderId, activityChoiseId, paramChoiseId, resultSelector, activeChoiseClass) {
	// calc activity
	activeChoiseClass = activeChoiseClass.slice(1, activeChoiseClass.length);
	let gender;
	let height;
	let weight;
	let age;
	let coefficientActivity;
	const genderChoise = document.querySelector(genderId);
	const activityChoise = document.querySelector(activityChoiseId);
	const paramChoise = document.querySelector(paramChoiseId);
	const result = document.querySelector(resultSelector);


	// иницилиизируем дефолтные значения
	function initDefaultVarActivityCalc() {

		gender = sessionStorage.getItem('gender') || 'female';
		sessionStorage.setItem('gender', gender);

		coefficientActivity = +sessionStorage.getItem('coefficientActivity') || 1.2;
		sessionStorage.setItem('coefficientActivity', coefficientActivity);

		height = sessionStorage.getItem('height');
		height ? sessionStorage.setItem('height', height) : null;

		weight = sessionStorage.getItem('weight');
		weight ? sessionStorage.setItem('weight', weight) : null;

		age = sessionStorage.getItem('age');
		age ? sessionStorage.setItem('age', age) : null;
	}

	// изменяем значения в сессии и переменных при изменении
	function changeVarActivityCalc(varName, value) {
		switch (varName) {
			case 'gender':
				sessionStorage.setItem(varName, value);
				gender = value;
				break;
			case 'height':
				sessionStorage.setItem(varName, value);
				height = +value;
				break;
			case 'weight':
				sessionStorage.setItem(varName, value);
				weight = +value;
				break;
			case 'age':
				sessionStorage.setItem(varName, value);
				age = +value;
				break;
			case 'coefficientActivity':
				sessionStorage.setItem(varName, value);
				coefficientActivity = +value;
				break;
		}

		calcTotalCalories()

	}

	// функция для проставления значений
	function setDefaultVar() {
		// проставляем значения в гендере
		for (const item of genderChoise.children) {
			item.classList.remove(activeChoiseClass);

		}
		genderChoise.querySelector(`#${gender}`).classList.add(activeChoiseClass);

		// проставляем значения в активность
		for (const item of activityChoise.children) {
			item.classList.remove(activeChoiseClass);
		}
		activityChoise.querySelector(`[data-coefficient="${coefficientActivity}"]`).classList.add(activeChoiseClass);

		// проставляем значения в input
		for (const input of paramChoise.children) {

			switch (input.getAttribute('id')) {
				case 'height':
					input.value = height ? height : null;
					break;
				case 'weight':
					input.value = weight ? weight : null;
					break;
				case 'age':
					input.value = age ? age : null;
					break;
			}
		}

	}

	// переключение плашек гендера и активности
	function addInteractiveCalcActivity(selector, activeClass) {
		const element = document.querySelector(`${selector}`);
		element.addEventListener('click', function (e) {
			if (e.target.closest('#female') || e.target.closest('#male')) {
				for (const item of element.children) {
					item.classList.remove(`${activeClass}`);
				}
				e.target.classList.add(`${activeClass}`)
				changeVarActivityCalc(e.target.parentElement.getAttribute('id'), e.target.getAttribute('id'))
			} else if (e.target.closest('[data-coefficient]')) {
				for (const item of element.children) {
					item.classList.remove(`${activeClass}`);
				}
				e.target.classList.add(`${activeClass}`)
				changeVarActivityCalc('coefficientActivity', e.target.dataset.coefficient)
			}
		})
	}

	// обработка ввода в параметры
	function addInputsInteractiveCalcActivity(selector) {
		const elem = document.querySelector(`${selector}`)
		for (const input of elem.children) {
			input.addEventListener('input', function (e) {
				// если внутри не цифра, то окрасим поле в красный
				if (/\D/g.test(input.value)) {
					input.style.border = '1px solid red'
					return;
				} else {
					input.style.border = ''
				}
				changeVarActivityCalc(input.getAttribute('id'), input.value)

			})
			input.addEventListener('blur', function (e) {
				if (!input.value) {
					input.style.border = '1px solid red'
				}
			})
		}
	}

	function calcTotalCalories() {
		if (!age || !gender || !height || !weight || !coefficientActivity) {
			result.innerHTML = '&#x221e;'
			return;
		}
		//для мужчин: BMR = 88.36 + (13.4 x вес, кг) + (4.8 х рост, см) – (5.7 х возраст, лет)
		//для женщин: BMR = 447.6 + (9.2 x вес, кг) + (3.1 х рост, cм) – (4.3 х возраст, лет)

		if (gender === 'female') {
			let resCalories = Math.ceil((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * coefficientActivity);
			result.innerHTML = resCalories;
		} else {
			let resCalories = Math.ceil((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * coefficientActivity);
			result.innerHTML = resCalories;
		}
	}

	initDefaultVarActivityCalc();
	setDefaultVar();
	addInteractiveCalcActivity(genderId, activeChoiseClass)
	addInteractiveCalcActivity(activityChoiseId, activeChoiseClass)
	addInputsInteractiveCalcActivity(paramChoiseId)
	calcTotalCalories()
}


export default calcActivity;