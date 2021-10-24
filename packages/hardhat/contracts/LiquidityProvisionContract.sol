pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";

// import "@openzeppelin/contracts/access/Ownable.sol"; //https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol

contract LiquidityProvisionContract {
    event SetToken1(address sender, string token1);
    event SetToken2(address sender, string token2);
    event SetStrategy(address sender, string strategy);
    event Error(string error_msg);

    mapping(string => string) strategies;
    string public token1 = "ETH";
    string public token2 = "DAI";
    string public strategy = "fixed strategy";
    string public purpose = "Auto LP Management";

    constructor() {
        strategies[
            "fixed strategy"
        ] = "Always provide liquidity in the price interval.";
        strategies[
            "uniform reset strategy"
        ] = "Allocate liquidity uniformly on a range of bins centered on the current price. Reset when the price moves outside this range.";
        strategies[
            "proportional reset strategy"
        ] = "Allocate liquidity proportionally to the probability of each bin in the that has 50% mass of the next-price distribution.";
    }

    function setToken1(string memory newToken1) public {
        token1 = newToken1;
        emit SetToken1(msg.sender, token1);
    }

    function setToken2(string memory newToken2) public {
        token2 = newToken2;
        emit SetToken2(msg.sender, token2);
    }

    function setStrategy(string memory newStrategy) public {
        if (bytes(strategies[newStrategy]).length != 0) {
            strategy = newStrategy;
            emit SetStrategy(msg.sender, strategy);
        } else {
            emit Error("Invalid strategy.");
        }
    }
}
