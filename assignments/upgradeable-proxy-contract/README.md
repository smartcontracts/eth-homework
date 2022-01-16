# Upgradeable Proxy Contract

## Prerequisites

I recommend completing the [Simple Proxy Contract assignment](../simple-proxy-contract) before tackling this one.
It'll give you a basic understanding of what proxies are and how they're meant to be used.

## Background

In the [previous assignment](../simple-proxy-contract) we covered the topic of proxy contracts.
You implemented a simple proxy contract which could be used to cheaply replicate the behavior of a reference contract.

We also discussed the technique of using proxies to create a contract whose behavior can be modified after deployment.
This can be done by creating a proxy contract whose implementation can be mutated by a privileged address.
In this assignment we'll create a proxy that allows a designated owner to update the implementation and, as a result, upgrade the behavior of the proxy.

The easiest way to add an `owner` and an `implementation` address is to include stored variables for each.
However, doing so introduces the potential for a dangerous collision in the storage of the proxy and the implementation.
Remember, the `delegatecall` operation allows a contract to execute the code of an external contract against the original contract's storage.
If we're not careful, this external code may accidentally overwrite some storage inside of the proxy contract.

Let's walk through a brief example.
Open up [Remix](https://remix.ethereum.org) and paste the following proxy code into a new file:

```solidity
contract SimpleProxy {
    address public implementation;

    constructor(address _implementation) {
        implementation = _implementation;
    }

    fallback() external {
        (bool success, bytes memory result) = implementation.delegatecall(msg.data);

        assembly {
            let pos := add(result, 0x20)
            let len := mload(result)
            if iszero(success) { revert(pos, len) }
            return(pos, len)
        }
    }
}
```

Now paste the following `Counter` contract into the same file, we'll use this as the implementation:

```solidity
contract Counter {
    uint256 public counter;

    function increment() public {
        counter++;
    }
}
```

Finally, paste the following `CounterProxyHelper` into the same file.
This contract will help us interact with the proxy contract as if it were a `Counter`.

```solidity
contract CounterProxyHelper {
    address proxy;

    constructor(address _proxy) {
        proxy = _proxy;
    }

    function counter() public view returns (uint256) {
        return Counter(proxy).counter();
    }

    function increment() public {
        Counter(proxy).increment();
    }
}
```

First deploy the `Counter` and copy its address.

<div align="center">
<img width="305" src="https://user-images.githubusercontent.com/14298799/149646039-2dd3b165-ac42-4995-b416-29f4589145ef.png">
</div>

Deploy the `SimpleProxy` contract, using the address of the `Counter` as the `_implementation` parameter of the constructor.

<div align="center">
<img width="305" alt="Screen Shot 2022-01-15 at 10 24 33 PM" src="https://user-images.githubusercontent.com/14298799/149646083-cbcf8b00-28c2-4361-974b-65807e74a730.png">
</div>

Now deploy the `CounterProxyHelper` and use the address of the `SimpleProxy` as the `_proxy` parameter of the constructor.

<div align="center">
<img width="305" alt="Screen Shot 2022-01-15 at 10 34 17 PM" src="https://user-images.githubusercontent.com/14298799/149646256-5f545d6a-c5dd-4070-a177-975d93ac34b7.png">
</div>

Open the pane for the deployed `CounterProxyHelper` and trigger the `counter` function.
You'd expect the returned result to be zero, but instead we get a *very* large number.
Strange indeed!

<div align="center">
<img width="305" alt="Screen Shot 2022-01-15 at 10 36 49 PM" src="https://user-images.githubusercontent.com/14298799/149646291-8b763514-f68c-42fc-a64c-be1a3eee600a.png">
</div>

Now trigger the `increment` function (you shouldn't get any errors).
Then trigger the `counter` function again.
This time the contract reverts!

<div align="center">
<img width="938" alt="Screen Shot 2022-01-15 at 10 38 41 PM" src="https://user-images.githubusercontent.com/14298799/149646320-cecdd8bd-777f-42ba-b993-bd1dc81c4e8a.png">
</div>

What's going on here?
This is clearly not the expected behavior.
You can find a hint by opening up the pane for the `SimpleProxy` contract and querying the `implementation` address.

<div align="center">
<img width="455" alt="Screen Shot 2022-01-15 at 10 41 20 PM" src="https://user-images.githubusercontent.com/14298799/149646360-b95d3b20-53af-4479-a165-1c5f78d1aa83.png">
</div>

Here's the result that I get back: `0xd7acd2a9fd159e69bb102a1ca21c9a3e3a5f771c`.
And here's the actual implementation address: `0xd7acd2a9fd159e69bb102a1ca21c9a3e3a5f771b`.
Notice the difference?
It's the *almost* the same address, but the last character has turned from a `b` to `c`.
It's been incremented by one!

What's happened here is that the storage for the proxy contract and the implementation contract have overlapped.
Solidity assigns variables positions in storage based on their location in the code.
The first variable defined in a contract is placed at storage position 0, the second at position 1, and so on.

Within the proxy, the first variable was the `implementation` address.
Within the counter, the first variable was the `counter` uint.
When the `increment` function was triggered, it was operating on the value within storage position 0 which it thought was a `counter`.
This storage position was already being used to contain the `implementation` address.
As a result, the `implementation` address was incremented and the proxy broke!

As part of this assignment, you'll learn how to avoid this issue.
[EIP-1967](https://eips.ethereum.org/EIPS/eip-1967) describes a standardized set of storage positions that can be used to hold variables within proxies.
These storage positions are carefully selected so that implementation contracts will not accidentally mutate these variables and create problems like the one we just observed.

## Assignment

The simple proxy contract that you constructed for the previous assignment contains the core logic applicable to any proxy: the fallback function that triggers a `delegatecall`.
You'll use the same logic for this assignment, but you'll also introduce a few new functions according to the following descriptions.
You MUST also use the logic described in [EIP-1967](https://eips.ethereum.org/EIPS/eip-1967) to store the variables required to make these functions work.

(HINT: You will probably to use the `sstore` and `sload` operations within an `assembly` block!)

### `getOwner`

```solidity
function getOwner() public view returns (address)
```

Returns the current owner address.

### `setOwner`

```solidity
function setOwner(address _owner) public
```

Updates the current owner address.
MUST only be callable by the current owner.

### `getImplementation`

```solidity
function getImplementation() public view returns (address)
```

Returns the current implementation address.

### `setImplementation`

```solidity
function setImplementation(address _implementation) public
```

Updates the current implementation address.
MUST only be callable by the current owner.

## Completion

1. Implement the `UpgradeableProxyContract` with the four functions described above.
2. Use the logic described in [EIP-1967](https://eips.ethereum.org/EIPS/eip-1967) to avoid storage collsions.
3. Write complete docstrings for each function that you've implemented.
4. Pass all tests.
