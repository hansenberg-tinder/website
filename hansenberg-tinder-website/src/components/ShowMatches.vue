<template>
	<div class="container show-matches">
		<h2>SMASH OR PASS?</h2>

		<h3>Matches</h3>
		<div v-if="!submitted" class="">
			Dein neues Token bitte hier eingeben:
			<input v-model="accessToken" />
			<button @click="submit">Bestätigen</button>
		</div>
		<SmashOrPass v-else :dItneilc="id" />

		<div class="error">{{ error }}</div>
	</div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import axios, { AxiosError } from 'axios';
import SmashOrPass from '../components/SmashOrPass.vue';

@Options({
	components: {
		SmashOrPass,
	},
})
export default class Home extends Vue {
	accessToken = '';
	matches = [];
	submitted = false;
	error = '';

	created(): void {}

	async submit(): Promise<void> {
		try {
			const login = await axios.post('/try/second/login', {
				aToken: this.accessToken,
			});
			this.matches = login.data.m;
			if (login.data.success) {
				this.submitted = true;
			} else {
				this.error = login.data.error;
			}
		} catch (err: any) {
			this.error =
				'Welches von den beiden: ?\n' +
				this.getOrEmptyString(err.response.msg) +
				this.getOrEmptyString(err.response.data.msg) +
				'\n\n' +
				this.getOrEmptyString(err.response.err) +
				this.getOrEmptyString(err.response.data.err);
		}
	}

	getOrEmptyString(s: string): string {
		if (s !== undefined && s !== null) {
			return s + '\n';
		}
		return '';
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
