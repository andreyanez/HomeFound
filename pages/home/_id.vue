<template>
	<div>
		<div>{{ home.title }}</div>
		<div>
			<div style="display: flex">
				<img v-for="image in home.images" :key="image" :src="image" width="200" height="150" />
			</div>
			{{ home.title }}<br />
			${{ home.pricePerNight }} / night<br />
			<img src="/images/marker.svg" width="20" height="20" />{{ home.location.address }}
			{{ home.location.city }} {{ home.location.state }} {{ home.location.country }}<br />
			<img src="/images/star.svg" width="20" height="20" />{{ home.reviewValue }}
			<br />
			{{ home.guests }} guests, {{ home.bedrooms }} rooms, {{ home.beds }} beds,
			{{ home.bathrooms }} bath<br />
		</div>
		<div style="height: 800px; width: 800px" ref="map"></div>
		<div v-for="review in reviews" :key="review.objectID">
			{{review.date}}
		</div>
	</div>
</template>
<script>
// import homes from '~/data/homes';
export default {
	head() {
		return {
			title: this.home.title,
		};
	},
	mounted() {
		// we are now calling the whole 3rd party map script callign the injection name with a $ sign,
		// and calling the showMap function,sendind the map html element and the geo parameters
		this.$maps.showMap(this.$refs.map, this.home._geoloc.lat, this.home._geoloc.lng);
	},
	async asyncData({ params, $dataApi, error }) {
		const homeResponse = await $dataApi.getHome(params.id);
		//Here, we check if the status response has been successful (ok response should be true)
		//in case it isn't, i throw the status and statusText properties from the response
		//to the error function, which triggers Nuxt's error page and accepts an error string or object
		if (!homeResponse.ok) return error({statusCode: homeResponse.status, message: homeResponse.statusText})

		const reviewResponse = await $dataApi.getReviewsByHomeId(params.id)
		if (!reviewResponse.ok) return error({statusCode: reviewResponse.status, message: reviewResponse.statusText})

		return {
			home: homeResponse.json,
			reviews: reviewResponse.json.hits
		};
	},
};
</script>
