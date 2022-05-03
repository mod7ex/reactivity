type Primitive = string | number | boolean | null | undefined | Symbol | bigint;
type Dep = Set<any>;
type KeyToDepMap = Map<any, Dep>;

/* ************* code ************* */

let activeEffect: any;

const effect = (cb: Function) => {
	activeEffect = cb;
	cb();
	activeEffect = undefined;
};

const targetMap = new Map<any, KeyToDepMap>();

let track = (target: object) => {
	let depsMap: KeyToDepMap | undefined = targetMap.get(target);

	if (!depsMap) {
		depsMap = new Map();
		targetMap.set(target, depsMap);
	}

	let dep: Dep | undefined = depsMap.get("value");

	if (!dep) {
		dep = new Set<any>();
		depsMap.set("value", dep);
	}

	dep.add(activeEffect);
};

let trigger = (target: object) => {
	let depsMap: KeyToDepMap | undefined = targetMap.get(target);

	if (!depsMap) return;

	depsMap.forEach((dep: Dep) => {
		console.log(dep);
		dep.forEach((eff) => eff());
	});
};

class RefImp {
	constructor(private _value: Primitive) {}

	get value() {
		track(this);
		return this._value;
	}

	set value(v: Primitive) {
		this._value = v;
		trigger(this);
	}
}

const ref = (val: Primitive) => {
	return new RefImp(val);
};
