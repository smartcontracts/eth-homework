import { expect } from './setup'
import { Contract, ContractFactory, Signer } from 'ethers'
import { ethers } from 'hardhat'

describe('UpgradeableProxyContract', () => {
  let signers: Signer[]
  before(async () => {
    signers = await ethers.getSigners()
  })

  let CounterFactory: ContractFactory
  let UpgradeableProxyContractFactory: ContractFactory
  before(async () => {
    CounterFactory = await ethers.getContractFactory('Counter')
    UpgradeableProxyContractFactory = await ethers.getContractFactory('UpgradeableProxyContract')
  })

  let Counter: Contract
  let UpgradeableProxyContract: Contract
  let ProxyAsCounter: Contract
  beforeEach(async () => {
    Counter = await CounterFactory.deploy()
    UpgradeableProxyContract = await UpgradeableProxyContractFactory.deploy(
      await signers[0].getAddress(),
      Counter.address
    )
    ProxyAsCounter = Counter.attach(UpgradeableProxyContract.address)
  })

  describe('construction', () => {
    it('should have an implementation address', async () => {
      expect(
        await UpgradeableProxyContract.getImplementation()()
      ).to.equal(Counter.address)
    })

    it('should have an owner', async () => {
      expect(
        await UpgradeableProxyContract.getOwner()
      ).to.equal(await signers[0].getAddress())
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

  describe('setOwner', () => {
    describe('when called by the current owner', () => {
      it('should update the owner address', async () => {
        await UpgradeableProxyContract.connect(signers[0]).setOwner(
          await signers[1].getAddress()
        )

        expect(
          await UpgradeableProxyContract.getOwner()
        ).to.equal(await signers[1].getAddress())
      })
    })

    describe('when called by not the current owner', () => {
      it('should revert', async () => {
        await expect(
          UpgradeableProxyContract.connect(signers[1]).setOwner(
            await signers[1].getAddress()
          )
        ).to.be.rejected
      })
    })
  })

  describe('setImplementation', () => {
    let Counter2: Contract
    beforeEach(async () => {
      Counter2 = await CounterFactory.deploy()
    })

    describe('when called by the current owner', () => {
      it('should update the implementation address', async () => {
        await UpgradeableProxyContract.connect(signers[0]).setImplementation(
          Counter2.address
        )

        expect(
          await UpgradeableProxyContract.getImplementation()
        ).to.equal(Counter2.address)
      })
    })

    describe('when called by not the current owner', () => {
      it('should revert', async () => {
        await expect(
          UpgradeableProxyContract.connect(signers[1]).setImplementation(
            Counter2.address
          )
        ).to.be.rejected
      })
    })
  })
})
