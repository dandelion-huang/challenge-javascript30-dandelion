# JavaScript Drum Kit

實作按下鍵盤對應按鍵觸發畫面改變與發出音效的效果。

### 知識點

* HTML `<kbd>` 標籤。
* HTML5 `data-*` 自定義屬性。
* HTML `<audio>` 標籤，以及它的屬性與方法。
* 事件監聽器 (eventListener)。
* JavaScript 樣板字串 (template literals)。
* JavaScript 箭頭函式 (arrow function)。
* HTML element 的 `classList` 屬性與其方法。

### 步驟

首先要建立 `script.js` 然後放在 HTML 結構中：

``` html
<script src="./script.js"></script>
```

當按鍵被按下與彈起的時候，會分別觸發 `keydown`、`keyup` 與 `keypress` 事件，其中 `keypress` 將逐步被**棄用 (deprecated)**。這時候我們可以利用事件監聽器 (event listener) 將這個事件印在執行環境 (runtime) 的控制台 (console) 中：

``` js
window.addEventListener('keydown', (e) => {
	console.log(e);
});
```

這時候我們可以在瀏覽器的控制台中看到印出的 `KeyboardEvent`，或者也可以利用一些[線上工具](https://uiwjs.github.io/keycode-info/)來觀察印出的結果。一般來說可以用以下三個屬性來比對按下的按鍵：

* `keyCode`：原課程使用的方式，會印出按鍵的 ASCII key code，但將逐漸被**棄用**。
* `key`：會印出考慮大小寫的值，且會因為鍵盤佈局不同改變。例如 `'a'` 和 `'A'`。
* `code`：會印出按鍵生成的字符，所以不會因為鍵盤佈局不同改變。例如 `'keyA'`。

我決定改成使用 `code` 來實作。

首先將原本的 starter file 中的對應部分：

``` html
<div data-key="65" class="key">
    <kbd>A</kbd>
    <span class="sound">clap</span>
</div>
<!-- ... -->

<audio data-key="65" src="sounds/clap.wav"></audio>
<!-- ... -->
```

更改為：

``` html
<div data-key-code="KeyA" class="key">
    <kbd>A</kbd>
    <span class="sound">clap</span>
</div>
<!-- ... -->

<audio data-key-code="KeyA" src="sounds/clap.wav"></audio>
<!-- ... -->
```

接下來我們要利用屬性選取器選取對應按鍵的 `<audio>` 並且重置音效的時間軸後播放它，順便將它封裝起來：

``` js
const playSound = (e) => {
    const audio = document.querySelector(`audio[data-key-code=${e.code}]`);

    if (audio === null) return; // early return

    audio.currentTime = 0; // reset the audio time
    audio.play(); // play the audio
}
```

然後利用事件監聽器綁定：

``` js
window.addEventListener('keydown', playSound);
```

到這裡播放音效的部分就大致完成了，接下來讓我們如法炮製，綁定增加 CSS class 的函式：

``` js
const highlightKeyStyle = (e) => {
    const key = document.querySelector(`.key[data-key-code=${e.code}]`);

    if (key === null) return; // early return

    key.classList.add('playing');
}

window.addEventListener('keydown', highlightKeyStyle);
```

取消這個 `.playing` class 的方式，原課程是利用 `transitionend` 事件並針對 `e.propertyName === 'transform'` 狀況來處理：

``` js
function removeTransition(e) {
    if (e.propertyName !== 'transform') return;
    e.target.classList.remove('playing');
}

// ...

const keys = Array.from(document.querySelectorAll('.key'));
keys.forEach(key => key.addEventListener('transitionend', removeTransition));
```

可以稍微注意其中使用的 `Array.from()` 方法和 `forEach()` 遍歷。

> 因為 `querySelectorAll()` 方法回傳的是一個 `NodeList`，這時候就可以使用 `Array.from()` 方法來將之轉換為陣列實體 (instance)，但是其實 NodeList 本來就可以使用 `forEach()` 遍歷，應該是為了解決某些老舊瀏覽器會遇到的問題吧。

但是這樣在長按按鍵的時候會有問題，所以我改成綁定在 `keyup` 事件上。

``` js
const removeHighlightKeyStyle = (e) => {
    const key = document.querySelector(`.key[data-key-code=${e.code}]`);

    if (key.classList.contains('playing')) {
        key.classList.remove('playing');
    }
}

window.addEventListener('keyup', removeHighlightKeyStyle);
```

### 延伸練習

可以嘗試把函式也綁定到 `MouseEvent` 上，會另外使用到 `Element.closest()` 方法，也會針對一些滑鼠才會觸發的問題，像是 `user-select` 這個 CSS property 和 `mouseleave` 事件做處理。

有興趣的話可以參考此專案原始碼。

### 參考資料

* [keycode-info](https://uiwjs.github.io/keycode-info/)
* [\<kbd\> - HTML | MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/kbd)
* [data-* - HTML | MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/data-*)
* [Element: keydown event - Web APIs | MDN](https://developer.mozilla.org/en-US/docs/Web/API/Element/keydown_event)
* [Element: keyup event - Web APIs | MDN](https://developer.mozilla.org/en-US/docs/Web/API/Element/keyup_event)
* [Element: keypress event - Web APIs | MDN](https://developer.mozilla.org/en-US/docs/Web/API/Element/keypress_event)
* [EventListener - Web APIs | MDN](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener)
* [KeyboardEvent - Web APIs | MDN](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent)
* [\<audio\> - HTML | MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio)
* [Template literals (Template strings) - JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)
* [Arrow function expressions - JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)
* [Element.classList - Web APIs | MDN](https://developer.mozilla.org/en-US/docs/Web/API/Element/classList)
* [Element: transitionend event - Web APIs | MDN](https://developer.mozilla.org/en-US/docs/Web/API/Element/transitionend_event)
* [NodeList - Web APIs | MDN](https://developer.mozilla.org/en-US/docs/Web/API/NodeList)
* [Element.closest() - Web APIs | MDN](https://developer.mozilla.org/en-US/docs/Web/API/Element/closest)
