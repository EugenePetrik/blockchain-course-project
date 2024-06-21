import { ethers } from 'ethers';
import * as dotenv from 'dotenv';

dotenv.config();

const infuraProjectId = String(process.env.INFURA_PROJECT_ID);
const accountAddress1 = String(process.env.ACCOUNT_ADDRESS_ONE);
const accountAddress2 = String(process.env.ACCOUNT_ADDRESS_TWO);

const provider = new ethers.JsonRpcProvider(`https://sepolia.infura.io/v3/${infuraProjectId}`);

const getBalance = async (account: string): Promise<void> => {
  const balance = await provider.getBalance(account);
  console.log(`Balance of account ${account}: ${ethers.formatEther(balance)} ETH`);
};

(async () => {
  await getBalance(accountAddress1);
  await getBalance(accountAddress2);
})();
