# Aegis - Unified Security Oracle Platform

Aegis is a comprehensive security oracle platform that combines smart contracts, a real-time monitoring oracle, and a modern web frontend. The platform provides automated threat detection, address freezing, and key rotation capabilities for enhanced blockchain security.

## 🏗️ Architecture

The project consists of three integrated components:

- **Frontend** (`/frontend`) - Next.js React application with Web3 integration
- **Smart Contracts** (`/contracts`) - Solidity contracts for security management
- **Oracle** (`/oracle`) - Node.js backend service monitoring blockchain transactions

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- MetaMask or compatible Web3 wallet
- Git

### Installation

1. **Clone and setup the project:**
```bash
cd C:\Users\user\OneDrive\Documents\Aegis
npm install
npm run install:all
```

2. **Configure environment variables:**
```bash
# Copy environment templates
cp oracle/env.example oracle/.env
cp frontend/env.example frontend/.env.local

# Edit the files with your configuration:
# oracle/.env - Set RPC_URL, ORACLE_PRIVATE_KEY, AEGIS_ADDRESS, MASTER_KEY_HEX
# frontend/.env.local - Set NEXT_PUBLIC_AEGIS_ADDRESS, NEXT_PUBLIC_ORACLE_URL
```

3. **Deploy contracts:**
```bash
# Start local Hardhat node
npm run dev:hardhat

# In another terminal, deploy contracts
cd contracts
npm run deploy
```

4. **Update environment variables** with the deployed contract addresses from `contracts/deployment.json`

5. **Start the entire platform:**
```bash
npm run dev
```

This will start:
- Frontend on http://localhost:3000
- Oracle API on http://localhost:3001  
- Hardhat node on http://localhost:8545

## 📋 Available Scripts

### Root Level Commands
- `npm run dev` - Start all services in development mode
- `npm run build` - Build contracts and frontend
- `npm run start` - Start production services
- `npm run deploy` - Deploy contracts to local network
- `npm run test` - Run contract tests
- `npm run clean` - Clean build artifacts
- `npm run install:all` - Install dependencies for all subprojects

### Individual Service Commands
- `npm run dev:frontend` - Start frontend only
- `npm run dev:oracle` - Start oracle only  
- `npm run dev:hardhat` - Start Hardhat node only

## 🔧 Configuration

### Environment Variables

#### Oracle (.env)
```
RPC_URL=http://127.0.0.1:8545
ORACLE_PRIVATE_KEY=your_oracle_private_key_here
AEGIS_ADDRESS=your_deployed_aegis_contract_address
MASTER_KEY_HEX=your_master_key_for_encryption
PORT=3001
LARGE_TRANSFER_THRESHOLD_ETH=5
VELOCITY_WINDOW_SECONDS=20
VELOCITY_TX_COUNT=3
```

#### Frontend (.env.local)
```
NEXT_PUBLIC_AEGIS_ADDRESS=your_deployed_aegis_contract_address
NEXT_PUBLIC_ORACLE_URL=http://localhost:3001
```

## 🛡️ Security Features

### Smart Contracts
- **Aegis.sol** - Main security contract with:
  - Address freezing/unfreezing
  - Balance management
  - Guardian system
  - Key rotation capabilities
  - Transfer restrictions for frozen addresses

- **SmartWallet.sol** - User wallet with:
  - Key rotation functionality
  - Arbitrary execution capabilities
  - ETH reception

### Oracle Service
- Real-time transaction monitoring
- Suspicious activity detection:
  - Large transfer threshold detection
  - High velocity transaction monitoring
- Automatic response actions:
  - Address freezing
  - Key rotation
  - Audit logging

### Frontend Dashboard
- Web3 wallet integration
- Real-time security audit log
- Token transfer interface
- Balance management
- Oracle status monitoring

## 🔍 Monitoring & Logging

The oracle service provides comprehensive monitoring:

- **Health Check**: `GET /health`
- **Audit Log**: `GET /audit`
- **Admin Freeze**: `POST /admin/freeze`

All security events are logged with timestamps and detailed information for audit purposes.

## 🧪 Testing

```bash
# Run contract tests
npm run test

# Test oracle functionality
cd oracle && npm test

# Test frontend
cd frontend && npm test
```

## 📁 Project Structure

```
aegis-unified/
├── frontend/                 # Next.js frontend application
│   ├── src/
│   │   ├── pages/           # React pages
│   │   └── styles/          # CSS styles
│   ├── package.json
│   └── next.config.js
├── contracts/               # Smart contracts
│   ├── contracts/          # Solidity files
│   ├── scripts/           # Deployment scripts
│   ├── test/              # Contract tests
│   ├── package.json
│   └── hardhat.config.js
├── oracle/                # Oracle backend service
│   ├── src/              # Node.js source files
│   ├── package.json
│   └── keystore/         # Encrypted key storage
├── package.json          # Root package configuration
└── README.md
```

## 🔐 Security Considerations

- Private keys are encrypted using AES-256-GCM
- Oracle service runs with minimal required permissions
- Smart contracts include comprehensive access controls
- All security events are logged for audit trails
- Automatic key rotation on suspicious activity detection

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Troubleshooting

### Common Issues

1. **Port conflicts**: Ensure ports 3000, 3001, and 8545 are available
2. **Environment variables**: Verify all required env vars are set
3. **Contract deployment**: Check Hardhat node is running before deployment
4. **Wallet connection**: Ensure MetaMask is installed and unlocked

### Getting Help

- Check the logs in each service directory
- Verify environment configuration
- Ensure all dependencies are installed
- Check network connectivity for RPC calls

## 🎯 Next Steps

- [ ] Add more sophisticated threat detection algorithms
- [ ] Implement multi-signature guardian system
- [ ] Add support for multiple networks
- [ ] Create mobile application
- [ ] Add comprehensive test coverage
- [ ] Implement automated deployment pipelines

