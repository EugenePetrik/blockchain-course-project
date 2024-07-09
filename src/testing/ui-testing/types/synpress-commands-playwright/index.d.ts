declare module '@synthetixio/synpress/commands/playwright' {
  export function browser(): any

  export function mainWindow(): any

  export function metamaskWindow(): any

  export function metamaskNotificationWindow(): any

  export function activeTabName(): any

  export function init(playwrightInstance: any): Promise<any>

  export function clear(): Promise<boolean>

  export function assignWindows(): Promise<boolean>

  export function assignActiveTabName(tabName: any): Promise<boolean>

  export function clearWindows(): Promise<boolean>

  export function isCypressWindowActive(): Promise<boolean>

  export function isMetamaskWindowActive(): Promise<boolean>

  export function isMetamaskNotificationWindowActive(): Promise<boolean>

  export function switchToCypressWindow(): Promise<boolean>

  export function switchToMetamaskWindow(): Promise<boolean>

  export function switchToMetamaskNotificationWindow(): Promise<boolean>

  export function switchToMetamaskNotification(): any

  export function waitFor(selector: any, page?: any): Promise<any>

  export function waitAndClick(selector: any, page?: any, args?: {}): Promise<any>

  export function waitAndClickByText(selector: any, text: any, page?: any): Promise<void>

  export function waitAndType(selector: any, value: any, page?: any): Promise<void>

  export function waitAndGetValue(selector: any, page?: any): Promise<any>

  export function waitAndGetInputValue(selector: any, page?: any): Promise<any>

  export function waitAndGetAttributeValue(selector: any, attribute: any, page?: any): Promise<any>

  export function waitAndSetValue(text: any, selector: any, page?: any): Promise<void>

  export function waitAndClearWithBackspace(selector: any, page?: any): Promise<void>

  export function waitClearAndType(text: any, selector: any, page?: any): Promise<void>

  export function waitForText(selector: any, text: any, page?: any): Promise<void>

  export function waitToBeHidden(selector: any, page?: any): Promise<void>

  export function waitUntilStable(page?: any): Promise<void>

  export function waitUntilNotificationWindowIsStable(page?: any): Promise<void>

  export function waitUntilMetamaskWindowIsStable(page?: any): Promise<void>

  export function fixBlankPage(page?: any): Promise<void>

  export function fixCriticalError(page?: any): Promise<void>
}
