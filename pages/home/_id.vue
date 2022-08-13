<template>
	<div>
		<div>{{ home.title }}</div>
		<div>
			<div style="display: flex">
				<img
					v-for="image in home.images"
					:key="image"
					:src="image"
					width="200"
					height="150"
				/>
			</div>
			{{ home.title }}<br />
			${{ home.pricePerNight }} / night<br />
			<img src="/images/marker.svg" width="20" height="20" />{{
				home.location.address
			}}
			{{ home.location.city }} {{ home.location.state }}
			{{ home.location.country }}<br />
			<img src="/images/star.svg" width="20" height="20" />{{
				home.reviewValue
			}}
			<br />
			{{ home.guests }} guests, {{ home.bedrooms }} rooms, {{ home.beds }} beds,
			{{ home.bathrooms }} bath<br />
		</div>
		<div style="height: 800px; width: 800px" ref="map"></div>
	</div>
</template>
<script>
import homes from '~/data/homes';
export default {
	head() {
		return {
			title: this.home.title,
			script: [
				{
					src: 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBSzDJl3esBDXjWyEaqIK9GSxNiFmhastI&libraries=places&callback=initMap',
					hid: 'map',
					defer: true,
					/*
						When we load this script, it will stay loaded even if we get out of
						this page.

						So, everytime we get in this page again, the script will be ran again,
						and it will add the google scripts again, duplicating them.

						This is a bug, google will throw a message saying its duplicating scripts

						To solve this, on the src above, we use a callback function to run when the script has
						been loaded. In this case its called initMap.

						To let Nuxt know this has already loaded, we have to use initMap to set a NEW
						propery into the window.object, this property called mapLoaded will be set to true
						the fist time the script above runs, and it will stay as true.

						We will use this mapLoaded property to let Nuxt know that it can skipt running this
						google script above and we do that with the skip property on this script option within
						the head method.

						process.client is also checked because we want to make sure that we are on the client part
						of Nuxt, that all the explanation I have for now...

					*/
					skip: process.client && window.mapLoaded,
				},
				{
					/* this script doesnt use a src but it adds code insisde it, like plain javascript when you open
						a script tag at the end of any index.html file.

						The code inside innerHTML will create the mapLoaded property and set it to true
					*/
					innerHTML: 'window.initMap = function(){ window.mapLoaded = true }',
					hid: 'map-init',
				},
			],
		};
	},
	data() {
		return {
			home: {},
		};
	},
	created() {
		const home = homes.find(home => home.objectID == this.$route.params.id);
		this.home = home;
	},
	mounted() {
		const mapOptions = {
			zoom: 18,
			center: new window.google.maps.LatLng(
				this.home._geoloc.lat,
				this.home._geoloc.lng
			),
			disableDefaultUI: true,
			zoomControl: true,
		};
		const map = new window.google.maps.Map(this.$refs.map, mapOptions);
		const { center } = mapOptions;
		const marker = new window.google.maps.Marker({ position: center });
		marker.setMap(map);
	},
};
</script>
