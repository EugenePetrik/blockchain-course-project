const Web3 = require('web3');
const fs = require('fs');
const path = require('path');
const solc = require('solc');

require('dotenv').config();

const { KALEIDO_API_URL, KALEIDO_API_KEY } = process.env;

const web3 = new Web3(new Web3.providers.HttpProvider(KALEIDO_API_URL));
const account = web3.eth.accounts.privateKeyToAccount(KALEIDO_API_KEY);
web3.eth.accounts.wallet.add(account);
web3.eth.defaultAccount = account.address;

// Compile contract
const contractPath = path.join(__dirname, '../contracts/Lottery.sol');
const source = fs.readFileSync(contractPath, 'utf8');

const input = {
  language: 'Solidity',
  sources: {
    'Lottery.sol': {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['abi', 'evm.bytecode'],
      },
    },
  },
};

const compiledContract = JSON.parse(solc.compile(JSON.stringify(input)));
const { abi } = compiledContract.contracts['Lottery.sol'].Lottery;
const bytecode = compiledContract.contracts['Lottery.sol'].Lottery.evm.bytecode.object;

// Deploy contract
const deploy = async () => {
  const contract = new web3.eth.Contract(abi);
  const deployOptions = {
    data: `0x${bytecode}`,
    arguments: [],
  };

  const newContractInstance = await contract.deploy(deployOptions).send({
    from: account.address,
    gas: 1500000,
    gasPrice: '30000000000',
  });

  console.log('Contract deployed at address:', newContractInstance.options.address);
};

deploy();
