import type { Node } from '@figma/rest-api-spec';
import picomatch from 'picomatch';
import { walk } from './walk';

/**
 * Finds nodes that match given glob patterns. layer names (node names) are used for matcher.
 *
 * @example
 * ```javascript
 * // Please note, that asterisks in below glob pattern has been replaced ;).
 * const title = glob(sectionNode, 'section/✱✱/title');
 * const items = glob(sectionNode, '✱✱/anatomy/item');
 * const previews = glob(sectionNode, '✱✱/preview', '✱✱/image', '✱✱/element-preview');
 * ```
 */
export function glob(node: Node, paths: string | string[]): Node[] {
	const children: Node[] = [];
	const pathsArray = Array.isArray(paths) ? paths : [paths];
	const lowerCasePaths = pathsArray
		.map((p) => p.trim().toLowerCase())
		.filter(Boolean);

	const matcher = picomatch(lowerCasePaths);

	walk(node, (node, path) => {
		const nodeNamesPath = path
			.map((node) => node.name.trim().toLowerCase())
			.join('/');
		if (matcher(nodeNamesPath)) {
			children.push(node);
		}
	});

	return children;
}
