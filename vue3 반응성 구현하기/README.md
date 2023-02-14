```javascript
let A0 = 1;
let A1 = 2;
let A2 = A0 + A1; // 3

/* 
  setter 는 update 는 "effect"
  "effect" 내부의 변수는 종속성(A0, A1)
  "effect" 가 종속성을 구독한다.(종속성 값 변화를 감지)
*/

function update() {
    A2 = A0 + A1;
}
```
