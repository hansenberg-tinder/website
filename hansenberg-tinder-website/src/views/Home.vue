<template>
	<div class="home">
		<h2>SMASH OR PASS?</h2>

		<div v-if="!submitted" class="">
			Deinen Benutzernamen bitte hier eingeben:
			<input v-model="accessToken" />
			<button @click="submit">Bestätigen</button>
		</div>
		<SmashOrPass v-else :dItneilc="id" />

		<div class="error">{{ error }}</div>
	</div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import axios from 'axios';
import SmashOrPass from '../components/SmashOrPass.vue';

@Options({
	components: {
		SmashOrPass,
	},
})
export default class Home extends Vue {
	accessToken = '';
	id = '';
	submitted = false;
	error = '';

	created(): void {
		console.log(`Home Created`);

		this.id = localStorage.getItem('jkl') || '';
		if (this.id !== '' && this.id !== null) {
			this.submitted = true;
		}
	}

	async submit(): Promise<void> {
		console.log('Try submitting with token: ' + this.accessToken);
		const login = await axios.post('/trylogin', { token: this.accessToken });
		this.id = login.data.id;
		if (login.data.success) {
			localStorage.setItem('jkl', this.id);
			this.submitted = true;
		} else {
			this.error = login.data.error;
		}
	}
}
</script>

<style scoped>
h2 {
	margin: 0.75rem;
}

.error {
	color: red;
	font-weight: bolder;
}
</style>
