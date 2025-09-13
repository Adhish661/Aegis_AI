// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Vault {
    address public owner;
    bool public frozen;

    event Deposited(address indexed from, uint256 amount, uint256 balance);
    event Withdrawn(address indexed to, uint256 amount);
    event Frozen(address indexed by, uint256 timestamp);
    event Unfrozen(address indexed by, uint256 timestamp);
    event TxRecorded(bytes32 txId, address from, address to, uint256 amount, bool flagged);
    event KeyRotated(address indexed oldOwner, address indexed newOwner, uint256 timestamp); // new

    modifier onlyOwner() {
        require(msg.sender == owner, "not owner");
        _;
    }

    modifier notFrozen() {
        require(!frozen, "vault frozen");
        _;
    }

    constructor(address _owner) {
        owner = _owner;
        frozen = false;
    }

    receive() external payable {
        emit Deposited(msg.sender, msg.value, address(this).balance);
    }

    function deposit() external payable {
        emit Deposited(msg.sender, msg.value, address(this).balance);
    }

    function withdraw(address payable to, uint256 amount) external onlyOwner notFrozen {
        require(address(this).balance >= amount, "insufficient");
        to.transfer(amount);
        emit Withdrawn(to, amount);
    }

    function freeze() external onlyOwner {
        frozen = true;
        emit Frozen(msg.sender, block.timestamp);
    }

    function unfreeze() external onlyOwner {
        frozen = false;
        emit Unfrozen(msg.sender, block.timestamp);
    }

    function recordTx(bytes32 txId, address from, address to, uint256 amount, bool flagged) external onlyOwner {
        emit TxRecorded(txId, from, to, amount, flagged);
    }

    // ------------------ New: Key Rotation ------------------
    function rotateKey(address newOwner) external onlyOwner {
        require(newOwner != address(0), "invalid address");
        address oldOwner = owner;
        owner = newOwner;
        emit KeyRotated(oldOwner, newOwner, block.timestamp);
    }
}
// pragma solidity ^0.8.19;

// contract Vault {
//     address public owner;
//     bool public frozen;
//     event Deposited(address indexed from, uint256 amount, uint256 balance);
//     event Withdrawn(address indexed to, uint256 amount);
//     event Frozen(address indexed by, uint256 timestamp);
//     event Unfrozen(address indexed by, uint256 timestamp);
//     event TxRecorded(bytes32 txId, address from, address to, uint256 amount, bool flagged);

//     modifier onlyOwner() {
//         require(msg.sender == owner, "not owner");
//         _;
//     }

//     modifier notFrozen() {
//         require(!frozen, "vault frozen");
//         _;
//     }

//     constructor(address _owner) {
//         owner = _owner;
//         frozen = false;
//     }

//     receive() external payable {
//         emit Deposited(msg.sender, msg.value, address(this).balance);
//     }

//     function deposit() external payable {
//         emit Deposited(msg.sender, msg.value, address(this).balance);
//     }

//     // Owner-only withdraw — blocked if frozen
//     function withdraw(address payable to, uint256 amount) external onlyOwner notFrozen {
//         require(address(this).balance >= amount, "insufficient");
//         to.transfer(amount);
//         emit Withdrawn(to, amount);
//     }

//     // Freeze/unfreeze by owner
//     function freeze() external onlyOwner {
//         frozen = true;
//         emit Frozen(msg.sender, block.timestamp);
//     }

//     function unfreeze() external onlyOwner {
//         frozen = false;
//         emit Unfrozen(msg.sender, block.timestamp);
//     }

//     // record off-chain monitored txs on-chain (optional)
//     function recordTx(bytes32 txId, address from, address to, uint256 amount, bool flagged) external onlyOwner {
//         emit TxRecorded(txId, from, to, amount, flagged);
//     }
// }
