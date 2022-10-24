<template>
	<div class="bg-white">
		<div class="max-w-3xl mx-auto px-4 py-16 sm:px-6 sm:py-60 lg:px-8">
			<div class="max-w-xl">
				<h1 class="text-sm font-semibold uppercase tracking-wide text-indigo-600">Success!</h1>
				<p class="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">
					You've booked {{ home.title }}
				</p>
				<nuxt-img
					class="app-house-header my-6"
					provider="cloudinary"
					width="360"
					height="200"
					:src="home.images[0]"
				/>
				<p class="mt-2 text-base text-gray-500 mb-10">Here are the propery owner details:</p>
				<img :src="homeUser.image" alt="" />
				<dl class="mt-8 text-sm font-medium">
					<dt class="text-gray-900">Name:</dt>
					<dd class="text-indigo-600 mt-2">{{ homeUser.name }}</dd>
					<dt class="text-gray-900 mt-8">Email:</dt>
					<a class="text-indigo-600 mt-2" :href="`mailto:${homeUser.email}`">{{
						homeUser.email
					}}</a>
				</dl>
			</div>
		</div>
	</div>
</template>

<script>
import Cookie from 'js-cookie';
export default {
	async asyncData({ $config, redirect, route, $dataApi }) {
		if (!Cookie.get($config.auth.cookieName)) {
			redirect('/no-access/');
			return;
		}
		const homeId = route.query.id;
		return {
			homeUser: (await $dataApi.getUserByHomeId(homeId)).json.hits[0],
			home: (await $dataApi.getHome(homeId)).json,
		};
	},
};
</script>

<style lang="scss" scoped></style>
