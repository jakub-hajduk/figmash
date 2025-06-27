import { deepEqual, equal } from 'node:assert';
import { describe, it, mock } from 'node:test';
import { n } from './type-guards/mimic-type';
import { walk } from './walk';

const simpleNode = n({
	name: 'root',
	children: [
		{
			name: 'level 1',
			children: [
				{
					name: 'level 2',
					children: [
						{
							name: 'level 3.0',
						},
						{
							name: 'level 3.1',
						},
						{
							name: 'level 3.2',
						},
					],
				},
			],
		},
	],
});

describe('walk()', () => {
	it('should call callback on each node', () => {
		const callback = mock.fn();
		walk(simpleNode, callback);

		equal(callback.mock.callCount(), 6);
	});

	it('should count indexes', () => {
		const out: number[] = [];
		walk(simpleNode, (_node, _path, index) => {
			out.push(index);
		});

		equal(out[0], 0);
		equal(out[1], 0);
		equal(out[2], 0);
		equal(out[3], 0);
		equal(out[4], 1);
		equal(out[5], 2);
	});

	it('should genreate correct path', () => {
		const out: string[][] = [];

		walk(simpleNode, (_node, path) => {
			out.push(path.map((p) => p.name));
		});

		deepEqual(out[0], ['root']);
		deepEqual(out[1], ['root', 'level 1']);
		deepEqual(out[2], ['root', 'level 1', 'level 2']);
		deepEqual(out[3], ['root', 'level 1', 'level 2', 'level 3.0']);
		deepEqual(out[4], ['root', 'level 1', 'level 2', 'level 3.1']);
		deepEqual(out[5], ['root', 'level 1', 'level 2', 'level 3.2']);
	});
});
