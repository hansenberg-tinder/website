<template>
	<div class="container">
		<div class="finished" v-if="finished">
			<span>Du hast alle Teilnehmer geswiped!</span>
		</div>
		<div class="swipe-container" id="stacked-cards-block" v-if="!finished">
			<!-- Swipe Items -->
			<div class="stackedcards-container">
				<SwipeItem
					class="swipe-item"
					v-for="(swipeItem, key) in swipeItems"
					:key="key"
					:data-active="currentPosition === key"
					:data-position="key"
					@touchstart="touchStart"
					@touchend="touchEnd"
					@touchmove="touchMove"
					@touchcancel="touchCancel"
				>
					<div class="card" v-if="key === currentPosition">
						<h3>
							{{ swipeItem.name }}
						</h3>
					</div>
				</SwipeItem>
			</div>
		</div>

		<!-- Global actions as alternative to swipe -->
		<div class="global-actions">
			<div class="circle pass-circle" @click="animateCard(false)">Pass</div>
			<div class="circle smash-circle" @click="animateCard(true)">Smash</div>
		</div>
	</div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import axios from 'axios';
import SwipeItem from './SwipeItem.vue';
import NameSwipeItem from '../models/NameSwipeItem';

@Options({
	props: {},
	components: {
		SwipeItem,
	},
})
export default class SmashOrPass extends Vue {
	swipeItems: NameSwipeItem[] = [];
	finished = false;

	currentPosition = 0; // Keep the position of the active stacked card.

	dItneilc = localStorage.getItem('jkl') || '';

	async created(): Promise<void> {
		if (this.dItneilc === '' || this.dItneilc === null) {
			throw new Error('No Benutzername found');
		}

		try {
			console.log('d');

			const d: string[] = (
				await axios.post('/names', {
					fd: this.dItneilc,
				})
			).data.names;
			console.log(d);
			this.swipeItems = [];

			for (let s of d) {
				this.swipeItems.push(new NameSwipeItem(s));
			}

			console.log('this.swipeItems');
			console.log(this.swipeItems);
		} catch (err) {
			console.error(err);
		}
	}

	mounted(): void {
		document.body.addEventListener('animationend', this.animationdone);
	}

	get currentCard(): NameSwipeItem {
		return this.swipeItems[this.currentPosition];
	}

	smashCard(dontCall = false): void {
		console.log('Smash');
		this.currentCard.smash(this.dItneilc);
		if (!dontCall) this.animationdone({ animationName: 'smash' });
	}

	passCard(dontCall = false): void {
		console.log('Pass');
		this.currentCard.pass(this.dItneilc);
		if (!dontCall) this.animationdone({ animationName: 'pass' });
	}

	touching = false;
	touchStartTime = -1;
	touchCurrentTime = -1;
	touchEndTime = -1;

	startx = -1;
	starty = -1;

	currentx = -1;
	currenty = -1;

	endx = -1;
	endy = -1;

	tx = 0;
	ty = 0;
	rdeg = 0;

	animating = false;

	touchStart(event: TouchEvent): void {
		if (this.animating) return;
		this.touching = true;
		this.touchStartTime = event.timeStamp;
		console.log(event);
		this.startx = event.touches[0].clientX;
		this.starty = event.touches[0].clientY;
	}
	touchMove(event: TouchEvent): void {
		if (this.animating) return;
		this.touchCurrentTime = event.timeStamp;
		this.currentx = event.touches[0].clientX;
		this.currenty = event.touches[0].clientY;

		const el = document.querySelector(
			`[data-position="${this.currentPosition}"]`
		) as HTMLElement;

		this.tx =
			(this.currentx - this.startx) / 2 + (this.currenty - this.starty) / 5;
		this.ty =
			((this.currentx - this.startx) / 2 + (this.currenty - this.starty) / 5) /
			10;
		this.rdeg = (this.currentx - this.startx) / 10;

		console.log(this.tx, this.ty, this.rdeg);

		el.style.setProperty(
			'transform',
			`translate(${this.tx}px, ${this.ty}px)` + ` ` + `rotate(${this.rdeg}deg) `
		);
	}
	touchCancel(): void {
		if (this.animating) return;
		this.resetTouch();
	}
	touchEnd(event: TouchEvent): void {
		if (this.animating) return;
		this.touchEndTime = event.timeStamp;
		console.log(event);
		this.endx = this.currentx;
		this.endy = this.currenty;
		// this.calcTouch();

		if (this.rdeg > 13) {
			this.smashCard();
		} else if (this.rdeg < -13) {
			this.passCard();
		} else {
			const el = document.querySelector(
				`[data-position="${this.currentPosition}"]`
			) as HTMLElement;
			el.classList.add('reset');
			setTimeout(() => {
				el.classList.remove('reset');
			}, 750);
		}

		// setTimeout(() => {
		this.resetTouch();
		// }, 750);
	}

