<template>
	<div class="app bg-gray-100">
		<header class="app-header fixed top-0 w-full z-20 bg-gray-100" id="header">
			<nuxt-link to="/" class="app-logo">
				<img src="/company_logo.svg" alt="airbnb_clone" width="150" />
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
				<UserLog />
			</div>
		</header>
		<nuxt />
		<footer class="bg-white">
			<div class="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
				<nuxt-link to="/" class="mb-10 block">
					<img src="/company_logo.svg" alt="airbnb_clone" width="150" class="mx-auto" />
				</nuxt-link>
				<nav class="-mx-5 -my-2 flex flex-wrap justify-center" aria-label="Footer">
					<div class="px-5 py-2">
						<a href="#" class="text-base text-gray-500 hover:text-gray-900"> About </a>
					</div>

					<div class="px-5 py-2">
						<a href="#" class="text-base text-gray-500 hover:text-gray-900"> Tools </a>
					</div>
				</nav>

				<p class="mt-8 text-center text-base text-gray-400">
					&copy; 2022 Made by
					<a href="https://github.com/andreyanez" target="_blank" class="text-gray-500"
						>andreyanez</a
					>
				</p>
			</div>
		</footer>
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
		window.addEventListener('scroll', this.scrollHeader);
	},
	methods: {
		//this will fire when the seach button is clicked
		search() {
			//checking if there's a address and range selected before searching
			if (!this.location.label || !this.range.start || !this.range.end) return;
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
		//simple event that adds class to header on scroll
		scrollHeader(e) {
			const navbarElement = document.getElementById('header');
			if (e.target.scrollingElement.scrollTop >= 15) {
				navbarElement.classList.add('activated');
			} else {
				navbarElement.classList.remove('activated');
			}
		},
	},
};
</script>
