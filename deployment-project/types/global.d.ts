type Address = string;

interface ContractState {
	owner: Address;
	posts: Post[];
	users: UserRole[];
}

interface Post {
	txid: string;
	image: string;
	title: string;
	description: string;
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
	id: number;
	content: string;
}

type ContractFunction = 'upsertPost' | 'removePost' | 'updateUser' | 'transfer';