const targetWeakMap = new WeakMap(); // WeakMap 의 key 는 객체
let activeEffect;

function subscribe(target, key) {
    const depsMap =
        targetWeakMap.get(target) ||
        targetWeakMap.set(target, new Map()).get(target);
    const depEffects = depsMap.get(key) || depsMap.set(key, new Set()).get(key);

    return depEffects;
}
function track(target, key) {
    activeEffect && subscribe(target, key).add(activeEffect);
}
function trigger(target, key) {
    subscribe(target, key).forEach((effect) => effect());
}

export function ref(value) {
    const refObject = {
        get value() {
            track(refObject, "value");
            return value;
        },
        set value(newValue) {
            value = newValue;
            trigger(refObject, "value");
        },
    };
    return refObject;
}

export function reactive(object) {
    const reactiveObject = new Proxy(object, {
        get(target, key) {
            track(target, key);
            return target[key];
        },
        set(target, key, value) {
            target[key] = value;
            trigger(target, key);
            return target[key];
        },
    });
    return reactiveObject;
}

export function watchEffect(update) {
    const effect = () => {
        activeEffect = effect;
        update();
        activeEffect = null;
    };
    effect();
}
