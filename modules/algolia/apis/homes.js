import { getHeaders } from '../../helpers';
import fetch from 'node-fetch';
import { unWrap, getErrorResponse } from '../../../utils/fetching';

export default algoliaConfig => {
	const headers = getHeaders(algoliaConfig);
	return {
		create: async (homeId, payload) => {
			// here before we try to send the data to algolia
			// we transform the data send by the date picker to EPOCH
			//this is because algolia works with EPOCH
			const availability = [];
			payload.availabilityRanges.forEach(range => {
				const start = new Date(range.start).getTime() / 1000;
				const end = new Date(range.end).getTime() / 1000;
				for (var day = start; day <= end; day += 86400) {
					availability.push(day);
				}
			});

			delete payload.availabilityRanges;
			payload.availability = availability;
			try {
				return unWrap(
					//Auth flow part 5: the create user function
					//calls to create a user using node-fetch and its
					//fetch function
					//The body of this call is the identity object
					//passed through the makeUserPayload funcion
					//to format it correctly for algolia
					await fetch(
						`https://${algoliaConfig.algolia_app_id}-dsn.algolia.net/1/indexes/home/${homeId}`,
						{
							headers,
							method: 'PUT',
							body: JSON.stringify(payload),
						}
					)
				);
			} catch (error) {
				return getErrorResponse(error);
			}
		},
		get: async homeId => {
			try {
				return unWrap(
					await fetch(
						`https://${algoliaConfig.algolia_app_id}-dsn.algolia.net/1/indexes/homes/${homeId}`,
						{
							headers,
						}
					)
				);
			} catch (error) {
				return getErrorResponse(error);
			}
		},
		delete: async homeId => {
			try {
				return unWrap(
					await fetch(
						`https://${algoliaConfig.algolia_app_id}-dsn.algolia.net/1/indexes/home/${homeId}`,
						{
							headers,
							method: 'DELETE',
						}
					)
				);
			} catch (error) {
				return getErrorResponse(error);
			}
		},
		getByUserId: async userId => {
			try {
				return unWrap(
					await fetch(
						`https://${algoliaConfig.algolia_app_id}-dsn.algolia.net/1/indexes/home/query`,
						{
							headers,
							method: 'POST',
							body: JSON.stringify({
								filters: `userId:${userId}`,
								attributesToRetrieve: ['objectID', 'title'],
								attributesToHighlight: [],
							}),
						}
					)
				);
			} catch (error) {
				return getErrorResponse(error);
			}
		},
	};
};
