# Security Scan Command

Run comprehensive security analysis.

## Usage

```
/security-scan [path]
```

## Arguments

- `path` (optional) - Specific file or directory to scan

## What This Does

1. Runs SAST analysis (SonarQube/Semgrep)
2. Checks dependency vulnerabilities (Snyk/npm audit)
3. Scans for secrets (TruffleHog)
4. Reviews smart contracts (Slither) if applicable
5. Generates vulnerability report

## Output Format

```markdown
## Security Scan Report

### Summary
| Category | Critical | High | Medium | Low |
|----------|----------|------|--------|-----|
| Code | X | X | X | X |
| Dependencies | X | X | X | X |
| Secrets | X | X | X | X |
| Contracts | X | X | X | X |

### Critical Findings
| Finding | Location | CVSS | Fix |
|---------|----------|------|-----|
| ... | ... | ... | ... |

### Dependency Vulnerabilities
| Package | Version | Vulnerability | Fixed In |
|---------|---------|---------------|----------|
| ... | ... | ... | ... |

### Recommendations
1. [Immediate action required]
2. [Short-term fix]
3. [Long-term improvement]
```

## Scan Tools Used

| Category | Tool | Config |
|----------|------|--------|
| SAST | Semgrep | `.semgrep.yml` |
| SCA | Snyk | `snyk.json` |
| Secrets | TruffleHog | `trufflehog.yml` |
| Contracts | Slither | `slither.config.json` |

## Example

```
/security-scan src/services/
```

## Related Commands

- `/security-review` - Review specific file
- `/vulnerability-report` - Detailed report

## Agent

`norchain-security-agent`
