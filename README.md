# Mallory Alpha Streams

A mobile-first AI copilot that replaces bulk analytics subscriptions with penny-priced, real-time Solana x402 paywalls. Mallory Alpha Streams only spends USDC when you ask for premium on-chain intelligence, then instantly renders the results as interactive AlphaStream cards right inside the chat so teams stay in flow without long-term pre-paid subscriptions, licenses, or dashboard detours.

## 🎯 Hackathon Pitch

**Mallory Alpha Streams** turns on-chain intelligence into a "micropay-as-you-go" superpower. Instead of locking analysts into $100+/month data contracts, each Nansen insight is bought on demand for ~0.001–0.002 USDC via x402.

### The Problem: Subscription Lock-In

Traditional blockchain analytics platforms (Nansen, Dune, etc.) require:
- **High upfront costs**: $100–$500+/month subscriptions even for occasional use
- **Rigid contracts**: Annual commitments that don't scale with actual usage
- **Dashboard fatigue**: Teams must context-switch between chat tools and analytics dashboards
- **Access barriers**: Shared API keys, VPN requirements, desktop-only access
- **Waste**: Paying for unused capacity "just in case" you need data

Small DAOs, trading desks, and gaming guilds often can't justify full licenses, while enterprises struggle with cost allocation and access control.

### The Solution: Micropayment-Powered Intelligence

Mallory Alpha Streams solves this with:

