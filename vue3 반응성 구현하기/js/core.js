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
    refObject.isRef = true;
    return refObject;
}

export function reactive(object) {
    object.isReactive = true;
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

export function computed(update) {
    const isTypeFunction = typeof update === "function";
    const computedRef = isTypeFunction
        ? computedFunction(update)
        : computedObject(update);
    computedRef.isRef = true;
    return computedRef;
}

function computedFunction(update) {
    /* 
        Function 은 가져오기 밖에 없으며
        종속성의 변화로만 값이 변한다.
    */
    let value;
    // 종속성 값 변경 시 실행된다.
    activeEffect = () => {
        value = update();
    };
    activeEffect(); // computed 종속성의 구독하기
    activeEffect = null;
    const computedRef = {
        get value() {
            track(computedRef, "value"); // 호출했을 땐 이펙트 추가
            return value;
        },
    };
    return computedRef;
}
function computedObject(object) {
    let value;
    const computedRef = {
        get value() {
            track(computedRef, "value");
            return value;
        },
        set value(newValue) {
            object.set(newValue);
            trigger(computedRef, "value");
        },
    };
    activeEffect = () => {
        value = object.get();
        trigger(computedRef, "value");
    };
    activeEffect();
    activeEffect = null;
    return computedRef;
}
export function watchEffect(update) {
    const effect = () => {
        activeEffect = () => {
            update();
        };
        activeEffect();
        activeEffect = null;
    };
    effect();
}
export function watch(target, update) {
    // reactive, reactiveKey
    const isRef = target.isRef;
    const isReactiveKey = typeof target === "function";
    if (isRef) {
        let from = target.value;
        function watch() {
            let to = target.value;
            update(to, from);
            from = to;
        }
        subscribe(target, "value").add(watch);
    } else if (isReactiveKey) {
        let from;
        activeEffect = function () {
            let to = target();
            update(to, from);
            from = to;
        };
        from = target();
        activeEffect = null;
    } else {
        throw Error("안해요~");
    }
}
