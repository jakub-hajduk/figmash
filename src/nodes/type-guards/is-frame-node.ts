import type { FrameNode, Node } from '@figma/rest-api-spec';

export const isFrameNode = (node: Node): node is FrameNode =>
	node.type === 'FRAME';
