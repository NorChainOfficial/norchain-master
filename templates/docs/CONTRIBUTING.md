# Contributing to NorChain

Thank you for your interest in contributing to NorChain! This document provides guidelines for contributing to NorChain repositories.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Convention](#commit-convention)
- [Pull Request Process](#pull-request-process)
- [Compliance Requirements](#compliance-requirements)
- [Getting Help](#getting-help)

## Code of Conduct

This project adheres to a Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the maintainers.

### Our Standards

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what's best for the community
- Show empathy towards others

## Getting Started

### Prerequisites

1. Fork the repository
2. Clone your fork locally
3. Set up the development environment
4. Create a feature branch

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/REPO_NAME.git
cd REPO_NAME

# Add upstream remote
git remote add upstream https://github.com/NorChainOfficial/REPO_NAME.git

# Install dependencies
npm install

# Create feature branch
git checkout -b feature/your-feature-name
```

### Development Environment

- Node.js 20.x or higher
- npm 10.x or higher
- Git 2.x or higher
- Your preferred IDE (VS Code recommended)

## Development Workflow

### 1. Sync Your Fork

```bash
git fetch upstream
git checkout main
git merge upstream/main
```

### 2. Create a Branch

Use descriptive branch names:
- `feature/add-user-authentication`
- `fix/token-transfer-bug`
- `docs/update-api-documentation`
- `refactor/improve-error-handling`

### 3. Make Changes

- Write clean, maintainable code
- Follow existing code patterns
- Add tests for new functionality
- Update documentation as needed

### 4. Test Your Changes

```bash
# Run linter
npm run lint

# Run tests
npm test

# Run full CI locally (if available)
npm run ci
```

### 5. Commit Your Changes

Follow our [commit convention](#commit-convention).

### 6. Push and Create PR

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

## Coding Standards

### TypeScript

```typescript
// Use explicit types
interface UserData {
  readonly id: string;
  readonly name: string;
  readonly email: string;
}

// Use const assertions
const CONFIG = {
  maxRetries: 3,
  timeout: 5000,
} as const;

// Use async/await over promises
async function fetchUser(id: string): Promise<UserData> {
  const response = await api.get(`/users/${id}`);
  return response.data;
}

// Use early returns
function processData(data: unknown): Result {
  if (!data) {
    return { error: 'No data provided' };
  }

  if (!isValid(data)) {
    return { error: 'Invalid data' };
  }

  return { success: true, data: transform(data) };
}
```

### Solidity

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title ExampleContract
 * @notice Brief description of the contract
 * @dev Implementation details
 */
contract ExampleContract is ReentrancyGuard {
    // State variables at the top
    address public owner;
    mapping(address => uint256) public balances;

    // Events after state variables
    event Deposit(address indexed user, uint256 amount);

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    // Constructor
    constructor() {
        owner = msg.sender;
    }

    // External functions
    function deposit() external payable nonReentrant {
        balances[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }

    // Public functions
    // Internal functions
    // Private functions
}
```

### Go

```go
// Package documentation
package main

import (
    "context"
    "errors"
    "fmt"
)

// Use meaningful names
type TransactionProcessor struct {
    validator Validator
    executor  Executor
}

// Document exported functions
// ProcessTransaction validates and executes a transaction.
func (p *TransactionProcessor) ProcessTransaction(ctx context.Context, tx *Transaction) error {
    if err := p.validator.Validate(tx); err != nil {
        return fmt.Errorf("validation failed: %w", err)
    }

    if err := p.executor.Execute(ctx, tx); err != nil {
        return fmt.Errorf("execution failed: %w", err)
    }

    return nil
}
```

## Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

### Format

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Code style (formatting, etc.) |
| `refactor` | Code refactoring |
| `perf` | Performance improvement |
| `test` | Adding/updating tests |
| `chore` | Maintenance tasks |
| `ci` | CI/CD changes |

### Examples

```bash
# Feature
feat(auth): add JWT token refresh

# Bug fix
fix(transfer): resolve race condition in token transfer

# Documentation
docs(api): update authentication endpoint docs

# With scope and body
feat(wallet): implement multi-signature support

Add support for M-of-N multi-signature wallets.

- Add MultiSigWallet contract
- Update SDK with signing helpers
- Add comprehensive tests

Closes #123
```

## Pull Request Process

### Before Submitting

- [ ] Code follows project standards
- [ ] Tests pass locally
- [ ] Documentation updated
- [ ] Commits follow convention
- [ ] Branch is up-to-date with main

### PR Template

Fill out the PR template completely:

1. **Description**: Clear explanation of changes
2. **Related Issues**: Link to related issues
3. **Type of Change**: Select appropriate type
4. **Testing**: Describe how you tested
5. **Compliance**: Check compliance requirements

### Review Process

1. **Automated Checks**: CI must pass
2. **Code Review**: At least one approval required
3. **Compliance Review**: For security token changes
4. **PM Review**: For cross-repo or compliance impact

### After Merge

- Delete your feature branch
- Close related issues
- Update any affected documentation

## Compliance Requirements

### Critical Rules

All contributions must:

1. **NOT enable public trading** for security tokens (PM-EQ, NV-EQ)
2. **NOT integrate** with DEX or CEX for security tokens
3. **NOT bypass** KYC verification requirements
4. **NOT handle** FIAT currency directly
5. **NOT market** security tokens as public investments
6. **MAINTAIN** private placement status
7. **INCLUDE** pause mechanisms where required
8. **REQUIRE** whitelist verification for security tokens

### Compliance Labels

Your PR may be automatically labeled:

- `compliance` - Affects compliance-related code
- `security-token` - Affects security token handling
- `pm-review-required` - Requires PM team review

### MiCA Compliance

We follow "Private First - Regulated Later" strategy. Do not introduce:

- Public offering mechanisms
- Exchange integrations
- EU retail marketing
- Direct FIAT custody

## Getting Help

### Resources

- [NorChain Roadmap](https://github.com/NorChainOfficial/norchain-master/blob/main/docs/ROADMAP.md)
- [Technical Documentation](https://docs.norchain.org)
- [Developer Tasks](https://github.com/NorChainOfficial/norchain-master/blob/main/docs/DEVELOPER_TASKS.md)

### Support Channels

- **Issues**: For bug reports and feature requests
- **Discussions**: For questions and ideas
- **Code Review**: Request review from maintainers

### Maintainers

- PM Agent: pm-agent@norchain.org
- Development Team: dev@norchain.org

---

Thank you for contributing to NorChain!
