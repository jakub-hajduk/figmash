# Figmash

Figmash is a versatile Figma parsing library that fetches file contents, traverses node trees, converts to ASTs, and outputs HTML, Markdown, or design tokens. Perfect for seamless Figma-to-code workflows!

It is simplier, and more composable successor of my previous project - [`@ltd-toolbox/figma-parser`](https://github.com/PGS-dev/ltd-toolbox/tree/main/packages/figma-parser).

## Why?
I felt like previous project was unnecessairly overcomplicated.
I decided to get rid of the class-nodes approach, since it is not super composable. 
I also decided to drop the figma file request, since others ([`figma-api`](https://github.com/didoo/figma-api) to be specific) do it way better.
Also I don't really liked the name ;).

## Usage

```typescript
import { getFigmaFileContents } from './api'
import { findDeep } from 'figmash'

const fileNodesResponse = await getFigmaFileContents()

const node = findDeep(fileNodesResponse.document, (node) => node.name.startsWith('Hello') )

console.log( node )
```

### deepChild
Returns deep child node using indexes of each another node.

```typescript
import { deepChild } from 'figmash'

const deepText = deepChild(node, 0, 1, 0, 4)
// equals to node.children[0].children[1].children[0].children[4]
```

### findDeep
Finds the first node deep in the tree that matches the given predicate.

```typescript
import { findDeep } from 'figmash'

const section = findDeep(document, (node) => node.type === 'FRAME' && node.name === 'docs-section')
```

### flatten
Flattens the given node to an array of nodes, keeping order of the nodes.

```typescript
import { flatten } from 'figmash'

const nodesArray = flaten(frameNode)
```

### glob

Finds nodes that match given glob patterns. layer names (node names) are used for matcher.

```typescript
import { glob } from 'figmash'

const title = glob(sectionNode, 'section/**/title');
const items = glob(sectionNode, '**/anatomy/item');
const previews = glob(sectionNode, '**/preview', '**/image', '**/element-preview');
```

### walk
Walks recursively through the figma file nodes.

```typescript
import { walk } from 'figmash'

walk(document, (node) => {
  if (node.name === 'Documentation') console.log(frame)
})
```
