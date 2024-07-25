const Web3 = require('web3');

require('dotenv').config();

const { KALEIDO_API_URL } = process.env;

module.exports = {
  networks: {
    development: {
      host: '127.0.0.1',
      port: 8545,
      network_id: '*',
    },
    kaleido: {
      provider: () => new Web3.providers.HttpProvider(KALEIDO_API_URL),
      network_id: '*',
    },
  },
  compilers: {
    solc: {
      version: '^0.8.0',
    },
  },
};
