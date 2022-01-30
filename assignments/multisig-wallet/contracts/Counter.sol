pragma solidity ^0.8.0;

contract Counter {
    uint256 public counter;

    function increment() public {
        counter++;
    }

    function add(uint256 x) public {
        counter += x;
    }

    // Just using this to make sure you've correctly handled reverts!
    function fail() public {
        revert("This function should fail");
    }
}
