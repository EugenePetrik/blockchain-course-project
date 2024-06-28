import { ethers, type HDNodeWallet, type JsonRpcProvider, type Mnemonic } from 'ethers';
import * as dotenv from 'dotenv';
import { logger } from '../utils/logger';

dotenv.config();

const infuraProjectId = String(process.env.INFURA_PROJECT_ID);
const mnemonicPhrase = String(process.env.METAMASK_MNEMONIC_PHRASE);

// Define the Sepolia testnet RPC URL
const provider: JsonRpcProvider = new ethers.JsonRpcProvider(
  `https://sepolia.infura.io/v3/${infuraProjectId}`,
);

const getBalance = async (index: number): Promise<void> => {
  const walletPath: string = `44'/60'/0'/0/${index}`;

  // Create a Mnemonic object
  const mnemonic: Mnemonic = ethers.Mnemonic.fromPhrase(mnemonicPhrase);

  // Create an HDNode from the mnemonic
  const hdNodeWallet: HDNodeWallet = ethers.HDNodeWallet.fromMnemonic(
    mnemonic,
    walletPath,
  ).connect(provider);

  const address: string = hdNodeWallet.address;
  logger.info(`Wallet address is ${address}`);

  const balance: bigint = await provider.getBalance(address);
  logger.info(`Balance of account ${index}: ${ethers.formatEther(balance)} ETH`);
};

(async () => {
  await getBalance(2);
  await getBalance(3);
})();
