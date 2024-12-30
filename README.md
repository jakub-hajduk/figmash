# Figmash

Figmash is a versatile Figma parsing library that fetches file contents, traverses node trees, converts to ASTs, and outputs HTML, Markdown, or design tokens. Perfect for seamless Figma-to-code workflows!

It is simplier, and more composable successor of my previous project - [`@ltd-toolbox/figma-parser`](https://github.com/PGS-dev/ltd-toolbox/tree/main/packages/figma-parser).

## Why?
I felt like previous project was unnecessairly overcomplicated.
I decided to get rid of the class-nodes approach, since it is not super composable. 
I decided to drop the figma file request, since others ([`figma-api`](https://github.com/didoo/figma-api) to be specific) do it better.
Also I don't really liked the name ;).

## Usage
