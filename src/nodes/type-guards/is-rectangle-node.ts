import type { Node, RectangleNode } from '@figma/rest-api-spec';

export const isRectangleNode = (node: Node): node is RectangleNode =>
	node.type === 'RECTANGLE';
