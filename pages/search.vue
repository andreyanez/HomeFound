<template>
	<div class="app-search-results-page">
		<div class="app-search-results">
			<div class="app-search-results-listing">
				<h2 class="app-title">Stays in {{ label }}</h2>
				<div v-if="!!homes.length">
					<nuxt-link v-for="home in homes" :key="home.objectID" :to="`/home/${home.objectID}`">
						<HomeRow
							class="app-house"
							:home="home"
							@mouseover.native="highlightMarker(home.objectID, true)"
							@mouseout.native="highlightMarker(home.objectID, false)"
						/>
					</nuxt-link>
				</div>
				<div v-else>
					<h3>No homes found</h3>
				</div>
			</div>
			<div class="app-search-results-map">
				<div class="app-map" ref="map"></div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	head() {
		return {
			title: `Homes around ${this.label}`,
		};
	},
	mounted() {
		this.updateMap();
	},
	methods: {
		//In highlighMarker, I link the property linked to its
		//respective marker, and add a class to change its color
		highlightMarker(homeId, isHighlighted) {
			document
				.getElementsByClassName(`home-${homeId}`)[0]
				?.classList?.toggle('marker-highlight', isHighlighted);
		},
		updateMap() {
			//Sending a new parameter to showMap, getHomeMarkers.
			this.$maps.showMap(this.$refs.map, this.lat, this.lng, this.getHomeMarkers());
		},
		//in getHomeMarkers, I create an array of objects with the geoloc of each home
		getHomeMarkers() {
			if (this.homes.length == 0) return null;
			return this.homes.map(home => {
				return {
					...home._geoloc,
					pricePerNight: home.pricePerNight,
					//sending the id of home to add a unique css class to each marker
					id: home.objectID,
				};
			});
		},
	},
	async beforeRouteUpdate(to, from, next) {
		//updating the data fetch with the start and end dates
		const data = await this.$dataApi.getHomesByLocation(
			to.query.lat,
			to.query.lng,
			to.query.start,
			to.query.end
		);
		this.homes = data.json.hits;
		this.label = to.query.label;
		this.lat = to.query.lat;
		this.lng = to.query.lng;
		this.updateMap();
		next();
	},
	async asyncData({ query, $dataApi }) {
		//updating the data fetch with the start and end dates
		const data = await $dataApi.getHomesByLocation(query.lat, query.lng, query.start, query.end);
		return {
			homes: data.json.hits,
			label: query.label,
			lat: query.lat,
			lng: query.lng,
		};
	},
};
</script>

<style>
.marker {
	background-color: white;
	border: 1px solid lightgray;
	font-weight: bold;
	border-radius: 20px;
	padding: 5px 8px;
}
.marker-highlight {
	color: white !important;
	background-color: black;
	border-color: black;
}
</style>
