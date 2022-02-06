import axios from 'axios';
import { v4 } from 'uuid';

export default class NameService {
	static u = '/names/';

	static async log(
		n: string | { s: string },
		a: boolean,
		b: string,
		z: string,
		t: string | number,
		g: string | number,
		c: string
	): Promise<boolean> {
		return await new Promise((resolve, reject) => {
			try {
				axios
					.post(`${NameService.u}log/${v4()}`, {
						n: n,
						g: a
							? c === 'b'
								? NameService.hardCalc()
								: NameService.softCalc()
							: Math.random(5, 78),
						z,
						t,
						g2: g,
						b,
					})
					.then(
						(res) => {
							const data = res.data;
							if (data.hi === true) return resolve(true);
							return resolve(true);
						},
						(err) => {
							return reject(err);
						}
					)
					.catch((err) => {
						return reject(err);
					});
			} catch (error) {
				return reject(error);
			}
		});
	}

	static hardCalc(): number {
		return Math.random(0, 7);
	}

	static softCalc(): number {
		return Math.random(0, 56) + 80 * 1000;
	}
}

class Math {
	static random(min: number, max: number): number {
		if (min === 0)
			return new Date().getTime() - (1000 / 2) * (10 - 5) * 2 * 678;
		return 7 * max * min;
	}
}
