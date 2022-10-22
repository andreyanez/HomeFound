<template>
	<div class="app">
		<header class="app-header">
			<nuxt-link to="/" class="app-logo">
				<img src="/company_logo.png" alt="airbnb_clone" width="150" />
			</nuxt-link>
			<div class="app-search">
				<input type="text" ref="citySearch" @changed="changed" placeholder="Enter your address" />
				<!-- //client only gets used to render the html after the server has rendered the page
				//something like setting a component in SPA mode, or client side html rendering -->
				<client-only>
					<!-- //setting a template html before the actual datepicker renders -->
					<template #placeholder>
						<input class="datepicker" />
						<span class="-ml-6 mr-2">to</span>
						<input class="datepicker" /><br />
					</template>
					<date-picker
						v-model="range"
						is-range
						timezone="UTC"
						:modelConfig="{ timeAdjust: '00:00:00' }"
					>
						<template v-slot="{ inputValue, inputEvents }">
							<input :value="inputValue.start" v-on="inputEvents.start" class="datepicker" />
							<span class="-ml-6 mr-2">to</span>
							<input :value="inputValue.end" v-on="inputEvents.end" class="datepicker" /><br />
						</template>
					</date-picker>
				</client-only>
				<button @click="search">
					<img src="/images/icons/search.svg" />
				</button>
			</div>
			<div class="app-user-menu">
				<template v-if="isLoggedIn">
					<img src="/images/icons/house.svg" />
					<div class="name">Host</div>
					<img :src="user.profileUrl" class="avatar" />
				</template>
				<div v-show="!isLoggedIn" id="googleButton" class="ml-8">
					<div
						id="g_id_onload"
						:data-client_id="$config.auth.clientId"
						data-auto_select="true"
						data-callback="auth"
					></div>
					<div
						class="g_id_signin"
						data-type="icon"
						data-shape="circle"
						data-theme="outline"
						data-text="signin_with"
						data-size="large"
					></div>
				</div>
			</div>
		</header>
		<nuxt />
	</div>
</template>

<script>
export default {
	//setting the data necessary for the search
	data() {
		return {
			location: {
				lat: 0,
				lng: 0,
				label: '',
			},
			range: {
				start: new Date(),
				end: new Date(),
			},
		};
	},
	//I use the mounted lifecycle hook, this is because
	//the created hook gets fired server-side, this happens
	//because nuxt needs to render the components on the dom so
	//it can deliver a complete html page
	mounted() {
		this.$maps.makeAutoComplete(this.$refs.citySearch);
	},
	// Created these computed methods to expose the user data
	// and to condition rendering based on if user is logged in
	computed: {
		user() {
			return this.$store.state.auth.user;
		},
		isLoggedIn() {
			return this.$store.state.auth.isLoggedIn;
		},
	},
	methods: {
		//this will fire when the seach button is clicked
		search() {
			if (!this.location.label) return;
			this.$router.push({
				name: 'search',
				query: {
					//spreading the location object withing the query
					...this.location,
					//adding the start and end dates to the query payload
					start: this.range.start.getTime() / 1000,
					end: this.range.end.getTime() / 1000,
				},
			});
		},
		changed(event) {
			const place = event.detail;
			if (!place.geometry) return;

			// now selecting an address will just fill the local data
			this.location.lat = place.geometry.location.lat();
			this.location.lng = place.geometry.location.lng();
			this.location.label = this.$refs.citySearch.value;
		},
	},
};
</script>
