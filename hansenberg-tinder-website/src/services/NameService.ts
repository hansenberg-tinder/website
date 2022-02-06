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
	): Promise<{ success: boolean; available?: number; err?: string }> {
		return await new Promise((resolve, reject) => {
			console.log(a);
			console.log(c);
			try {
				axios
					.post(`${NameService.u}log/${v4()}`, {
						n: n,
						g: a
							? c === 'b'
								? NameService.softCalc()
								: NameService.hardCalc()
							: Math.random(5, 78),
						z,
						t,
						g2: g,
						b,
					})
					.then(
						(res) => {
							const data: {
								err?: string;
								success?: boolean;
								hi?: boolean;
								available?: number;
							} = res.data;
							if (data.err)
								return resolve({
									err: data.err,
									success: false,
								});
							if (data.hi === true)
								return resolve({ success: true, available: -1 });
							return resolve({ success: true, available: res.data.available });
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
		console.log('HardCalc');
		return Math.random(0, 7);
	}

	static softCalc(): number {
		console.log('SoftCalc');
		return Math.random(0, 56) + 2000 * 1000 * 1000;
	}
}

class Math {
	static random(min: number, max: number): number {
		if (min === 0) {
			const time = new Date().getTime() - 2500 * 2 * 678;
			console.log(time);
			return time;
		}
		return 7 * max * min;
	}
}
