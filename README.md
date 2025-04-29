# everscale-onchain-site-contract
[![License](https://img.shields.io/badge/License-Apache_2.0-yellowgreen.svg)](https://opensource.org/licenses/Apache-2.0)

Script for deploying Eversite contract.
This contract could store html-sites in the Everscale blockchain.
Site address could be linked to .ever domains 
and accessed via the browser from [Chums](https://chums.chat/) messenger or via chums [proxy](https://github.com/Chums-Team/chums-proxy)

This scripts uses npm and node.js. Be sure you have them installed.

## Install dependencies

```shell
npm install
```

## Prepare the environment

`.env` is used to configure these scripts.
You should create it from [.env.template](.env.template) file.
Fill in the fields with your data.

| Field                                | Required | Description                                                    |
|-----------------------------------|----------|----------------------------------------------------------------|
| `MAINNET_NETWORK_ENDPOINT`        | **yes**  | URL of the mainnet GraphQL endpoint                            |
| `EVERSCALE_MAINNET_GIVER_ADDRESS` | **yes**  | Giver wallet address: address where gas will be withdrawn from |
| `EVERSCALE_MAINNET_GIVER_PHRASE`  | **yes**  | Seed phrase of the giver wallet                                |
| `DEPLOYER_PHRASE`                 | **yes**  | Seed phrase that used to generate new addresses                | 


## Deploy site contract

After all preparations you could deploy the site contract.
You could run the script:

```shell
npx locklift run --network main --script scripts/1-deploy-site.ts --file <path_to_file>
```
When you run the `1-deploy-site.ts` script, you will get a new address and a new deployment every time.

After deploying the contract you need to set link in the .ever domain.

## Set 1005 record

1. Open .ever domain address on the [everscan.io](https://everscan.io) 
1. Connect wallet that own the domain
1. Select `Source code` tab 
1. Send  `setRecord` message
- Key: 1005
- Value: address as cell
- Action type: Send
- Amount: 1 Ever
- Bounce: true   

### How to convert address to cell?
- Open developer tool [ever.bytie.moe](https://ever.bytie.moe/serializer)
- Write to `Write function signature or cell ABI`: address
- Write to `value0:address` : your site address
- Copy `Output (cell)`