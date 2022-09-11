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
			{{formatDate(review.date)}}
			<short-text :text="review.comment" :target="150"/>
		</div>
		<img :src="user.image"/>
		{{user.name}}
		{{formatDate(user.joined)}}
		{{user.reviewCount}}
		{{user.description}}
	</div>
</template>
<script>
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

		//I changed the behavior of the data fetching due to unneccesary blocking with each call
		//now all api calls will run at the same time
		const responses = await Promise.all([
			$dataApi.getHome(params.id),
			$dataApi.getReviewsByHomeId(params.id),
			$dataApi.getUserByHomeId(params.id)
		])

		//if there's a bad response, a object is created and it will be used to send the error 
		//function, which triggers Nuxt's error page and accepts an error string or object
		const badResponse = responses.find((response)=> !response.ok)
		if (badResponse) return error({statusCode: badResponse.status, message: badResponse.statusText})


		return {
			home: responses[0].json,
			reviews: responses[1].json.hits,
			user: responses[2].json.hits[0]
		};
	},
	methods:{
		formatDate(dateString){
			const date = new Date(dateString)
			return date.toLocaleDateString()
		}
	}
};
</script>
