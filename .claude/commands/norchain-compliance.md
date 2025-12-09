# NorChain Compliance Check

Check regulatory compliance status and requirements.

## Arguments
- `$ARGUMENTS` - Optional: "tokens", "investors", "transactions", "company", or specific check type

## Instructions

1. Read `docs/LEGAL_COMPLIANCE_ROADMAP.md`
2. Based on argument, provide relevant compliance information:
   - "tokens": Token classification (NOR, PM-EQ, NV-EQ)
   - "investors": Investor onboarding checklist
   - "transactions": Transaction compliance checklist
   - "company": Company onboarding requirements
   - No argument: Full compliance overview

## Token Classification Reference

| Token | Type | Tradability | Regulation |
|-------|------|-------------|------------|
| NOR | Utility | Public | Minimal |
| PM-EQ | Security | Private only | Private placement exempt |
| NV-EQ | Security | Private only | Private placement exempt |

## Output Format

```
## Compliance Check: [Type]

### Strategy
"Private First — Regulated Later"

### Current Status
[What regulations are avoided and how]

### Checklist
- [ ] Item 1
- [ ] Item 2

### Required Disclaimers
[Relevant legal disclaimers]

### MiCA Trigger Points
[Actions that would trigger regulation]
```

Always emphasize the "Private First" strategy and warn about actions that trigger MiCA.
