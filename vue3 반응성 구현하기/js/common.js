import { reactive, watchEffect, computed, watch } from "./core.js";

const user = reactive({
    a0: 1,
    a1: 2,
    count: 0,
});

const userCount = computed({
    get() {
        return user.count;
    },
    set(newCount) {
        user.count = newCount;
    },
});
const userCountPlusOne = computed(() => userCount.value + 1);

watchEffect(() => {
    console.log(userCount.value);
    console.log(userCountPlusOne.value);
});

user.count = 2;
