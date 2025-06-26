import type { LinkUnfurlNode, Node } from '@figma/rest-api-spec';

export const isLinkUnfurlNode = (node: Node): node is LinkUnfurlNode =>
	node.type === 'LINK_UNFURL';
