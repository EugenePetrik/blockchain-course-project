declare module '@synthetixio/synpress/commands/metamask' {
  export function extensionId(): any;

  export function extensionUrls(): {
    extensionInitialUrl: any;
    extensionHomeUrl: any;
    extensionSettingsUrl: any;
    extensionAdvancedSettingsUrl: any;
    extensionExperimentalSettingsUrl: any;
    extensionAddNetworkUrl: any;
    extensionNewAccountUrl: any;
    extensionImportAccountUrl: any;
    extensionImportTokenUrl: any;
  };

  export function walletAddress(): any;

  export function goTo(url: any): Promise<void>;

  export function goToHome(): Promise<void>;

  export function goToSettings(): Promise<void>;

  export function goToAdvancedSettings(): Promise<void>;

  export function goToExperimentalSettings(): Promise<void>;

  export function goToAddNetwork(): Promise<void>;

  export function goToNewAccount(): Promise<void>;

  export function goToImportAccount(): Promise<void>;

  export function goToImportToken(): Promise<void>;

  export function getExtensionDetails(): Promise<{
    extensionInitialUrl: any;
    extensionId: any;
    extensionSettingsUrl: string;
    extensionAdvancedSettingsUrl: string;
    extensionExperimentalSettingsUrl: string;
    extensionAddNetworkUrl: string;
    extensionNewAccountUrl: string;
    extensionImportAccountUrl: string;
    extensionImportTokenUrl: string;
  }>;

  export function closePopupAndTooltips(): Promise<boolean>;

  export function closeModal(): Promise<boolean>;

  export function unlock(password: any): Promise<boolean>;

  export function optOutAnalytics(): Promise<boolean>;

  export function importWallet(secretWords: any, password: any): Promise<boolean>;

  export function createWallet(password: any): Promise<boolean>;

  export function importAccount(privateKey: any): Promise<boolean>;

  export function createAccount(accountName: any): Promise<any>;

  export function switchAccount(accountNameOrAccountNumber: any): Promise<boolean>;

  export function changeNetwork(network: any): Promise<boolean>;

  export function addNetwork(network: any): Promise<boolean>;

  export function disconnectWalletFromDapp(): Promise<boolean>;

  export function disconnectWalletFromAllDapps(): Promise<boolean>;

  export function activateAdvancedGasControl(skipSetup: any): Promise<boolean>;

  export function activateShowHexData(skipSetup: any): Promise<boolean>;

  export function activateTestnetConversion(skipSetup: any): Promise<boolean>;

  export function activateShowTestnetNetworks(skipSetup: any): Promise<boolean>;

  export function activateCustomNonce(skipSetup: any): Promise<boolean>;

  export function activateDismissBackupReminder(skipSetup: any): Promise<boolean>;

  export function activateEthSignRequests(skipSetup: any): Promise<boolean>;

  export function activateImprovedTokenAllowance(skipSetup: any): Promise<boolean>;

  export function resetAccount(): Promise<boolean>;

  export function confirmSignatureRequest(): Promise<boolean>;

  export function rejectSignatureRequest(): Promise<boolean>;

  export function confirmDataSignatureRequest(): Promise<boolean>;

  export function rejectDataSignatureRequest(): Promise<boolean>;

  export function importToken(tokenConfig: any): Promise<{
    tokenContractAddress: any;
    tokenSymbol: any;
    tokenDecimals: any;
    imported: boolean;
  }>;

  export function confirmAddToken(): Promise<boolean>;

  export function rejectAddToken(): Promise<boolean>;

  export function confirmPermissionToSpend(spendLimit: any): Promise<boolean>;

  export function rejectPermissionToSpend(): Promise<boolean>;

  export function acceptAccess(options?: any): Promise<boolean>;

  export function rejectAccess(): Promise<boolean>;

  export function confirmTransaction(gasConfig?: any): Promise<{
    recipientPublicAddress: any;
    networkName: any;
    customNonce: any;
    confirmed: boolean;
  }>;

  export function rejectTransaction(): Promise<boolean>;

  export function confirmEncryptionPublicKeyRequest(): Promise<boolean>;

  export function rejectEncryptionPublicKeyRequest(): Promise<boolean>;

  export function confirmDecryptionRequest(): Promise<boolean>;

  export function rejectDecryptionRequest(): Promise<boolean>;

  export function confirmPermisionToApproveAll(): Promise<boolean>; //typo in lib name function

  export function rejectPermisionToApproveAll(): Promise<boolean>; //typo in lib name function

  export function allowToAddNetwork({ waitForEvent }?: { waitForEvent: any }): Promise<boolean>;

  export function rejectToAddNetwork(): Promise<boolean>;

  export function allowToSwitchNetwork(): Promise<boolean>;

  export function rejectToSwitchNetwork(): Promise<boolean>;

  export function allowToAddAndSwitchNetwork(): Promise<boolean>;

  export function getWalletAddress(): Promise<any>;

  export function initialSetup(
    playwrightInstance: any,
    {
      secretWordsOrPrivateKey,
      network,
      password,
      enableAdvancedSettings,
      enableExperimentalSettings,
    }: {
      secretWordsOrPrivateKey: any;
      network: any;
      password: any;
      enableAdvancedSettings: any;
      enableExperimentalSettings: any;
    }
  ): Promise<boolean>;

  export function activateAdvancedSetting(
    toggleOn: any,
    toggleOff: any,
    skipSetup: any,
    experimental: any
  ): Promise<boolean>;

  export function setupSettings(enableAdvancedSettings: any, enableExperimentalSettings: any): Promise<boolean>;
}
