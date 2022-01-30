import { HardhatUserConfig } from 'hardhat/types'

// Plugins
import '@nomiclabs/hardhat-ethers'
import '@nomiclabs/hardhat-waffle'

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.11',
  }
}

export default config
