# ChilizTV - Live Sports Betting & Streaming Platform

A modern, real-time sports betting and streaming platform built with Next.js, featuring live match streaming, real-time chat, and Web3 integration with Chiliz blockchain.

## 🚀 Features

### 🏈 Live Sports Streaming
- **Real-time match streaming** with multiple commentator options
- **Live match status** tracking (LIVE, BET_OPEN, ENDED)

### 💰 Sports Betting
- **Web3 betting** with CHZ tokens on Chiliz blockchain
- **Multiple bet types**: Match winner, Half-time bets
- **Real-time odds** from API-FOOTBALL
- **Bet history** tracking and portfolio management
- **Fan token integration** for enhanced betting features

### 💬 Real-time Chat System
- **Live chat** per match with Gun.js
- **Featured messages** for users with 50+ fan tokens
- **Bet messages** automatically featured
- **System messages** for match events
- **User authentication** with Privy

### 🏆 Fan Token Integration
- **Fan token balance** display in betting dialog
- **Token breakdown** showing individual team tokens
- **Featured message access** based on token balance
- **Half-time betting** requires 50+ fan tokens

### 👤 User Management
- **Web3 authentication** with Privy
- **Wallet integration** with Chiliz testnet
- **User profiles** with betting statistics
- **Username customization** with verification
- **ZK Identity to withdraw** with self-protocol

## 🛠️ Technologies

### Frontend
- **Next.js** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling

### Web3 & Blockchain
- **Privy** - Web3 authentication
- **Wagmi** - React hooks for Ethereum
- **Viem** - TypeScript interface for Ethereum
- **Chiliz Testnet** - Sports blockchain integration
- **Self-Protocol** - ZK identity

### Real-time Communication
- **Gun.js** - Decentralized real-time database
- **WebSockets** - Real-time chat functionality

## ⚙️ Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd front-end/chiliztv
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Configure environment variables**
```bash
# Create a .env.local file
cp .env.example .env.local
```

Required environment variables:
```env
# Privy Authentication
NEXT_PUBLIC_PRIVY_PROJECT_ID=your_privy_project_id
NEXT_PUBLIC_PRIVY_CLIENT_ID=your_privy_client_id

# Backend API
NEXT_PUBLIC_API_URL=http://localhost:3000

# Vercel Deployment
NEXT_PUBLIC_URL=https://your-domain.vercel.app
```

4. **Start development server**
```bash
npm run dev
# or
yarn dev
```

5. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_PRIVY_PROJECT_ID` | Privy project ID | Yes |
| `NEXT_PUBLIC_PRIVY_CLIENT_ID` | Privy client ID | Yes |
| `NEXT_PUBLIC_API_URL` | Backend API URL | Yes |
| `NEXT_PUBLIC_URL` | Frontend URL for Vercel | Yes |

### Supported Networks

- **Chiliz Testnet** - Development and testing
- **Chiliz Mainnet** - Production (when ready)

## 📝 License

This project is licensed under the AGPL-3.0 License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ by the ChilizTV Team**
