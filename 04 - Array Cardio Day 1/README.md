# Array Cardio Day 1

練習陣列的各種方法 (Method)。

### 知識點

* `console` 這個 Web APIs 的方法。
* `Array.prototype.filter()` 方法。
* `Array.prototype.map()` 方法。
* `Array.prototype.sort()` 方法。
* `Array.prototype.reduce()` 方法。
* 三元運算子。
* `String.prototype.includes()` 方法。
* `String.prototype.split()` 方法。
* `String.prototype.charCodeAt()` 方法。

### 步驟

> 這一天的內容是實際操作一些陣列的動態方法（實例方法）。建議去參考資料中閱讀 MDN 對於參數的詳細描述，這部分不會在這邊著墨。

在開始之前讓我們先聊一些與課程內容無關的東西。在 ECMAScript 6 中引入了類別，而 JavaScript 中所有的類別都繼承自物件，所以儘管 JavaScript 的物件導向 (OOP) 實作方式相當奇特，他依然會牽涉到物件導向相關的概念。

讓我們先略過物件導向的四大特性。物件有屬性 (attribute) 及方法 (method)，當物件的屬性並不是單純的資料，具有某些功能，這就是一個方法。

這裡讓我們利用 `class` 關鍵字宣告一個 `Student` 類別，類別的首字必須大寫。然後利用 `constructor()` 建構子函數初始化實例 (instance)。

``` js
class Student {
  constructor(name, age) {
    this.name = name; // attribute
    this.age = age; // attribute
  }

 // dynamic method
  cry() {
    console.log('QAQ');
  }
}

// instantiation
const dandelion = new Student('dandelion', 5);
dandelion.cry(); // 'QAQ'
```

像 `Array` 這些 built-in 的類別，我們可以使用 `new` 關鍵字來建立實例。常用的資料類別，JavaScript 允許我們省略 `new` 關鍵字，但不建議這麼做。

``` js
const newArr = new Array();
const arr = Array();
```

而類別方法分成靜態方法 (static method) 以及動態方法 (dynamic method)。如果這個方法是所有該類別所共有的，與個別實例的屬性無關，這就是一個靜態方法；反之則為動態方法。

在 MDN 上，如果我們看到的方法是像 `Array.from()` 這樣的條目，就是靜態方法。如果我們看到的是 `Array.prototype.filter()` 這種表達方法，就是動態方法。

> 至於 `prototype` 就牽涉到物件導向的繼承 (inheritance) 與 JavaScript 的原型鏈 (prototype chain)，這部分真的扯太遠啦。如果有興趣的話，可以閱讀參考資料。

讓我們火速進入正題：

`Array.prototype.filter()` 方法：回傳一個新陣列，對其中的每個元素進行回呼函式 (callback function)，如果回呼函式回傳 `true` 則保留此值。

**篩選出 1500 - 1599 出生的發明家：**

``` js
const fifteen = inventors.filter((inventor) => 1600 > inventor.year && inventor.year >= 1500);
console.table(fifteen);
```

> 此處的箭頭函式，就是回呼函式。回呼函式經常使用箭頭函式的寫法。

``` js
const fifteen = inventors.filter(callbackFn);
```

> 這裡我們要順便介紹箭頭函式之前都沒有介紹到的特性：當箭頭函式內的敘述只有一行的時候，可以省略 `{}`，這個時候會直接回傳敘述的值。

``` js
// 以下兩者等價

const arrowFunction1 = () => 2 > 1;

const arrowFunction2 = () => {
  return 2 > 1;
};
```

`Array.prototype.filter()` 方法：回傳一個新陣列，新陣列的元素值為回呼函式的回傳值。

**回傳所有發明家的全名：**

``` js
const fullnames = inventors.map((inventor) => `${inventor.first} ${inventor.last}`);
console.table(fullnames);
```

`Array.prototype.sort()` 方法：就地 (in-place) 排序陣列，會根據回呼函式的回傳值做相對應的處理。

> 所謂的就地，指的是直接改變傳入資料的結構。在這裡指的也就是不回傳另一個新陣列。

**依照出生年份從小到大排序：**

``` js
const ordered = inventors.sort((a, b) => a.year - b.year);
console.table(ordered);
```

> `sort()` 方法的實作有它特定的邏輯，如果使用 `(a, b) => a.year - b.year` 作為回呼函式，將會做遞增排列；而如果以 `(a, b) => b.year - a.year` 傳入則會做遞減排列。

> 這裡還有一個原課程疏忽的地方是，在撰寫回呼函式的時候，原課程一開始是這樣寫的：

``` js
const ordered = inventors.sort((firstPerson, secondPerson) => {
  if (firstPerson.year - secondPerson.year) {
    return 1;
  } else {
    return -1;
  }
});
```

