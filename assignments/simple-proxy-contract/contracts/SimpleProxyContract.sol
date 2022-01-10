pragma solidity ^0.8.0;

/**
 * @title SimpleProxyContract
 * @dev A simple proxy contract where the implementation address is set once and cannot be mutated.
 */
contract SimpleProxyContract {
    /**
     * Address of the implementation contract for this proxy.
     * NOTE: We're marking this as immutable to avoid accidental storage collisions. We'll go into
     * the subject of storage collisions in a future lesson. For now, you may be interested in
     * reading more about the immutable keyword:
     * https://docs.soliditylang.org/en/v0.8.11/contracts.html#immutable
     */
    address public immutable implementation;

    /**
     * @param _implementation Address of the implementation contract.
     */
    constructor(address _implementation) {
        implementation = _implementation;
    }

    fallback() external payable {
        revert("Implement me!");

        // 1. Use delegatecall (Solidity version, NOT assembly) to trigger the code of the implementation contract.
        // Read more about delegatecall here:
        // https://docs.soliditylang.org/en/v0.8.11/introduction-to-smart-contracts.html#delegatecall-callcode-and-libraries
        // See how to trigger delegatecall here:
        // https://docs.soliditylang.org/en/v0.8.11/units-and-global-variables.html#members-of-address-types

        // 2. Use assembly to return or revert with the result of the delegatecall.
        // You must use assembly because you cannot use `return` within the fallback function.
    }
}
