# AGENTS.md

## Project Context
TRC-8004 (Jan 2026 Update) is a standard for decentralized agent governance on TRON/EVM.
- **Goal**: Enable autonomous agents to have verifiable identities, reputation, and independent validation.
- **Framework**: Hybrid Hardhat/Foundry project.

## Dev Environment
- Use `npm run compile` (Hardhat) or `forge build` (Foundry) to compile contracts.
- Use `npm run test` or `npx hardhat test` for standard unit tests.
- Use `forge test` for fast, property-based testing in the `test/` directory.
- Root contains `hardhat.config.ts`, `foundry.toml`, and `.git`.

## Core Architecture
The system logic is split across three essential registries:
1.  **IdentityRegistry**: Agents are **ERC-721** tokens. Manages `agentWallet` which resets to `address(0)` on transfer.
2.  **ValidationRegistry**: Facilitates score-based verification (0-100) of agent work by independent validators.
3.  **ReputationRegistry**: Public feedback system (no authorization required) for recording performance signals.

## Testing Instructions
- CI runs all tests on every PR.
- Run `forge test -vvv` to see detailed execution logs during development.
- For specific tests, use `forge test --match-path test/IdentityRegistry.t.sol`.
- Ensure all tests pass before proposing changes.

## PR Instructions
- **Title format**: `[TRC-8004] <brief-description>`
- Run `npm run compile` and `forge test` locally.
- Keep `AGENTS.md` updated if core logic or workflows change.
- Do not modify `lib/` dependencies directly; use submodules if needed.

---
