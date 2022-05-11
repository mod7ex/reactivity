namespace reactivity0 {
	type Tg = () => void;

	let activeUpdate: Tg | undefined;

	let autorun = (update: Tg) => {
		function wrappedUpdate() {
			activeUpdate = wrappedUpdate;
			update();
			activeUpdate = undefined;
		}

		wrappedUpdate();
	};

	class Dep {
		constructor(private subscribers: Set<Tg> = new Set()) {}

		depend() {
			if (!activeUpdate || this.subscribers.has(activeUpdate)) return;
			this.subscribers.add(activeUpdate);
		}

		notify() {
			this.subscribers.forEach((run) => run());
		}
	}

	let data = { price: 5, quantity: 2 };
	let total = 0;

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

	autorun(() => {
		total = data.price * data.quantity;
	});
}
