import { equal } from 'node:assert';
import { describe, it } from 'node:test';
import { findDeep } from './find-deep';
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

describe('findDeep()', () => {
	it('should return searched node', () => {
		const out = findDeep(testNode, (node) => node.name === 'description');

		equal(out?.name, 'description');
	});
});
