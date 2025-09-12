const { ethers } = require("ethers");
const User = require("./models/User");

// Create a new wallet
const createWallet = async () => {
    const wallet = ethers.Wallet.createRandom();
    return {
        address: wallet.address,
        privateKey: wallet.privateKey
    };
};

// Rotate private key for a user
const rotateKey = async (userId) => {
    const wallet = await createWallet();
    await User.findByIdAndUpdate(userId, { privateKey: wallet.privateKey });
    return wallet.privateKey;
};

// Freeze transactions (mock function)
const freezeTransactions = (userId) => {
    // You can set a 'frozen' flag in DB, then backend prevents outgoing tx
    return `Transactions for user ${userId} are frozen`;
};

module.exports = { createWallet, rotateKey, freezeTransactions };
