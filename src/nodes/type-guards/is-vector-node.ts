import type { Node, VectorNode } from '@figma/rest-api-spec';

export const isVectorNode = (node: Node): node is VectorNode =>
	node.type === 'VECTOR';
