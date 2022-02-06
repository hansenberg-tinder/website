<template>
	<div class="home">
		<h2>SMASH OR PASS?</h2>

		<div v-if="!submitted" class="">
			Willkommen beim Hansenberg-Tinder! Auf dieser Seite kannst du erst einmal
			dein Token, das dir ausgeteilt wurde, eingeben. Im Anschluss werden dir
			nacheinander die Teilnehmer angezeigt, die du nach links (Smash) oder nach
			rechts (Pass) swipen kannst.
			<br />
			Sobald du dein hier Token eingegeben hast, hast du 60 Minuten, um alle
			Teilnehmer zu swipen:
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
		try {
			const login = await axios.post('/trylogin', { token: this.accessToken });
			if (login.data.tl) {
				this.error = 'Leider bist du zu spät!';
				return;
			}
			if (login.data.te) {
				this.error = 'Leider bist du zu früh!';
				return;
			}
			this.id = login.data.id;
			if (login.data.success) {
				localStorage.setItem('jkl', this.id);
				this.submitted = true;
			} else {
				this.error = login.data.error;
			}
		} catch (err: any) {
			this.error =
				this.getOrEmptyString(err.response.msg) +
				'\n' +
				this.getOrEmptyString(err.response.data.msg) +
				'\n\n' +
				this.getOrEmptyString(err.response.err) +
				'\n' +
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
