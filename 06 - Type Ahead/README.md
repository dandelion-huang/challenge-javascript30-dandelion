# AJAX Type Ahead

練習使用 AJAX (Asynchronous JavaScript and XML) 以及刪選效果。

### 知識點

* AJAX (Asynchronous JavaScript and XML) 的使用。
* `RegExp()` 正規表達式的使用。

### 步驟

要聊到 `fetch()`，首先要先知道什麼叫做同步，什麼叫做非同步。

> 由於 JavaScript 是單執行緒的語言，因此一般的操作都是有可能阻塞執行緒的，這就像是所有的操作都走在同一條步道上一樣，也可以稱呼這種狀況為 blocking。非同步操作就是利用一些「其他的方式」，達成不會阻塞執行緒的效果，像是大家各走各的步道，可以有各自完成的先後之分，也被稱為 non-blocking。

為什麼非同步操作這麼重要是因為，在前端網頁呈現中，如果畫面需要用到 JavaScript 處理過的結果，而這個處理又很耗時的話，網頁畫面會像是卡住一樣，這樣的使用者體驗非常不好。我們有利用非同步操作來達成各種頁面部分更新的需求。

而 AJAX 的 Asynchronous 也就是非同步的意思了，但其實也不是一開始就很火紅，是由於 Gmail 大量使用這個技術才讓大家看到 AJAX 的強大之處。

> 話又說回來，上面所謂的非同步操作使用的「其他的方式」又是什麼？這就要提到 event loop 的概念了，這部分可以直接看這個超讚的影片，看過的都說讚：

