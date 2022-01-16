pragma solidity ^0.8.0;

contract Counter {
    uint256 public counter;

    function increment() public {
        counter++;
    }

    // Just using this to make sure you've correctly handled reverts!
    function fail() public {
        revert("This function should fail");
    }
}
