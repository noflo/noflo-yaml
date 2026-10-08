# @noflo/yaml

YAML handling components for [NoFlo](https://noflojs.org)

## Components

- `yaml/ExtractFrontmatter` — splits a document into Front Matter head and body
- `yaml/ParseYaml` — parses YAML into a JavaScript object
- `yaml/ToYaml` — serializes a JavaScript object to YAML
- `yaml/ToFrontmatter` — joins head and body into a Front Matter document
- `yaml/ParseFrontmatter` (graph) — parses a Front Matter document into an object with head, body, and filename grouping; requires `noflo-core`, `noflo-groups`, `noflo-strings`, and `noflo-objects` at their 2.x versions to be usable

## Usage

Components are discovered automatically by NoFlo 2.x on Node.js. Example in FBP:

```
ReadFile(files/ReadFile) OUT -> IN Parse(yaml/ParseYaml)
'server: { port: 8080 }' -> IN Parse
```

## Development

Install dependencies and run the test suite:

```
npm ci
npm test
```
