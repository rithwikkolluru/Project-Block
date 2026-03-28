# CryptoShield.version2

A production-grade Web3 security platform built on the Algorand blockchain. CryptoShield provides real-time threat detection, wallet analysis, smart contract auditing, and phishing URL scanning with an institutional-grade security interface.

---

## Overview

CryptoShield.version2 is the complete rebuild of the original CryptoShield project. It transforms a static prototype into a fully interactive, authenticated, and secured platform with a modern dark glassmorphism design, Three.js particle backgrounds, and Framer Motion animations.

---

## Features

### Security Scanning
- Wallet Address Analysis: Scans any Algorand wallet address for suspicious activity, flagged transactions, and risk level
- Smart Contract Auditing: Analyzes Algorand application IDs for known vulnerabilities and threat patterns
- Transaction Verification: Inspects transaction hashes for anomalies, double spends, and suspicious patterns
- Phishing URL Detection: Neural-net driven analysis of URLs for phishing signatures and malicious redirects

### Input Validation
All scan inputs are validated against official Algorand format specifications before any scan can proceed:
- Wallet Address: 58-character uppercase Base32 string with checksum verification via algosdk
- Transaction ID: 52-character uppercase Base32 string
- Smart Contract App ID: Numeric integer within the uint64 range
- Phishing URL: Must begin with http:// or https://

Any format violation immediately blocks the scan and provides a specific error message.

### Authentication
- Email-based login with session persistence via localStorage
- Algorand wallet connection via Pera Wallet
- All platform routes are protected — unauthenticated users are redirected to the login page
- Session is fully cleared on logout

### Interactive Dashboard
- Real-time Traffic Analysis chart with animated data simulation
- Live security stats with hover effects and micro-animations
- Shield Status progress indicator
- Sidebar tab navigation with active state highlighting

### Network Map
- Force-directed physics visualization of Algorand transaction paths
- Discovers connected wallet clusters and malicious entities on-chain
- Available exclusively to authenticated users

### Scam Registry
- Community-sourced database of flagged wallets, contracts, and URLs
- Searchable, filterable, and sortable registry interface
- Protected behind authentication

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite |
| Styling | Tailwind CSS, custom CSS variables, glassmorphism utilities |
| Animations | Framer Motion |
| 3D Visuals | Three.js (particle background, LightPillar shader) |
| State Management | Zustand |
| Blockchain | Algorand SDK (algosdk), Pera Wallet |
| Routing | React Router DOM v6 |
| Backend | Node.js, Express.js |
| Security | Helmet, CORS, Rate Limiting |

---

## Project Structure

```
src/
  components/
    auth/           ProtectedRoute — route guard for authenticated pages
    home/           Hero, Features, HowItWorks, DashboardPreview
    layout/         Navbar, Footer
    ui/             ScanTabs, FeatureCard
    visuals/        Scene (Three.js), LightPillar (shader)
  hooks/
    useWallet.ts    Zustand store for auth state and session persistence
    useScanWarp.ts  Scan execution, animation state, risk scoring
  pages/
    Home.tsx
    NetworkMapPage.tsx
    RegistryPage.tsx
    Auth/           LoginPage, LogoutPage
  services/
    blockchain/     algorandService.js (Pera Wallet + algosdk abstraction)
    api/            auth.js (Sign In With Algorand logic)
  stores/
    useCosmicStore.ts   Global scan state and history
  utils/
    algorandValidator.ts  Algorand input format validation
  physics/
    gravityEngine.ts      Risk physics calculations
```

---

## Getting Started

### Prerequisites
- Node.js 18 or higher
- npm 9 or higher

### Installation

```bash
git clone https://github.com/rithwikkolluru/Project-Block.git
cd Project-Block
npm install
```

### Development

```bash
npm run dev
```

The app will be available at http://localhost:5174

### Environment

The backend server runs on port 5000. Algorand testnet node: https://testnet-api.algonode.cloud

---

## Branch

This version is on the `feature/v2-redesign` branch.

---

## License

This project is for educational and demonstration purposes on the Algorand blockchain ecosystem.
