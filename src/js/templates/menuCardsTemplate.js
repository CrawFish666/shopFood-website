

// use class for MenuCard
class MenuCard {
	constructor(imgSrc, imgAlt, title, description, price, parentSelector, ...classes) {
		this.imgSrc = imgSrc;
		this.imgAlt = imgAlt;
		this.title = title;
		this.description = description;
		this.price = price;
		this.transfer = 95; // курс валюты USD to RUB
		this.convertToRUB();
		this.parentSelector = document.querySelector(parentSelector);
		this.classes = classes;
	}

	convertToRUB() {
		this.price = this.price * this.transfer;
	}

	createHTMLforCard() {
		const element = document.createElement('div');

		if (!this.classes.length) {
			element.classList.add('menu__item')
		} else {
			this.classes.forEach(className => element.classList.add(className))
		}

		element.innerHTML = `

					<img src=${this.imgSrc} alt=${this.imgAlt}>
					<h3 class="menu__item-subtitle">${this.title}</h3>
					<div class="menu__item-descr">${this.description}</div>
					<div class="menu__item-divider"></div>
					<div class="menu__item-price">
						<div class="menu__item-cost">Цена:</div>
						<div class="menu__item-total"><span>${this.price}</span> руб/день</div>
					</div>

		`;
		this.parentSelector.append(element);
	}




}



export default MenuCard;