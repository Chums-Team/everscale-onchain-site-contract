import { LockliftConfig } from "locklift";
import { FactorySource } from "./build/factorySource";
import "@broxus/locklift-deploy";
import { Deployments } from "@broxus/locklift-deploy";
import * as dotenv from "dotenv";

dotenv.config();

declare module "locklift" {
  //@ts-ignore
  export interface Locklift {
    deployments: Deployments<FactorySource>;
  }
}

declare global {
  const locklift: import("locklift").Locklift<FactorySource>;
}

const config: LockliftConfig = {
  compiler: {
    // Specify path to your TON-Solidity-Compiler
    // path: "/mnt/o/projects/broxus/TON-Solidity-Compiler/build/solc/solc",

    // Or specify version of compiler
    version: "0.70.0",

    // Specify config for extarnal contracts as in exapmple
    // externalContracts: {
    //   "node_modules/broxus-ton-tokens-contracts/build": ['TokenRoot', 'TokenWallet']
    // }
  },
  linker: {
    // Specify path to your stdlib
    // lib: "/mnt/o/projects/broxus/TON-Solidity-Compiler/lib/stdlib_sol.tvm",
    // // Specify path to your Linker
    // path: "/mnt/o/projects/broxus/TVM-linker/target/release/tvm_linker",

    // Or specify version of linker
    version: "0.18.4",
  },
  networks: {
    locklift: {
      connection: {
        id: 1001,
        // @ts-ignore
        type: "proxy",
        // @ts-ignore
        data: {},
      },
      keys: {
        // Use everdev to generate your phrase
        // !!! Never commit it in your repos !!!
        // phrase: "action inject penalty envelope rabbit element slim tornado dinner pizza off blood",
        amount: 20,
      },
    },
    main: {
      connection: {
        id: 42,
        type: 'jrpc',
        data: {
          endpoint: process.env.EVERSCALE_MAINNET_JRPC_ENDPOINT!,
        },
      },
      giver: {
        address: process.env.EVERSCALE_MAINNET_GIVER_ADDRESS!,
        phrase: process.env.EVERSCALE_MAINNET_GIVER_PHRASE!,
        accountId: 0,
      },
      keys: {
        // !!! Never commit it in your repos !!!
        phrase: process.env.DEPLOYER_PHRASE!,
        amount: 1000,
      },
    },
  },
  mocha: {
    timeout: 2000000,
  },
};

export default config;
