# Array Cardio Day 2

練習陣列的各種方法 (Method)。

### 知識點

* `Array.prototype.some()` 方法。
* `Array.prototype.every()` 方法。

### 步驟

> 這一天的內容是延續第四天的練習，介紹一些陣列實例的方法。

`Array.prototype.some()` 方法：回傳一個 `boolean`，代表陣列中是否**有一元素**可以通過回呼函示的驗證。
`Array.prototype.every()` 方法：回傳一個 `boolean`，代表陣列中是否**所有元素**可以通過回呼函示的驗證。

``` js
const isAnyAdult = people.some((person) => {
	const currentYear = new Date().getFullYear();

	if (currentYear - person.year >= 18) return true;
});

console.log(isAnyAdult);
```

``` js
const isEveryAdult = people.every((person) => {
	const currentYear = new Date().getFullYear();

	if (currentYear - person.year >= 18) return true;
});

console.log(isEveryAdult);
```

`Array.prototype.find()` 方法：回傳**第一個**通過回呼函式驗證的元素。
`Array.prototype.findIndex()` 方法：回傳**第一個**通過回呼函式驗證的元素之索引。

> 與之相對的為 `Array.prototype.findLast()` 和 `Array.prototype.findLastIndex()`。

``` js
const comment = comments.find((comment) => comment.id === 823423);

console.log(comment);
```

``` js
const commentIndex = comments.findIndex((comment) => comment.id === 823423);

console.log(commentIndex);
```

那如果現在要刪除其中一個元素，一般常見的有兩種方式：

第一種做法是利用 `Array.prototype.slice()` 方法：製造一個原陣列的**淺層拷貝**，保留特定索引範圍的部分。

``` js
const newComments1 = [
  ...comments.slice(0, commentIndex),
  ...comments.slice(commentIndex + 1)
];

console.table(newComments1);
```

> 所謂的淺層拷貝 (sahllow copy)，指的是只有單層的拷貝；與之相對的是深層拷貝 (deep copy)。這些觀念會與 call by value 和 call by reference 有關，相信網路上有很多資源，此處就不贅述了。

> 也建議順便搞懂 JavaScript 的 call by sharing 特性，因為真的是蠻神奇的。

原課程也提到這是在 Redux 中常見的寫法，這其實是因為 immutable 這種特性的緣故。

第二種做法是利用 `Array.prototype.splice()` 方法：就地更動原陣列，比較特別的是可以順便添加元素進去。

``` js
const comments2 = comments.splice(commentIndex, 1);

console.table(comments);
```

可以特別注意我們印出來的是 `comments` 而不是 `comments2`，原陣列已經被改變了。

### 延伸練習

簡單地利用 `Array.prototype.splice()` 方法添加一些元素：

``` js
comments.splice(4,
  0,
  { text: 'I am hungry...', id: 265031 },
  { text: 'QAQ...', id: 957128 }
);

console.table(comments);
```

有興趣的話可以參考此專案 repo。

### 參考資料

* [Array.prototype.some() - JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some)
* [Array.prototype.every() - JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every)
* [Array.prototype.find() - JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find)
* [Array.prototype.findIndex() - JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex)
* [Array.prototype.slice() - JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice)
* [Array.prototype.splice() - JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice)
