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
	//the new 'map' plugin is created with the name of
	//maps.client.js because nuxt will use it only on the client
	plugins: ['~/plugins/maps.client', '~/plugins/auth.client', '~/plugins/dataApi'],
	modules: ['~/modules/auth'],
	devServerHandlers: [],
	buildModules: ['@nuxtjs/tailwindcss'],
	css: ['~/assets/sass/app.scss'],
	build: {
		//remove inline styles and
		// base64 encoding
		extractCSS: true,
		loaders: {
			limit: 0,
		},
	},
	// Environment variables
	//env variables now stored on nuxt's runtime config
	publicRuntimeConfig: {
		algolia_search_api: process.env.ALGOLIA_SEARCH_KEY,
		algolia_app_id: process.env.ALGOLIA_APP_ID,
		maps_api_key: process.env.MAPS_API_KEY,
		auth: {
			cookieName: 'idToken',
			clientId: process.env.GOOGLE_AUTH_ID,
		},
	},
};
