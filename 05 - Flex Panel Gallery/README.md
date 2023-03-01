# Flex Panels Image Gallery

主要是練習 CSS flexbox 以及利用 JavaScript 達成 Accordion 效果。

> Accordion 的中文是手風琴，指的是那種展開使用者互動區塊的效果。

### 知識點

* CSS flexbox 的使用。

### 步驟

> 關於 CSS flexbox 的部分不會有太多解釋，建議可以直接到 [Flexbox Froggy](https://flexboxfroggy.com/) 去練習。

**首先讓 `panels` 改成水平排列並自動撐開寬度：**

``` css
.panels {
  display: flex;
  /* ... */
}

.panel {
  flex: 1 0 auto;
  /* ... */
}
```

> 注意 `flex` 是 `flex-grow`、`flex-shrink` 和 `flex-basis` 的縮寫屬性 (shorthand property)。

由於課程提供的 template 已經將 `box-sizing` 宣告為 `border-box`，我們可以對每個 `panel` 的內容設定 `border` 來觀察他們的範圍，並且不影響 box model 的大小。 

``` css
.panel > p {
  /* ... */
  border: 1px solid red;
}
```

這邊我將原課程所使用的 `*` 改成 `p`。原因是 CSS 使用到 combinator 的 selector 在解析的時候是由右方至左方解析的，所以盡量不要使用會選取到所有元素的萬用字元 (wildcard)，也就是 `*`，可以優化 CSS selector 的效能。

**讓每張 `panel` 中的字平均分擔垂直方向三分之一並置中：**

``` css
.panel {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  /* ... */
}

.panel > * {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1 0 auto;
	/* ... */
}
```

**讓上下的文字先移出畫面，並設定重新顯示的條件：**

``` css
.panel > p:first-child {
  transform: translate3d(0, -100%, 0);
}
.panel.is-active > p:first-child {
  transform: translate3d(0, 0, 0);
}
.panel > p:last-child {
  transform: translate3d(0, 100%, 0);
}
.panel.is-active > p:last-child {
  transform: translate3d(0, 0, 0);
}
```

這裡原課程設定的重新顯示條件是用 `.open-active`，我會選擇使用 `.is-*` 這種表示狀態的 classname 來做管理。同時，為了使用 GPU  acceleration，將 `translateY()` 改成 `translate3d()`。這部分可以閱讀參考資料的 CSS performance optimization 部分，文中會介紹到 GPU accelerated properties 以及 `will-change` 相關知識。

> 關於 `:first-child` 這些偽類別 (pseudo-classes)，如果不熟的話可以閱讀參考資料。

**讓選中的 `panel` 展開：**

``` css
.panel.is-active {
  flex: 5 0 auto;
  font-size: 40px;
}
```

在做 JavaScript 相關的事件綁定，我會選擇做得簡潔一些。

``` js
const panels = document.querySelectorAll('.panel');

const toggleOpen = (e) => {
  e.target.classList.toggle('is-active');
}

panels.forEach((panel) => panel.addEventListener('click', toggleOpen));
```

為了避免點擊到 `<p>`，加上無視游標事件的 CSS 屬性。同時因為我們沒有監聽 `transitionend` 事件，必須要為 `transition` 屬性加上 `delay`。

``` css
.panel > p {
  /* ... */
  transition: transform 0.5s 0.7s; /* delay: 0.7s */
  pointer-events: none;
}
```

最後將測試用的 `border` 屬性註解掉即可。

``` css
.panel > p {
  /* ... */
  /* border: 1px solid red; */
}
```

### 延伸練習

目前這種作法，在點擊其他卡片的時候不會取消已經被點擊的卡片的 `.is-active`。我們可以將它改得比較舒服一些，點擊都先去掉所有 `panel` 的 `.is-active` classname，然後再為當前這張卡片添加類別。

``` js
const toggleOpen = (e) => {
  panels.forEach((panel) => {
    if (panel.classList.contains('is-active')) {
      panel.classList.remove('is-active');
    }
  });
  e.target.classList.add('is-active');
};
```

有興趣的話可以參考此專案 repo。

### 參考資料

* [flex - CSS: Cascading Style Sheets | MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/flex)
* [CSS Box Model | MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Box_Model)
* [Pseudo-classes - CSS | MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes)
* [CSS performance optimization - Learn web development | MDN](https://developer.mozilla.org/en-US/docs/Learn/Performance/CSS)
* [transition - CSS | MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/transition)
