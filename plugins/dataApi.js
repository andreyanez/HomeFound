export default function (context, inject) {
	const appId = context.$config.algolia_app_id;
	const apiKey = context.$config.algolia_search_api;
	const ALGOLIA_URL = `https://${appId}-dsn.algolia.net/1/indexes`;
	const headers = {
		'X-Algolia-API-Key': apiKey,
		'X-Algolia-Application-Id': appId,
	};
	inject('dataApi', {
		getHome,
		getReviewsByHomeId,
		getUserByHomeId,
		getHomesByLocation,
	});

	async function getHome(homeId) {
		try {
			return unWrap(await fetch(`${ALGOLIA_URL}/home/${homeId}`, { headers }));
		} catch (error) {
			return getErrorResponse(error);
		}
	}

	async function getReviewsByHomeId(homeId) {
		try {
			return unWrap(
				await fetch(`${ALGOLIA_URL}/reviews/query`, {
					headers,
					method: 'POST',
					body: JSON.stringify({
						filters: `homeId:${homeId}`,
						hitsPerPage: 6,
						attributesToHighlight: [],
					}),
				})
			);
		} catch (error) {
			return getErrorResponse(error);
		}
	}

	async function getUserByHomeId(homeId) {
		try {
			return unWrap(
				await fetch(`${ALGOLIA_URL}/users/query`, {
					headers,
					method: 'POST',
					body: JSON.stringify({
						filters: `homeId:${homeId}`,
						attributesToHighlight: [],
					}),
				})
			);
		} catch (error) {
			return getErrorResponse(error);
		}
	}

	async function getHomesByLocation(lat, lng, radiusInMeters = 1500) {
		try {
			return unWrap(
				await fetch(`${ALGOLIA_URL}/home/query`, {
					headers,
					method: 'POST',
					body: JSON.stringify({
						aroundLatLng: `${lat},${lng}`,
						aroundRadius: radiusInMeters,
						hitsPerPage: 10,
						attributesToHighlight: [],
					}),
				})
			);
		} catch (error) {
			return getErrorResponse(error);
		}
	}

	//Here, I made an unwrap function to get only the desired
	//data from the api call
	const unWrap = async response => {
		const json = await response.json();
		const { ok, status, statusText } = response;
		return {
			json,
			ok,
			status,
			statusText,
		};
	};

	//This function gets called when there is an error
	//when trying to make an api call
	const getErrorResponse = error => {
		return {
			ok: false,
			status: 500,
			statusText: error.message,
		};
	};
}
