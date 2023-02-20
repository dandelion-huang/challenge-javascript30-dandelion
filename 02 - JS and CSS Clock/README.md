# CSS + JS Clock

利用 CSS 和 JavaScript 實作一個時鐘。

### 知識點

* CSS `transform` 相關屬性。
* JavaScript `Date` 物件。
* CSS `cubic-bazier()` 函式。

### 步驟

> 這一天的內容是初學者很容易接觸到的實作時鐘。因為是蠻常見的練習，會寫得比較簡單讓讀者自己去摸索看看，個人覺得這是剛開始學習 CSS 時很有趣的，像是捏陶土一樣的體驗。

首先，原專案的指針尺寸會讓計算角度變得比較繁瑣，所以我們先將寬高相關的部分互換，同時加上讓三根指針寬度不同的宣告。也要記得移除 `.hand` 中不再需要的宣告。

``` css
.hand {
  background: black;
  position: absolute;
  left: 50%;
}

.hour-hand {
  width: 8px;
  height: 30%;
  transform-origin: 4px 100%;
  transform: translate(-4px, 66.6667%);
}

.min-hand {
  width: 6px;
  height: 40%;
  transform-origin: 3px 100%;
  transform: translate(-3px, 25%);
}

.second-hand {
  width: 4px;
  height: 50%;
  transform-origin: 2px 100%;
  transform: translate(-2px, 0);
}
```

這部分可以注意 `width`、`height` 跟 `transform` 的宣告間的對應關係，因為屬於比較基礎的內容，就讓讀者自己去玩玩看囉～

> 不過在這個時候三隻指針都是疊在一起的狀態，所以可以利用 `opacity` 屬性隱藏不想要看到的指針：

``` css
.hidden {
  opacity: 0;
}
```

> 也可以利用 `visibility` 這個屬性來隱藏：

``` css
.hidden {
  visibility: hidden;
}
```

> 關於 `visibility: hidden` 和 `display:none` 間的差別可以參考參考資料。

然後讓我們利用偽元素 (pseudo-element) 在時鐘中點加上一個黑點：

``` css
.clock-face::after {
  content: '';
  width: 2rem;
  height: 2rem;
  background: black;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
```

> 這裡可以注意 `position: absolute` 和 `left: 50%; top: 50% transform: translate(-50%, -50%);` 的組合用法，是一種常用的置中寫法。

> 有時候也會看到另外一種作法如下：

``` css
.centered {
  width: 2rem; /* required */
  height: 2rem; /* required */
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
}
```

> 可以不宣告寬高看看會得到什麼結果。

> 不過上面這種作法對瀏覽器 reflow 會比較吃力，請盡量利用 `transform` 來做置中。

接下來調整一下版面、指針和中點的陰影，幫指針加上圓角，並把秒針改成紅色：

``` css
.clock {
  /* ... */
  box-shadow:
    0 0 2px 4px rgba(0, 0, 0, 0.1),
    inset 0 0 2px 2px #EFEFEF,
    inset 0 0 15px black,
    0 0 10px 2px rgba(0, 0, 0, 0.2);
}

.clock-face::after {
  /* ... */
  box-shadow:
    0 0 0 2px rgba(0, 0, 0, 0.1),
    0 0 10px 2px rgba(0, 0, 0, 0.2);
}

.hand {
  /* ... */
  box-shadow:
    3px 5px 2px rgba(0, 0, 0, 0.3);
}

.hour-hand {
  /* ... */
  border-radius: 4px; /* half of the width of the clock hands */
}

.min-hand {
  /* ... */
  border-radius: 3px; /* half of the width of the clock hands */
}

.second-hand {
  /* ... */
  background: red;
  border-radius: 2px; /* half of the width of the clock hands */
  /* ... */
}
```

這時候讓我們直接進入 JavaScript 部分來計算時間：

