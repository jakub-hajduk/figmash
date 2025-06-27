import { deepEqual } from 'node:assert';
import { describe, it } from 'node:test';
import { n } from '../type-guards/mimic-type';
import { transform } from './transform';
import type { Getter } from './types';

describe('transform()', () => {
	it('should use default Getter if no getters provided', async () => {
		const output = await transform(
			n({
				type: 'TEXT',
				characters: 'Text node',
				id: '1',
				name: 'Document',
			}),
		);

		deepEqual(output, {});
	});

	it('should transform nodes', async () => {
		const idGetter: Getter = {
			test: () => true,
			get: (node) => ({ id: node.id }),
		};

		const output = await transform(
			n({
				type: 'FRAME',
				id: '1',
				name: 'Container',
			}),
			[idGetter],
		);

		deepEqual(output, { id: '1' });
	});

	it('should affect only tested nodes', async () => {
		const inputNode = n({
			type: 'Frame',
			name: 'Container',
			children: [
				{
					type: 'TEXT',
					name: 'Text layer',
					characters: 'Hello world',
				},
				{
					type: 'GROUP',
					name: 'Group 1',
				},
				{
					type: 'RECTANGLE',
					name: 'quatro rogi',
				},
				{
					type: 'CIRCLE',
					name: 'pie rogi',
				},
			],
		});

		const frameNodes: Getter = {
			test: (node) => node.type === 'RECTANGLE',
			get: (node) => ({ name: node.name }),
		};

		const output = await transform(inputNode, [frameNodes]);

		deepEqual(output, { name: 'quatro rogi' });
	});

	it('should go recursive', async () => {
		const idGetter: Getter = {
			test: () => true,
			get: (node) => ({ id: node.id }),
		};

		const output = await transform(
			n({
				id: '1',
				children: [
					{
						id: '2',
						children: [
							{
								id: '3',
							},
						],
					},
				],
			}),
			[idGetter],
		);

		deepEqual(output, {
			id: '1',
			children: [{ id: '2', children: [{ id: '3' }] }],
		});
	});

	it('should stop recursive on children: false', async () => {
		const idGetter: Getter = {
			test: (node) => Number.parseInt(node.id) <= 2,
			get: (node) => {
				return {
					id: node.id,
					children: node.id === '2' ? false : [],
				};
			},
		};

		const output = await transform(
			n({
				id: '1',
				children: [
					{
						id: '2',
						children: [
							{
								id: '3',
							},
						],
					},
				],
			}),
			[idGetter],
		);

		deepEqual(output, { id: '1', children: [{ id: '2' }] });
	});

	it('should stop recursive on specified children', async () => {
		const idGetter: Getter = {
			test: (node) => node.id === '1',
			get: (node) => {
				return {
					id: node.id,
					children: [{ id: '8' }, { id: '9' }, { id: '10' }],
				};
			},
		};

		const output = await transform(
			n({
				id: '1',
				children: [
					{
						id: '2',
						children: [
							{
								id: '3',
							},
						],
					},
				],
			}),
			[idGetter],
		);

		deepEqual(output, {
			id: '1',
			children: [{ id: '8' }, { id: '9' }, { id: '10' }],
		});
	});

	it('should acccept getters with async test', async () => {
		const idGetter: Getter = {
			test: async () => await Promise.resolve(true),
			get: (node) => ({ id: node.id }),
		};

		const output = await transform(
			n({
				id: '1',
				name: 'Test Node',
			}),
			[idGetter],
		);

		deepEqual(output, { id: '1' });
	});

	it('should acccept getters with async get', async () => {
		const idGetter: Getter = {
			test: () => Promise.resolve(true),
			get: async (node) => await Promise.resolve({ id: node.id }),
		};

		const output = await transform(
			n({
				id: '1',
				name: 'Test Node',
			}),
			[idGetter],
		);

		deepEqual(output, { id: '1' });
	});

	describe('parse tree options', () => {
		it('should ommit empty nodes if omitEmpty is true', async () => {
			const allGetter: Getter = {
				test: () => true,
				get: (node) => ({ id: node.id }),
			};
			const clearSecond: Getter = {
				test: (node) => node.id === '2',
				get: () => ({}),
			};

			const output = await transform(
				n({
					name: 'Container',
					id: '0',
					children: [
						{
							id: '1',
							name: 'First',
						},
						{
							id: '2',
							name: 'Second',
						},
						{
							id: '3',
							name: 'Third',
						},
					],
				}),
				[clearSecond, allGetter],
				{ omitEmpty: true },
			);

			deepEqual(output.children, [{ id: '1' }, { id: '3' }]);
		});

		it('should keep empty nodes if omitEmpty is false', async () => {
			const allGetter: Getter = {
				test: () => true,
				get: (node) => ({ id: node.id }),
			};
			const clearSecond: Getter = {
				test: (node) => node.id === '2',
				get: () => ({}),
			};

			const output = await transform(
				n({
					name: 'Container',
					id: '0',
					children: [
						{
							id: '1',
							name: 'First',
						},
						{
							id: '2',
							name: 'Second',
						},
						{
							id: '3',
							name: 'Third',
						},
					],
				}),
				[clearSecond, allGetter],
				{ omitEmpty: false },
			);

			deepEqual(output.children, [{ id: '1' }, {}, { id: '3' }]);
		});

		it('should remove nodes with empty children if omitFauxNodes set to true', async () => {
			const allGetter: Getter = {
				test: () => true,
				get: (node) => ({ id: node.id }),
			};
			const clearSecond: Getter = {
				test: (node) => node.id === '2',
				get: () => ({ children: [] }),
			};

			const output = await transform(
				n({
					name: 'Container',
					id: '0',
					children: [
						{
							id: '1',
							name: 'First',
						},
						{
							id: '2',
							name: 'Second',
						},
						{
							id: '3',
							name: 'Third',
						},
					],
				}),
				[clearSecond, allGetter],
				{ omitFauxNodes: true },
			);

			deepEqual(output.children, [{ id: '1' }, { id: '3' }]);
		});

		it('should keep nodes with empty children if omitFauxNodes set to false', async () => {
			const allGetter: Getter = {
				test: () => true,
				get: (node) => ({ id: node.id }),
			};
			const clearSecond: Getter = {
				test: (node) => node.id === '2',
				get: () => ({ children: [] }),
			};

			const output = await transform(
				n({
					name: 'Container',
					id: '0',
					children: [
						{
							id: '1',
							name: 'First',
						},
						{
							id: '2',
							name: 'Second',
						},
						{
							id: '3',
							name: 'Third',
						},
					],
				}),
				[clearSecond, allGetter],
				{ omitEmpty: false, omitFauxNodes: false },
			);

			deepEqual(output.children, [{ id: '1' }, { children: [] }, { id: '3' }]);
		});
	});
});
