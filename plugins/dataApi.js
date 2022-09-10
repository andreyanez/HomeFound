export default function (context, inject) {
	const appId = process.env.algolia_app_id
	const apiKey = process.env.algolia_search_api;

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
