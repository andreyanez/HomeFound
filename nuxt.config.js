export default {
	components: true,
	rootUrl:
		process.env.NODE_ENV === 'production'
			? 'https://nuxtairbnbclone.vercel.app'
			: 'http://localhost:3000',
	head: {
		htmlAttrs: {
			lang: 'en',
		},
		meta: [
			{
				charset: 'utf-8',
			},
		],
		link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
	},
	router: {
		prefetchLinks: false,
	},
	//the new 'map' plugin is created with the name of
	//maps.client.js because nuxt will use it only on the client
	plugins: [
		'~/plugins/maps.client',
		'~/plugins/auth2.client',
		'~/plugins/dataApi',
		'~/plugins/vCalendar.client',
		'~/plugins/stripe.client',
	],
	modules: [
		'~/modules/auth',
		'~/modules/stripe',
		'~/modules/algolia',
		'~/modules/cloudinary',
		'@nuxtjs/cloudinary',
	],
	cloudinary: {
		cloudName: 'simuniver',
	},
	image: {
		cloudinary: {
			baseURL: 'https://res.cloudinary.com/simuniver/image/upload/',
		},
	},
	devServerHandlers: [],
	buildModules: ['@nuxtjs/tailwindcss', '@nuxt/image'],
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
		algolia: {
			algolia_app_id: process.env.ALGOLIA_APP_ID,
			algolia_search_key: process.env.ALGOLIA_SEARCH_KEY,
		},
		maps_api_key: process.env.MAPS_API_KEY,
		auth: {
			cookieName: 'idToken',
			clientId: process.env.GOOGLE_AUTH_ID,
		},
		cloudinary: {
			apiKey: process.env.CLOUDINARY_API_KEY,
		},
		stripe: {
			key: 'pk_test_51LtJ0PAWeOsgC9iQklx0T9rBiGi7qZAOxjH0ivsYCjVoRSrtCQv5C6y5056RdUBbHXxY3ztVORDbYWWV7cHB3ADb00DJlQXu6X',
		},
	},
	privateRuntimeConfig: {
		algolia: {
			algolia_app_id: process.env.ALGOLIA_APP_ID,
			algolia_api_key: process.env.ALGOLIA_API_KEY,
		},
		cloudinary: {
			apiSecret: process.env.CLOUDINARY_API_SECRET,
		},
		stripe: {
			secretKey: process.env.STRIPE_SECRET_KEY,
		},
	},
};
