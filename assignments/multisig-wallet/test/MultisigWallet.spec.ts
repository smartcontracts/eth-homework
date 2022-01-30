import { expect } from './setup'
import { Contract, ContractFactory, Signer } from 'ethers'
import { ethers } from 'hardhat'

describe('MultisigWallet', () => {
  let signers: Signer[]
  before(async () => {
    signers = await ethers.getSigners()
  })

  let CounterFactory: ContractFactory
  let MultisigWalletFactory: ContractFactory
  before(async () => {
    CounterFactory = await ethers.getContractFactory('Counter')
    MultisigWalletFactory = await ethers.getContractFactory('MultisigWallet')
  })

  /**
   * Utility function for easily creating a new MultisigWallet contract.
   * 
   * @param owners Owners for the multisig.
   * @param required Number of required signatures for the multisig.
   * @returns A new MultisigWallet contract.
   */
  const deployMultisigWallet = async (
    owners: Signer[],
    required: number
  ): Promise<Contract> => {
    return MultisigWalletFactory.deploy(
      await Promise.all(
        owners.map(
          async (signer) => {
            return signer.getAddress()
          }
        )
      ),
      required
    )
  }

  let Counter: Contract
  let MultisigWallet: Contract
  beforeEach(async () => {
    // Counter will be used during tests where the multisig is making a call to an external
    // contract.
    Counter = await CounterFactory.deploy()

    // Deploy the Multisig with one owner and require only one signature.
    // This is a base instance that can be used in testing, but you may want to deploy a different
    // instance if you want to e.g., test with a different number of owners.
    MultisigWallet = await deployMultisigWallet([signers[0]], 1)
  })

  describe('construction', () => {
    describe('owner initialization logic', () => {
      describe('when one owner is given', () => {
        it('should have the given owner', async () => {
          // Example test showing how to initialize a contract and make basic assertions.
          MultisigWallet = await deployMultisigWallet([signers[0]], 1)

          expect(await MultisigWallet.owners()).to.deep.equal(
            [await signers[0].getAddress()]
          )
        })
      })

      describe('when multiple owners are given', () => {
        it('should have exactly the given owners', async () => {
          // Implement this test
        })
      })

      describe('when no owners are given', () => {
        it('should throw an error', async () => {
          // Example test showing how to test for reverts.
          await expect(
            await deployMultisigWallet([], 1)
          ).to.be.reverted
        })
      })
    })

    describe('requirement initialization logic', () => {
      describe('when the number of required signatures is equal to the number of owners', () => {
        it('should set the number of required sigs', async () => {
          MultisigWallet = await deployMultisigWallet([signers[0]], 1)

          expect(await MultisigWallet.required()).to.equal(1)
        })
      })

      describe('when the number of required sigs is less than the number of owners', () => {
        it('should set the number of required sigs', async () => {
          // Implement this test
        })
      })

      describe('when the number of required sigs is zero', () => {
        it('should throw an error', async () => {
          // Implement this test
        })
      })

      describe('when the number of required sigs is greater than the number of owners', () => {
        it('should throw an error', async () => {
          // Implement this test
        })
      })
    })
  })

  describe('submitTransaction', () => {
    describe('when called by an owner', () => {
      it('should add the transaction to the pending transaction list', async () => {
        await MultisigWallet.connect(signers[0]).submitTransaction(
          Counter.address,
          0,
          Counter.interface.encodeFunctionData('add', [10]),
        )

        expect(
          await MultisigWallet.transactions(0)
        ).to.deep.equal([
          Counter.address,
          0, // Value
          Counter.interface.encodeFunctionData('add', [10]),
          false, // Executed (boolean)
        ])
      })

      it('should add a confirmation for the submitting owner', async () => {
        await MultisigWallet.connect(signers[0]).submitTransaction(
          Counter.address,
          0,
          Counter.interface.encodeFunctionData('add', [10]),
        )

        expect(
          await MultisigWallet.confirmations(0, await signers[0].getAddress())
        ).to.equal(true)
      })
    })

    describe('when called by not an owner', () => {
      it('should throw an error', async () => {
        // Implement this test
      })
    })
  })

  describe('confirmTransaction', () => {
    describe('when called by an owner', () => {
      describe('when the transaction exists', () => {
        describe('when the owner has not yet confirmed', () => {
          it('should add a confirmation for the owner', async () => {
            MultisigWallet = await deployMultisigWallet([signers[0], signers[1]], 1)

            await MultisigWallet.connect(signers[0]).submitTransaction(
              Counter.address,
              0,
              Counter.interface.encodeFunctionData('add', [10]),
            )

            await MultisigWallet.connect(signers[1]).confirmTransaction(0)

            expect(
              await MultisigWallet.confirmations(0, await signers[1].getAddress())
            ).to.equal(true)
          })
        })

        describe('when the owner has already confirmed', () => {
          it('should throw an error', async () => {
            // Implement this test
          })
        })
      })

      describe('when the transaction does not exist', () => {
        it('should throw an error', async () => {
          // Implement this test
        })
      })
    })

    describe('when called by not an owner', () => {
      it('should throw an error', async () => {
        // Implement this test
      })
    })
  })

  describe('revokeConfirmation', () => {
    describe('when called by an owner', () => {
      describe('when the transaction exists', () => {
        describe('when the owner has confirmed', () => {
          it('should revoke the confirmation for the owner', async () => {
            // Implement this test
          })
        })

        describe('when the owner has not confirmed', () => {
          it('should throw an error', async () => {
            // Implement this test
          })
        })
      })

      describe('when the transaction does not exist', () => {
        it('should throw an error', async () => {
          // Implement this test
        })
      })
    })

    describe('when called by not an owner', () => {
      it('should throw an error', async () => {
        // Implement this test
      })
    })
  })

  describe('executeTransaction', () => {
    describe('when called by an owner', () => {
      describe('when the transaction exists', () => {
        describe('when the transaction has been confirmed by the required number of owners', () => {
          it('should execute the transaction', async () => {
            MultisigWallet = await deployMultisigWallet([signers[0], signers[1]], 2)

            // Submit
            await MultisigWallet.connect(signers[0]).submitTransaction(
              Counter.address,
              0,
              Counter.interface.encodeFunctionData('add', [10]),
            )

            // Confirm
            await MultisigWallet.connect(signers[1]).confirmTransaction(0)

            // Execute
            await MultisigWallet.connect(signers[0]).executeTransaction(0)

            // Check the result
            expect(
              await Counter.counter()
            ).to.equal(10)
          })
        })

        describe('when the transaction has not been confirmed by the required number of owners', () => {
          it('should throw an error', async () => {
            // Implement this test
          })
        })
      })

      describe('when the transaction does not exist', () => {
        it('should throw an error', async () => {
          // Implement this test
        })
      })
    })

    describe('when called by not an owner', () => {
      it('should throw an error', async () => {
        // Implement this test
      })
    })
  })

  // These tests must be carried out by executing a multisig transaction that calls the multisig
  // contract itself.
  describe('addOwner', () => {
    describe('when called by the multisig', () => {
      describe('when the new owner is not already an owner', () => {
        it('should add the new owner', async () => {
          await MultisigWallet.connect(signers[0]).submitTransaction(
            MultisigWallet.address,
            0,
            MultisigWallet.interface.encodeFunctionData('addOwner', [await signers[1].getAddress()]),
          )

          await MultisigWallet.connect(signers[0]).executeTransaction(0)

          expect(
            await MultisigWallet.owners()
          ).to.deep.equal([
            await signers[0].getAddress(),
            await signers[1].getAddress(),
          ])
        })
      })

      describe('when the new owner is already an owner', () => {
        it('should throw an error', async () => {
          // Implement this test
        })
      })
    })

    describe('when called by not the multisig', () => {
      it('should throw an error', async () => {
        // Implement this test
      })
    })
  })

  // These tests must be carried out by executing a multisig transaction that calls the multisig
  // contract itself.
  describe('removeOwner', () => {
    describe('when called by the multisig', () => {
      describe('when the owner is an existing owner', () => {
        it('should remove the new owner', async () => {
          // Implement this test
        })

        describe('when the requirement would exceed the number of owners', () => {
          it('should set the requirement to the number of owners', async () => {
            // Implement this test
          })
        })
      })

      describe('when the owner is not an existing owner', () => {
        it('should throw an error', async () => {
          // Implement this test
        })
      })
    })

    describe('when called by not the multisig', () => {
      it('should throw an error', async () => {
        // Implement this test
      })
    })
  })

  // These tests must be carried out by executing a multisig transaction that calls the multisig
  // contract itself.
  describe('replaceOwner', () => {
    describe('when called by the multisig', () => {
      describe('when the old owner is an existing owner', () => {
        describe('when the new owner is not already an owner', () => {
          it('should replace the old owner with the new owner', async () => {
            // Implement this test
          })
        })

        describe('when the new owner is already an owner', () => {
          it('should throw an error', async () => {
            // Implement this test
          })
        })
      })

      describe('when the old owner is not an existing owner', () => {
        it('should throw an error', async () => {
          // Implement this test
        })
      })
    })

    describe('when called by not the multisig', () => {
      it('should throw an error', async () => {
        // Implement this test
      })
    })
  })

  // These tests must be carried out by executing a multisig transaction that calls the multisig
  // contract itself.
  describe('changeRequirement', () => {
    describe('when called by the multisig', () => {
      describe('when the requirement is zero', () => {
        it('should throw an error', async () => {
          // Implement this test
        })
      })

      describe('when the new requirement is less than the number of owners', () => {
        it('should set the requirement to the new requirement', async () => {
          // Implement this test
        })
      })

      describe('when the new requirement is equal to the number of owners', () => {
        it('should set the requirement to the new requirement', async () => {
          // Implement this test
        })
      })

      describe('when the new requirement is greater than the number of owners', () => {
        it('should throw an error', async () => {
          // Implement this test
        })
      })
    })

    describe('when called by not the multisig', () => {
      it('should throw an error', async () => {
        // Implement this test
      })
    })
  })
})
