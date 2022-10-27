<template>
	<div class="border-gray-400 rounded-3xl border-2 p-9 flex justify-between mb-12">
		<div class="homes__list">
			<h3 class="text-3xl leading-6 font-medium text-gray-900 mb-7">Your list of homes</h3>
			<ul>
				<li v-for="home in homeList" :key="home.objectID" class="mb-4">
					<p class="">{{ home.title }}</p>
					<button class="text-red-800" @click="deleteHome(home.objectID)">Delete</button>
				</li>
			</ul>
		</div>
		<div class="homes__form w-3/4">
			<h2 class="text-3xl leading-6 font-medium text-gray-900 mb-7">Add a Home</h2>

			<form class="space-y-8 divide-y divide-gray-200" @submit.prevent="onSubmit">
				<div class="space-y-8 divide-y divide-gray-200">
					<div>
						<div>
							<h3 class="text-lg leading-6 font-medium text-gray-900">Home Information</h3>
							<p class="mt-1 text-sm text-gray-500">Register the details of your home</p>
						</div>
						<div class="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
							<div class="sm:col-span-3">
								<label for="home-name" class="block text-sm font-medium text-gray-700">
									Title
								</label>
								<div class="mt-1">
									<input
										type="text"
										name="home-name"
										id="home-name"
										v-model="home.title"
										class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
									/>
								</div>
							</div>

							<div class="sm:col-span-4">
								<label for="about" class="block text-sm font-medium text-gray-700"> About </label>
								<div class="mt-1">
									<textarea
										id="about"
										name="about"
										rows="3"
										v-model="home.description"
										class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md"
									></textarea>
								</div>
								<p class="mt-2 text-sm text-gray-500">Describe your home.</p>
							</div>

							<div class="sm:col-span-4">
								<label for="note" class="block text-sm font-medium text-gray-700"> Note </label>
								<div class="mt-1">
									<input
										v-model="home.note"
										id="note"
										name="note"
										type="text"
										class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
									/>
								</div>
							</div>

							<div class="sm:col-span-6">
								<label for="features" class="block text-sm font-medium text-gray-700">
									Features
								</label>
								<div class="flex flex-wrap gap-5">
									<div class="mt-1">
										<input
											type="text"
											name="Feature"
											v-model="home.features[0]"
											class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
										/>
									</div>
									<div class="mt-1">
										<input
											type="text"
											name="Feature"
											v-model="home.features[1]"
											class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
										/>
									</div>

									<div class="mt-1">
										<input
											type="text"
											name="Feature"
											v-model="home.features[2]"
											class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
										/>
									</div>
									<div class="mt-1">
										<input
											type="text"
											name="Feature"
											v-model="home.features[3]"
											class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
										/>
									</div>
								</div>
							</div>
							<div class="sm:col-span-2">
								<label for="price" class="block text-sm font-medium text-gray-700">
									Price Per Night
								</label>
								<div class="mt-1">
									<input
										type="number"
										name="price"
										id="price"
										v-model="home.pricePerNight"
										class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
									/>
								</div>
							</div>
							<div class="flex flex-wrap gap-5 sm:col-span-6">
								<div>
									<label for="guests" class="block text-sm font-medium text-gray-700">
										Guests
									</label>
									<div class="mt-1">
										<input
											type="number"
											name="guests"
											id="guests"
											v-model="home.guests"
											class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
										/>
									</div>
								</div>
								<div>
									<label for="bedrooms" class="block text-sm font-medium text-gray-700">
										Bedrooms
									</label>
									<div class="mt-1">
										<input
											type="number"
											name="bedrooms"
											id="bedrooms"
											v-model="home.bedrooms"
											class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
										/>
									</div>
								</div>
								<div>
									<label for="beds" class="block text-sm font-medium text-gray-700"> Beds </label>
									<div class="mt-1">
										<input
											type="number"
											name="beds"
											id="beds"
											v-model="home.beds"
											class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
										/>
									</div>
								</div>
								<div>
									<label for="bathrooms" class="block text-sm font-medium text-gray-700">
										Bathrooms
									</label>
									<div class="mt-1">
										<input
											type="number"
											name="bathrooms"
											id="bathrooms"
											v-model="home.bathrooms"
											class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
										/>
									</div>
								</div>
							</div>
							<div class="sm:col-span-4">
								<label for="price" class="block text-sm font-medium text-gray-700">
									Location
								</label>
								<div class="mt-1">
									<input
										type="text"
										ref="locationSelector"
										autocomplete="off"
										placeholder="Select a location"
										@changed="changed"
										name="location"
										id="location"
										class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
									/>
								</div>
							</div>
							<div class="sm:col-span-6 flex flex-wrap gap-5">
								<p>Address: {{ home.location.address }}</p>
								<p>City: {{ home.location.city }}</p>
								<p>State: {{ home.location.state }}</p>
								<p>Postal Code: {{ home.location.postalCode }}</p>
								<p>Country: {{ home.location.country }}</p>
							</div>
						</div>
					</div>

					<div class="pt-8">
						<div>
							<h3 class="text-lg leading-6 font-medium text-gray-900">Images</h3>
							<p class="mt-1 text-sm text-gray-500">Add up to 4 images total.</p>
						</div>
						<div class="mt-6">
							<div class="flex flex-wrap gap-y-6 gap-x-4">
								<ImageUploader
									@image-loading="isLoading = $event"
									@file-uploaded="imageUpdated($event, 0)"
								/>
								<ImageUploader
									@image-loading="isLoading = $event"
									@file-uploaded="imageUpdated($event, 1)"
								/>
								<ImageUploader
									@image-loading="isLoading = $event"
									@file-uploaded="imageUpdated($event, 2)"
								/>
								<ImageUploader
									@image-loading="isLoading = $event"
									@file-uploaded="imageUpdated($event, 3)"
								/>
							</div>
						</div>
					</div>

					<div class="pt-8">
						<div>
							<h3 class="text-lg leading-6 font-medium text-gray-900">Property Availability</h3>
							<p class="mt-1 text-sm text-gray-500">Set up to two possible ranges for your home.</p>
						</div>
						<div class="mt-6 gap-y-6 gap-x-4">
							<date-picker
								v-for="(range, index) in home.availabilityRanges"
								:key="index"
								v-model="home.availabilityRanges[index]"
								is-range
								timezone="UTC"
								:modelConfig="{ timeAdjust: '00:00:00' }"
							>
								<template v-slot="{ inputValue, inputEvents }">
									<div class="mb-4">
										<span class="inline-block mr-2">From</span>
										<input
											:value="inputValue.start"
											class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2 sm:text-sm border-gray-300 rounded-md"
											v-on="inputEvents.start"
										/>
										<span class="inline-block mx-2">to</span>
										<input
											:value="inputValue.end"
											class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2 sm:text-sm border-gray-300 rounded-md"
											v-on="inputEvents.end"
										/>
									</div>
								</template>
							</date-picker>
						</div>
					</div>
				</div>

				<div class="pt-5">
					<div class="flex justify-end">
						<button
							type="submit"
							:disabled="isLoading"
							class="w-22 h-9 inline-flex items-center justify-center border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-dodger-blue hover:bg-polo-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
						>
							<LoadingSpinner v-if="isLoading" size="20px" />
							<span v-else>Add Home</span>
						</button>
					</div>
				</div>
			</form>
		</div>
	</div>
