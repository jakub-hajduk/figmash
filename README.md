# Figmash

Figmash is a powerful and flexible TypeScript library designed to improve the process of extracting and transforming data from Figma files. It provides set of utilities for traversing Figma node trees, applying custom transformation rules, and generating structured output suitable for various applications, including design token extraction, code generation, and custom AST creation.

## Why Figmash?

Figmash was developed to address common challenges in working with Figma data, building upon lessons learned from previous projects. Our core design principles prioritize:

* **Simplicity and Composability:** Moving away from overly complex architectures, Figmash offers a modular and highly composable set of functions, making it easier to integrate into diverse workflows.
* **Focused Functionality:** Figmash specializes in efficient Figma node tree manipulation. It intentionally defers the responsibility of fetching Figma file contents to dedicated, optimized libraries (such as `figma-api`), allowing Figmash to excel at its core task: transforming the raw data you provide.

## Installation

To integrate Figmash into your project, use your preferred package manager:

```bash
npm install figmash
```

## Quick Start Example

This example demonstrates how to use `findDeep` to locate a specific node within a Figma file's structure.

```typescript
import { findDeep } from 'figmash';
// Assuming 'getFigmaFileContents' is an external utility or part of your project
// that fetches the raw Figma file data.
import { getFigmaFileContents } from './api';

async function main() {
  try {
    const fileNodesResponse = await getFigmaFileContents();

    // Locate the first node whose name starts with 'Hello' anywhere in the document tree.
    const helloNode = findDeep(fileNodesResponse.document, (node) => node.name.startsWith('Hello'));

    if (helloNode) {
      console.log('Found node:', helloNode.name, 'Type:', helloNode.type);
    } else {
      console.log('No node found with a name starting with "Hello".');
    }
  } catch (error) {
    console.error('Error fetching or processing Figma file:', error);
  }
}

main();
```

## API Reference

Figmash provides a suite of functions for navigating, querying, and transforming Figma node trees.

### `deepChild(node, ...indices)`

This utility efficiently retrieves a deeply nested child node by specifying a sequence of numerical indices. It offers a direct path to specific elements within the tree structure without requiring manual iteration.

**Parameters:**
  * `node`: The starting Figma node from which to begin the traversal.
  * `...indices: number[]`: A variadic argument representing the sequence of child indices to follow at each level of depth.

**Returns:** `Node | undefined`
  * The target child node if successfully located, otherwise `undefined`.
  
**Usage Example:**

```typescript
import { deepChild } from 'figmash';

// This call attempts to access:
// rootNode.children[0].children[1].children[0].children[4]
const deepTextNode = deepChild(rootNode, 0, 1, 0, 4);

if (deepTextNode) {
  console.log('Successfully found deep node:', deepTextNode.name);
} else {
  console.log('Deep node not found at the specified path.');
}
```

### `findDeep(node, predicate)`

This function performs a depth-first search within the Figma node tree, starting from the provided `node`. It returns the first node that satisfies the criteria defined by the `predicate` function.

**Parameters:**
  * `node`: The root node from which the search will commence.
  * `predicate: (node) => boolean`: A callback function that evaluates each node. It should return `true` if the node matches the desired criteria, and `false` otherwise.

**Returns:** `Node | undefined`
  * The first matching node encountered during the traversal, or `undefined` if no node satisfies the predicate.

 **Usage Example:**

```typescript
import { findDeep } from 'figmash';

// Find the first FRAME node named 'docs-section' anywhere within the document
const documentationSection = findDeep(document, (node) => 
  node.type === 'FRAME' && node.name === 'docs-section'
);

if (documentationSection) {
  console.log('Found documentation section:', documentationSection.name);
} else {
  console.log('Documentation section not found in the document.');
}
```

### `flatten(node)`

This function transforms a hierarchical Figma node tree (or any sub-tree) into a flat array of nodes. The order of nodes in the resulting array corresponds to a depth-first traversal of the original tree.

**Parameters:**
  * `node`: The root node of the tree (or sub-tree) to be flattened.

**Returns:** `Node[]`
  * An array containing all nodes from the given tree, including the root node itself, in traversal order.

**Usage Example:**

```typescript
import { flatten } from 'figmash'

// Obtain a flat list of all nodes within 'frameNode'
const allNodesInFrame = flatten(frameNode)

console.log(`Flattened ${allNodesInFrame.length} nodes from the frame.`)
allNodesInFrame.forEach(n => console.log(`- ${n.name} (${n.type})`))
```

---

### `glob(node, ...patterns)`

This function identifies nodes within a given Figma node's sub-tree whose names match one or more specified glob patterns. It is particularly effective for selecting nodes based on naming conventions or hierarchical paths within your Figma design.

**Parameters:**
  * `node`: The starting Figma node from which to begin the pattern matching.
  * `...patterns: string[]`: One or more glob patterns to match against the `name` property of Figma nodes. Patterns support wildcards such as `*` (matching any sequence of characters) and `**` (matching any sequence of directories/groups).
**Returns:** `Node[]`
  * An array of Figma nodes whose names successfully match any of the provided glob patterns.

