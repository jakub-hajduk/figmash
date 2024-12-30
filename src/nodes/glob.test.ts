import { equal } from 'node:assert';
import { describe, it } from 'node:test';
import { glob } from './glob';
import { n } from './type-guards/mimic-type';

const testNode = n({
	name: 'root',
	children: [
		{
			name: 'Frame 1',
		},
		{
			name: 'Frame 2',
			children: [
				{
					name: 'image 1',
				},
				{
					name: 'group',
					children: [
						{
							name: 'image 2',
						},
						{
							name: 'description',
						},
					],
				},
			],
		},
		{
			name: 'Frame 3',
			children: [
				{
					name: 'image 3',
				},
				{
					name: 'description',
				},
				{
					name: 'paragraph test',
				},
			],
		},
	],
});

describe('glob()', () => {
	it('should accept one path', () => {
		const out = glob(testNode, 'root/*');

		equal(out.length, 3);
	});

	it('should accept multiple paths', () => {
		const out = glob(testNode, ['root/*', '**/image*']);

		equal(out.length, 6);
	});
});