``` js
const secondHand = document.querySelector('.second-hand');
const minHand = document.querySelector('.min-hand');
const hourHand = document.querySelector('.hour-hand');

const setDate = () => {
  const now = new Date();
  
  const seconds = now.getSeconds();
  const secondsDegrees = (seconds / 60) * 360;

  secondHand.style.transform = `rotate(${secondsDegrees}deg)`;

  const mins = now.getMinutes();
  const minsDegrees = (mins / 60) * 360 + (seconds / 60) * 6;

  minHand.style.transform = `rotate(${minsDegrees}deg)`;

  const hours = now.getHours();
  const hoursDegrees = (hours / 12) * 360 + (mins / 60) * 30;

  hourHand.style.transform = `rotate(${hoursDegrees}deg`;

  setTimeout(setDate, 60);
}

setDate();
```

這部分首先可以注意的是 JavaScript 內建的 `Date` 物件與其方法：`Date.getSeconds()`、`Date.getMinutes()` 和 `Date.getHours()`。了解它們的回傳值後應該就可以理解指針刻度的算法了。

第二個需要注意的是 `element.style` 這個寫法會給予這個元素 inline-style。所以會發現指針不但會跳到奇怪的地方，還是繞著中心旋轉的。

這時候 `transform-origin` 屬性就派上用場了：

``` css
.hour-hand {、
  transform-origin: 4px 100%; /* half of the width of the clock hands */
}

.min-hand {
  transform-origin: 3px 100%; /* half of the width of the clock hands */
}

.second-hand {
  transform-origin: 2px 100%; /* half of the width of the clock hands */
```

雖然旋轉定位點的問題解決了，但是指針位置還是不正確。這是因為我們寫在 `style.css` 中的 `transform: translate();` 內容完全被 JavaScript 加上的 inline-style 覆蓋掉了。

所以我們要註解掉 CSS 中指針的 `transform` 部分，並修正 JavaScript 內容：

``` js
// ...

secondHand.style.transform = `translateX(-2px) rotate(${secondsDegrees}deg)`;

// ...

minHand.style.transform = `translate(-3px, 25%) rotate(${minsDegrees}deg)`;

// ...

hourHand.style.transform = `translate(-4px, 66.6667%) rotate(${hoursDegrees}deg`;

// ...
```

第三個可以注意的地方是我們改成使用 `setTimeout()` 這個 web API 來更新時間，而不是使用課程用的 `setInterval()`。

> 要理解這兩個函式的差異會牽扯到其他觀念，主要是關於 **event loop** 的知識，所以可能不適合在這邊做解說。不過我們可以先簡單比較這兩種寫法。

> 在不考慮其他任務 (task) 的時候，以下兩種寫法**大致**等價：

``` js
const setDate = () => {
  // do something ...
}

setInterval(setDate, 1000);
```

``` js
const setDate = () => {
  // do something ...

  setTimeout(setDate, 1000);
}

setDate();
```

> 可以把關鍵字 **event loop**、**call stack**、**web API** 記錄下來，等到學習到 **AJAX** 的時候應該就有機會可以理解了。

> 也可以猜想看看，我使用的寫法為什麼不以 1000 毫秒為間隔？

``` js
const setDate = () => {
  // do something ...

  setTimeout(setDate, 60);
}
```

> 其實是希望更新指針的時間細一點，不然假設網頁在 10.5 秒的時候讀取完成，之後每次更新時間的時候都會誤差半秒。

然後讓我們利用 `cubic-bazier()` 函式為秒針加上一些有趣的動作。

``` js
// ...

secondHand.style.transition = 'transform 0.05s cubic-bezier(0.1, 2.7, 0.58, 1)';

// ...
```

貝茲曲線是一種緩動函數 (easing-function)，可以提供具有速度變化的動作。我們可以將它做為 `transition-timing-function`，或是使用 `ease`、`ease-in-out` 等關鍵字來使用內建的緩動函數。

這時候我們會發現在指針每次繞完一圈的時候會有閃爍的現象，我們可以調整一下 `style.transition` 來觀察這個行為：

``` js
// ...

secondHand.style.transition = 'transform 1s';

// ...
```

> 竟然是逆時針走的...也就是說在那個瞬間是從 `354deg` 旋轉到 `0deg`。

我們可以在這個特殊的時刻讓 `transition: transform 0s` 來解決這個問題。

``` js
// ...

if (secondsDegrees === 0) {
  secondHand.style.transition = 'transform 0s';
} else {
  secondHand.style.transition = 'transform 0.05s cubic-bezier(0.1, 2.7, 0.58, 1)';
}

// ...
```

### 延伸練習

目前這種做法，指針指到 0 的時候就會很突兀，因為指針動畫不同，所以我們可以在那個特別的時刻，讓指針是從 `354deg` 旋轉到 `360deg`。

我們順便將一些條件判斷封裝起來，比方說 `secondsDegrees === 0` 這種條件判斷，可以用一個函式包起來。此外，`secondHand` 的 `transition` 就可以不用一直宣告，也可以搬出去。

此外也可以把羅馬文字鐘面刻度印出來，用迴圈旋轉過文字位置後還要將文字反方向轉回來，只是我覺得現在這樣的鐘面也蠻簡潔，所以就不實作這塊了。

最後的成果請參考此專案 repo。

### 參考資料

* [transform - CSS | MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/transform)
* [transform - CSS-Tricks](https://css-tricks.com/almanac/properties/t/transform/)
* [Pseudo-elements - CSS | MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-elements)
* [box-shadow - CSS | MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/box-shadow)
* [box-shadow - CSS-Tricks](https://css-tricks.com/almanac/properties/b/box-shadow/)
* [Date - JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/)
* [\<easing-function\> - CSS | MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/easing-function)
* [transition-timing-function - CSS | MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/transition-timing-function)
