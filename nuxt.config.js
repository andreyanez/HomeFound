export default {
	components: true,
	head: {
		htmlAttrs: {
			lang: 'en',
		},
		meta: [
			{
				charset: 'utf-8',
			},
		],
	},
	router: {
		prefetchLinks: false,
	},
	build: {
		postcss: null,
	},
	//the new 'map' plugin is created with the name of
	//maps.client.js because nuxt will use it only on the client
	plugins: ['~/plugins/maps.client', '~/plugins/dataApi'],
	
 	 // Environment variables
 	 env: {
 	   maps_api: process.env.MAPS_API_KEY,
	   algolia_search_api: process.env.ALGOLIA_SEARCH_KEY,
	   algolia_app_id: process.env.ALGOLIA_APP_ID
 	 },
	  
};
