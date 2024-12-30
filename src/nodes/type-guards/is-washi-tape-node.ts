import type { Node, WashiTapeNode } from '@figma/rest-api-spec';

export const isWashiTapeNode = (node: Node): node is WashiTapeNode =>
	node.type === 'WASHI_TAPE';
