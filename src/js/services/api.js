
class Api {
	constructor() {
		this.url = process.env.SERVER_URL;
	}
	async getDataMenuCard() {
		try {
			// const response = await fetch(`${this.url}/db.json`);
			const response = await fetch(`${this.url}/menu`);
			if (!response.ok) {
				// throw new Error(`Не можем получить данные с ${url}, status: ${response.status}`)
				throw new Error(`Не можем получить данные с ${this.url}, status: ${response.status}`)
			}
			return await response.json()
		} catch (error) {
			console.log(error);
		}
	}

	async postDataModalFeedback(data, url) {
		const response = await fetch(`${url || this.url + '/requests'}`, {
			method: "POST",
			headers: {
				"Content-type": 'application/json'
			},
			body: data
		})
		return await response.json();
	}

}





export default new Api;


