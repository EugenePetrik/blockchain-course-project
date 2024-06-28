import { ethers, type Wallet, type JsonRpcProvider } from 'ethers';
import * as dotenv from 'dotenv';
import { logger } from '../utils/logger';

dotenv.config();

const infuraProjectId: string = String(process.env.INFURA_PROJECT_ID);

const firstWalletPrivateKey: string = String(process.env.FIRST_WALLET_PRIVATE_KEY);
const secondWalletPrivateKey: string = String(process.env.SECOND_WALLET_PRIVATE_KEY);

async function main() {
  const firstWallet: Wallet = new ethers.Wallet(firstWalletPrivateKey);
  const secondWallet: Wallet = new ethers.Wallet(secondWalletPrivateKey);

  const provider: JsonRpcProvider = new ethers.JsonRpcProvider(
    `https://sepolia.infura.io/v3/${infuraProjectId}`,
  );

  const firstWalletBalance: bigint = await provider.getBalance(firstWallet.address);
  const secondWalletBalance: bigint = await provider.getBalance(secondWallet.address);

  logger.info(`Balance of the 1st wallet: ${ethers.formatEther(firstWalletBalance)} ETH`);
  logger.info(
    `Balance of the 2st wallet: ${ethers.formatEther(secondWalletBalance)} ETH`,
  );
}

main().catch(error => logger.error('Error:', error));
