import { ref, reactive, computed, watch, watchEffect } from "./core.js";

const user = reactive({
    name: "Minseok0917",
});

const userGreting = computed(() => `Hello I'm ${user.name} Front-end Enginner`);

/* watch(userGreting, function (to) {
    console.log(to);
}); */

watchEffect(() => {
    console.log(userGreting.value);
});

user.name = "ZONE";
