import type { CanvasNode, Node } from '@figma/rest-api-spec';

export const isCanvasNode = (node: Node): node is CanvasNode =>
	node.type === 'CANVAS';
