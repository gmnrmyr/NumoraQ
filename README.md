# NumoraQ 🚀💰🧠

**A crypto-native financial management platform for serious investors, Web3 enthusiasts, and financially curious individuals.**

[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue)](https://github.com/gmnrmyr/NumoraQ)

> **Status: archived (2025 cloud version).** This repo is the multi-user SaaS version of NumoraQ, built June to September 2025 (500+ commits): React + TypeScript + Vite on the front, Supabase (Postgres, RLS, edge functions) on the back, Stripe and Solana payments in test mode. The hosted site is offline. Development continues as a private, local-first app that runs on my own machine, so the links to the live site below no longer work.

## 🎯 Overview

NumoraQ combines traditional finance tools with cutting-edge blockchain integrations, AI-powered advisory, and a gamified XP-driven user engagement system. Our mission is to give users full control of their net worth across all asset classes — from fiat to DeFi — while incentivizing action, discipline, and education through community-driven systems.

### Key Features ✨

- **🏦 Advanced Portfolio Management**: Track crypto, NFTs, stocks, real estate, and manual assets
- **🎮 Gamification System**: XP-based progression from NEWCOMER to WHALE
- **🤖 AI Financial Advisory**: GPT-powered personalized insights
- **💎 Premium Degen Plans**: Subscription-based premium features
- **📊 Real-time Analytics**: Live price tracking and portfolio visualization
- **🔐 Multi-wallet Support**: Solana, EVM, and manual integrations

## 🏗 Architecture

### Frontend Stack
- **React 18** + TypeScript
- **TailwindCSS** with Brutalist theme tokens
- **Vite** for build optimization
- **React Context** + Custom Hooks
- **Unicorn Studio** for role-based animations
- **Custom Charts** for projections and asset breakdowns

### Backend Stack
- **Supabase** (Auth, PostgreSQL, Storage, Realtime)
- **Row Level Security (RLS)** on all data layers
- **Edge Functions** for payment/webhook logic
- **Stripe** for subscription management
- **CoinGecko API** + custom live price APIs
- **ChatGPT API** for AI advisory features

### Infrastructure
- **Production**: [numoraq.online](https://numoraq.online/)
- **Development**: [testnumoraq.vercel.app](https://testnumoraq.vercel.app/)
- **CI/CD**: GitHub → Vercel → Supabase migrations
- **Payments**: Stripe integration
- **Database**: Supabase PostgreSQL with automated backups

## 🚀 Getting Started

### Prerequisites
- Docker and Docker Compose
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/gmnrmyr/NumoraQ.git
   cd NumoraQ
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env.local
   # Configure your environment variables
   ```

3. **Build and start with Docker**
   ```bash
   # Build the Docker image
   docker-compose build

   # Start the development environment
   docker-compose up -d

   # View logs (optional)
   docker-compose logs -f
   ```

4. **Open your browser**
   ```
   http://localhost:5173
   ```

### Environment Variables

Create a `.env.local` file with the following variables:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_key
VITE_OPENAI_API_KEY=your_openai_key
VITE_COINGECKO_API_KEY=your_coingecko_key
```

## 💰 Monetization

### Degen Plans (Premium Subscriptions)
- **Monthly**: $9.99
- **3-Month**: $24.99  
- **6-Month**: $44.99
- **Yearly**: $79.99
- **Lifetime**: $299

### Tier System
Progressive XP-based roles:
- 🆕 **NEWCOMER** → 🐋 **WHALE**
- Points earned through donations and activity
- Tier-based feature access and rewards

## 🎮 Gamification Features

### XP System
- Daily check-ins and activity rewards
- Streak bonuses (daily/weekly/monthly)
- Leaderboard competitions
- Community challenges

### Premium Features
- AI GPT financial consulting
- Advanced dashboard animations
- Exclusive tier benefits
- Priority customer support

## 🛠 Development

### Project Structure
```
src/
├── components/     # React components
├── hooks/         # Custom React hooks
├── pages/         # Route components
├── lib/           # Utilities and configs
├── types/         # TypeScript definitions
└── styles/        # CSS and theme files
```

### Available Scripts

#### Docker Commands
```bash
# Build and start containers
docker-compose up -d

# Stop containers
docker-compose down

# Rebuild containers
docker-compose build --no-cache

# View logs
docker-compose logs -f

# Access container shell
docker-compose exec app sh

# Clean up containers and volumes
docker-compose down -v --remove-orphans
```

#### Container Commands (Inside Docker)
```bash
# Access the container
docker-compose exec app sh

# Then run commands inside the container:
npm run build      # Build for production
npm run lint       # Run ESLint
npm run test       # Run tests
```

### Database Schema

Key tables:
- `user_premium_status` - Premium subscription management
- `user_points` - XP and tier tracking
- `premium_codes` - Admin-generated codes
- `portfolios` - User asset tracking
- `transactions` - Income/expense records

## 🔧 Known Issues & Roadmap

### Current Challenges
- [ ] Stripe tier purchases not reflecting roles
- [ ] Degen time stacking logic needs fixes
- [ ] CMS admin panel consolidation needed
- [ ] Auth metadata exposure limitations

### Phase 1 (In Progress)
- [ ] Fix degen stacking logic
- [ ] Implement points → tier auto upgrade
- [ ] CMS UI/UX overhaul
- [ ] Complete test environment setup

### Phase 2 (Planned)
- [ ] Enhanced wallet sync (Solana + EVM)
- [ ] NFT + DeFi price tracking
- [ ] GPT financial persona advisor
- [ ] Mobile-responsive improvements

### Phase 3 (Future)
- [ ] Mobile app development
- [ ] Open banking integration
- [ ] Advanced analytics dashboard
- [ ] Community features expansion

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use TailwindCSS for styling
- Maintain responsive design principles
- Add tests for new features
- Update documentation as needed

## 📊 Admin Panel

Access the CMS via `CTRL+SHIFT+E` in the main dashboard (temporary solution).

### Admin Features
- User management and analytics
- Premium code generation
- Points and tier management
- Payment and subscription oversight
- System logs and monitoring

## 🔐 Security

- Row Level Security (RLS) implemented on all database operations
- Stripe webhook signature validation
- User authentication via Supabase Auth
- Environment variable protection
- Regular security audits

## 📱 Browser Support

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📞 Support & Community

- **Documentation**: [Project Wiki](https://github.com/gmnrmyr/NumoraQ/wiki)
- **Issues**: [GitHub Issues](https://github.com/gmnrmyr/NumoraQ/issues)
- **Discussions**: [GitHub Discussions](https://github.com/gmnrmyr/NumoraQ/discussions)

## 📄 License

This project is proprietary software. All rights reserved.

## 🙏 Acknowledgments

Built with ❤️ by degens for all financial analysis frens.

---

**⚠️ Disclaimer**: NumoraQ is not a financial advisor. All financial decisions should be made at your own discretion and risk.

---

*© 2025 NumoraQ. Made by degens for degens.* 🚀
