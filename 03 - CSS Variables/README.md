# Playing with CSS Variables and JS

以 JavaScript 和 CSS 實作即時濾鏡效果。

### 知識點

* HTML `<label>` 和 `<input>` 標籤。
* CSS Variables 與 `:root` 偽類別 (pseudo-class)。

### 步驟

> 按照慣例，CSS 相關的內容會解釋得比較簡單。

CSS 的變數必須要宣告在 `:root` 這個 pseudo-class 中。他代表文件的根元素，可以視為優先級更高的 `html` tag selector。

``` css
:root {
  --color-base: #ffc600;
  --spacing: 10px;
  --blur: 10px;
}
```

使用的時候利用 `var()` 函式來取用。

``` css
img {
  padding: var(--spacing);
  background-color: var(--color-base);
  filter: blur(var(--blur))
}

.hl {
  color: var(--color-base);
}
```

在 HTML 中將 `<input>` 的 `type` 設定為 `range` 會以滑動條的形式呈現。

``` html
<input id="spacing" type="range" name="spacing" min="10" max="200" value="10" data-sizing="px" />
```

> 你或許會好奇，為什麼只是加上一個 `type` 屬性的說明就讓視覺有這麼大的變化。其實這中間有 shadow DOM 在作用，你可以透過檢查工具來發現它的存在。你也可以透過一些簡單的 JavaScript 來創建 shadow DOM。

> shadow DOM 曾經是 Web Component 的一個重要部分，只是後來似乎並沒有流行起來。不過，我們還是有機會看到一些自製的 shadow DOM component。我就曾經在 apple 官網上看過使用 shadow DOM 實作的 carousel play/pause 按鈕，只是現在已經撤下了。shadow DOM 是一個比較偏小知識的內容，就不在這邊做過多著墨。

接下來我們要利用 event listener 監聽 `<input>` 值，並利用 JavaScript 更新它。

``` js
const inputs = document.querySelectorAll('.controls input');

const handleUpdate = (e) => {
  console.log(e.target.value);
};

inputs.forEach((input) => {
  input.addEventListener('change', handleUpdate);
});
```

> 這裡原課程使用的 `handleUpdate()` 是使用函式陳述式 (function statement) 來宣告，所以 `this` 會指向事件監聽器註冊的對象，可以用 `this.value` 取得 `<input>` 的值。但是當我們使用箭頭函式來宣告的時候，`this` 會佚失而指向全域對象（在瀏覽器中指向 `window` 或 `undefined`，在 node 中指向 `global`）。

> 關於 `this` 指向的對象，我自己是覺得 [W3Schools](https://www.w3schools.com/js/js_this.asp) 說明的六種情況簡單易懂。

* In an object method, `this` refers to the **object**.
* Alone, `this` refers to the **global object**.
* In a function, `this` refers to the **global object**.
* In a function, in strict mode, `this` is `undefined`.
* In an event, `this` refers to the **element** that received the event.
* Methods like `call()`, `apply()`, and `bind()` can refer `this` to **any object**.

> 話說回來，我們在 day 01 中就曾經看過的箭頭函式，其實是一種函式表達式 (function expression)。

``` js
const arrowFunction = () => {
  // ...
}

const functionExpression = function() {
  // ...
}
```

> 以函式表達式宣告的箭頭函式，其實是宣告了一個匿名函式，然後將其賦值 (assign) 給一個變數。而這種寫法的進一步簡寫，就是箭頭函式。

由於在 `<input>` 上拖曳並不會觸發函式，因此原課程提出可以順便註冊事件在 `mousemove` 事件上，但這樣觸發頻率有點高。我自己的習慣是註冊在 `input` 事件上，並根據需求決定要不要也註冊在 `change` 事件上。

``` js
// ...

inputs.forEach((input) => {
	input.addEventListener('input', handleUpdate);
	input.addEventListener('change', handleUpdate);
});
```

接下來我們會利用 `dataset` 這個屬性來取得元素所有 `data-*` 自定義屬性的值。這裡要記得加上一個條件判斷來避免串接字串時加上 `undefined`。（其實在第一天的延伸練習中就有使用過 `dataset`。）

``` js
const handleUpdate = (e) => {
	// '' for color input or it'll be undefined
	const suffix = e.target.dataset.sizing || '';
};
```

然後利用 `setProperty()` 方法來更新元素的屬性。

``` js
const handleUpdate = (e) => {
	// '' for color input or it'll be undefined
	const suffix = e.target.dataset.sizing || '';
	document.documentElement.style.setProperty(`--${e.target.name}`, e.target.value + suffix);
};
```

最後，原課程做了一個有趣的嘗試，給予 `<h2>` 元素一個自己的變數：

``` html
<h2 style="--color-base: #bada55">
  Update CSS Variables with <span class="hl">JS</span>
</h2>
```

如此一來，`JS` 這兩個字就無法取得祖輩層的 `:root` 中宣告的變數值了，這說明了 CSS 的階層性。

### 延伸練習

我們可以多加上一些 `<input>` 來為展示區域加上更多 `filter()`。

有興趣的話可以參考此專案 repo。

### 參考資料

* [\<label\> - HTML | MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label)
* [\<input\> - HTML | MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input)
* [:root - CSS | MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/:root)
* [Web Components | MDN](https://developer.mozilla.org/en-US/docs/Web/Web_Components)
* [Using shadow DOM - Web Components | MDN](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM)
* [JavaScript this - W3Schools](https://www.w3schools.com/js/js_this.asp)
* [Arrow function expressions - JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)
* [function declaration - JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)
* [function expressions - JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/function)
* [data-* - HTML | MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/data-*)
* [CSSStyleDeclaration.setProperty() - Web APIs | MDN](https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleDeclaration/setProperty)
* [filter - CSS | MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/filter)
