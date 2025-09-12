// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract BitVault {
    address public owner;
    bool public frozen = false;

    event TransactionFrozen(address by, uint256 timestamp);
    event TransactionUnfrozen(address by, uint256 timestamp);
    event KeyRotated(address oldOwner, address newOwner, uint256 timestamp);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    modifier notFrozen() {
        require(!frozen, "Transactions are frozen");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function rotateKey(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid new owner");
        emit KeyRotated(owner, newOwner, block.timestamp);
        owner = newOwner;
    }

    function freezeTransactions() external onlyOwner {
        frozen = true;
        emit TransactionFrozen(msg.sender, block.timestamp);
    }

    function unfreezeTransactions() external onlyOwner {
        frozen = false;
        emit TransactionUnfrozen(msg.sender, block.timestamp);
    }

    function secureTransaction(address to, uint256 amount) external onlyOwner notFrozen {
        require(to != address(0), "Invalid recipient");
        // Normally you'd handle ERC20 or Ether transfers here
        // For now we just log the action
    }
}