**Usage Example:**

```typescript
import { glob } from 'figmash';
import type { Node } from '@figma/rest-api-spec';

// Assume 'sectionNode' is a Figma FRAME or GROUP node representing a section of your design
declare const sectionNode;

// Find a 'title' node nested anywhere under 'sectionNode'
const sectionTitle = glob(sectionNode, 'section/**/title');
console.log('Section title node:', sectionTitle[0]?.name);

// Find all 'item' nodes that are direct children of an 'anatomy' group, anywhere in the tree
const anatomyItems = glob(sectionNode, '**/anatomy/item');
console.log('Anatomy items found:', anatomyItems.map(i => i.name));

// Find nodes named 'preview', 'image', or 'element-preview' anywhere in the tree
const previewRelatedNodes = glob(sectionNode, '**/preview', '**/image', '**/element-preview');
console.log('Preview-related nodes:', previewRelatedNodes.map(p => p.name));
```

---

### `walk(node, callback)`

This function recursively traverses the Figma node tree, starting from the specified `node`. For each node encountered during the traversal, it executes a provided `callback` function. This is a versatile utility for performing side effects or custom logic on every node in a tree.

**Parameters:**
  * `node`: The starting Figma node from which the tree walk will commence.
  * `callback: (node) => void`: A function that will be invoked for each node in the tree. It receives the current Figma node as its argument.
**Returns:** `void`
  * This function does not return a value; its primary purpose is to facilitate the execution of the callback for each node.

**Usage Example:**

```typescript
import { walk } from 'figmash';
import type { Node } from '@figma/rest-api-spec';

walk(document, (node) => {
  console.log(`Visiting node: ${node.name} (Type: ${node.type})`);
});

// Find and log specific nodes based on custom criteria
walk(document, (node) => {
  if (node.name === 'Documentation' && node.type === 'FRAME') {
    console.log('Found a "Documentation" frame! ID:', node.id);
    // Further actions can be performed here, e.g., extracting its children
  }
});
```

### `transform(node, [getters], [options])`

The `transform` function is the core of Figmash's data processing capabilities. It recursively processes a Figma node and its children, converting them into a new, custom tree structure based on user-defined rules.

**Parameters:**
  * `node`: The root Figma node from which the transformation process will begin.
  * `getters?: Getter[]`: (Optional) An array of `Getter` objects that define the specific transformation rules. If omitted, a default behavior is applied which typically results in all nodes being filtered out unless explicitly handled.
  * `options?: Partial<ParseTreeOptions>`: (Optional) An object to configure advanced behaviors of the transformation process.

**Returns:**
 * `Promise<GetterNode>`: A promise that resolves to the root of your newly constructed custom tree, representing the transformed Figma data.

### The `Getter` Mechanism: Customizing Your Output

The `Getter` mechanism is central to Figmash's flexibility. It defines a set of rules that you provide to precisely control how different types of Figma nodes are converted into your desired output format. A `Getter` is an object with two essential properties: `test` and `get`.

```typescript
interface Getter {
  /**
  * A predicate function that determines if this getter rule applies to a given Figma node.
  * @param node The Figma node to evaluate.
  * @returns `true` if this rule should be applied, `false` otherwise.
  */
  test: (node) => boolean;
  /**
  * The transformation function that converts the Figma node into a custom object.
  * This function is only called if its corresponding `test` function returns `true`.
  * @param node The Figma node to transform.
  * @returns A new object representing the transformed node, or a Promise resolving to such an object.
  */
  get: (node) => object | Promise<object>;
}
```

When `transform` processes a node, it iterates through your `getters` array. It applies the `get` function of the **first** `Getter` whose `test(node)` function returns `true`.

* **`test: (node) => boolean`**:
  * This predicate function receives a Figma node and should return `true` if the current rule is applicable to that node.
  * **Best Practice:** Utilize TypeScript type guards (e.g., `isRectange(node)` imported from `figmash`) within your `test` functions. This enhances type safety, allowing TypeScript to correctly infer the node's specific type within the `get` function.

* **`get: (node) => object | Promise<object>`**:
  * This function performs the actual data transformation. It is invoked only when its corresponding `test` function has returned `true`.
  * It receives the Figma node and is responsible for returning a new object that represents your desired output structure for that specific node.
  * **Filtering Nodes:** Returning an empty object (`{}`) from a `get` function will typically result in that node being filtered out by the `omitEmpty` option (see below). This is a powerful technique for ignoring nodes that do not contribute semantic value to your final tree but must still be traversed (e.g., purely structural `GROUP` or `FRAME` nodes).

### Controlling Recursion: Stopping Deeper Traversal

You can explicitly prevent the `transform` function from recursively processing a node's children by returning `children: false` within your `Getter`'s `get` function. When this property is present, the transformer will include the current node in the output but will **not** traverse its Figma children. The `children: false` property itself will be removed from the final transformed object for a clean output.

This is particularly useful when you've extracted all necessary information from a parent node and its immediate properties, and you don't need to delve into its descendants.

