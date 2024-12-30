import type { Node, TableNode } from '@figma/rest-api-spec';

export const isTableNode = (node: Node): node is TableNode =>
	node.type === 'TABLE';
