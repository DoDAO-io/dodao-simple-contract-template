//SPDX-License-Identifier: UNLICENSED

// Solidity files have to start with this pragma.
// It will be used by the Solidity compiler to validate its version.
pragma solidity ^0.8.9;

// We import this library to be able to use console.log
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// This is the main building block for smart contracts.
contract Token is ERC20 {
    /**
     * Contract initialization.
     */
    constructor() ERC20("My Hardhat Token", "MHT") {
        _mint(msg.sender, 1000000);
    }

    function decimals() public view virtual override returns (uint8) {
        return 2;
    }

    /**
     * A function to transfer tokens.
     *
     * The `external` modifier makes a function *only* callable from outside
     * the contract.
     */
    function transfer(
        address to,
        uint256 amount
    ) public virtual override returns (bool) {
        console.log(
            "Transferring from %s to %s %s tokens",
            msg.sender,
            to,
            amount
        );

        return super.transfer(to, amount);
    }
}
