<template>
	<div class="app">
		<div class="app-container">
			<div class="app-hero">
				<h2>- Settle in somewhere new. Discover stays to live, work, or just relax.</h2>
			</div>
		</div>
		<!-- <SectionPremiumListings /> -->
		<!-- <SectionRecentlyAdded class="app-background-grey" :homes="homes" /> -->
		<!-- <SectionMore /> -->
	</div>
</template>

<script>
export default {
	head() {
		return {
			title: 'Airbnb_Clone',
			meta: [
				{
					name: 'description',
					content: 'Airbnb clone made in Nuxt!',
					hid: 'description',
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
