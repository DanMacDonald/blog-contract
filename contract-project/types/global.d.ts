type Address = string;

interface ContractState {
	owner: Address;
	posts: Post[];
	users: UserRole[];
}

interface Post {
	txid: Address;
	imageTxid: Address;
	title: string;
	description: string;
	timestamp: number;
}


interface UserRole {
	address: Address;
	role: string;
}

interface ContractAction {
	input: ContractInput;
	caller: string;
}


interface ContractInput {
	function: ContractFunction;
	data: any;
}

type ContractFunction = 'upsertPost' | 'removePost' | 'setUserRole' | 'transfer';