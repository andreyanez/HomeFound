<template>
	<div class="app-section">
		<div class="app-wrapper">
			<div class="app-masonry">
				<div
					v-for="public_id in images"
					:key="public_id"
					:style="`background-image: url(${getImageUrl(public_id)})`"
				></div>
			</div>
		</div>
	</div>
</template>
<script>
export default {
	props: {
		images: {
			type: Array,
			required: true,
		},
	},
	methods: {
		getImageUrl(public_id) {
			return this.$img(
				public_id,
				{
					width: 600,
				},
				{
					provider: 'cloudinary',
				}
			);
		},
	},
};
</script>
