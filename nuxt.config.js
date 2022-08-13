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
	plugins: ['~/plugins/maps.client'],
};
