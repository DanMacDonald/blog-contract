
export async function handle(state: ContractState, action: ContractAction) {
	const input = action.input;
	switch (input.function) {
		case 'upsertPost': return await upsertPost(state, action);
		case 'removePost': return await removePost(state, action);
		case 'setUserRole': return await setUserRole(state, action);
		case 'transfer': return await transfer(state, action);
		default: throw new ContractError(`No function supplied or function not recognised: "${input.function}"`);
	}
}

function removePost(state: ContractState, action: ContractAction) {
	const input: any = action.input.data;
	if (canRemove(state, action.caller) == false) {
		throw new ContractError("Invalid permissions. Wallet address does not have permissions to remove a post.");
	}
	// try to find the existing post
	const existing = state.posts.find(p => p.txid == input.txid);
	if (!existing) {
		throw new ContractError(`Invalid post. Post with txid:${input.txid} is not published on the blog`);
	}
	// remove the post
	const index = state.posts.indexOf(existing);
	console.log(`index: ${index} existing:`, existing);
	if (index == 0) {
		state.posts.shift();
	} else {
		state.posts.splice(index, 1);
	}
	return { state };
}

function upsertPost(state: ContractState, action: ContractAction) {
	const input: any = action.input.data;
	// check permissions
	if (canPost(state, action.caller) == false) {
		throw new ContractError("Invalid permissions. Wallet address does not have permissions to post.");
	}
	// first try to find the existing post
	const existing = state.posts.find(p => p.txid == input.txid);
	if (existing != null) {
		existing.imageTxid = input.imageTxid || existing.imageTxid;
		existing.title = input.title || existing.title;
		existing.description = input.description || existing.description;
		existing.timestamp = input.timestamp || existing.timestamp;
	} else {
		// add a new post to the beginning of the posts array
		state.posts.unshift(<Post>{
			txid: input.txid,
			imageTxid: input.imageTxid,
			title: input.title,
			description: input.description,
			timestamp: input.timestamp
		});
	}
	return { state };
}

function transfer(state: ContractState, action: ContractAction) {
	if (canTransfer(state, action.caller) == false) {
		throw new ContractError("Invalid permissions. Only the owner can transfer ownership.");
	}
	let input: any = action.input.data;
	if (isAddressValid(input.target) == false) {
		throw new ContractError(`Invalid transfer target. The target wallet address is invalid ${input.target}`);
	}
	state.owner = input.target;
	return { state }
}

function setUserRole(state: ContractState, action: ContractAction) {
	if (isOwner(state, action.caller) == false) {
		throw new ContractError(`Invalid permissions. Only the owner can modify users`);
	}
	let input: any = action.input.data;
	if (input.role != 'post' && input.role != 'none') {
		throw new ContractError(`Invalid user role ${input.role}. Valid roles are 'post' and 'none'.`);
	}

	// try to find an existing user
	const existing = state.users.find(u => u.address == input.address);
	if (existing != null) {
		existing.role = input.role;
	} else {
		state.users.push(<UserRole>{
			address: input.address,
			role: input.role
		});
	}
	return { state };
}

// =============================================================================
// Utility Functions
// =============================================================================
function canPost(state: ContractState, caller: Address): boolean {
	// current owner of the state can post
	if (isOwner(state, caller)) {
		return true;
	}
	// any user with the post role can post
	const userRole = state.users.find((u => u.address == caller));
	if (userRole && userRole.role?.includes("post")) {
		return true;
	}
	return false;
}

function canRemove(state: ContractState, caller: Address): boolean {
	// only the owner can remove published posts
	return isOwner(state, caller);
}

function canTransfer(state: ContractState, caller: Address): boolean {
	// only the current owner of the state can transfer
	return isOwner(state, caller);
}

function isOwner(state: ContractState, caller: Address): boolean {
	if (isAddressValid(caller) == false) {
		throw new ContractError("Invalid wallet address.");
	}
	// current owner of the state can post
	if (state.owner == caller) {
		return true;
	}
	return false;
}

function isAddressValid(address: Address) {
	const re: RegExp = /^[a-zA-Z0-9_\-]{43}$/;
	const isValid: boolean = re.test(address);
	return isValid;
}

declare const ContractError;