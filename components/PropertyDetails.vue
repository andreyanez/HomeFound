<template>
	<div class="app-wrapper">
		<div class="app-double-column app-property-details">
			<div>
				<h1>{{ home.title }}</h1>
				<div class="app-flex">
					<div class="app-address">
						{{ home.location.address }} {{ home.location.city }} {{ home.location.state }}
						{{ home.location.country }}
					</div>
					<div class="app-rating">
						{{ home.reviewValue }} <span>({{ home.reviewCount }})</span>
					</div>
				</div>
				<div class="app-property-details-footer">
					{{ pluralize(home.guests, 'guest') }} &middot;
					{{ pluralize(home.bedrooms, 'room') }} &middot; {{ pluralize(home.beds, 'bed') }} &middot;
					{{ pluralize(home.bathrooms, 'bath') }}
				</div>
			</div>
			<div>
				<div class="app-price">${{ home.pricePerNight }}<span> / night</span></div>
				<client-only>
					<date-picker
						v-model="range"
						is-range
						timezone="UTC"
						:modelConfig="{ timeAdjust: '00:00:00' }"
						class="app-search"
					>
						<template v-slot="{ inputValue, inputEvents }">
							<input
								:value="inputValue.start"
								v-on="inputEvents.start"
								class="datepicker"
								placeholder="Check in"
							/>
							<input
								:value="inputValue.end"
								v-on="inputEvents.end"
								class="datepicker"
								placeholder="Check out"
							/>
						</template>
					</date-picker>
				</client-only>
				<button class="app-big-button h-17" @click="checkout">
					<span v-if="isLoading" class="block w-14"><LoadingSpinner size="50px" /></span>
					<span v-else>Request to book!</span>
				</button>
			</div>
		</div>
	</div>
</template>
<script>
import pluralize from '~/utils/pluralize';
export default {
	props: {
		home: {
			type: Object,
			required: true,
		},
	},
	mounted() {
		if (this.$route.query.result == 'success') {
			alert('Success!');
		}
	},
	methods: {
		pluralize,
		checkout() {
			//checking if user selected a date range
			if (!this.range.start || !this.range.end) {
				alert('Please select a start and end date');
				return;
			}
			//checking if user selected a date range within a day apart
			if (this.range.start.toString() == this.range.end.toString()) {
				alert('Start and end dates must be at least 1 day apart');
				return;
			}
			//checking if user is logged in before booking
			if (!this.$store.getters['isLoggedIn']) {
				alert('You must sign in to book your stay');
				return;
			}
			this.isLoading = true;
			const start = this.range.start.getTime() / 1000;
			const end = this.range.end.getTime() / 1000;
			//calling the new stripe plugin
			//sending the id of the home owner
			this.$stripe.checkout(this.home.objectID, start, end);
		},
	},
	data() {
		return {
			range: {
				start: null,
				end: null,
			},
			isLoading: false,
		};
	},
};
</script>
