import { getHeaders } from '../helpers';
import fetch from 'node-fetch';
import { unWrap, getErrorResponse } from '../../../utils/fetching';

export default algoliaConfig => {
	const headers = getHeaders(algoliaConfig);
	return {
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