const eversiteAbi = {"ABIversion":2,"version":"2.3","header":["pubkey","time","expire"],"functions":[{"name":"constructor","inputs":[{"name":"contentType","type":"optional(string)"}],"outputs":[]},{"name":"upload","inputs":[{"name":"part","type":"cell"},{"name":"index","type":"uint8"}],"outputs":[]},{"name":"getDetails","inputs":[],"outputs":[{"name":"content","type":"map(uint8,cell)"},{"name":"contentType","type":"string"}]},{"name":"destruct","inputs":[{"name":"dest","type":"address"}],"outputs":[]},{"name":"transferOwnership","inputs":[{"name":"newOwner","type":"uint256"}],"outputs":[]},{"name":"owner","inputs":[],"outputs":[{"name":"owner","type":"uint256"}]},{"name":"_randomNonce","inputs":[],"outputs":[{"name":"_randomNonce","type":"uint256"}]}],"data":[{"key":1,"name":"_randomNonce","type":"uint256"}],"events":[{"name":"OwnershipTransferred","inputs":[{"name":"previousOwner","type":"uint256"},{"name":"newOwner","type":"uint256"}],"outputs":[]}],"fields":[{"name":"_pubkey","type":"uint256"},{"name":"_timestamp","type":"uint64"},{"name":"_constructorFlag","type":"bool"},{"name":"owner","type":"uint256"},{"name":"_randomNonce","type":"uint256"},{"name":"_content","type":"map(uint8,cell)"},{"name":"_contentType","type":"string"}]} as const

export const factorySource = {
    Eversite: eversiteAbi
} as const

export type FactorySource = typeof factorySource
export type EversiteAbi = typeof eversiteAbi
