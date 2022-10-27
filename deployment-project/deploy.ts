import * as WarpSdk from 'warp-contracts';
import fs from "fs";
import Arweave from "arweave";
import { Tags } from 'warp-contracts';

// Live wallet
let wallet1 = JSON.parse(fs.readFileSync("/Users/dmac/arweave/arweave-key-89tR0-C1m3_sCWCoVCChg4gFYKdiH5_ZDyZpdJ2DDRw.json").toString());
let wallet = JSON.parse(fs.readFileSync("/Users/dmac/arweave/arlocal/coiK5oVZx2VOycmINHzVy1XKrMVse3fXsxpH0d2ukXY.txt").toString());
let wallet2 = JSON.parse(fs.readFileSync("/Users/dmac/arweave/arlocal/S_06ihlWOO3z8cc5a1OpxQkhJVwdvB2nexpLC1y61Us.txt").toString());
let wallet3 = JSON.parse(fs.readFileSync("/Users/dmac/arweave/arlocal/EIu6OhKV93RgQCJ9lw4nOPmtYFEA90U59KmyLc-Q8rk.txt").toString());
let contractSrc = fs.readFileSync("../contract-project/out/contract.js").toString();

const arweave = Arweave.init({
	host: 'localhost',
	port: 1984,
	protocol: 'http'
})
let warp = WarpSdk.WarpFactory.forLocal();

// const arweave = Arweave.init({
// 	host: 'arweave.net',// Hostname or IP address for a Arweave host
// 	port: 443,          // Port
// 	protocol: 'https',  // Network protocol http or https
// });
// let warp = WarpSdk.WarpFactory.forMainnet();

(async () => {
	const amount = arweave.ar.arToWinston("10");
	const address1 = await arweave.wallets.jwkToAddress(wallet);
	await arweave.api.get(`mint/${address1}/${amount}`);
	const address2 = await arweave.wallets.jwkToAddress(wallet2);
	await arweave.api.get(`mint/${address2}/${amount}`);

	const state: ContractState = {
		owner: address1,
		posts: [],
		users: []
	};

	const initialState = JSON.stringify(state);
	const tags: Tags = [];

	const { contractTxId, srcTxId } = await warp.createContract.deploy({
		wallet,
		initState: initialState,
		data: { 'Content-Type': 'text/html', body: '<h1>HELLO WORLD</h1>' },
		src: contractSrc,
		tags
	});

	console.log(`ContractId: ${contractTxId}`);
	console.log(`SourceTxid: ${srcTxId}`);
})();