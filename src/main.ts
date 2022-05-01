// **************************************************************** Reactivity 2

let watcher = (myFunc: Tg) => {
	target = myFunc;
	target();
	target = undefined;
};

class Dep {
	constructor(private subscribers: Tg[] = []) {}

	depend() {
		if (!target || this.subscribers.includes(target)) return;
		this.subscribers.push(target);
	}

	notify() {
		this.subscribers.forEach((run) => run());
	}
}

let data = { price: 5, quantity: 2 };

Object.keys(data).forEach((key) => {
	// @ts-ignore
	let internalValue = data[key];

	let dep = new Dep();

	Object.defineProperty(data, key, {
		get() {
			console.log(`Getting ${key}: ${internalValue}`);
			dep.depend(); // record target
			return internalValue;
		},

		set(v) {
			console.log(`Setting ${key}: ${v}`);
			internalValue = v;
			dep.notify(); // notify (run) subscribers
		},
	});
});

let total = 0;

watcher(() => {
	total = data.price * data.quantity;
});
