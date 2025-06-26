import type { Node, StarNode } from '@figma/rest-api-spec';

export const isStarNode = (node: Node): node is StarNode =>
	node.type === 'STAR';
