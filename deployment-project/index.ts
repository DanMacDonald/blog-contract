import * as WarpSdk from 'warp-contracts';
import fs from "fs";
import Arweave from "arweave";
import ArLocal from 'arlocal';
import { Tags } from 'warp-contracts';

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

// Simple tests intended to be stepped though in vscode debugger.

(async () => {
	const arlocal = new ArLocal(1984, false)
	await arlocal.start()

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

	console.log(contractTxId);
	console.log(srcTxId);

	// Connect to the contract as the admin
	const contract = warp.contract(contractTxId).connect(wallet);
	const { sortKey, cachedValue } = await contract.readState();

	console.log(sortKey);
	console.log(cachedValue);

	const data: Post = {
		txid: 'txid',
		image: 'http://localhost/stuff',
		title: 'Post Title',
		description: 'Post Desc'
	}

	// Add a post
	await contract.writeInteraction({
		function: "upsertPost",
		data
	});

	let readState = await contract.readState();

	// Edit a post
	data.title = "Edited Post title";
	let rs = await contract.writeInteraction({
		function: "upsertPost",
		data
	});

	readState = await contract.readState();

	// Remove a post
	await contract.writeInteraction({
		function: "removePost",
		data: { txid: data.txid }
	});

	readState = await contract.readState();


	// Attempt to add a post as an unauthorized user
	const contract2 = warp.contract(contractTxId).connect(wallet2);

	data.title = "Post2 Title";

	// Try to add a post.
	let res = await contract2.writeInteraction({
		function: "upsertPost",
		data
	})

	readState = await contract.readState();

	// Have the admin add the post
	await contract.writeInteraction({
		function: "upsertPost",
		data
	});

	// Invalid user tries to remove the post
	let result = await contract2.dryWrite({
		function: "removePost",
		data: { txid: data.txid }
	});

	// Admin adds user role
	await contract.writeInteraction({
		function: "setUserRole",
		data: { address: address2, role: "post" }
	});

	readState = await contract.readState();

	// have the user add a post
	const data2 = { ...data, title: "Post2 Title", txid: "txid2" };
	res = await contract2.writeInteraction({
		function: "upsertPost",
		data: data2
	});

	readState = await contract.readState();

	// Have the user edit a post
	const data3 = {...data, title: "Edit Post1 Title"};
	res = await contract2.writeInteraction({
		function: "upsertPost",
		data: data3
	});

	readState = await contract.readState();

	// Transfer ownership of the site to the user
	res = await contract.writeInteraction({
		function: "transfer",
		data: {target: address2}
	});

	readState = await contract.readState();

	await arlocal.stop();
})();