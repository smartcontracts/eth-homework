pragma solidity ^0.8.0;

/**
 * @title SimpleProxyContract
 * @dev A simple proxy contract where the implementation address is set once and cannot be mutated.
 */
contract SimpleProxyContract {
    address public immutable implementation;

    /**
     * @param _implementation Address of the implementation contract.
     */
    constructor(address _implementation) {
        implementation = _implementation;
    }

    fallback() external payable {
        (bool success, bytes memory data) = implementation.delegatecall(msg.data);

        assembly
        {
            // delegatecall leaves the return data in a returndata buffer
            // we have to go get it

            // how much data?
            let size := returndatasize()

            // where's the next available memory address?
            let location := mload(0x40)

            // copy the returndata buffer to memory
            returndatacopy(location, 0, size)

            // delegatecall bool is falsy on 0, truthy on non-zero
            if iszero(success) { revert(location, size) }

            // and as K said, return inside fallback must be in assembly
            return(location, size)
        }
    }
}
