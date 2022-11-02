<template>
	<div>
		<client-only>
			<template #placeholder>
				<LoadingSpinner size="50px" />
			</template>

			<button
				aria-label="Google Login"
				class="grid p-2 rounded-full place-content-center"
				v-show="!isLoading && !isUserLoggedIn"
				@click="login"
			>
				Login
			</button>
			<div v-if="isUserLoggedIn" class="relative">
				<!-- Drop Down Menu -->
				<button
					ref="dropdownInfoBtn"
					id="dropdownInfoBtn"
					data-dropdown-toggle="dropdownInformation"
					class="flex items-center gap-2 px-2 py-1 text-sm font-medium bg-white shadow text-primary-250 hover:bg-dodger-blue hover:text-white app-button"
					type="button"
					@click="isDropdownActive = !isDropdownActive"
				>
					<img
						class="w-8 h-8 border-2 rounded-full border-primary-200"
						aria-label="User Image"
						referrerpolicy="no-referrer"
						:src="userInfo.photoURL"
					/>

					<p>{{ userInfo.displayName.split(' ')[0] }}</p>
				</button>

				<!-- Dropdown Info Menu -->
				<div
					ref="dropdownInfoMenu"
					id="dropdownInfoMenu"
					class="z-10 hidden w-48 bg-white divide-y divide-gray-100 rounded shadow"
					:class="{ active: isDropdownActive }"
					@click="handleDropdown"
				>
					<!-- User Info -->
					<div class="px-4 py-3 text-sm text-gray-900">
						<div class="truncate">{{ userInfo.displayName }}</div>
						<div class="font-medium truncate">{{ userInfo.email }}</div>
					</div>

					<!-- Links -->
					<ul class="py-1 text-sm text-gray-700" aria-labelledby="dropdownInformationButton">
						<li>
							<NuxtLink
								class="block px-4 py-2 hover:bg-gray-100 hover:text-primary-200"
								to="/admin/homes"
								>Add a Home</NuxtLink
							>
						</li>
					</ul>
					<div class="py-1">
						<button
							@click="logout"
							v-show="isUserLoggedIn"
							class="w-full px-4 py-2 group hover:bg-gray-100"
						>
							<div class="flex items-center gap-2">
								<p class="group-hover:text-red-700">Logout</p>
							</div>
						</button>
					</div>
				</div>
			</div>
		</client-only>
	</div>
</template>

<script>
export default {
	data() {
		return {
			isLoading: false,
			isDropdownActive: false,
		};
	},
	computed: {
		isUserLoggedIn() {
			return this.$store.getters['isLoggedIn'];
		},
		userInfo() {
			return this.$store.state.authUser;
		},
	},
	methods: {
		async login() {
			this.isLoading = true;
			try {
				let provider = new this.$fireModule.auth.GoogleAuthProvider();
				await this.$fire.auth.signInWithPopup(provider);
			} catch (error) {
				console.log(error);
			}
			this.isLoading = false;
		},
		async logout() {
			await this.$fire.auth.signOut();
		},
		handleDropdown(event) {
			if (!dropdownInfoBtn.contains(event.target) && !dropdownInfoMenu.contains(event.target))
				this.isDropdownActive = false;
		},
	},
	mounted() {
		if (process.client) {
			window.addEventListener('click', this.handleDropdown);
		}
	},
};
</script>

<style scoped>
#dropdownInfoMenu.active {
	@apply block absolute top-12 right-0;
}
</style>
