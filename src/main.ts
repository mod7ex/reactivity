// **************************************************************** Reactivity 0

/*
type Target = null | (() => void);

let price = 5;
let quantity = 2;
let total = 0;

let target: Target = null;

let storage: Target[] = [];

target = () => {
	total = price * quantity;
};

let record = () => {
	storage.push(target);
};

let replay = () => {
	storage.forEach((run) => run && run());
};

record(); // save target

target();
*/

// **************************************************************** Reactivity 1

type Target = () => void;

let target: Target | undefined;

class Dep {
	constructor(private subscribers: Target[] = []) {}

	depend() {
		if (!target || this.subscribers.includes(target)) return;
		this.subscribers.push(target);
	}

	notify() {
		this.subscribers.forEach((run) => run());
	}
}

let dep = new Dep();

let price = 5;
let quantity = 2;
let total = 0;

// ----------------> we will encapsulate the three new blocks in one function called watcher
// target = () => { total = price * quantity; };
// dep.depend();
// target();

let watcher = (myFunc: Target) => {
	target = myFunc;
	dep.depend();
	target();
	target = undefined;
};

watcher(() => {
	total = price * quantity;
});
