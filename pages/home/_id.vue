<template>
	<div class="app-container">
		<property-gallery :images="home.images" />
		<property-details :home="home" />
		<property-description :home="home" />
		<property-map :home="home" />
		<property-reviews :reviews="reviews" />
		<property-host :user="user" />
	</div>
</template>
<script>
export default {
	head() {
		return {
			title: this.home.title,
		};
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
