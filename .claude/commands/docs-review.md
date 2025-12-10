# Docs Review Command

Review documentation for completeness and accuracy.

## Usage

```
/docs-review [path]
```

## Arguments

- `path` (optional) - Specific documentation file or directory

## What This Does

1. Checks documentation coverage
2. Validates code/doc alignment
3. Identifies outdated content
4. Reviews formatting and style
5. Suggests improvements

## Output Format

```markdown
## Documentation Review

### Coverage Score: X/10

### Coverage Analysis
| Component | Documented | Accurate | Score |
|-----------|------------|----------|-------|
| API | ✅ | ⚠️ | 7/10 |
| Models | ❌ | N/A | 0/10 |
| Services | ✅ | ✅ | 10/10 |

### Issues Found
| Issue | Location | Severity | Fix |
|-------|----------|----------|-----|
| Missing description | api.md:45 | Medium | Add endpoint description |
| Outdated example | readme.md:23 | High | Update code example |

### Style Issues
- [ ] Inconsistent headings
- [ ] Missing code examples
- [ ] Broken links
- [ ] Outdated screenshots

### Recommendations
1. Add JSDoc to [functions]
2. Update API examples in [file]
3. Add architecture diagram for [component]

### Documentation Health
- Total files: X
- Documented: Y%
- Up to date: Z%
```

## Quality Checks

| Check | Description |
|-------|-------------|
| Coverage | All public APIs documented |
| Accuracy | Code matches documentation |
| Examples | Working code examples |
| Links | No broken links |
| Freshness | Updated within 30 days |

## Example

```
/docs-review docs/api/
```

## Related Commands

- `/docs-generate` - Generate documentation
- `/api-spec` - Generate API spec

## Agent

`norchain-docs-agent`