- **💰 Granular spend**: Pay only when an insight is actually needed (the latest Smart Money rotation, a wallet deep dive, or a token pulse), rather than keeping a subscription warm "just in case"
- **⚡ Instant UX**: The app funnels Grid's production wallet through x402 right in the chat UI; balances update and the assistant keeps responding in seconds, with deductions visible in the new sticky HUD
- **🤖 AI-native workflows**: Alpha Streams live inside the conversation: natural-language requests trigger tools, render dynamic AlphaStreamCards, and raise realtime toasts every time USDC/SOL leaves the Grid account (no manual reconciliation)
- **📱 Mobile-first scouting**: Hand an analyst or trader an Expo build; the combination of Grid, x402 and AI removes the need for shared API keys or VPN'd desktops
- **📊 Transparent ops**: The ledger lands in Supabase (`alpha_usage`) so finance can reconcile spend by user/tool; [Orb Explorer](https://orb.helius.dev) confirms the chain moves

Compared with subscription SaaS dashboards, Mallory's "micropayment + chat" model makes institutional-grade data accessible to smaller teams that would never justify a full license, while still giving enterprises fine-grained cost controls.

## 🏗️ Monorepo Structure

```
mallory/
├── apps/
│   ├── client/          # React Native app (iOS, Android, Web)
│   └── server/          # Backend API (Node.js + Express)
├── packages/
│   └── shared/          # Shared types and utilities
└── package.json         # Workspace configuration
```

## ✨ Features

### Client (Mobile & Web)
- 🔐 **Authentication**: Google OAuth via Supabase
- 💬 **AI Chat**: Streaming conversations with Claude
- 💰 **Embedded Wallet**: Grid-powered smart contract wallets
- 🔑 **Client-Side Signing**: Secure transaction signing (keys never leave device)
- 📱 **Cross-Platform**: iOS, Android, and Web from single codebase
- 🎨 **Modern UI**: Beautiful, responsive design with Reanimated
- 🏷️ **Version Tracking**: Automatic version display with git commit hash

### Server (Backend API)
- 🤖 **AI Streaming**: Claude integration with Server-Sent Events and extended thinking
- 🔧 **AI Tools**: Web search (Exa), user memory (Supermemory), and 20+ Nansen data APIs
- 💰 **x402 Payments**: Server-side implementation for premium data access
- 💎 **Wallet Data**: Price enrichment via Birdeye API
- 🔒 **Secure Auth**: Supabase JWT validation
- 🚀 **Production Ready**: Comprehensive testing infrastructure

### Monorepo Management
- 🔄 **Synchronized Versioning**: Single command updates all packages
- 🏷️ **Automatic Releases**: GitHub releases created on version tags
- 📝 **Generated Changelogs**: Commit history automatically compiled

### Alpha Streams (Premium Tools)
- 🔍 **Wallet Deep Dive**: Historical balances + top counterparties analysis
- 📊 **Smart Money Radar**: Cross-chain netflows + holdings intelligence
- 💎 **Token Pulse**: DEX trades + DCA activity + transfer patterns
- 💰 **x402 Integration**: Automatic micropayments (~0.001–0.002 USDC per call)
- 📈 **Real-time Balance Updates**: Live SOL/USDC balance badge with payment toasts
- 📝 **Usage Analytics**: All spend tracked in `alpha_usage` table for reconciliation

## 🏛️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client (Expo RN)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │   Chat UI    │  │ Grid Wallet  │  │  AlphaStreamCard    │  │
│  │              │  │  (x402 HUD)  │  │  AlphaToastProvider │  │
│  └──────┬───────┘  └──────┬───────┘  └──────────────────────┘  │
│         │                  │                                       │
│         └──────────┬───────┘                                       │
│                    │                                               │
│         ┌───────────▼───────────┐                                  │
│         │   Chat API Request    │                                  │
│         │  (gridSession + msg)  │                                  │
│         └───────────┬───────────┘                                  │
└──────────────────────┼────────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Server (Node.js + Express)                    │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              Claude AI (Anthropic)                      │   │
│  │  ┌──────────────────────────────────────────────────┐   │   │
│  │  │  Tool Registry:                                  │   │   │
│  │  │  • searchWeb (free)                              │   │   │
│  │  │  • alphaWalletDeepDive (x402)                    │   │   │
│  │  │  • alphaSmartMoneyRadar (x402)                   │   │   │
│  │  │  • alphaTokenPulse (x402)                        │   │   │
│  │  └──────────────────────────────────────────────────┘   │   │
│  └──────────────────────────────────────────────────────────┘   │
│                       │                                           │
│         ┌─────────────▼─────────────┐                            │
│         │  x402 Payment Service     │                            │
│         │  ┌─────────────────────┐ │                            │
│         │  │ Ephemeral Wallet    │ │                            │
│         │  │ Manager             │ │                            │
│         │  └─────────────────────┘ │                            │
│         └─────────────┬─────────────┘                            │
└───────────────────────┼──────────────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
        ▼               ▼               ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│   Grid API   │ │  x402 API    │ │  Nansen API  │
│  (Funding)   │ │  (Payments)   │ │  (Data)      │
└──────────────┘ └──────────────┘ └──────────────┘
        │               │               │
        └───────────────┼───────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Supabase (PostgreSQL)                      │
│  ┌──────────────────┐  ┌──────────────────┐                  │
│  │  conversations   │  │   alpha_usage    │                  │
│  │  messages        │  │  (ledger)        │                  │
│  │  users           │  └──────────────────┘                  │
│  └──────────────────┘                                         │
└─────────────────────────────────────────────────────────────────┘
```

### Flow: Alpha Stream Request

1. **User Request**: "Show me wallet deep dive for 2NHG...kH7V"
2. **AI Tool Selection**: Claude selects `alphaWalletDeepDive`
3. **Payment Guard**: Server checks Grid wallet balance via Grid API
4. **Ephemeral Wallet**: Creates temporary wallet for x402 payment
5. **Funding**: Transfers 0.01 USDC + 0.001 SOL from Grid → ephemeral wallet
6. **x402 Payment**: Ephemeral wallet pays ~0.001 USDC to Nansen via x402
7. **Data Fetch**: Nansen returns historical balances + counterparties
8. **Usage Logging**: Server writes row to `alpha_usage` table
9. **Response**: AI formats data into `AlphaStreamCard` component
10. **UI Update**: Client renders card + shows balance update toast

## 🗺️ Future Roadmap

### Phase 1: Enhanced Analytics (Q1 2025)
- [ ] **Portfolio Analytics**: Multi-wallet aggregation and PnL tracking
- [ ] **Alert System**: Real-time notifications for smart money movements
- [ ] **Custom Dashboards**: Save and share Alpha Stream insights
- [ ] **Export Tools**: CSV/JSON export for external analysis

### Phase 2: Multi-Chain Expansion (Q2 2025)
- [ ] **Ethereum Support**: Extend Alpha Streams to Ethereum mainnet
- [ ] **Cross-Chain Analysis**: Compare flows across Solana, Ethereum, Base
- [ ] **Layer 2 Integration**: Optimism, Arbitrum, Polygon support
- [ ] **Bridge Intelligence**: Track cross-chain capital movements

### Phase 3: Advanced Features (Q3 2025)
- [ ] **AI-Powered Alerts**: Natural language alert creation ("notify me when whales buy SOL")
- [ ] **Collaborative Workspaces**: Team sharing and permission management
- [ ] **API Access**: REST/GraphQL APIs for programmatic access
- [ ] **Webhook Integration**: Connect Alpha Streams to trading bots and dashboards

### Phase 4: Enterprise Features (Q4 2025)
- [ ] **Cost Controls**: Budget limits and spending alerts per team/user
- [ ] **Audit Logs**: Comprehensive activity tracking for compliance
- [ ] **SSO Integration**: Enterprise authentication (Okta, Auth0)
- [ ] **Custom Data Sources**: Onboard proprietary analytics providers

### Integration Opportunities
- **DEX Aggregators**: Jupiter, 1inch for trade execution from insights
- **Portfolio Trackers**: Zapper, DeBank for unified portfolio view
- **Trading Bots**: Integrate Alpha Streams signals into automated strategies
- **DAO Tools**: Snapshot, Tally for governance-informed decisions

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ or Bun
- Git
- Expo CLI (optional, included in dependencies)

### 1. Clone and Install

```bash
git clone https://github.com/darkresearch/mallory.git
cd mallory
bun install
```

### 2. Environment Setup

#### Client Environment (`.env` in `apps/client/`)
```bash
# Copy from template
cp apps/client/.env.example apps/client/.env

# Required variables:
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
EXPO_PUBLIC_BACKEND_API_URL=http://localhost:3001
EXPO_PUBLIC_GRID_API_KEY=your-grid-api-key
EXPO_PUBLIC_GRID_ENV=sandbox
```

#### Server Environment (`.env` in `apps/server/`)
```bash
# Copy from template
cp apps/server/.env.example apps/server/.env

# Required variables:
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ANTHROPIC_API_KEY=sk-ant-your-key
BIRDEYE_API_KEY=your-birdeye-key
GRID_API_KEY=your-grid-api-key

# Optional (for AI tools):
EXA_API_KEY=your-exa-key

# Infinite Memory (OpenMemory for infinite context):
OPENMEMORY_URL=http://localhost:8080
OPENMEMORY_API_KEY=your-openmemory-key
```

### 3. Run Development Servers

#### Option A: Run Both (Client + Server)
```bash
bun run dev
```

#### Option B: Run Separately
```bash
# Terminal 1 - Backend
bun run server

# Terminal 2 - Client (Web)
bun run client
```

The client will be available at:
- Web: http://localhost:8081
- API: http://localhost:3001

## 📱 Client Development

See [apps/client/README.md](./apps/client/README.md) for detailed client documentation.

**Key Commands:**
```bash
cd apps/client

# Web
bun run web

# iOS (requires Mac + Xcode)
bun run ios

# Android (requires Android Studio)
bun run android
```

## 🔧 Server Development

See [apps/server/README.md](./apps/server/README.md) for detailed server documentation.

**API Endpoints:**
- `POST /api/chat` - AI chat streaming with tool calling
- `GET /api/wallet/holdings` - Wallet holdings with price data
- `GET /health` - Health check

**AI Tools:**
- `searchWeb` - Web search via Exa (always available)
- `addMemory` - User memory via Supermemory (optional)
- `nansen*` - 20+ Nansen API endpoints for blockchain analytics (requires x402 payments)
- `alphaWalletDeepDive` - Premium wallet analysis via Alpha Streams (~0.002 USDC)
- `alphaSmartMoneyRadar` - Cross-chain smart money intelligence (~0.002 USDC)
- `alphaTokenPulse` - Token activity and flow analysis (~0.001 USDC)
- `nansen*` - 20+ individual Nansen API endpoints (requires x402 payments)

## 🔑 Grid Wallet Integration

Mallory uses [Grid](https://developers.squads.so) for embedded wallets:

- **Non-Custodial**: User private keys never exist - Grid uses secure enclaves and MPC
- **Email-Based Auth**: Simple OTP verification flow
- **Session Secrets**: Generated client-side, passed to backend only when needed for signing
- **Smart Contract Wallets**: Spending limits and programmable transactions
- **Production Ready**: Sandbox and production environments
- **x402 Integration**: Automatic micropayments for premium data APIs via Alpha Streams

Grid's architecture means neither the client nor server ever has access to user private keys, making it truly non-custodial while still providing seamless transaction signing.

**Alpha Streams Payment Flow:**
1. User requests premium insight in chat
2. Server creates ephemeral wallet for x402 payment
3. Grid wallet funds ephemeral wallet (0.01 USDC + 0.001 SOL)
4. Ephemeral wallet pays Nansen via x402 (~0.001–0.002 USDC)
5. Data returned and rendered in AlphaStreamCard
6. Balance updates shown in real-time with toast notifications
7. All transactions logged in `alpha_usage` table for reconciliation

## 📦 Shared Package

The `packages/shared` directory contains TypeScript types and utilities shared between client and server:

```typescript
import type { ChatRequest, HoldingsResponse } from '@darkresearch/mallory-shared';
import { X402PaymentService } from '@darkresearch/mallory-shared';
```

## 🧪 Testing

Mallory has comprehensive test coverage: unit tests, integration tests, and E2E tests.

**Run tests:**
```bash
cd apps/client

# Fast tests (unit + integration)
bun test

# E2E tests (requires backend running)
bun run test:e2e

# AI-powered tests (optional - expensive)
# These use Claude to verify response completeness and test 200k+ token conversations
bun test __tests__/e2e/chat-message-flow.test.ts  # ~5-10 min, ~$1-2
bun test __tests__/e2e/long-context.test.ts       # ~10-20 min, ~$2-3
```

**CI/CD:**
- Regular tests run on every PR
- AI tests only run when `[run-ai-tests]` is in commit message:
  ```bash
  git commit -m "fix: improve streaming [run-ai-tests]"
  ```

See [apps/client/__tests__/CHAT_STATE_TESTS.md](./apps/client/__tests__/CHAT_STATE_TESTS.md) for full testing documentation.

## 🚢 Deployment

### Client Deployment
- **Web**: Deploy to Vercel, Netlify, or any static host
- **iOS**: Deploy via Expo EAS or native build
- **Android**: Deploy via Expo EAS or native build

See [apps/client/README.md](./apps/client/README.md#deployment) for details.

### Server Deployment
- **Recommended**: Railway, Render, Fly.io
- **Node.js**: Any Node.js 18+ hosting

See [apps/server/README.md](./apps/server/README.md#deployment) for details.

## 🛠 Troubleshooting

**Google OAuth “Unsupported provider: provider is not enabled”** as highlighted in https://github.com/darkresearch/mallory/issues/73
- **Summary:** Supabase blocks Google sign-in until the provider is enabled in the dashboard.
- **Steps to reproduce:** run Mallory with valid Supabase env vars, click **Continue with Google**, Supabase returns the 400 error.
- **Observed behaviour:** Supabase responds with `{"code":400,"error_code":"validation_failed","msg":"Unsupported provider: provider is not enabled"}` and the user cannot sign in.
- **Root cause:** the Google OAuth provider is disabled by default in Supabase projects.
- **Fix:**
  - In the Supabase dashboard open `Authentication → Providers → Google`, flip **Enable** on.
  - In Google Cloud Console create OAuth credentials (type “Web application”) if you haven’t already.
    - Add redirect URIs such as `https://<your-supabase-project>.supabase.co/auth/v1/callback`.
    - Copy the client ID and secret back into Supabase.
  - Save the provider settings, reload Mallory, and try **Continue with Google** again.

## 🏷️ Version Management

Mallory uses synchronized semantic versioning across all packages.

### Auto-Release via PR

Include `[release: v*.*.*]` in your PR title:

```
feat: add new wallet feature [release: v0.2.0]
```

When merged to `main`, the version automatically bumps and a GitHub release is created! 🚀

### Manual Release

```bash
bun scripts/sync-version.js 0.2.0
git add . && git commit -m "chore: bump version to 0.2.0"
git tag v0.2.0 && git push && git push --tags
```

See [VERSION.mdx](./VERSION.mdx) for details.

## 🤝 Contributing

Contributions welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) first.

## 📄 License

Apache License 2.0 - see [LICENSE](./LICENSE) for details.

## 🆘 Support

- 📧 Email: hello@darkresearch.ai
- 🐛 Issues: [GitHub Issues](https://github.com/darkresearch/mallory/issues)
- 📚 Docs: [Full Documentation](./docs/)

## 🙏 Acknowledgments

Built with:
- [Expo](https://expo.dev) - React Native framework
- [Grid (Squads)](https://developers.squads.so) - Embedded wallets
- [Anthropic](https://anthropic.com) - Claude AI with extended thinking
- [Exa](https://exa.ai) - AI-powered web search
- [Supermemory](https://supermemory.ai) - User memory & RAG
- [Supabase](https://supabase.com) - Auth & database
- [Birdeye](https://birdeye.so) - Solana market data
- [Nansen](https://nansen.ai) - Blockchain analytics (via x402)
- [Faremeter](https://x402.org) - x402 payment protocol
- [streamdown-rn](https://www.npmjs.com/package/streamdown-rn) - React Native markdown streaming

---

**Made with ❤️ by [Dark](https://darkresearch.ai)**

