<template>
	<div class="app pt-36">
		<div class="app-container">
			<div class="app-hero">
				<h2>Find homes all over the world to stay!</h2>
				<h3>Are you an home owner? <nuxt-link to="/admin/homes">Register a home!</nuxt-link></h3>
			</div>
		</div>
		<div class="app-padded-vertical">
			<div class="app-wrapper">
				<h2 class="app-title">Premium Listings</h2>
				<div class="app-gallery">
					<nuxt-link
						:to="listing.url"
						v-for="(listing, index) in listings"
						:key="index"
						class="app-gallery-item"
						:class="`city-${listing.id}`"
					>
						<div>
							<h3>{{ listing.city }}</h3>
							<p>{{ listing.country }}</p>
						</div>
					</nuxt-link>
				</div>
			</div>
		</div>
		<div class="app-padded-vertical">
			<div class="app-wrapper">
				<div class="app-carousel">
					<div class="app-carousel-header">
						<h2>Recently Added</h2>
					</div>
					<div class="app-carousel-items">
						<nuxt-link
							:to="`/home/${home.objectID}/`"
							v-for="(home, index) in homes"
							:key="index"
							class="app-house"
						>
							<div class="app-house-header">
								<nuxt-img :src="home.images[0]" width="360" height="175" provider="cloudinary" />
							</div>
							<div class="app-house-body">
								<div class="app-rating">
									{{ home.reviewValue }}
									<span>({{ home.reviewCount }})</span>
								</div>
								<h2>{{ home.title }}</h2>
								<div class="app-address">
									{{ home.address }}
								</div>
								<div class="app-price">
									${{ home.pricePerNight }}
									<span>/ night</span>
								</div>
								<div class="app-house-footer">
									<img src="/images/icons/house-blue.svg" width="16px" />
									<div class="app-house-guests">{{ home.guests }} guests</div>
								</div>
							</div>
						</nuxt-link>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	head() {
		return {
			title: 'HomeFound',
			meta: [
				{
					name: 'description',
					content: 'Airbnb clone made in Nuxt!',
					hid: 'description',
				},
			],
		};
	},
	data() {
		return {
			listings: [
				{
					id: 'paris',
					city: 'Paris',
					country: 'France',
					url: '/search?lat=48.856614&lng=2.3522219&label=Paris,%20France',
				},
				{
					id: 'new-york',
					city: 'New York',
					country: 'USA',
					url: '/search?lat=40.7127753&lng=-74.0059728&label=New%20York,%20USA',
				},
				{
					id: 'london',
					city: 'London',
					country: 'UK',
					url: '/search?lat=51.5073509&lng=-0.1277583&label=London,%20UK',
				},
				{
					id: 'dubai',
					city: 'Dubai',
					country: 'UAE',
					url: '/search?lat=25.2048493&lng=55.2707828&label=Dubai%20-%20United%20Arab%20Emirates',
				},
			],
		};
	},
	async asyncData({ $dataApi }) {
		return {
			homes: (await $dataApi.getHomes()).json.hits,
		};
	},
};
</script>
