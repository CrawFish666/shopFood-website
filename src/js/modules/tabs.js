// Tabs
// let tabs = document.querySelectorAll('.tabheader__item');
// let tabsContent = document.querySelectorAll('.tabcontent');
// let tabsParent = document.querySelector('.tabheader__items');
// tabheader__item_active без точки надо
function tabs(tabsSelector, tabsContentSelector, tabsParentSelector, tabsActiveClass) {

	let tabs = document.querySelectorAll(tabsSelector);
	let tabsContent = document.querySelectorAll(tabsContentSelector);
	let tabsParent = document.querySelector(tabsParentSelector);

	function hideTabContent() {

		tabsContent.forEach(item => {
			item.classList.add('hide');
			item.classList.remove('show', 'fade');
		});

		tabs.forEach(item => {
			item.classList.remove(tabsActiveClass.slice(1, tabsActiveClass.length));
		});
	}

	function showTabContent(i = 0) {
		tabsContent[i].classList.add('show', 'fade');
		tabsContent[i].classList.remove('hide');
		tabs[i].classList.add(tabsActiveClass.slice(1, tabsActiveClass.length));
	}

	hideTabContent();
	showTabContent();

	tabsParent.addEventListener('click', function (event) {
		const target = event.target;
		if (target && target.classList.contains(tabsSelector.slice(1, tabsSelector.length))) {
			tabs.forEach((item, i) => {
				if (target == item) {
					hideTabContent();
					showTabContent(i);
				}
			});
		}
	});
}

export default tabs;