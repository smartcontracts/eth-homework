# eth-homework

## What is this?

`eth-homework` is a repository that I use as part of the mentoring program that I'm developing.
Mentees fork this repository and complete their homework based on the various assignments included within.

## Repository structure

I'm using [Hardhat](https://hardhat.org) + TypeScript as my preferred development environment.
For the sake of flexibility, each assignment is a separate package with its own `package.json` file and its own `hardhat.config.ts` file.

## Assignments

- [Simple Proxy Contract](./assignments/simple-proxy-contract)

## Setup

```
git clone https://github.com/smartcontracts/eth-homework.git
cd eth-homework
```

## Working on an assignment

### Installing dependencies

```
yarn install
```

```
npm i --save-dev @types/mocha
```

### Compiling contracts

```
yarn compile
```

### Running tests

```
yarn test
```
