declare module '@synthetixio/synpress/helpers' {
  export function setNetwork(network: any): Promise<void>

  export function findNetwork(network: any): Promise<any>

  export function getCurrentNetwork(): {
    readonly id: number
    readonly network: string
    readonly name: string
    readonly nativeCurrency: {
      readonly name: string
      readonly symbol: string
      readonly decimals: number
    }
    readonly rpcUrls: {
      readonly alchemy: {
        readonly http: readonly [string]
        readonly webSocket: readonly [string]
      }
      readonly infura: {
        readonly http: readonly [string]
        readonly webSocket: readonly [string]
      }
      readonly default: {
        readonly http: readonly [string]
      }
      readonly public: {
        readonly http: readonly [string]
      }
    }
    readonly blockExplorers: {
      readonly etherscan: {
        readonly name: string
        readonly url: string
      }
      readonly default: {
        readonly name: string
        readonly url: string
      }
    }
    readonly contracts: {
      readonly ensRegistry: {
        readonly address: string
      }
      readonly ensUniversalResolver: {
        readonly address: string
        readonly blockCreated: number
      }
      readonly multicall3: {
        readonly address: string
        readonly blockCreated: number
      }
    }
  }

  export function addNetwork(newNetwork: any): Promise<void>

  export function checkNetworkAdded(network: any): Promise<boolean>

  export function getSynpressPath(): string

  export function createDirIfNotExist(path: any): Promise<boolean>

  export function checkDirOrFileExist(path: any): Promise<boolean>

  export function getMetamaskReleases(version: any): Promise<{
    filename: any
    downloadUrl: any
    tagName: any
  }>

  export function download(url: any, destination: any): Promise<void>

  export function prepareMetamask(version: any): Promise<string>
}
