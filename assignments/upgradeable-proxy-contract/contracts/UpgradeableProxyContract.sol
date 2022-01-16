pragma solidity ^0.8.0;

/**
 * @title UpgradeableProxyContract
 * @dev A more advanced proxy contract where the owner and implementation addresses can be mutated.
 */
contract UpgradeableProxyContract {

    /**
     * @param _owner Address of the initial owner of this contract
     * @param _implementation Address of the initial implementation for this contract.
     */
    constructor(
        address _owner,
        address _implementation
    ) {
        revert("Implement me!");
    }

    fallback() external payable {
        revert("Implement me!");

        // HINT: Reuse the code from the SimpleProxyContract, but get the implementation address
        // in a slightly different way.
    }


    function getOwner() public view returns (address) {
        revert("Implement me!");
    }

    function setOwner(address _owner) public {
        revert("Implement me!");
    }

    function getImplementation() public view returns (address) {
        revert("Implement me!");
    }

    function setImplementation(address _implementation) public {
        revert("Implement me!");
    }
}
