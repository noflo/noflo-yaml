# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

### Changed

- Migrated to NoFlo 2.x: components now depend on `@noflo/noflo` ^2.0.0 instead of the unscoped `noflo` 1.x package
- Package is now plain ESM (`"type": "module"`) with no build step; supported runtime is Node.js >= 22 (components also run under Deno and Bun)
- Updated `js-yaml` from ^4.0.0 to ^5.4.3; the package now ships dual ESM/CJS exports. Parse errors remain routed to the `ParseYaml` error port; empty and whitespace-only input continues to produce an empty object (js-yaml 5 would otherwise throw on it)
- Removed the unused `coffeescript` runtime dependency
- Test suite now runs with `@noflo/fbp-spec-runner` and `node:test` instead of Mocha/Chai

### Fixed

- `ToYaml` gained an `error` outport: objects that cannot be serialized to YAML are routed there instead of throwing into the network

### Known limitations

- The `yaml/ParseFrontmatter` graph is currently unusable: it composes components from `noflo-core`, `noflo-groups`, `noflo-strings`, and `noflo-objects`, which have not been migrated to NoFlo 2.x yet. It becomes usable again once those libraries land their 2.x versions
