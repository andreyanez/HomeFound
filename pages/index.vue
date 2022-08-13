<template>
	<div>
		<ul>
			<li v-for="home in homes" :key="home.objectID">
				<nuxt-link :to="`/home/${home.objectID}`" prefetch
					><home-card :home="home"
				/></nuxt-link>
			</li>
		</ul>
	</div>
</template>

<script>
import homes from '../data/homes';

export default {
	head() {
		return {
			title: 'Homepage',
			meta: [
				{
					name: 'description',
					content: 'This is a homepage!',
					hid: 'description',
				},
			],
		};
	},
	data() {
		return {
			homes: homes,
		};
	},
};
</script>
