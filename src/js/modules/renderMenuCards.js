import api from "../services/api";
import MenuCard from "../templates/menuCardsTemplate";

async function renderMenuCard({ parentSelector }) {
	const data = await api.getDataMenuCard().then(data => data);
	data.forEach(({ img, altimg, title, descr, price }) => {
		new MenuCard(
			img,
			altimg,
			title,
			descr,
			price,
			parentSelector,

		).createHTMLforCard()
	});
}



export default renderMenuCard;