export const initializeModal = () => {
  const modals = document.querySelectorAll(".js-modal");
  const buttons = document.querySelectorAll(".js-modal-open-button");
  const closeButtons = document.querySelectorAll(".js-modal-close-button");

  // modalとbuttonがページ内にない場合returnする
  if (!modals || !buttons || !closeButtons) return;

  // モーダルopenする関数
  const openModal = (modal) => {
    modal.showModal();
    // 背面のスクロールを無効化
    document.body.style.overflow = "hidden";
    // フォーカストラップ：モーダル内の最初のフォーカス可能な要素にフォーカス
    const firstFocusable = modal.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (firstFocusable) {
      firstFocusable.focus();
    }
  };

  // モーダルcloseする関数
  const closeModal = (modal) => {
    modal.close();
    // 背面のスクロールを有効化
    document.body.style.overflow = "";
  };

  // ボタンクリックでモーダルopenする関数
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const modalId = button.getAttribute("data-modal-open");
      const modal = document.getElementById(modalId);
      if (modal) {
        openModal(modal);
      }
    });
  });

  // クローズボタンクリックでモーダルclose
  closeButtons.forEach((closeButton) => {
    closeButton.addEventListener("click", () => {
      // クローズボタンから最も近いdialog要素を取得
      const modal = closeButton.closest(".js-modal");
      if (modal) {
        closeModal(modal);
      }
    });
  });

  // 背景クリックでモーダルclose
  modals.forEach((modal) => {
    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        closeModal(modal);
      }
    });
  });

  // Escapeキーを押すと非表示（モーダルが開いている時のみ）
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      modals.forEach((modal) => {
        if (modal.open) {
          closeModal(modal);
        }
      });
    }
  });

  // フォーカストラップ：Tabキーでモーダル内のフォーカスを循環させる
  modals.forEach((modal) => {
    modal.addEventListener("keydown", (event) => {
      if (event.key !== "Tab") return;

      const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstFocusable = focusableElements[0];
      const lastFocusable = focusableElements[focusableElements.length - 1];

      if (event.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstFocusable) {
          event.preventDefault();
          lastFocusable.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastFocusable) {
          event.preventDefault();
          firstFocusable.focus();
        }
      }
    });
  });
};
