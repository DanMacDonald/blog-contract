import fs from "fs";

import Arweave from "arweave";
const arweave = Arweave.init({
	host: 'localhost',
	port: 1984,
	protocol: 'http'
})

let wallet = JSON.parse(fs.readFileSync("/Users/dmac/arweave/arlocal/S_06ihlWOO3z8cc5a1OpxQkhJVwdvB2nexpLC1y61Us.txt").toString());
let priusImage = fs.readFileSync("./prius4-min.png");
let avatarImage = fs.readFileSync("./dmac.png");

(async () => {
	const amount = arweave.ar.arToWinston("10");
	const address1 = await arweave.wallets.jwkToAddress(wallet);
	await arweave.api.get(`mint/${address1}/${amount}`);

	let tx = await arweave.createTransaction({
		data: avatarImage,
	}, wallet);
	tx.addTag("Content-Type", "image/png");
	await arweave.transactions.sign(tx, wallet);
	const avatarTxid = tx.id;
	await arweave.transactions.post(tx);
	console.log(`avatarImage: ${avatarTxid}`);

	let data = JSON.stringify({
		handle: "DMac",
		avatar:`ar://${avatarTxid}`,
		banner: "ar://a0ieiziq2JkYhWamlrUCHxrGYnHWUAMcONxRmfkWt-k",
		name: "DMac",
		bio: "Accelerating the worlds transition to decentralized messaging",
		links: {
		  "twitter": "MyMailProtocol"
		},
		wallets: {}
	  });

	let accountTx = await arweave.createTransaction({
		data,
	}, wallet);
	accountTx.addTag("Protocol-Name", "Account-0.3" );
	accountTx.addTag("handle", "DMac" );
	await arweave.transactions.sign(accountTx, wallet);
	await arweave.transactions.post(accountTx);
	console.log(`AccountTx: ${accountTx}`);



	tx = await arweave.createTransaction({
		data: priusImage,
	}, wallet);
	tx.addTag("Content-Type", "image/png");
	await arweave.transactions.sign(tx, wallet);
	const imgTxid = tx.id;
	const res = await arweave.transactions.post(tx);
	console.log(`priusImage: ${imgTxid}`);

	let transaction = await arweave.createTransaction({
		data: '<html><head><meta charset="UTF-8"><title>Arweave 2.6 Spec</title></head><body>Arweave is a permanent data storage network. This document describes version 2.6 the latest upgrade.</body></html>',
	}, wallet);
	
	transaction.addTag('Title', 'Arweave 2.6 Spec');
	transaction.addTag('Description', 'Arweave is a permanent data storage network. This document describes version 2.6 the latest upgrade.');
	transaction.addTag('Thumbnail', imgTxid);
	await arweave.transactions.sign(transaction, wallet);

	const response = await arweave.transactions.post(transaction);
	console.log(response.status);
	console.log(transaction.id);
})();