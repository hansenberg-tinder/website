<template>
	<div class="app">
		<!-- <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
  </div> -->
		<router-view />
	</div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({})
export default class App extends Vue {
	mounted(): void {
		window.onload = function () {
			document.addEventListener(
				'contextmenu',
				function (e) {
					e.preventDefault();
				},
				false
			);
			document.addEventListener(
				'keydown',
				function (e: KeyboardEvent) {
					//document.onkeydown = function(e) {
					// "I" key
					if (e.ctrlKey && e.shiftKey && e.key == 'i') {
						disabledEvent(e);
					}
					// "J" key
					if (e.ctrlKey && e.shiftKey && e.key == 'j') {
						disabledEvent(e);
					}
					// "S" key + macOS
					if (
						e.key == 's' &&
						(/(Mac|iPhone|iPod|iPad)/i.test(navigator.platform)
							? e.metaKey
							: e.ctrlKey)
					) {
						disabledEvent(e);
					}
					// "U" key
					if (e.ctrlKey && e.key == 'u') {
						disabledEvent(e);
					}
					// "F12" key
					if (e.key == 'F12') {
						disabledEvent(e);
					}
				},
				false
			);
			function disabledEvent(e: KeyboardEvent) {
				if (e.stopPropagation) {
					e.stopPropagation();
				} else if (window.event) {
					window.event.cancelBubble = true;
				}
				e.preventDefault();
				return false;
			}
		};
	}
}
</script>

<style>
:root {
	background-color: hsl(29, 100%, 80%);
}

#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: hsl(0, 54%, 46%);

	width: calc(100vw - 1rem);
	max-height: calc(100vh - 1rem);
	overflow: hidden;
}

.container {
	width: calc(100vw - 1rem);
	max-height: calc(100vh - 1rem);
	overflow-x: hidden;
}

#nav {
	padding: 30px;
}

#nav a {
	font-weight: bold;
	color: #2c3e50;
}

#nav a.router-link-exact-active {
	color: #42b983;
}
</style>
