import type { Node, StickyNode } from '@figma/rest-api-spec';

export const isStickyNode = (node: Node): node is StickyNode =>
	node.type === 'STICKY';
