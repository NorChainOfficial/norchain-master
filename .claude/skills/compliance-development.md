# Compliance Development Skill

Expert skill for building MiCA-compliant blockchain features.

## Skill Identity

This skill provides expertise in:
- KYC/AML integration
- Transaction monitoring
- Compliance reporting
- Regulatory requirements
- "Private First — Regulated Later" strategy

## Activation Triggers

Activate this skill when:
- Implementing KYC verification
- Building AML monitoring
- Creating compliance reports
- Integrating with compliance providers
- Implementing transfer restrictions

## Strategy: Private First — Regulated Later

### Phase 1: Private Operation
- Security tokens (PM-EQ, NV-EQ) are private placements
- All investors are KYC verified
- No public trading
- Private P2P marketplace only

### Phase 2: Optional Public Transition
- Apply for MiCA authorization if desired
- Convert to public offering structure
- Enable regulated secondary market

## Token Compliance Matrix

| Requirement | NOR | PM-EQ | NV-EQ |
|-------------|-----|-------|-------|
| KYC Required | ❌ | ✅ | ✅ |
| AML Monitoring | Optional | ✅ | ✅ |
| Transfer Limits | ❌ | ✅ | ✅ |
| Holding Limits | ❌ | ✅ | ✅ |
| Whitelist | ❌ | ✅ | ✅ |
| Certificate | ❌ | ✅ | ✅ |
| Audit Trail | Optional | ✅ | ✅ |

## KYC Integration Pattern

```typescript
// KYC Service Interface
interface KYCProvider {
  initiateVerification(investor: InvestorData): Promise<VerificationId>;
  getVerificationStatus(id: VerificationId): Promise<KYCStatus>;
  getVerificationResult(id: VerificationId): Promise<KYCResult>;
}

interface KYCResult {
  status: 'approved' | 'rejected' | 'pending';
  riskScore: number;
  verificationLevel: 'basic' | 'enhanced' | 'full';
  sanctions: SanctionsCheck;
  pep: PEPCheck;
  documents: VerifiedDocument[];
}

// Usage in SmartPay flow
async function processInvestment(
  investorId: string,
  amount: bigint
): Promise<void> {
  const kyc = await kycProvider.getVerificationResult(investorId);

  if (kyc.status !== 'approved') {
    throw new ComplianceError('KYC verification required');
  }

  if (kyc.sanctions.isMatch) {
    throw new ComplianceError('Sanctions list match');
  }

  // Proceed with investment
}
```

## AML Monitoring Pattern

```typescript
// Transaction Monitoring
interface TransactionMonitor {
  analyzeTransaction(tx: Transaction): Promise<RiskAssessment>;
  flagSuspicious(tx: Transaction, reason: string): Promise<void>;
  generateSAR(tx: Transaction): Promise<SuspiciousActivityReport>;
}

interface RiskAssessment {
  riskScore: number; // 0-100
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  flags: RiskFlag[];
  requiresReview: boolean;
}

// Risk flags to monitor
enum RiskFlag {
  LARGE_TRANSACTION = 'LARGE_TRANSACTION',
  RAPID_MOVEMENT = 'RAPID_MOVEMENT',
  NEW_WALLET = 'NEW_WALLET',
  JURISDICTION_RISK = 'JURISDICTION_RISK',
  PATTERN_MATCH = 'PATTERN_MATCH',
}
```

## Compliance Reporting

```typescript
// Regulatory Reporting Interface
interface ComplianceReporter {
  generateDailyReport(): Promise<DailyReport>;
  generateAuditTrail(dateRange: DateRange): Promise<AuditTrail>;
  exportToRegulator(report: Report, format: ReportFormat): Promise<void>;
}

interface DailyReport {
  date: Date;
  totalTransactions: number;
  totalVolume: bigint;
  newInvestors: number;
  flaggedTransactions: FlaggedTransaction[];
  kycApprovals: number;
  kycRejections: number;
}
```

## Compliance Providers

Recommended integrations:
- **KYC**: Jumio, Onfido, Veriff
- **AML**: Chainalysis, Elliptic, TRM Labs
- **Sanctions**: ComplyAdvantage, Refinitiv
- **Audit**: Deloitte, PwC, KPMG

## Prohibited Actions

- ❌ Allow non-KYC security token transfers
- ❌ Enable public DEX listing for PM-EQ/NV-EQ
- ❌ Process FIAT directly (use on-ramps)
- ❌ Skip sanctions screening
- ❌ Allow anonymous holdings

## Context Files

Always reference:
- `/docs/LEGAL_COMPLIANCE_ROADMAP.md`
- `/docs/ROADMAP.md` (Phase 10)
- `.claude/agents/norchain-backend-agent.md`

## Usage

```
/skill compliance-development
```
