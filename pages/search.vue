<template>
	<div>
		<div style="height: 800px; width: 800px; float: right" ref="map"></div>
		Results for: {{ label }}<br />
		<div v-if="homes.length > 0">
			<nuxt-link v-for="home in homes" :key="home.objectID" :to="`/home/${home.objectID}`">
				<!-- here I use .native after each event because HomeRow is a component, not a native tag -->
				<HomeRow
					:home="home"
					@mouseover.native="highlightMarker(home.objectID, true)"
					@mouseout.native="highlightMarker(home.objectID, false)"
				/>
			</nuxt-link>
		</div>
		<div v-else>No results found</div>
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
		const data = await this.$dataApi.getHomesByLocation(to.query.lat, to.query.lng);
		this.homes = data.json.hits;
		this.label = to.query.label;
		this.lat = to.query.lat;
		this.lng = to.query.lng;
		this.updateMap();
		next();
	},
	async asyncData({ query, $dataApi }) {
		const data = await $dataApi.getHomesByLocation(query.lat, query.lng);
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
