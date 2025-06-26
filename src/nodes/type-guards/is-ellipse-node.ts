import type { EllipseNode, Node } from '@figma/rest-api-spec';

export const isEllipseNode = (node: Node): node is EllipseNode =>
	node.type === 'ELLIPSE';
