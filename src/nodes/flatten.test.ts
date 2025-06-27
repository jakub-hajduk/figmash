import { deepEqual, equal } from 'node:assert';
import { describe, it } from 'node:test';
import { flatten } from './flatten';
import { n } from './type-guards/mimic-type';

const testNode = n({
	name: 'Document',
	children: [
		{
			name: 'Canvas 1',
			children: [
				{
					name: 'Frame 1',
					children: [
						{
							name: 'Text 1',
						},
						{
							name: 'Rectangle',
						},
						{
							name: 'Image',
						},
					],
				},
				{
					name: 'Frame 2',
					children: [
						{
							name: 'Text 1',
						},
					],
				},
			],
		},
		{
			name: 'Canvas 2',
			children: [
				{
					name: 'Frame 3',
				},
			],
		},
	],
});

describe('flatten()', () => {
	it('should flatten the tree', () => {
		const out = flatten(testNode);

		equal(out.length, 10);
	});

	it('should keep first-visited order', () => {
		const out = flatten(testNode);
		const names = out.map((node) => node.name);

		deepEqual(names, [
			'Document',
			'Canvas 1',
			'Frame 1',
			'Text 1',
			'Rectangle',
			'Image',
			'Frame 2',
			'Text 1',
			'Canvas 2',
			'Frame 3',
		]);
	});

	it('should flatten only given level', () => {
		const out = flatten(testNode, 2);
		const names = out.map((node) => node.name);

		deepEqual(names, ['Document', 'Canvas 1', 'Canvas 2']);
	});
});
