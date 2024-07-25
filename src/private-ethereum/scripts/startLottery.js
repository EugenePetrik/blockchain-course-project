const Web3 = require('web3');
const { abi } = require('../build/Lottery.json');

require('dotenv').config();

const { KALEIDO_API_URL, KALEIDO_API_KEY, CONTRACT_ADDRESS } = process.env;

const web3 = new Web3(new Web3.providers.HttpProvider(KALEIDO_API_URL));
const account = web3.eth.accounts.privateKeyToAccount(KALEIDO_API_KEY);
web3.eth.accounts.wallet.add(account);
web3.eth.defaultAccount = account.address;

const startLottery = async () => {
  try {
    const contract = new web3.eth.Contract(abi, CONTRACT_ADDRESS);
    await contract.methods.startLottery().send({ from: account.address });
    console.log('Lottery started');
  } catch (error) {
    console.error('Error starting lottery:', error);
  }
};

startLottery();
