import type { EmbedNode, Node } from '@figma/rest-api-spec';

export const isEmbedNode = (node: Node): node is EmbedNode =>
	node.type === 'EMBED';
