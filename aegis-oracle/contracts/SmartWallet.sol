// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract SmartWallet {
    address public owner;
    event KeyRotated(address indexed oldKey, address indexed newKey, string reason);
    event Executed(address indexed to, uint256 value, bytes data);

    constructor(address _owner) payable {
        owner = _owner;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    // rotate the controlling key for this wallet (user flow)
    function rotateKey(address newOwner, string calldata reason) external onlyOwner {
        address old = owner;
        owner = newOwner;
        emit KeyRotated(old, newOwner, reason);
    }

    // execute arbitrary call (useful to move funds or call other contracts)
    function execute(address to, uint256 value, bytes calldata data) external onlyOwner returns (bytes memory) {
        (bool success, bytes memory result) = to.call{value: value}(data);
        require(success, "Execution failed");
        emit Executed(to, value, data);
        return result;
    }

    // Accept ETH
    receive() external payable {}
}
