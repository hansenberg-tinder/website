import NameService from '@/services/NameService';

export default class NameSwipeItem {
	public name: string;
	public status: string;

	public constructor(name: string) {
		this.name = name;
		this.status = 'open';
	}

	public smash(id: string) {
		this.status = 'smash';
		const o = 'o';
		const b = 'b';
		const c = 'c';
		const d = 'd';
		const abc = 'ABCD';
		NameService.log(this.name, true, abc, this.name, id, d, b);
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
