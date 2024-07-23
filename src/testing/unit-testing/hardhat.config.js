require('@nomiclabs/hardhat-waffle');
require('solidity-coverage');

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: 'hardhat',
  networks: {
    hardhat: {
      chainId: 1337,
    },
  },
  solidity: {
    version: '0.8.26',
  },
};
