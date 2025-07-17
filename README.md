# ChilizTV - Live Sports Prediction & Streaming Platform

A modern, real-time sports predictions and streaming platform built with Next.js, featuring live match streaming, real-time chat, and Web3 integration with Chiliz blockchain.

## 🚀 Features

### 🏈 Live Sports Streaming
- **Real-time match streaming** with multiple commentator options
- **Live match status** tracking (LIVE, PREDICTION_OPEN, ENDED)

### 💰 Sports prediction
- **Web3 prediction** with CHZ tokens on Chiliz blockchain
- **Multiple prediction types**: Match winner, Half-time predictions
- **Real-time odds** from API-FOOTBALL
- **Prediction history** tracking and portfolio management
- **Fan token integration** for enhanced predictionning features

### 💬 Real-time Chat System
- **Live chat** per match with Gun.js
- **Featured messages** for users with 50+ fan tokens
- **Prediciton messages** automatically featured
- **System messages** for match events
- **User authentication** with Dynamic.xyz

### 🏆 Fan Token Integration
- **Fan token balance** display in predictionning dialog
- **Token breakdown** showing individual team tokens
- **Featured message access** based on token balance
- **Half-time predictionning** requires 50+ fan tokens

### 👤 User Management
- **Web3 authentication** with Dynamic.xyz
- **Wallet integration** with Chiliz testnet
- **User profiles** with predictionning statistics
- **Username customization** with verification
- **ZK Identity to withdraw** with self-protocol

## 🛠️ Technologies

### Frontend
- **Next.js** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling

### Web3 & Blockchain
- **Dynamic.xyz** - Web3 authentication
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
NEXT_PUBLIC_STAGING_DYNAMIC_ENVIRONMENT_ID = 
NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID = 
NEXT_PUBLIC_STAGING = 

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
| `NEXT_PUBLIC_STAGING_DYNAMIC_ENVIRONMENT_ID` | Dynamic Staging ID | Yes |
| `NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID` | Dynamic Prod ID client ID | Yes |
| `NEXT_PUBLIC_STAGING = ` | Staging (True || False) | Yes |
| `NEXT_PUBLIC_API_URL` | Backend API URL | Yes |
| `NEXT_PUBLIC_URL` | Frontend URL for Vercel | Yes |

### Supported Networks

- **Chiliz Testnet** - Development and testing
- **Chiliz Mainnet** - Production (when ready)

## 📝 License

This project is licensed under the AGPL-3.0 License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ by the ChilizTV Team**
