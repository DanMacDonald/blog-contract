import fs from "fs";

import Arweave from "arweave";
const arweave = Arweave.init({
	host: 'localhost',
	port: 1984,
	protocol: 'http'
})

let wallet = JSON.parse(fs.readFileSync("/Users/dmac/arweave/arlocal/S_06ihlWOO3z8cc5a1OpxQkhJVwdvB2nexpLC1y61Us.txt").toString());
let wallet2 = JSON.parse(fs.readFileSync("/Users/dmac/arweave/arlocal/coiK5oVZx2VOycmINHzVy1XKrMVse3fXsxpH0d2ukXY.txt").toString());
let wallet3 = JSON.parse(fs.readFileSync("/Users/dmac/arweave/arlocal/V8FYyUHHTGP6-KzNkfaTJaKThMYJSHL9HIOx2fiXpoo.json").toString());

let priusImage = fs.readFileSync("./prius4-min.png");
let avatarImage = fs.readFileSync("./avatar-min.png");

(async () => {
	const amount = arweave.ar.arToWinston("10");
	const address1 = await arweave.wallets.jwkToAddress(wallet);
	const address2 = await arweave.wallets.jwkToAddress(wallet2);
	const address3 = await arweave.wallets.jwkToAddress(wallet3);
	await arweave.api.get(`mint/${address1}/${amount}`);
	await arweave.api.get(`mint/${address2}/${amount}`);
	await arweave.api.get(`mint/${address3}/${amount}`);

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
		bio: "this is my bio",
		links: {
		  "twitter": "MyMailProtocol"
		},
		wallets: {}
	  });

	let accountTx = await arweave.createTransaction({
		data,
	}, wallet2);
	accountTx.addTag("Protocol-Name", "Account-0.3" );
	accountTx.addTag("handle", "DMac" );
	await arweave.transactions.sign(accountTx, wallet2);
	await arweave.transactions.post(accountTx);
	console.log(`AccountTx`, accountTx);



	tx = await arweave.createTransaction({
		data: priusImage,
	}, wallet);
	tx.addTag("Content-Type", "image/png");
	await arweave.transactions.sign(tx, wallet);
	const imgTxid = tx.id;
	const res = await arweave.transactions.post(tx);
	console.log(`priusImage: ${imgTxid}`);

	data = JSON.stringify({
		handle: "DMac",
		avatar:`ar://${imgTxid}`,
		banner: "ar://a0ieiziq2JkYhWamlrUCHxrGYnHWUAMcONxRmfkWt-k",
		name: "DMac",
		bio: "this is my bio",
		links: {
		  "twitter": "MyMailProtocol"
		},
		wallets: {}
	  });

	let accoun2tTx = await arweave.createTransaction({
		data,
	}, wallet3);
	accoun2tTx.addTag("Protocol-Name", "Account-0.3" );
	accoun2tTx.addTag("handle", "DMac" );
	await arweave.transactions.sign(accoun2tTx, wallet3);
	await arweave.transactions.post(accoun2tTx);
	console.log(`AccountTx`, accoun2tTx);

	
})();