import type { Node, TextNode } from '@figma/rest-api-spec';

export const isTextNode = (node: Node): node is TextNode =>
	node.type === 'TEXT';
