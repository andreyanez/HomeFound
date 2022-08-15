<template>
	<div>
		<nuxt-img :src="home.images[0]" width="200" height="150" provider="cloudinary" /><br />
		<p>{{ home.title }}</p>
		<p>
			{{ home.location.address }}
		</p>
		<p>{{ home.location.city }},{{ home.location.state }}</p>
		<p>{{ home.guests }} guests</p>
		<p>{{ home.pricePerNight }}$/night</p>
	</div>
</template>

<script>
export default {
	props: {
		home: {
			type: Object,
			required: true,
		},
	},
};
</script>

<style lang="scss" scoped></style>
