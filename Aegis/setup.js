#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { execSync } from "child_process";

console.log("🚀 Setting up Aegis Unified Platform...\n");

// Check if Node.js version is compatible
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split(".")[0]);
if (majorVersion < 18) {
  console.error("❌ Node.js 18+ is required. Current version:", nodeVersion);
  process.exit(1);
}

console.log("✅ Node.js version:", nodeVersion);

// Create directories if they don't exist
const directories = ["frontend", "contracts", "oracle"];
directories.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 Created directory: ${dir}`);
  }
});

// Install root dependencies
console.log("\n📦 Installing root dependencies...");
try {
  execSync("npm install", { stdio: "inherit" });
  console.log("✅ Root dependencies installed");
} catch (error) {
  console.error("❌ Failed to install root dependencies:", error.message);
  process.exit(1);
}

// Install all subproject dependencies
console.log("\n📦 Installing all subproject dependencies...");
try {
  execSync("npm run install:all", { stdio: "inherit" });
  console.log("✅ All dependencies installed");
} catch (error) {
  console.error("❌ Failed to install subproject dependencies:", error.message);
  process.exit(1);
}

// Create environment files if they don't exist
console.log("\n⚙️ Setting up environment files...");

const envFiles = [
  {
    source: "oracle/env.example",
    target: "oracle/.env",
    description: "Oracle environment configuration",
  },
  {
    source: "frontend/env.example",
    target: "frontend/.env.local",
    description: "Frontend environment configuration",
  },
];

envFiles.forEach(({ source, target, description }) => {
  if (fs.existsSync(source) && !fs.existsSync(target)) {
    fs.copyFileSync(source, target);
    console.log(`✅ Created ${description}: ${target}`);
  } else if (fs.existsSync(target)) {
    console.log(`⚠️  ${description} already exists: ${target}`);
  } else {
    console.log(`❌ Source file not found: ${source}`);
  }
});

// Create keystore directory for oracle
const keystoreDir = path.join("oracle", "keystore");
if (!fs.existsSync(keystoreDir)) {
  fs.mkdirSync(keystoreDir, { recursive: true });
  console.log("📁 Created oracle keystore directory");
}

console.log("\n🎉 Setup complete!");
console.log("\n📋 Next steps:");
console.log("1. Edit oracle/.env with your configuration");
console.log("2. Edit frontend/.env.local with your contract addresses");
console.log("3. Start Hardhat node: npm run dev:hardhat");
console.log("4. Deploy contracts: cd contracts && npm run deploy");
console.log("5. Update .env files with deployed contract addresses");
console.log("6. Start the platform: npm run dev");
console.log("\n🔗 Services will be available at:");
console.log("- Frontend: http://localhost:3000");
console.log("- Oracle API: http://localhost:3001");
console.log("- Hardhat RPC: http://localhost:8545");
console.log("\n📖 See README.md for detailed instructions");






// #!/usr/bin/env node

// import fs from "fs";
// import path from "path";
// const { execSync } = require('child_process');

// console.log('🚀 Setting up Aegis Unified Platform...\n');

// // Check if Node.js version is compatible
// const nodeVersion = process.version;
// const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
// if (majorVersion < 18) {
//   console.error('❌ Node.js 18+ is required. Current version:', nodeVersion);
//   process.exit(1);
// }

// console.log('✅ Node.js version:', nodeVersion);

// // Create directories if they don't exist
// const directories = ['frontend', 'contracts', 'oracle'];
// directories.forEach(dir => {
//   if (!fs.existsSync(dir)) {
//     fs.mkdirSync(dir, { recursive: true });
//     console.log(`📁 Created directory: ${dir}`);
//   }
// });

// // Install root dependencies
// console.log('\n📦 Installing root dependencies...');
// try {
//   execSync('npm install', { stdio: 'inherit' });
//   console.log('✅ Root dependencies installed');
// } catch (error) {
//   console.error('❌ Failed to install root dependencies:', error.message);
//   process.exit(1);
// }

// // Install all subproject dependencies
// console.log('\n📦 Installing all subproject dependencies...');
// try {
//   execSync('npm run install:all', { stdio: 'inherit' });
//   console.log('✅ All dependencies installed');
// } catch (error) {
//   console.error('❌ Failed to install subproject dependencies:', error.message);
//   process.exit(1);
// }

// // Create environment files if they don't exist
// console.log('\n⚙️ Setting up environment files...');

// const envFiles = [
//   {
//     source: 'oracle/env.example',
//     target: 'oracle/.env',
//     description: 'Oracle environment configuration'
//   },
//   {
//     source: 'frontend/env.example', 
//     target: 'frontend/.env.local',
//     description: 'Frontend environment configuration'
//   }
// ];

// envFiles.forEach(({ source, target, description }) => {
//   if (fs.existsSync(source) && !fs.existsSync(target)) {
//     fs.copyFileSync(source, target);
//     console.log(`✅ Created ${description}: ${target}`);
//   } else if (fs.existsSync(target)) {
//     console.log(`⚠️  ${description} already exists: ${target}`);
//   } else {
//     console.log(`❌ Source file not found: ${source}`);
//   }
// });

// // Create keystore directory for oracle
// const keystoreDir = path.join('oracle', 'keystore');
// if (!fs.existsSync(keystoreDir)) {
//   fs.mkdirSync(keystoreDir, { recursive: true });
//   console.log('📁 Created oracle keystore directory');
// }

// console.log('\n🎉 Setup complete!');
// console.log('\n📋 Next steps:');
// console.log('1. Edit oracle/.env with your configuration');
// console.log('2. Edit frontend/.env.local with your contract addresses');
// console.log('3. Start Hardhat node: npm run dev:hardhat');
// console.log('4. Deploy contracts: cd contracts && npm run deploy');
// console.log('5. Update .env files with deployed contract addresses');
// console.log('6. Start the platform: npm run dev');
// console.log('\n🔗 Services will be available at:');
// console.log('- Frontend: http://localhost:3000');
// console.log('- Oracle API: http://localhost:3001');
// console.log('- Hardhat RPC: http://localhost:8545');
// console.log('\n📖 See README.md for detailed instructions');

