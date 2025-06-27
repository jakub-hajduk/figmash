import type { LineNode, Node } from '@figma/rest-api-spec';

export const isLineNode = (node: Node): node is LineNode =>
	node.type === 'LINE';
