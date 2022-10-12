import userApi from './user';
import homeApi from './homes';
export default algoliaConfig => {
	return {
		user: userApi(algoliaConfig),
		homes: homeApi(algoliaConfig),
	};
};
