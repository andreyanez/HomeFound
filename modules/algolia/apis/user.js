import { getHeaders } from '../../helpers';
import fetch from 'node-fetch';
import { unWrap, getErrorResponse } from '../../../utils/fetching';

export default algoliaConfig => {
	const headers = getHeaders(algoliaConfig);
	return {
		//deleting home from user info
		removeHome: async function (identity, homeId) {
			// we fetch the user to update the data
			const payload = (await this.getById(identity)).json;
			// we filter the homes to exclude the deleted home
			const homes = payload.homeId.filter(id => id != homeId);
			payload.homeId = homes;
			//this.create updates the user with the updated data
			await this.create(identity, payload);
		},
		//assigning home to user
		assignHome: async function (identity, homeId) {
			const payload = (await this.getById(identity)).json;
			payload.homeId.push(homeId);
			const response = await this.create(identity, payload);
		},
		bookHome: async (identityId, homeId, start, end) => {
			try {
				return unWrap(
					await fetch(
						`https://${algoliaConfig.algolia_app_id}-dsn.algolia.net/1/indexes/bookings/`,
						{
							headers,
							method: 'POST',
							body: JSON.stringify({
								identityId,
								homeId,
								start,
								end,
							}),
						}
					)
				);
			} catch (error) {
				return getErrorResponse(error);
			}
		},
		create: async (identity, payload) => {
			try {
				return unWrap(
					//Auth flow part 5: the create user function
					//calls to create a user using node-fetch and its
					//fetch function
					//The body of this call is the identity object
					//passed through the makeUserPayload funcion
					//to format it correctly for algolia
					await fetch(
						`https://${algoliaConfig.algolia_app_id}-dsn.algolia.net/1/indexes/users/${identity.id}`,
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
		getById: async identity => {
			//this function just checks if the user that has logged in is on Algolia's records
			try {
				return unWrap(
					await fetch(
						`https://${algoliaConfig.algolia_app_id}-dsn.algolia.net/1/indexes/users/${identity.id}`,
						{
							headers,
						}
					)
				);
			} catch (error) {
				return getErrorResponse(error);
			}
		},
	};
};
