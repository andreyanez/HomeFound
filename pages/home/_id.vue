<template>
	<div class="app-container pt-40">
		<property-gallery :images="home.images" />
		<property-details :home="home" />
		<property-description :home="home" />
		<property-map :home="home" />
		<property-reviews :reviews="reviews" />
		<property-host :user="user" />
		<script type="application/ld+json" v-html="getSchema"></script>
	</div>
</template>
<script>
export default {
	head() {
		return {
			title: this.home.title,
			//social card setup
			meta: [
				{ hid: 'og-type', property: 'og:type', content: 'website' },
				{ hid: 'og-title', property: 'og:title', content: this.home.title },
				{ hid: 'og-desc', property: 'og:description', content: this.home.description },
				{
					hid: 'og-image',
					property: 'og:image',
					content: this.$img(this.home.images[0], { width: 1200 }, { provider: 'cloudinary' }),
				},
				{
					hid: 'og-url',
					property: 'og:url',
					content: `${this.$config.rootUrl}/home/${this.home.objectID}`,
				},
				{ hid: 't-type', name: 'twitter:card', content: 'summary_large_image' },
			],
		};
	},
	computed: {
		// schema.org markup for seo
		getSchema() {
			return JSON.stringify({
				'@context': 'http://schema.org',
				'@type': 'BedAndBreakfast',
				name: this.home.title,
				image: this.$img(this.home.images[0], { width: 1200 }, { provider: 'cloudinary' }),
				address: {
					'@type': 'PostalAddress',
					addressLocality: this.home.location.city,
					addressRegion: this.home.location.state,
					postalCode: this.home.location.zipcode,
					streetAddress: this.home.location.address,
				},
				aggregateRating: {
					'@type': 'AggregateRating',
					ratingValue: this.home.reviewValue,
					reviewCount: this.home.reviewCount,
				},
			});
		},
	},
	async asyncData({ params, $dataApi, error }) {
		//I changed the behavior of the data fetching due to unneccesary blocking with each call
		//now all api calls will run at the same time
		const responses = await Promise.all([
			$dataApi.getHome(params.id),
			$dataApi.getReviewsByHomeId(params.id),
			$dataApi.getUserByHomeId(params.id),
		]);

		//if there's a bad response, a object is created and it will be used to send the error
		//function, which triggers Nuxt's error page and accepts an error string or object
		const badResponse = responses.find(response => !response.ok);
		if (badResponse)
			return error({ statusCode: badResponse.status, message: badResponse.statusText });

		return {
			home: responses[0].json,
			reviews: responses[1].json.hits,
			user: responses[2].json.hits[0],
		};
	},
};
</script>
