<template>
	<!-- <div class="mt-1 p-6 border-2 border-gray-300 border-dashed rounded-md w-fit">
		<div class="space-y-1 text-center block">
			<div class="flex text-sm text-gray-600">
				<input
					id="file-upload"
					type="file"
					accept="image/jpg"
					name="imageUploader"
					ref="imageUploadInput"
					@change="uploaded"
				/>
			</div>
		</div>
	</div> -->
	<div
		class="mt-1 flex justify-center items-center px-6 pt-5 pb-6 border-2 w-44 border-gray-300 border-dashed rounded-md"
	>
		<LoadingSpinner v-if="isLoading" size="40px" />
		<div class="space-y-1 text-center" v-show="!isLoading">
			<svg
				class="mx-auto h-12 w-12 text-gray-400"
				stroke="currentColor"
				fill="none"
				viewBox="0 0 48 48"
				aria-hidden="true"
			>
				<path
					d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
			<div class="flex justify-center text-sm text-gray-600">
				<label
					class="relative cursor-pointer font-medium text-polo-blue hover:text-mineshaft focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-mineshaft"
				>
					<span ref="inputName">Upload a file</span>
					<input
						id="file-upload"
						ref="imageUploadInput"
						type="file"
						class="sr-only"
						@change="uploaded"
					/>
				</label>
			</div>
			<p class="text-xs text-gray-500" ref="inputMessage">PNG, JPG up to 10MB</p>
		</div>
	</div>
</template>

<script>
import { unWrap } from '~/utils/fetching';
export default {
	methods: {
		async uploaded(e) {
			//Capturing the uploaded file
			const file = e.target.files[0];
			if (!file) return;
			const filesize = file.size / 1000000;
			// validating max 10mb file size client side
			if (filesize > 10) {
				this.$refs.imageUploadInput.value = '';
				this.$refs.inputMessage.innerText = 'File size is too big!';
				setTimeout(() => {
					this.$refs.inputMessage.innerText = 'PNG, JPG up to 10MB';
				}, 6000);
				return;
			}

			this.isLoading = true;
			// changing the filename, removing any hyphens
			const filename = file.name.replace(/-/, '').split('.').slice(0, -1).join('.') + Date.now();
			const options = {
				timestamp: Date.now(),
				public_id: filename,
			};
			// calling cloudinary api to encrypr the file
			const response = await unWrap(
				await fetch('/api/cloudinary/signature', {
					method: 'POST',
					body: JSON.stringify(options),
					headers: {
						'Content-Type': 'application/json',
					},
				})
			);
			const signature = response.json.signature;

			const readData = fileObj =>
				new Promise(resolve => {
					const reader = new FileReader();
					reader.onloadend = () => resolve(reader.result);
					reader.readAsDataURL(fileObj);
				});
			const data = await readData(file);

			const cloudinaryResponse = await this.$cloudinary.upload(data, {
				...options,
				apiKey: this.$config.cloudinary.apiKey,
				signature,
			});

			// validating max 10mb file size server side
			// emitting the id back to parent component
			if (cloudinaryResponse.error) {
				this.$refs.inputMessage.innerText = 'File size is too big!';
				return;
			}
			this.$refs.inputName.innerText = file.name;
			this.$emit('file-uploaded', cloudinaryResponse.public_id);
			this.isLoading = false;
		},
	},
	data() {
		return {
			isLoading: false,
		};
	},
};
</script>
