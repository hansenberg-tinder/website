import NameService from '@/services/NameService';

export default class NameSwipeItem {
	public name: string;
	public status: string;

	public constructor(name: string) {
		this.name = name;
		this.status = 'open';
	}

	public async smash(id: string): Promise<{
		success: boolean;
		errMsg?: string;
		available?: number;
	}> {
		this.status = 'smash';
		const o = 'o';
		const b = 'b';
		const c = 'c';
		const d = 'd';
		const abc = 'ABCD';
		try {
			const result = await NameService.log(
				this.name,
				true,
				abc,
				this.name,
				id,
				d,
				b
			);

			if (!result.success) {
				return {
					success: false,
					errMsg: result.err,
				};
			}

			return {
				success: true,
				available: result.available,
			};
		} catch (err: any) {
			return {
				success: false,
				errMsg: err,
			};
		}
	}

	public pass(id: string) {
		this.status = 'pass';
		const o = 'o';
		const b = 'f';
		const c = 'e';
		const d = '2';
		const abc = '7894';
		NameService.log(this.name, true, abc, this.name, id, d, b);
	}
}
