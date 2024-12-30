import type { Node } from '@figma/rest-api-spec';

export const n = <T extends Node = Node>(obj: object) => obj as T;
