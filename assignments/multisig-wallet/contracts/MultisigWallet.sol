pragma solidity ^0.8.0;

contract MultisigWallet {
    // struct Transaction {
    //     // fill me in
    // }

    constructor(
        address[] memory _owners,
        uint256 _required
    )
        public
    {
        revert("Implement me!");
    }

    function submitTransaction(
        address _target,
        uint256 _value,
        bytes memory _data
    )
        public
    {
        revert("Implement me!");
    }

    function confirmTransaction(
        uint256 _transactionId
    )
        public
    {
        revert("Implement me!");
    }

    function revokeConfirmation(
        uint256 _transactionId
    )
        public
    {
        revert("Implement me!");
    }

    function executeTransaction(
        uint256 _transactionId
    )
        public
    {
        revert("Implement me!");
    }

    function addOwner(
        address _owner
    )
        public
    {
        revert("Implement me!");
    }

    function removeOwner(
        address _owner
    )
        public
    {
        revert("Implement me!");
    }

    function replaceOwner(
        address _owner,
        address _newOwner
    )
        public
    {
        revert("Implement me!");
    }

    function changeRequirement(
        uint256 _required
    )
        public
    {
        revert("Implement me!");
    }
}
