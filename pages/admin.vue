<template>
	<div class="pt-40 max-w-7xl mx-auto">
		<h1 class="text-2xl font-bold mb-16">Admin page</h1>
		<!-- <div class="bg-gray-200 p-2">
			<nuxt-link to="/admin/homes/">Homes</nuxt-link>
		</div> -->
		<nuxt-child></nuxt-child>
	</div>
</template>

<script>
import Cookie from 'js-cookie';
export default {
	asyncData({ $config, redirect }) {
		if (!Cookie.get($config.auth.cookieName)) {
			redirect('/no-access/');
			return;
		}
		console.log(Cookie);
	},
};
</script>
