import type { Node, ShapeWithTextNode } from '@figma/rest-api-spec';

export const isShapeWithTextNode = (node: Node): node is ShapeWithTextNode =>
	node.type === 'SHAPE_WITH_TEXT';
