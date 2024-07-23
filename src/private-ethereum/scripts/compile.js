const path = require('path');
const fs = require('fs');
const solc = require('solc');

// Path to the Lottery contract
const lotteryPath = path.resolve(__dirname, '../contracts', 'Lottery.sol');
const source = fs.readFileSync(lotteryPath, 'utf8');

// Input structure for the Solidity compiler
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

// Compile the contract
const output = JSON.parse(solc.compile(JSON.stringify(input)));

// Extract the compiled contract
const contract = output.contracts['Lottery.sol'].Lottery;

// Path to save the compiled contract
const buildPath = path.resolve(__dirname, '../build');
if (!fs.existsSync(buildPath)) {
  fs.mkdirSync(buildPath);
}

// Write the compiled contract to the build directory
fs.writeFileSync(
  path.resolve(buildPath, 'Lottery.json'),
  JSON.stringify(contract, null, 2),
  'utf8',
);

console.log('Contract compiled successfully.');
