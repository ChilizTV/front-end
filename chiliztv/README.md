# ChilizTV - Live Sports Betting & Streaming Platform

A modern, real-time sports betting and streaming platform built with Next.js, featuring live match streaming, real-time chat, and Web3 integration with Chiliz blockchain.

## 🚀 Features

### 🏈 Live Sports Streaming
- **Real-time match streaming** with multiple commentator options
- **Live match status** tracking (LIVE, BET_OPEN, ENDED)
- **Match filtering** by status and league
- **Auto-refresh** every 10 minutes for live updates

### 💰 Sports Betting
- **Web3 betting** with CHZ tokens on Chiliz blockchain
- **Multiple bet types**: Match winner, Over/Under, Both teams score, Half-time bets
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

## 🛠️ Technologies

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Lucide React** - Icon library

### Web3 & Blockchain
- **Privy** - Web3 authentication
- **Wagmi** - React hooks for Ethereum
- **Viem** - TypeScript interface for Ethereum
- **Chiliz Testnet** - Sports blockchain integration

### Real-time Communication
- **Gun.js** - Decentralized real-time database
- **WebSockets** - Real-time chat functionality

### UI Components
- **shadcn/ui** - Modern component library
- **Radix UI** - Accessible primitives
- **Custom components** - Tailored for sports betting

## 📋 Prerequisites

- **Node.js** (version 18+)
- **npm** or **yarn**
- **Chiliz testnet** wallet
- **Backend server** running (see server README)

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

## 🏗️ Project Structure

```
front-end/chiliztv/
├── app/                    # Next.js App Router
│   ├── dashboard/         # User dashboard page
│   ├── live/             # Live matches page
│   ├── leaderboard/      # Leaderboard page
│   └── layout.tsx        # Root layout
├── components/           # React components
│   ├── ui/              # shadcn/ui components
│   ├── live/            # Live streaming components
│   ├── bets/            # Betting components
│   ├── dashboard/       # Dashboard components
│   └── providers/       # Context providers
├── services/            # API services
├── utils/               # Utility functions
├── models/              # TypeScript interfaces
├── lib/                 # Library configurations
└── public/              # Static assets
```

## 🎯 Key Components

### Live Matches (`components/live/LiveMatches.tsx`)
- Displays all available matches with real-time status
- Filters by LIVE, BET_OPEN, ENDED
- Shows match details, odds, and fan tokens
- Responsive grid layout with hover effects

### Bet Dialog (`components/bets/BetsDialog.tsx`)
- Web3 betting interface with CHZ integration
- Fan token balance display
- Multiple bet types (full-time, half-time)
- Real-time CHZ price from Pyth Network

### Chat System (`components/live/Chats.tsx`)
- Real-time chat with Gun.js
- Featured messages for high token holders
- Bet message integration
- User authentication integration

### Dashboard (`components/dashboard/Dashboard.tsx`)
- User profile management
- Betting history and statistics
- Fan token portfolio
- Web3 wallet integration

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

### Fan Tokens Supported

- **PSG** - Paris Saint-Germain
- **JUV** - Juventus
- **BAR** - FC Barcelona
- **INTER** - Inter Milan

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository** to Vercel
2. **Set environment variables** in Vercel dashboard
3. **Deploy** automatically on push to main branch

```bash
# Build for production
npm run build

# Start production server
npm start
```

### Manual Deployment

```bash
# Build the application
npm run build

# Export static files (optional)
npm run export

# Deploy to your hosting provider
```

## 🔗 API Integration

The frontend communicates with the backend through REST APIs:

### Chat Endpoints
- `POST /chat/message/{matchId}` - Send chat message
- `POST /chat/bet/{matchId}` - Send bet message
- `GET /chat/messages/{matchId}` - Get room messages
- `GET /chat/token-balances/{walletAddress}` - Get user token balances

### Match Endpoints
- `GET /matches` - Get all matches
- `GET /matches/live` - Get live matches
- `GET /matches/{id}` - Get specific match

## 🎨 UI/UX Features

### Design System
- **Dark theme** optimized for sports viewing
- **Responsive design** for mobile and desktop
- **Smooth animations** with Framer Motion
- **Accessible components** with Radix UI

### User Experience
- **Real-time updates** without page refresh
- **Intuitive betting flow** with clear steps
- **Visual feedback** for all user actions
- **Error handling** with user-friendly messages

## 🔒 Security

- **Web3 authentication** with Privy
- **Wallet signature** verification
- **HTTPS enforcement** in production
- **Input validation** on all forms
- **XSS protection** with Next.js

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run integration tests
npm run test:integration

# Run E2E tests
npm run test:e2e
```

## 📊 Performance

- **Next.js optimization** with App Router
- **Image optimization** with Next.js Image
- **Code splitting** for faster loading
- **Lazy loading** for non-critical components
- **Caching strategies** for API calls

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Development Guidelines

- **TypeScript** for all new code
- **ESLint** and **Prettier** for code formatting
- **Component testing** with Jest and React Testing Library
- **Accessibility** compliance with WCAG guidelines

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the `/docs` folder
- **Issues**: Create an issue on GitHub
- **Discord**: Join our community server
- **Email**: support@chiliztv.com

## 🔄 Changelog

### v1.0.0 (Current)
- ✅ Live match streaming
- ✅ Real-time chat system
- ✅ Web3 betting integration
- ✅ Fan token features
- ✅ User dashboard
- ✅ Mobile responsive design

---

**Built with ❤️ by the ChilizTV Team**
