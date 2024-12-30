import type { DocumentNode, Node } from '@figma/rest-api-spec';

export const isDocumentNode = (node: Node): node is DocumentNode =>
	node.type === 'DOCUMENT';
