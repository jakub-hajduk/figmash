import type { Node, SliceNode } from '@figma/rest-api-spec';

export const isSliceNode = (node: Node): node is SliceNode =>
	node.type === 'SLICE';
