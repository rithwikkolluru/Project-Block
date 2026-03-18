# CryptoShield - AI-Based Scam Detection for Crypto Transactions

CryptoShield is a premium, high-performance web dashboard built to analyze and visualize blockchain transaction risk in real time. Leveraging an advanced AntGravity physics engine built with Framer Motion and Zustand, it provides users with an intuitive, dynamic interface to identify and report malicious activity on the blockchain, specifically tailored for the Algorand network.

## Project Architecture

The architecture of CryptoShield relies on a combination of React, Ant Design, and custom visual physics engines mapping to on-chain risk metrics. Risk metrics interact directly with the frontend to create weight, orbit, and visual indicators of danger.

### Core Modules

1. Scanner (GravityHero)
The primary entry point. Users input a wallet or contract address. This interface features a magnetic input field and triggers a simulated hyper-space "warp" animation during data resolution to manage perceived loading times.

2. Risk visualization (RiskNebula)
Following a scan, a computed Risk Score (out of 100) dictates the center of gravity in a simulated physics environment. Orbital cards representing Wallet History, Contract Audits, and Community Alerts orbit the central score. The color, speed, and behavior of these orbits change depending on the risk severity (Safe, Warning, Danger).

3. Activity Timeline (StellarHistory)
A high-performance, tabular view of recent or historical scans, featuring stagger-animated rows, color-coded severity badges, and layout structures capable of handling large virtualized datasets.

4. Network Connections (NetworkMap)
A deep dive view mapping out transaction connections using a force-directed graph. Suspect nodes and their transaction relationships are visualized here, scaling in size and changing color based on their assigned risk index. Users can select nodes to view specific details, metrics, and risk flags within a slide-out panel.

5. Community Registry (ScamRegistry)
A decentralized lookup interface for viewing and submitting intelligence on fraudulent addresses. This section features a sortable, filterable list of known scam addresses alongside a form submission UI that is designed to connect directly with an Algorand smart contract (AVM) for reporting new threats. 

## Technology Stack

Frontend Framework: React 18, Vite
Styling and Design: Vanilla CSS, Tailwind CSS, Ant Design 5
State Management: Zustand
Animations and Physics: Framer Motion, react-force-graph-2d, custom WebGL Shaders
Routing: React Router DOM
Scrolling: @studio-freight/lenis (Smooth Scrolling)
Data Fetching: Mocked asynchronous services (designed to easily swap with Algorand SDKs and AVM calls)

## Mobile Optimization

The application respects system-level breakpoint optimizations.
- Desktop environments experience multi-orbital planetary physics and large virtualized tables.
- Mobile environments stack visualizations, limit particle computations, and implement swipe/touch gesture considerations for seamless interaction over small screen boundaries.
- The physics engine incorporates requestAnimationFrame (RAF) throttling to ensure steady 60 frames per second performance on common mobile hardware.

## Installation and Setup

1. Clone this repository
2. ensure Node.js is installed
3. Install the required dependencies:
   npm install
4. Run the local development server:
   npm run dev

## Connecting to Algorand (Next Steps)

Currently, the data pathways within the app use mock simulated responses. The frontend components are configured parallel to typical Algorand data structures. You can connect the dashboard logic by:
1. Importing the `algosdk` package.
2. Replacing the asynchronous resolution patterns in `useScanWarp` and `mockFetchNetworkMap` with calls to an Algod/Indexer instance or your own local AlgoKit network.
3. Modifying the `SubmitScamReportForm` inside the Registry module to construct, sign, and send Application Call (AppCall) transactions mapping to your decentralized registry smart contract. 

## Design System

The platform intentionally does not use generic interface components. It relies on a carefully curated 'cosmic' visual language:
Backgrounds: Deep void gradients blending into indigo.
Typography: High-contrast sans-serif, using monospaced fonts for cryptographic data points.
Glassmorphism: Interfaces float above the background canvas using backdrop blurring and semi-transparent borders.
Performance: Strict avoidance of layout thrashing and DOM-heavy redraws during physics calculations. 

## System Constraints and Environment Requirements

This system is optimized for modern browsers supporting WebGL and advanced layout animations. When deploying to production environments, ensure you perform standard build processes using Vite before pushing to a CDN or edge network. Always consider implementing strict content security policies (CSP) when connecting to live wallet providers.
