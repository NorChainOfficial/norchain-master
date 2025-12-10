# Security Review Command

Review a specific file for security issues.

## Usage

```
/security-review <file>
```

## Arguments

- `file` - File path to review

## What This Does

1. Analyzes code for security vulnerabilities
2. Checks OWASP Top 10 risks
3. Reviews authentication/authorization
4. Validates input handling
5. Checks for secrets exposure
6. Provides remediation code

## Output Format

```markdown
## Security Review: [File]

### Risk Score: X/10

### Vulnerabilities Found
| Line | Issue | Severity | CWE | Fix |
|------|-------|----------|-----|-----|
| ... | ... | ... | ... | ... |

### OWASP Top 10 Check
- [ ] A01: Broken Access Control
- [ ] A02: Cryptographic Failures
- [ ] A03: Injection
- [ ] A04: Insecure Design
- [ ] A05: Security Misconfiguration
- [ ] A06: Vulnerable Components
- [ ] A07: Auth Failures
- [ ] A08: Data Integrity Failures
- [ ] A09: Logging Failures
- [ ] A10: SSRF

### Code Fixes
```typescript
// BEFORE (vulnerable)
...

// AFTER (secure)
...
```

### Recommendations
1. [Security improvement]
```

## Common Issues

| Issue | Risk | Pattern |
|-------|------|---------|
| SQL Injection | Critical | String concatenation in queries |
| XSS | High | Unescaped user input |
| Hardcoded Secret | High | API keys in code |
| Missing Auth | Critical | Unprotected endpoints |
| Path Traversal | High | Unsanitized file paths |

## Example

```
/security-review src/api/users.ts
```

## Related Commands

- `/security-scan` - Full scan
- `/vulnerability-report` - Generate report

## Agent

`norchain-security-agent`
