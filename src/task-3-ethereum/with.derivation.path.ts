import { ethers, type HDNodeWallet, type JsonRpcProvider, type Mnemonic, type Wallet } from 'ethers';
import * as dotenv from 'dotenv';

dotenv.config();

const infuraProjectId = String(process.env.INFURA_PROJECT_ID);
const mnemonicPhrase = String(process.env.METAMASK_MNEMONIC_PHRASE);

// Define the Sepolia testnet RPC URL
const provider: JsonRpcProvider = new ethers.JsonRpcProvider(
  `https://sepolia.infura.io/v3/${infuraProjectId}`
);

// Create a Mnemonic object
const mnemonic: Mnemonic = ethers.Mnemonic.fromPhrase(mnemonicPhrase);

// Create an HDNode from the mnemonic
const hdNode: HDNodeWallet = ethers.HDNodeWallet.fromMnemonic(mnemonic);

const getBalance = async (index: number): Promise<void> => {
  // Derive the path for the account (without the "m/" prefix)
  const walletPath: string = `m/44'/60'/0'/0/${index}`;
  const walletNode: HDNodeWallet = hdNode.derivePath(walletPath.replace(/^m\//, ''));

  // Create a wallet instance from the derived private key and connect to the provider
  const wallet: Wallet = new ethers.Wallet(walletNode.privateKey, provider);

  const balance: bigint = await provider.getBalance(wallet.address);
  console.log(`Balance of account ${index}: ${ethers.formatEther(balance)} ETH`);
};

(async () => {
  await getBalance(0);
  await getBalance(1);
})();
