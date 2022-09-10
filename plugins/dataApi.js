export default function (context, inject) {
	const appId = 'RC6C4AMIAL';
	const apiKey = 'f1f432a12c7e98f2c82ceb925b122bd0';

	inject('dataApi', {
		getHome,
	});

	async function getHome(homeId) {
		const response = await fetch(`https://${appId}-dsn.algolia.net/1/indexes/home/${homeId}`, {
			headers: {
				'X-Algolia-API-Key': apiKey,
				'X-Algolia-Application-Id': appId,
			},
		});
		const json = await response.json();
		return json;
	}
}
