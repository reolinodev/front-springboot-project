import "../css/style.css";
import "../scss/main.scss";
import "../css/reset.min.css";

import detail from '../js/module/alert';

//Babel 적용 예제
// ES5
const myArrary = [1, 2, 3, 4];
let arr1 = myArrary.map(function (item) {
  return item;
});
console.log(arr1);

// ES6
let arr2 = myArrary.map((item) => item);
console.log(arr2);

//Define Plugin 적용 예제
console.log(process.env.NODE_ENV);
console.log(VERSION);
console.log(MAX_COUNT);
console.log(api.domain);

// 모듈 임폴트
console.log(detail('철수', 20));
