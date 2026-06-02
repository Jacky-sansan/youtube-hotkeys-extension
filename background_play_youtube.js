(function () {
  "use strict";

  // 1. 強制覆蓋 document 的可見性屬性
  // 使用 Object.defineProperty 攔截 YouTube 腳本的讀取請求
  const fakeVisibility = () => {
    const props = {
      hidden: false,
      visibilityState: "visible",
      webkitHidden: false,
      webkitVisibilityState: "visible",
    };

    for (let key in props) {
      Object.defineProperty(document, key, {
        get: () => props[key],
        set: () => {}, // 阻止 YouTube 試圖修改這些狀態
        configurable: true,
      });
    }
  };

  // 2. 偽裝焦點狀態 (YouTube 播放器會檢查視窗是否有焦點)
  const fakeFocus = () => {
    document.hasFocus = () => true;
  };

  // 3. 攔截並殺死所有「隱藏」或「失去焦點」的事件
  const blockInterruption = () => {
    const eventsToBlock = [
      "visibilitychange",
      "webkitvisibilitychange",
      "blur",
      "mouseleave",
      "focusout",
    ];

    eventsToBlock.forEach((type) => {
      window.addEventListener(
        type,
        (e) => {
          e.stopImmediatePropagation();
        },
        true,
      ); // 使用 true 確保在捕獲階段就攔截

      document.addEventListener(
        type,
        (e) => {
          e.stopImmediatePropagation();
        },
        true,
      );
    });
  };

  // 執行初始化
  fakeVisibility();
  fakeFocus();
  blockInterruption();

  console.log("純 JS 版 YouTube 背景播放修正已啟動。");
})();
