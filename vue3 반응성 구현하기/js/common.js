import { reactive, watchEffect } from "./core.js";

const user = reactive({
    a0: 1,
    a1: 2,
});

watchEffect(function () {
    console.log(user.a0 + user.a1);
});

// 3
user.a0 = 5; // 7
user.a1 = 10; // 15
user.a1 = 6; // 16
