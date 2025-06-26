import type { Node, SectionNode } from '@figma/rest-api-spec';

export const isSectionNode = (node: Node): node is SectionNode =>
	node.type === 'SECTION';
