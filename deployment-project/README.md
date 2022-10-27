# Deployment Project
A typescript project that includes the Redstone Warp Contract package to test and deploy a the [blog contract](https://github.com/DanMacDonald/blog-contract/tree/main/contract-project) to Arweave.

## index.ts 
Intended to be used with `arlocal` for local development. Deploys the `blog contract` locally and then uses Warp to perform a series of actions on the contract. Intended to be stepped though in the debugger in vscode to validate the responses.

## deploy.ts
Deploys the contract to arweave mainnet. (or `arlocal` depending on what config is used). 

## content.ts 
Deploys some content to `arlocal` to facilitate testing.

**NOTE: This code references wallet files on my machine, you will need to generate your own wallets using something like https://arweave.app and use those instead.**