```typescript
import type { Getter, isTextNode } from 'figmash'; // Assuming 'figmash' exports Getter

const paragraphGetter: Getter = {
  test: (node) => isTextNode(node),
  get: (node) => {
    const content = (node).characters;
    return {
      type: 'paragraph',
      data: content,
      children: false // Crucial: Stops the transformer from going deeper
    };
  }
};
```

---

**Where to place this section:**

I recommend placing this section within the **"The `Getter` Mechanism: Customizing Your Output"** part of your `README.md`. It would fit well as a sub-heading, perhaps right after the general explanation of the `get` function's purpose, or immediately following the `Getter` interface definition. This ensures readers understand this powerful control mechanism as they learn about defining their transformation rules.

### Configuration Options (`ParseTreeOptions`)

You can fine-tune the behavior of the `transform` function by providing an `options` object:

* `omitEmpty: boolean` (default: `true`)
  * When set to `true`, any transformed node that results in an empty object (`{}`) will be automatically removed from its parent's `children` array. This is crucial for generating a clean, semantically meaningful output tree, free from unnecessary empty structures.

* `omitFauxNodes: boolean` (default: `true`)
  * If `true`, Figmash will "unwrap" faux nodes. A faux node is defined as a transformed node that possesses no properties of its own other than a single child within its `children` array. In such cases, the single child will effectively replace the faux node in the tree. This feature is particularly beneficial for streamlining the output by removing structural layers from Figma (like redundant groups) that do not convey essential semantic information.

### Comprehensive Usage Example

Let's illustrate how to use `transform` to parse a conceptual Figma frame, extracting specific information like color tokens (represented by named rectangles) and text content, while ignoring other elements.

**Conceptual Figma Structure:**
* Page 1
  * Design System Frame
     * Group "Colors"
       * Rectangle (name: "color-primary-blue", fill: #0D99FF)
       * Rectangle (name: "color-accent-green", fill: #10B981)
     * Group "Content"
       * Text (characters: "Hello World")
     * Frame "Irrelevant"
       * ... (other nodes we want to ignore)


**Transformation Code:**

We define a set of `Getter` rules to precisely identify and transform only the nodes relevant to our desired output.

```typescript
import { transform, type Getter, isRectangleNode, isTextNode } from 'figmash';

// 1. Define your transformation rules (Getters)
const myGetters: Getter[] = [
  // Rule 1: Transform Text Nodes
  {
    test: (node) => isTextNode(node),
    get: (node) => ({
      type: 'typography',
      content: node.characters,
    }),
  },
  // Rule 2: Transform Rectangles that represent color tokens
  {
    test: (node) => isRectangleNode(node) && node.name.startsWith('color-'),
    get: (node) => ({
      type: 'colorToken',
      name: node.name.replace('color-', ''),
      // Assuming a single solid fill for simplicity; access the color property
      hex: (node.fills[0] as any)?.color,
    }),
  }
];

// 2. Simulate a Figma root node structure for demonstration
const figmaRootNode = {
  id: '0:1',
  name: 'Design System Frame',
  type: 'FRAME',
  children: [
    {
      id: '0:2',
      name: 'Colors',
      type: 'GROUP',
      children: [
        {
          id: '0:3',
          name: 'color-primary-blue',
          type: 'RECTANGLE',
          fills: [{ type: 'SOLID', color: { r: 0.05, g: 0.6, b: 1, a: 1 } }],
        },
        {
          id: '0:4',
          name: 'color-accent-green',
          type: 'RECTANGLE',
          fills: [{ type: 'SOLID', color: { r: 0.06, g: 0.72, b: 0.5, a: 1 } }],
        },
      ],
    },
    {
      id: '0:5',
      name: 'Content',
      type: 'GROUP',
      children: [
        {
          id: '0:6',
          name: 'Hello World Text',
          type: 'TEXT',
          characters: 'Hello World',
        },
      ],
    },
    {
      id: '0:7',
      name: 'Irrelevant Frame',
      type: 'FRAME',
      children: [
        {
          id: '0:8',
          name: 'Some other node',
          type: 'RECTANGLE',
          fills: [],
        },
      ],
    },
  ],
};

// 3. Execute the transformation
async function runTransformation() {
  const customTree = await transform(figmaRootNode, myGetters);
  console.log(JSON.stringify(customTree, null, 2));
}

runTransformation();
```

**Resulting `customTree` Output:**

The output is a clean, simplified tree containing only the data specified by our `Getter` rules. All irrelevant nodes and empty structural groups are automatically filtered out, providing a focused and actionable data structure.

```json
{
  "children": [
    {
      "children": [
        {
          "type": "colorToken",
          "name": "primary-blue",
          "hex": {
            "r": 0.05,
            "g": 0.6,
            "b": 1,
            "a": 1
          }
        },
        {
          "type": "colorToken",
          "name": "accent-green",
          "hex": {
            "r": 0.06,
            "g": 0.72,
            "b": 0.5,
            "a": 1
          }
        },
        {
          "type": "typography",
          "content": "Hello World"
        }
      ]
    }
  ]
}
```
