const isTypeFunction = typeof update === "function";
if (isTypeFunction) {
  let value;
  const effect = () => {
    activeEffect = effect; // 구독 이팩트 저장용
    value = update(); // 실행 => GET => 의존성 이팩트 구독
    activeEffect = null; // 초기화
  };
  effect();
  const computedRef = {
    get value() {
      return value;
    },
  };
  return computedRef;
} else {
  // watchEffect(update.get); // 의존성에 이팩트 추가
  const computedRef = {
    get value() {
      track(computedRef, "value"); // 구독하기
      return update.get();
    },
    set value(newValue) {
      update.set(newValue);
      trigger(computedRef, "value"); // 구독된 이팩트 실행
    },
  };
  return computedRef;
}
