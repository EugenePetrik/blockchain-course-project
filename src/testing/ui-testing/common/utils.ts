import { Browser } from '@playwright/test';
import { initialSetup, importAccount } from '@synthetixio/synpress/commands/metamask';
import playwright from '@synthetixio/synpress/commands/playwright';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

export const setupMetamaskWallet = async (browser: Browser): Promise<void> => {
  const network = {
    networkName: process.env.NETWORK_NAME!,
    rpcUrl: process.env.RPC_URL!,
    chainId: process.env.CHAIN_ID!,
    symbol: process.env.SYMBOL!,
    isTestnet: process.env.IS_TESTNET!,
  };
  const playwrightInstance = browser.browserType();
  await initialSetup(playwrightInstance, {
    secretWordsOrPrivateKey: process.env.MNEMONIC_PHARASE!,
    network,
    password: process.env.METAMASK_PASSWORD!,
    enableAdvancedSettings: true,
    enableExperimentalSettings: false,
  });
  await playwright.waitUntilStable();
};

export const importNewAccount = async (privateKey: string): Promise<void> => {
  const success = await importAccount(privateKey);

  if (!success) {
    throw new Error('Failed to import the account');
  }

  // Add a small wait time to ensure MetaMask processes the new account
  await wait(3_000);
};

export async function wait(timeout: number): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, timeout));
}
