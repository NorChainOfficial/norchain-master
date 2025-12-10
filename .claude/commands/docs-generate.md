# Docs Generate Command

Generate documentation of a specific type.

## Usage

```
/docs-generate <type> [target]
```

## Arguments

- `type` - Documentation type: `api`, `code`, `architecture`, `readme`, `changelog`
- `target` (optional) - Specific file or service to document

## What This Does

1. Analyzes source code or configurations
2. Extracts documentation from comments
3. Generates formatted documentation
4. Creates diagrams if needed
5. Outputs in requested format

## Documentation Types

### API Documentation (`api`)
Generates OpenAPI 3.0 specification from code annotations.

### Code Documentation (`code`)
Generates TSDoc/JSDoc documentation with TypeDoc.

### Architecture Documentation (`architecture`)
Creates architecture diagrams using Mermaid.

### README Documentation (`readme`)
Generates or updates README.md with standard sections.

### Changelog Documentation (`changelog`)
Updates CHANGELOG.md from conventional commits.

## Output Format

```markdown
## Documentation Generated: [Type]

### Files Created
| File | Type | Location |
|------|------|----------|
| api.yaml | OpenAPI | /docs/api/ |
| diagram.md | Mermaid | /docs/architecture/ |

### Preview
[Preview of generated documentation]

### Next Steps
1. Review generated documentation
2. Fill in missing descriptions
3. Add examples where needed
4. Commit to repository
```

## Example

```
/docs-generate api src/controllers/
/docs-generate architecture wallet-service
/docs-generate changelog
```

## Related Commands

- `/docs-review` - Review documentation
- `/api-spec` - Generate API spec for endpoint

## Agent

`norchain-docs-agent`
