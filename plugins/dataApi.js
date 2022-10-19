import { unWrap, getErrorResponse } from '~/utils/fetching';

export default function ({ $config }, inject) {
	const appId = $config.algolia.algolia_app_id;
	const apiKey = $config.algolia.algolia_search_key;
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
		getHomes,
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

	async function getHomesByLocation(lat, lng, start, end, radiusInMeters = 1500 * 15) {
		try {
			//adding the EPOCH dates to an array so algolia can filter them
			const days = [];
			for (var day = parseInt(start); day <= parseInt(end); day += 86400) {
				days.push(`availability:${day}`);
			}
			return unWrap(
				await fetch(`${ALGOLIA_URL}/home/query`, {
					headers,
					method: 'POST',
					body: JSON.stringify({
						aroundLatLng: `${lat},${lng}`,
						aroundRadius: radiusInMeters,
						hitsPerPage: 10,
						//using filters to concatenate query
						filters: days.join(' AND '),
						attributesToHighlight: [],
					}),
				})
			);
		} catch (error) {
			return getErrorResponse(error);
		}
	}

	async function getHomes() {
		try {
			return unWrap(
				await fetch(`${ALGOLIA_URL}/home/query`, {
					headers,
					method: 'POST',
					body: JSON.stringify({
						hitsPerPage: 3,
						attributesToHighlight: [],
					}),
				})
			);
		} catch (error) {
			return getErrorResponse(error);
		}
	}
}
