import * as bip39 from 'bip39';
import { ethers } from 'ethers';
import * as dotenv from 'dotenv';
import { logger } from '../utils/logger';

dotenv.config();

const infuraProjectId = String(process.env.INFURA_PROJECT_ID);

async function main() {
  logger.info('Step 1: initialize the provider');
  const provider = new ethers.JsonRpcProvider(
    `https://sepolia.infura.io/v3/${infuraProjectId}`,
  );

  logger.info('Step 2: generate a mnemonic phrase');
  // const mnemonic = bip39.generateMnemonic();
  const mnemonic: string = String(process.env.NEW_METAMASK_ACCOUNT_MNEMONIC_PHRASE);
  logger.info(`Generated Mnemonic phrase: ${mnemonic}`);

  logger.info('Step 3: create TAF bank account from mnemonic');
  const tafBankWallet = ethers.Wallet.fromPhrase(mnemonic).connect(provider);
  logger.info(`TAF bank account address: ${tafBankWallet.address}`);

  logger.info(
    'Step 4: create a new Ethereum account from the mnemonic using a different derivation path',
  );
  const hdNode = ethers.HDNodeWallet.fromPhrase(mnemonic);
  const walletPath = "m/44'/60'/0'/0/1";
  const newAccountNode = hdNode.derivePath(walletPath.replace(/^m\//, ''));
  const newAccountWallet = new ethers.Wallet(newAccountNode.privateKey, provider);
  logger.info(`New account address: ${newAccountWallet.address}`);

  logger.info('Step 5: check TAF bank account balance');
  const tafBankBalance = await provider.getBalance(tafBankWallet.address);
  logger.info(
    `TAF bank account balance: ${ethers.formatUnits(tafBankBalance, 'ether')} ETH`,
  );

  const transferAmount = ethers.parseUnits('0.02', 'ether');

  logger.info('Estimate gas for the transaction');
  const estimatedGas = await provider.estimateGas({
    to: newAccountWallet.address,
    value: transferAmount,
    from: tafBankWallet.address,
  });

  logger.info('Get fee data');
  const feeData = await provider.getFeeData();

  logger.info("Provide a fallback value for maxFeePerGas if it's null");
  const maxFeePerGas = feeData.maxFeePerGas ?? ethers.parseUnits('0.001', 'gwei');
  const maxPriorityFeePerGas =
    feeData.maxPriorityFeePerGas ?? ethers.parseUnits('0.001', 'gwei');

  logger.info('Calculate total gas fee');
  const estimatedGasFee = estimatedGas * maxFeePerGas;
  logger.info(`Estimated gas fee: ${ethers.formatUnits(estimatedGasFee, 'ether')} ETH`);

  if (tafBankBalance < transferAmount + estimatedGasFee) {
    logger.error(
      'Not enough funds in TAF bank account to cover transfer amount and gas fee',
    );
    return;
  }

  logger.info('Step 6: transfer 0.02 ETH from TAF bank account to the new account');
  const transferTx = await tafBankWallet.sendTransaction({
    to: newAccountWallet.address,
    value: transferAmount,
    gasLimit: estimatedGas,
    maxFeePerGas,
    maxPriorityFeePerGas,
  });
  const transferReceipt = await transferTx.wait();

  if (transferReceipt) {
    logger.info(`Transfer Transaction Hash: ${transferTx.hash}`);
    logger.info(`Gas used for deposit: ${transferReceipt.gasUsed.toString()}`);
  } else {
    logger.error('Failed to retrieve transfer transaction receipt.');
  }

  logger.info('Step 7: check new account balance');
  const newAccountBalance = await provider.getBalance(newAccountWallet.address);
  logger.info(
    `New account balance: ${ethers.formatUnits(newAccountBalance, 'ether')} ETH`,
  );

  logger.info('Estimate gas for the return transaction');
  const estimatedReturnGas = await provider.estimateGas({
    to: tafBankWallet.address,
    value: transferAmount,
    from: newAccountWallet.address,
  });

  logger.info('Calculate total gas fee for the return transaction');
  const estimatedReturnGasFee = estimatedReturnGas * maxFeePerGas;
  logger.info(
    `Estimated return gas fee: ${ethers.formatUnits(estimatedReturnGasFee, 'ether')} ETH`,
  );

  if (newAccountBalance < transferAmount + estimatedReturnGasFee) {
    logger.error('Not enough funds in new account to cover return amount and gas fee');
    return;
  }

  logger.info('Step 8: send ETH tokens back to the TAF bank account');
  const returnTx = await newAccountWallet.sendTransaction({
    to: tafBankWallet.address,
    value: transferAmount,
    gasLimit: estimatedReturnGas,
    maxFeePerGas,
    maxPriorityFeePerGas,
  });
  const returnReceipt = await returnTx.wait();

  if (returnReceipt) {
    logger.info(`Return Transaction Hash: ${returnTx.hash}`);
    logger.info(`Gas used for withdrawal: ${returnReceipt.gasUsed.toString()}`);
  } else {
    logger.error('Failed to retrieve return transaction receipt.');
  }

  logger.info('Step 9: log total gas used');
  if (transferReceipt && returnReceipt) {
    const totalGasUsed = transferReceipt.gasUsed + returnReceipt.gasUsed;
    logger.info(`Total Gas used for deposit and withdrawal: ${totalGasUsed.toString()}`);
  }
}

main().catch(error => logger.error('Error:', error));
