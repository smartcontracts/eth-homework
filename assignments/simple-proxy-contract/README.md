# Assignment: Simple Proxy Contract

## Background

Proxy contracts are a common and important construct in Ethereum smart contract development.
Proxies generally use the `delegatecall` operation to execute the code of some other contract (called the `implementation`) against the proxy's own storage.
It's worth noting that the term "proxy" is a bit of a misnomer because the proxy contract isn't acting like a middleman between you and the target contract, it's simply using the code of the target contract against its own storage.

![proxy1](https://user-images.githubusercontent.com/14298799/148847546-eda6e15f-85ab-4fd7-b45a-259fca1dd287.png)

Developers use proxies for many reasons.
One common use for the proxy pattern is to create a contract whose functionality can be easily upgraded.
Contract code is immutable and can't be modified once a contract is deployed.
However, we can use the `delegatecall` operation to execute the code of some other contract against our own storage.
By modifying the target of this operation we can change the code being executed within our proxy.
Usually the ability to modify the target of the `delegatecall` is reserved for some privileged `owner` address (could be an EOA, a multisig, a governance contract, or anything in-between).

![proxy2](https://user-images.githubusercontent.com/14298799/148847589-141146c5-cd77-41b7-bab8-54eb2b77310f.png)

Proxies can also be used to create lightweight copies of other contracts.
It's often quite expensive to deploy smart contracts to Ethereum.
Large deployments can cost upwards of thousands of dollars.
Proxies can reduce deployment costs when you simply need to create copies of an existing contract.
To do so, you simply need to deploy one "reference" contract with all of the code.
You can create copies of the reference contract with a basic proxy that permanently points to the reference contract.
Note that these copies are cheaper to deploy but end up being more expensive for end-users because of the additional code overhead that proxies introduce.

![proxy3](https://user-images.githubusercontent.com/14298799/148847629-14ca1d2e-3bb6-41a5-af17-d8cd1bbbc90b.png)

## Assignment

In this assignment you'll be implementing a simple proxy contract for the purpose of creating cheap copies of a reference contract.
You'll write the logic for triggering `delegatecall` operations to a fixed `implementation` address.

We'll be using a simple `Counter` contract as the reference (you can easily imagine the existence of many different `Counter` contracts at the same time).
You can apply this same pattern to any sort of contract that you may want to cheaply duplicate.

## Completion

Pass all tests to complete the assignment:

```
yarn test
```