> 但實際上，如果我們配合 `console.log()` 來觀察，會發現應該是這樣：

``` js
const ordered = inventors.sort((secondPerson, firstPerson) => {
  console.log('first parameter: ', secondPerson);
  console.log('second parameter: ', firstPerson);

  if (secondPerson.year - firstPerson.year) {
    return 1;
  } else {
    return -1;
  }
});
```

> 也就是說，當回呼函式中有多個形式參數的時候，這些形式參數會排隊進入陣列中取值。因此，越早進入的形式參數會取得較後面的值。這也就代表著，`sort()` 方法的運作方式，是如果回傳值為 `1`，則不調換兩個元素的位置；而如果回傳值為 `-1` 則調換它們。而其實還有第三種情況，如果回傳值是 `0`，將保持原來的順序。

原課程也介紹了三元運算字 (ternary operator)，我們可以將上面的最化簡形式改寫成：

``` js
const ordered = inventors.sort((a, b) => a.year > b.year ? 1 : -1);
```

`Array.prototype.reduce()` 方法：將陣列透過回呼函是與初始值處理成單一值。

**加總所有發明家在世的年份：**

``` js
const totalYears = inventors.reduce((total, inventor) => total + (inventor.passed - inventor.year), 0);
console.log(totalYears);
```

> 這裡要注意 `reduce()` 方法的第二個參數 `initialValue`，在這裡是設定為 `0` 來作為年份總計的初始值。透過不同的 `initialValue` 的設計讓 `reduce()` 方法可以達成很多有趣的操作，這部分在 MDN 上有很多範例，請一定要看看。

**依照在世年份從小到大排序：**

``` js
const oldest = inventors.sort((a, b) => (a.passed - a.year) - (b.passed - b.year));
console.table(oldest);
```

**綜合題，在 [Category:Boulevards in Paris - Wikipedia](https://en.wikipedia.org/wiki/Category:Boulevards_in_Paris) 中取得所有包含 `'de'` 的路名：**

``` js
// https://en.wikipedia.org/wiki/Category:Boulevards_in_Paris

const category = document.querySelector('.mw-category');
const links = Array.from(category.querySelectorAll('a'));
const de = links.map((link) => link.textContent).filter((streetName) => streetName.includes('de'));
console.table(de);
```

> 這裡使用了` Array.from()` 方法將 `NodeList` 轉換為陣列實例。然後依序利用 `map()` 方法取得路名，以 `filter()` 方法篩選資料，並利用 `String.prototype.includes()` 方法挑出具有特定內容的字串。

**依照姓氏首字母順序排序 `people`：**

``` js
const alpha = people.sort((a, b) => a.split(', ') > b.split(', ') ? 1 : -1);
console.table(alpha);
```

> 這裡除了利用 `String.prototype.split()` 方法裁切 `', '` 後面的部分外，也要注意兩個字串在 `sort()` 的方式其實是從首字開始逐字比對他們的 ASCII code。可以利用 `String.prototype.charCodeAt()` 來觀察。

**利用 `reduce()` 方法將陣列資料分類加總：**

``` js
const transportation = data.reduce((obj, item) => {
  obj[item] = obj[item] ? ++obj[item] : 1;

	return obj;
}, {});
console.log(transportation);
```

> 利用空物件作為 `initialValue` 來達成分組加總的一個範例。我盡量整理了程式碼讓它看起來比較簡潔，背後的邏輯並不複雜。當然如果使用的是 C++ 可以寫得更簡潔，有興趣的話可以研究看看。

### 延伸練習

暫時想不到延伸練習的題材，這些操作 leetcode 上面很多。

> 如果想要更熟悉 JavaScript 這個語言，無論是 execution context 或是 call by sharing，這些觀念，甚至稍微接觸資料結構與演算法，都很建議從每天寫一題 leetcode 開始。當你認識到 JavaScript 的資料處理速度其實很慢之後，也可以嘗試 Python、Java、C++ 等語言。

我自己也是利用刷題的機會多看看別的語言對於資料結構的實作與預設行為的差異，雖然還是有很多不懂的地方，但是有在接觸總是好的吧，希望有一天也可以嘗試使用別的語言來做開發。

### 參考資料

* [Classes - JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)
* [Inheritance and the prototype chain - JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain)
* [Console - Web APIs  | MDN](https://developer.mozilla.org/zh-TW/docs/Web/API/Console)
* [Array.prototype.filter() - JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)
* [Array.prototype.map() - JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)
* [Array.prototype.sort() - JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)
* [Conditional (ternary) operator - JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator)
* [Array.prototype.reduce() - JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce)
* [Array.from() - JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from)
* [String.prototype.includes() - JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/includes)
* [String.prototype.split() - JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/split)
* [String.prototype.charCodeAt() - JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/charCodeAt)
