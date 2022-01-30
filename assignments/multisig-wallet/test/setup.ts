// Boilerplate chai setup script.
// Don't worry about this file.

import chai from 'chai'
import { solidity } from 'ethereum-waffle'
import chaiAsPromised from 'chai-as-promised'

chai.use(solidity)
chai.use(chaiAsPromised)

const should = chai.should()
const { expect } = chai

export {
  should,
  expect
}
