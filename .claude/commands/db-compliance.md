# Dashboard Compliance Command

Get compliance checklist and token information.

## Arguments

- `$ARGUMENTS` - Optional filter: category or status

## Instructions

Use `get_compliance` to retrieve compliance data:

```
get_compliance
get_compliance category="Legal"
get_compliance status="pending"
```

Present results showing:

**Compliance Checklist:**
- Item ID, Category, Description
- Status (pending, in_progress, complete)
- Required flag

**Token Compliance:**
- Symbol, Name, Type
- Tradability, KYC requirement

**Summary:**
- Total items and completion rate
- Items needing attention

## Categories

- Legal
- Documentation
- Technical

## Token Types

- **NOR**: Utility token (public trading, optional KYC)
- **PM-EQ**: Security token (private only, KYC required)
- **NV-EQ**: Security token (private only, KYC required)

Arguments: $ARGUMENTS
