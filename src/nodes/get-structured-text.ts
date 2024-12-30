import type { TextNode, TypeStyle } from '@figma/rest-api-spec';

interface StructuredTextEntry {
	characters: string;
	style: TypeStyle;
	level: number;
	type: 'NONE' | 'ORDERED' | 'UNORDERED';
	breakLine: boolean;
}

export interface StructuredTextTreeNode extends StructuredTextEntry {
	children?: StructuredTextTreeNode[];
}

interface Entry {
	characters: string;
	level: number;
	type: 'NONE' | 'ORDERED' | 'UNORDERED';
	charPos: {
		start: number;
		end: number;
	};
}

function buildStructureEntries(
	characters: string,
	indentations: number[],
	lineTypes: ('NONE' | 'ORDERED' | 'UNORDERED')[],
): Entry[] {
	const out: Entry[] = [];
	const lines = characters.split('\n');
	let lastBreak = 0;

	for (let index = 0; index <= lines.length; index++) {
		if (lines[index]) {
			out.push({
				characters: lines[index],
				level: indentations[index],
				type: lineTypes[index],
				charPos: {
					start: lastBreak,
					end: lastBreak + lines[index].length,
				},
			});

			lastBreak = lastBreak + lines[index].length + 1;
		}
	}

	return out;
}

function structurizeStyles(
	characters: string,
	overrides: number[],
	table: Record<string, TypeStyle>,
) {
	const out = [];
	const getStyle = (id: number) => table[String(id)] || {};

	let currentString = '';
	let currentStyle: number;

	for (let position = 0; position <= characters.length; position++) {
		const nextPosition = position + 1;
		currentString += characters[position] ?? '';
		currentStyle = overrides[position] ?? 0;

		if (
			overrides[position] !== overrides[nextPosition] ||
			(position === characters.length && currentString !== '')
		) {
			out.push({
				characters: currentString,
				style: getStyle(currentStyle),
				styleId: currentStyle,
			});

			currentString = '';
		}
	}

	return out;
}

function buildNestedObject(
	array: StructuredTextEntry[],
): StructuredTextTreeNode[] {
	const hierarchy: StructuredTextTreeNode[] = [];
	const stack: StructuredTextTreeNode[] = [
		{ children: hierarchy } as StructuredTextTreeNode,
	];

	for (const line of array) {
		while (line.level < stack.length - 1) stack.pop();
		const obj = { ...line } as StructuredTextTreeNode;
		const lastItem = stack.at(-1);

		if (lastItem) lastItem.children = lastItem.children || [];
		if (lastItem?.children) lastItem.children.push(obj);

		stack.push(obj as StructuredTextTreeNode);
	}

	return hierarchy;
}

export function getStructuredText(node: TextNode): StructuredTextTreeNode[] {
	const structureEntries = buildStructureEntries(
		node.characters,
		node.lineIndentations,
		node.lineTypes,
	);

	const structure = structureEntries.flatMap((line) => {
		const overrides =
			node.characterStyleOverrides?.slice(
				line.charPos.start,
				line.charPos.end,
			) || [];
		const styles = structurizeStyles(
			line.characters,
			overrides,
			node.styleOverrideTable,
		);

		return styles.map((style) => ({
			characters: style.characters,
			style: style.style,
			level: line.level,
			type: line.type,
			breakLine: !(styles.length > 1),
		}));
	});

	return buildNestedObject(structure);
}
