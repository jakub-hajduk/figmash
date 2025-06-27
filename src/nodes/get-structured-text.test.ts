import { deepEqual, equal } from 'node:assert';
import { describe, it } from 'node:test';
import type { TextNode } from '@figma/rest-api-spec';
import { getStructuredText } from './get-structured-text';
import { n } from './type-guards/mimic-type';

describe('getStructuredText', () => {
	it('Should build structured tree based on lineIndentations', () => {
		const textNode = n<TextNode>({
			characters: 'A\nB\nC',
			lineIndentations: [0, 1, 2],
			lineTypes: ['UNORDERED', 'UNORDERED', 'UNORDERED'],
			characterStyleOverrides: [0, 0, 0, 0, 0],
			styleOverrideTable: {
				'0': {},
			},
		});

		const structure = getStructuredText(textNode);

		equal(structure[0].characters, 'A');
		equal(structure[0].children?.[0].characters, 'B');
		equal(structure[0].children?.[0].children?.[0].characters, 'C');
	});

	describe('should distinct between', () => {
		it('one line', () => {
			const textNode = n<TextNode>({
				characters: 'AB',
				lineIndentations: [0],
				lineTypes: ['NONE'],
				characterStyleOverrides: [0, 1],
				styleOverrideTable: {
					'0': {},
					'1': {},
				},
			} as TextNode);

			const structure = getStructuredText(textNode);

			equal(structure[0].breakLine, false);
			equal(structure[1].breakLine, false);
		});

		it('new lines', () => {
			const textNode = n<TextNode>({
				characters: 'A\nB',
				lineIndentations: [0, 0, 0],
				lineTypes: ['NONE', 'NONE', 'NONE'],
				characterStyleOverrides: [0, 0, 1],
				styleOverrideTable: {
					'0': {},
					'1': {},
				},
			} as TextNode);

			const structure = getStructuredText(textNode);

			equal(structure[0].breakLine, true);
			equal(structure[1].breakLine, true);
		});
	});

	describe('Should build styles', () => {
		it('in single line', () => {
			const textNode = n<TextNode>({
				characters: 'A B',
				lineIndentations: [0],
				lineTypes: ['NONE'],
				characterStyleOverrides: [0, 0, 1],
				styleOverrideTable: {
					'0': {},
					'1': {
						italic: true,
					},
				},
			} as TextNode);

			const styles = getStructuredText(textNode);

			deepEqual(styles[0].style, {});
			deepEqual(styles[1].style, { italic: true });
		});

		it('in multiple lines', () => {
			const textNode = n<TextNode>({
				characters: 'A\nB',
				lineIndentations: [0, 0],
				lineTypes: ['NONE', 'NONE'],
				characterStyleOverrides: [0, 0, 1],
				styleOverrideTable: {
					'0': {},
					'1': {
						italic: true,
					},
				},
			} as TextNode);

			const styles = getStructuredText(textNode);

			deepEqual(styles[0].style, {});
			deepEqual(styles[1].style, { italic: true });
		});

		it('in nested lines', () => {
			const textNode = n<TextNode>({
				characters: 'A\nB',
				lineIndentations: [0, 1],
				lineTypes: ['NONE', 'NONE'],
				characterStyleOverrides: [0, 0, 1],
				styleOverrideTable: {
					'0': {},
					'1': {
						italic: true,
					},
				},
			} as TextNode);

			const styles = getStructuredText(textNode);

			deepEqual(styles[0].style, {});
			deepEqual(styles[0].children?.[0].style, { italic: true });
		});
	});
});
