# SOC2 Evidence Command

Collect evidence for a specific control.

## Usage

```
/soc2-evidence <control>
```

## Arguments

- `control` - Control ID (e.g., `CC6.1`, `A1.2`, `PI1.1`)

## What This Does

1. Identifies required evidence for control
2. Collects relevant artifacts
3. Generates evidence documentation
4. Timestamps and organizes evidence
5. Updates compliance tracking

## Output Format

```markdown
## SOC2 Evidence Collection: [Control ID]

### Control Details
- **ID**: [Control ID]
- **Criteria**: [Security/Availability/etc.]
- **Description**: [Control description]
- **Owner**: [Team/Person]

### Evidence Collected
| Type | Source | Date | Location |
|------|--------|------|----------|
| Screenshot | AWS Console | [date] | `/evidence/CC6.1/` |
| Log export | CloudWatch | [date] | `/evidence/CC6.1/` |
| Config file | GitHub | [date] | `/evidence/CC6.1/` |

### Evidence Package
```
evidence/
└── CC6.1/
    ├── 2024-01-15_access-review.pdf
    ├── 2024-01-15_iam-policy.json
    └── 2024-01-15_screenshot.png
```

### Verification
- [ ] Evidence dated within period
- [ ] Evidence shows control operating
- [ ] Evidence properly labeled
- [ ] Evidence stored in repository

### Next Collection: [date]
```

## Evidence Types by Control

| Control | Evidence Types |
|---------|---------------|
| CC6.1 (Access) | IAM configs, access reviews, audit logs |
| A1.2 (Backup) | Backup logs, recovery test results |
| C1.3 (Encryption) | TLS certs, KMS configs, encryption settings |
| PI1.1 (Validation) | Validation rules, error logs |

## Example

```
/soc2-evidence CC6.1
```

## Related Commands

- `/soc2-status` - Check compliance status
- `/soc2-gap-analysis` - Analyze gaps

## Agent

`norchain-soc2-agent`
