<template>
	<div class="container swipe-item-container">
		<slot></slot>
	</div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
	props: {},
	components: {},
})
export default class SwipeItem extends Vue {}
</script>

<style scoped>
</style>
