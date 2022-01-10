import { expect } from './setup'
import { Contract, ContractFactory } from 'ethers'
import { ethers } from 'hardhat'

describe('SimpleProxyContract', () => {
  let CounterFactory: ContractFactory
  let SimpleProxyContractFactory: ContractFactory
  before(async () => {
    CounterFactory = await ethers.getContractFactory('Counter')
    SimpleProxyContractFactory = await ethers.getContractFactory('SimpleProxyContract')
  })

  let Counter: Contract
  let SimpleProxyContract: Contract
  let ProxyAsCounter: Contract
  beforeEach(async () => {
    Counter = await CounterFactory.deploy()
    SimpleProxyContract = await SimpleProxyContractFactory.deploy(Counter.address)

    // Create a contract instance with the ABI of the Counter contract but located at the address
    // of the SimpleProxyContract. This is how we usually interact with proxy contracts when we
    // want to treat them as the contracts they're acting as a proxy for.
    ProxyAsCounter = Counter.at(SimpleProxyContract.address)
  })

  describe('construction', () => {
    it('should have an implementation address', async () => {
      expect(
        await SimpleProxyContract.implementation()
      ).to.equal(Counter.address)
    })
  })

  describe('fallback', () => {
    describe('successful function calls', () => {
      it('should act like a counter', async () => {
        expect(
          await ProxyAsCounter.counter()
        ).to.equal(0)

        await ProxyAsCounter.increment()

        expect(
          await ProxyAsCounter.counter()
        ).to.equal(1)
      })

      it('should not impact the implementation', async () => {
        expect(
          await Counter.counter()
        ).to.equal(0)

        await ProxyAsCounter.increment()

        expect(
          await Counter.counter()
        ).to.equal(0)
      })
    })

    // Make sure you've correctly handled reverts!
    describe('failed function calls', () => {
      it('should pass along revert data', async () => {
        await expect(
          ProxyAsCounter.fail()
        ).to.be.revertedWith('This function should fail')
      })
    })
  })
})
