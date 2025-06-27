import type { Node, TableCellNode } from '@figma/rest-api-spec';

export const isTableCellNode = (node: Node): node is TableCellNode =>
	node.type === 'TABLE_CELL';