</template>
<script>
import { unWrap } from '~/utils/fetching';
export default {
	data() {
		return {
			homeList: [],
			home: {
				title: '',
				description: '',
				note: '',
				pricePerNight: '',
				guests: '',
				bedrooms: '',
				beds: '',
				bathrooms: '',
				features: ['', '', '', ''],
				location: {
					address: '',
					city: '',
					state: '',
					postalCode: '',
					country: '',
				},
				_geoloc: {
					lat: '',
					lng: '',
				},
				images: [],
				availabilityRanges: [
					{
						start: '',
						end: '',
					},
					{
						start: '',
						end: '',
					},
				],
			},
			isLoading: false,
		};
	},
	mounted() {
		this.$maps.makeAutoComplete(this.$refs.locationSelector, ['address']);
		this.setHomesList();
	},
	methods: {
		async deleteHome(homeId) {
			await fetch(`/api/homes/${homeId}`, {
				method: 'DELETE',
			});
			// removing the deleted home from the view
			const index = this.homeList.findIndex(obj => obj.objectID == homeId);
			this.homeList.splice(index, 1);
		},
		async setHomesList() {
			this.homeList = (await unWrap(await fetch('/api/homes/user/'))).json;
		},
		changed(event) {
			const addressParts = event.detail.address_components;
			const street = this.getAddressPart(addressParts, 'street_number')?.short_name || '';
			const route = this.getAddressPart(addressParts, 'route')?.short_name || '';
			this.home.location.address = street + ' ' + route;
			this.home.location.city = this.getAddressPart(addressParts, 'locality')?.short_name || '';
			this.home.location.state =
				this.getAddressPart(addressParts, 'administrative_area_level_1')?.long_name || '';
			this.home.location.country = this.getAddressPart(addressParts, 'country')?.short_name || '';
			this.home.location.postalCode =
				this.getAddressPart(addressParts, 'postal_code')?.short_name || '';
			const geo = event.detail.geometry.location;
			this.home._geoloc.lat = geo.lat();
			this.home._geoloc.lng = geo.lng();
		},
		getAddressPart(parts, type) {
			return parts.find(part => part.types.includes(type));
		},
		imageUpdated(imageUrl, index) {
			this.home.images[index] = imageUrl;
		},
		async onSubmit() {
			this.isLoading = true;

			//In case user uploads images skipping inputs
			//This filters only the not null values and sends them
			const newArray = this.home.images.filter(n => n);
			this.home.images = newArray;

			// unwraping the response on a variable
			// to be able to update the homeslist once a new
			// home is added
			const response = await unWrap(
				await fetch('/api/homes', {
					method: 'POST',
					body: JSON.stringify(this.home),
					headers: {
						'Content-Type': 'application/json',
					},
				})
			);

			this.homeList.push({
				//title comes from the just added home form
				title: this.home.title,
				objectID: response.json.homeId,
			});

			this.isLoading = false;
		},
	},
};
</script>
