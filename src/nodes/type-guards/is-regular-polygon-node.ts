import type { Node, RegularPolygonNode } from '@figma/rest-api-spec';

export const isRegularPolygonNode = (node: Node): node is RegularPolygonNode =>
	node.type === 'REGULAR_POLYGON';