[所以說event loop到底是什麼玩意兒？| Philip Roberts | JSConf EU](https://www.youtube.com/watch?v=8aGhZQkoFbQ)

看完了以後，想想 Web APIs 使用的資源是怎麼來的，大概就會知道為什麼我用「其他的方式」這種曖昧的說法了。

話說回來，讓我們聊聊 `fetch()`。

> `fetch()` 是 JavaScript ES6 引入的語法糖，本質上是 `return new Promise()`。

其中的 `Promise` 物件是在 ES6 規範的一個重要特性，他代表的是一個即將完成或失敗的非同步操作，以及它所產生的值。也就是說，`Promise` 物件內部會有三種狀態：`pending`、`fulfilled` 或 `rejected`，這三個狀態同時間只會有一個存在。

> 由於這種特性，通常我們在實作的時候還會實作等候逾時等功能。

``` js
const timeoutPromise = (delay) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject('Timeout...');
    }, delay);
  });
};

Promise.race([
  doSomething(),
  timeoutPromise(3000)
])
  .then(
    () => {
      // resolve
    },
    () => {
      // reject
    });
```

> `race()` 是 `Promise` 物件的一個方法，可以實作兩個函式競速這樣的功能，一旦得到其中一個結果就會接收其成功值或失敗訊息。

在上面的範例中，我們也看到了 `then()` 這種寫法，而 `then()` 其實是可以不斷串接的，可以將 `Promise` 建構成一連串的 `Promise` chain。透過這種概念，讓我們得以從狀態機 (state machine) 角度建構出 `Promise` 樹狀結構，因此像 Web Worker 這樣的技術，背後都有 `Promise` 在穿針引線。

> 關於 callback hell 到 ES5 `generator`，然後到 ES6 `Promise` 以及 `fetch()`，最後到 ES7 `async/await` 的演進過程，可能會長到可以寫兩天的內容，所以這部分就留給有興趣的讀者自己去研究了。我相信網路上都有很多很棒的文章可以參考。~~（或許等我有空的時候再回來補完，但是上次 day 04 的 class 介紹也覺得根本可以寫六天。）~~

現在讓我們回到課程的內容，我們已經預先定義好了一個 URL，包含大量地名資料：

``` js
const endpoint =
	'https://gist.githubusercontent.com/Miserlou/c5cd8364bf9b2420bb29/raw/2bf258763cdddd704f8ffd3ea9a3e81d25e2c6f6/cities.json';
```

我們可以透過這種方式觀察 `fetch()` 的回傳值（是一個 `Promise` 物件）。

``` js
const promise = fetch(endpoint);
console.log(promise); // Promise {<pending>}
```

因此我們要先將 HTTP Response 轉換為 JSON 格式，再透過控制台觀察它的內容：

``` js
fetch(endpoint)
	.then((blob) => blob.json())
	.then((data) => console.log(data));
```

現在將這些 `data` 賦值予 `cities`。

``` js
const cities = [];

fetch(endpoint)
	.then((blob) => blob.json())
	.then((data) => cities.push(...data));
```

> 此處所謂的 BLOB，指的是 Binary Large Object，一個相當於原始二元資料的不可變物件。

> 這裡也使用了 `...`，展開運算子 (spread operator)，用來將陣列展開為一個個的元素推入陣列中。而這個運算子其實有另外一個功能，叫做其餘運算子 (rest operator)。關於他們的使用方式可以閱讀參考資料。

> 像這種相同的符號或函式卻具有多重功能的狀況，在程式領域中被稱為過載 (overload)。

接下來讓我們撰寫過濾資料的函式：

``` js
const findMatches = (wordToMatch, cities) => {
	return cities.filter((place) => {
		const regex = new RegExp(wordToMatch, 'gi');
		return place.city.match(regex) || place.state.match(regex);
	});
};
```

這裡使用到了正規表達式 (regular expression) 這個類別，第二個參數是 `flags`，有各種設定可以選擇。`g` 代表 global，意思是尋找全部匹配的部分，而不是只尋找第一個；`i` 代表 insensitive，不區分大小寫的意思。

> 關於正規表達式可以在 [regex101](https://regex101.com/) 玩玩看。

這裡我們可以利用上方的連結測試看看下面這段正規表達式究竟在匹配什麼，後用會使用到這個函式：

``` js
const numberWithCommas = (x) => {
	return x.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
```

> 在 [regex101](https://regex101.com/) 中貼入 `/\B(?=(\d{3})+(?!\d))/g` 以後，可以在右邊的 EXPLANATION 部分看到這段正規表達式的解說，所以這裡就不特別著墨啦。

> 另外，使用到這個函式的地方的參數本來就是字串，因此我去掉了原課程使用的 `toString()` 方法。

現在一口氣將事件綁定，幫匹配字串用 `<span class="hl">` 和 `</span>` 夾住，和置換掉建議清單中的 HTML 一起做完：

``` js
const searchInput = document.querySelector('.search');
const suggestions = document.querySelector('.suggestions');

const displayMatches = (e) => {
	const matchArray = findMatches(e.target.value, cities);
	const html = matchArray.map((place) => {
    const regex = new RegExp(e.target.value, 'gi');
    const cityName = place.city.replace(regex, `<span class="hl">${e.target.value}</span>`);
    const stateName = place.state.replace(regex, `<span class="hl">${e.target.value}</span>`);

    return `
      <li>
        <span class="name">${cityName}, ${stateName}</span>
        <span class="population">${numberWithCommas(place.population)}</span>
      </li>
    `;
  })
  .join('');

	suggestions.innerHTML = html;
};

searchInput.addEventListener('keyup', displayMatches);
```

> 將 `Array.prototype.map()` 回傳的字串陣列用 `Array.prototype.join('')` 連接成字串。

觀察結果可以得知，我們前面撰寫的 `numberWithCommas()` 函式所做的事就像它的名字一樣，是用來幫人口數加上 `','` 分隔用的。

### 延伸練習

將非同步相關處理都改成用 `async/await` 的寫法增加可讀性。

``` js
const fetchCities = async () => {
  const response = await fetch(endpoint);
  const result = await response.json();
  cities.push(...result);
}

fetchCities();
```

有興趣的話可以參考此專案 repo。

### 參考資料

* [所以說event loop到底是什麼玩意兒？| Philip Roberts | JSConf EU](https://www.youtube.com/watch?v=8aGhZQkoFbQ)
* [Using the Fetch API | MDN](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)
* [Promise - JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
* [Promise.race() - JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/race)
* [Callback Hell](http://callbackhell.com/)
* [Generator - JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator)
* [async function - JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)
* [Blob - Web APIs | MDN](https://developer.mozilla.org/en-US/docs/Web/API/Blob)
* [Spread syntax (...) - JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)
* [Rest parameter - JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters)
* [Function overloading - Wikipedia](https://en.wikipedia.org/wiki/Function_overloading)
* [RegExp - JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/RegExp)
* [regex101: build, test, and debug regex](https://regex101.com/)
* [Object.prototype.toString() - JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/toString)
* [String.prototype.replace() - JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace)
* [Array.prototype.join() - JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/join)
