// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Aegis is Ownable {
    // Mappings
    mapping(address => uint256) private balances; // store balances
    mapping(address => bool) public frozen;
    mapping(address => bool) public flagged;
    mapping(address => bool) public guardians;

    // Events
    event AddressFlagged(address indexed addr, address indexed reporter, string reason);
    event AddressFrozen(address indexed addr, address indexed reporter, string reason);
    event AddressUnfrozen(address indexed addr, address indexed reporter);
    event KeyRotated(address indexed oldKey, address indexed newKey, string reason);

    // Constructor
    constructor() Ownable(msg.sender) {
        // Optional: give deployer some demo balance
        balances[msg.sender] = 1000;
    }

    // Public getter for balances
    function balance(address _account) external view returns (uint256) {
        return balances[_account];
    }

    // Mint function
    function mint(address _to, uint256 _amount) external onlyOwner {
        balances[_to] += _amount;
    }

    // Transfer function
    function transfer(address _to, uint256 _amount) external {
        require(!frozen[msg.sender], "Sender is frozen");
        require(!frozen[_to], "Recipient is frozen");
        require(balances[msg.sender] >= _amount, "Insufficient balance");

        balances[msg.sender] -= _amount;
        balances[_to] += _amount;
    }

    // Modifiers
    modifier onlyGuardianOrOwner() {
        require(msg.sender == owner() || guardians[msg.sender], "Not authorized");
        _;
    }

    // Freeze an address
    function freezeAddress(address _addr, string memory reason) external onlyGuardianOrOwner {
        frozen[_addr] = true;
        emit AddressFrozen(_addr, msg.sender, reason);
    }

    // Unfreeze an address
    function unfreezeAddress(address _addr) external onlyGuardianOrOwner {
        frozen[_addr] = false;
        emit AddressUnfrozen(_addr, msg.sender);
    }

    // Flag an address
    function flagAddress(address _addr, string memory reason) external onlyGuardianOrOwner {
        flagged[_addr] = true;
        emit AddressFlagged(_addr, msg.sender, reason);
    }

    // Rotate keys
    function rotateKey(address newKey, string memory reason) external onlyGuardianOrOwner {
    address oldKey = owner();
    _transferOwnership(newKey);
    emit KeyRotated(oldKey, newKey, reason);
    }

    // Assign or update guardian status
    function setGuardian(address _guardian, bool status) external onlyOwner {
        guardians[_guardian] = status;
    }
}

