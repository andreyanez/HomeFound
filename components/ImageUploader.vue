<template>
	<div class="mt-1 p-6 border-2 border-gray-300 border-dashed rounded-md w-fit">
		<div class="space-y-1 text-center block">
			<div class="flex text-sm text-gray-600">
				<input id="file-upload" type="file" class="" name="imageUploader" @change="uploaded" />
			</div>
		</div>
	</div>
</template>

<script>
import { unWrap } from '~/utils/fetching';
export default {
	methods: {
		async uploaded(e) {
			const file = e.target.files[0];
			if (!file) return;
			const filename = file.name.split('.').slice(0, -1).join('.') + Date.now();
			const options = {
				timestamp: Date.now(),
				public_id: filename,
			};
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
			const asset = await this.$cloudinary.upload(data, {
				...options,
				apiKey: this.$config.cloudinary.apiKey,
				signature,
			});

			this.$emit('file-uploaded', asset.public_id);
		},
	},
};
</script>

<style lang="scss" scoped></style>