	/**
	 * Calculates touch validation with time
	 * Unused
	 */
	calcTouch(): void {
		const minSwipeCoefficient = 0.45;

		const xdiff = this.endx - this.startx;
		// const ydiff = this.endy - this.starty;

		const timeDiff = this.touchEndTime - this.touchStartTime;

		console.log('xdiff', 'timeDiff');
		console.log(xdiff, timeDiff);
		if (xdiff / timeDiff < -1 * minSwipeCoefficient) {
			// Pass
			this.passCard();
		} else if (xdiff / timeDiff > minSwipeCoefficient) {
			// Smash
			this.smashCard();
		}
	}

	resetTouch(): void {
		this.touching = false;
		this.touchStartTime = -1;
		this.touchCurrentTime = -1;
		this.touchEndTime = -1;

		this.startx = -1;
		this.starty = -1;

		this.currentx = -1;
		this.currenty = -1;

		this.endx = -1;
		this.endy = -1;

		this.tx = 0;
		this.ty = 0;
		this.rdeg = 0;

		const el = document.querySelector(
			`[data-position="${this.currentPosition}"]`
		) as HTMLElement;
		el.style.setProperty('transform', '');
	}

	// Animations
	animateCard(smash: boolean): void {
		console.log(this.animating);
		if (smash) this.smashCard(true);
		else this.passCard(true);

		this.animating = true;

		document
			.querySelector(`[data-position="${this.currentPosition}"]`)
			?.classList.add(this.currentCard.status);
	}

	animationdone(ev: AnimationEvent | { animationName: string }): void {
		// get the container
		var origin = document;

		// if any of the card events have
		// ended…
		if (
			ev.animationName.includes('smash') ||
			ev.animationName.includes('pass')
		) {
			// remove the first card in the element
			const d = origin.querySelector(
				`[data-position="${this.currentPosition}"]`
			);
			if (d) {
				console.log(`Animating: ${this.animating}`);

				if (this.animating) {
					setTimeout(() => {
						d.remove();
					}, 750);
				} else d.remove();
			} else throw new Error('d not defined');

			// if there are no cards left, do nothing
			if (!origin?.querySelector('[data-position]')) {
				this.finished = true;
			} else {
				this.currentPosition += 1;
			}
			this.animating = false;
		}
	}
}
</script>

<style scoped>
@keyframes smash {
	from {
		opacity: 1;
	}
	to {
		transform: rotate(60deg) translateX(300px) translateY(-120px);
		opacity: 0;
	}
}

@keyframes pass {
	from {
		opacity: 1;
	}

	to {
		transform: rotate(-60deg) translateX(-300px) translateY(-120px);
		opacity: 0;
	}
}

@keyframes reset {
	from {
	}

	to {
		transform: rotate(0) translateX(0) translateY(0);
	}
}

.finished {
	height: calc(100vw + 2rem);
	display: table;
	width: 100%;
	text-align: center;
}
.finished span {
	display: table-cell;
	vertical-align: middle;
}

.swipe-item {
	--tx: 0px;
	--ty: 0px;
	--rdeg: 0deg;

	margin: 2rem;
	width: calc(100vw - 5rem);
}

.swipe-item.smash {
	animation: smash 0.7s ease-out;
}

.swipe-item.pass {
	animation: pass 0.7s ease-out;
}

.swipe-item.reset {
	animation: reset 0.5s ease-out;
}

.stackedcards-container {
	height: calc(100vw);
}

.card {
	border-radius: 1rem;
	border: 1px solid hsla(0, 1%, 28%, 0.678);
	box-shadow: 2px 0.1rem hsla(0, 1%, 28%, 0.678);

	width: 50vw;
	margin: 0.5rem auto;

	aspect-ratio: 1 / 1;
}

.global-actions {
	display: flex;
}

.global-actions * {
	margin: 0 0.5rem;
	margin: auto;
}

.circle {
	height: 3.5rem;
	width: 3.5rem;
	border-radius: 50%;
	line-height: 3.5rem;
	text-align: center;
}

.smash-circle {
	color: hsl(0, 0%, 26%);
	background-color: hsl(106, 81%, 36%);
}
.pass-circle {
	color: hsl(0, 0%, 60%);
	background-color: hsl(0, 81%, 36%);
}
</style>
