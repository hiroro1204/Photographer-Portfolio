/**
 * component > modal
 * モーダルのアニメーション（GSAP）
 * モーダルを開くときにモーダル内の要素をフェードインし、モーダルを閉じるときにモーダル内の要素をフェードアウトする
 */

export const initializeModal = () => {
  const modals = document.querySelectorAll(".js-modal");
  const buttons = document.querySelectorAll(".js-modal-open-button");
  const closeButtons = document.querySelectorAll(".js-modal-close-button");

  // modalとbuttonがページ内にない場合returnする
  if (!modals || !buttons || !closeButtons) return;

  // 定数定義
  const ANIMATION_DURATION = 0.8; // メインアニメーションのduration
  const FOOTER_DURATION = 0.3; // フッターアニメーションのduration
  const EASE_TYPE = "power2.inOut";

  // clipPathの値定義
  const CLIP_PATH = {
    FULL: "inset(0% 0% 0% 0%)", // 全表示
    HIDDEN_TOP: "inset(100% 0% 0% 0%)", // 上から100%切る
    HIDDEN_BOTTOM: "inset(0% 0% 100% 0%)", // 下から100%切る
  };

  /**
   * モーダルを開く関数
   */
  const openModal = (modal) => {
    // モーダルの開閉機能は確実に実行
    modal.showModal();
    document.body.style.overflow = "hidden";

    // アニメーション処理（GSAPが存在する場合のみ実行）
    if (typeof gsap !== "undefined" && modal) {
      const modalImg = modal.querySelector(".js-modal-image");
      const modalFooter = modal.querySelector(".js-modal-footer");

      // 初期状態を設定
      gsap.set(modal, { clipPath: CLIP_PATH.HIDDEN_TOP });
      if (modalImg) {
        gsap.set(modalImg, { clipPath: CLIP_PATH.FULL });
      }
      if (modalFooter) {
        gsap.set(modalFooter, { opacity: 0 });
      }

      // アニメーション
      const tl = gsap.timeline({
        defaults: { ease: EASE_TYPE },
      });

      tl.to(modal, {
        duration: ANIMATION_DURATION,
        clipPath: CLIP_PATH.FULL,
      });

      if (modalFooter) {
        tl.to(modalFooter, {
          duration: FOOTER_DURATION,
          opacity: 1,
        });
      }
    }

    // フォーカストラップ：モーダル内の最初のフォーカス可能な要素にフォーカス
    const firstFocusable = modal.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (firstFocusable) {
      firstFocusable.focus();
    }
  };

  /**
   * モーダルを閉じる関数
   */
  const closeModal = (modal) => {
    // モーダルのIDから対応するボタンを取得
    const modalId = modal.id;
    const button = document.querySelector(
      `.js-modal-open-button[data-modal-open="${modalId}"]`
    );
    const buttonImg = button
      ? button.querySelector(".js-modal-button-image")
      : null;
    const buttonTitle = button
      ? button.querySelector(".js-modal-button-title")
      : null;

    // アニメーション処理（GSAPが存在する場合のみ実行）
    if (typeof gsap !== "undefined" && modal) {
      const modalFooter = modal.querySelector(".js-modal-footer");

      // アニメーション
      const tl = gsap.timeline({
        defaults: { ease: EASE_TYPE },
        onComplete: () => {
          // モーダルの閉鎖は確実に実行
          modal.close();
          document.body.style.overflow = "";

          // リセット
          gsap.set(modal, { clipPath: CLIP_PATH.HIDDEN_TOP });
          if (modalFooter) {
            gsap.set(modalFooter, { opacity: 0 });
          }

          // ボタン画像とタイトルを表示
          if (buttonImg) {
            gsap.set(buttonImg, { clipPath: CLIP_PATH.HIDDEN_BOTTOM });
            gsap.to(buttonImg, {
              duration: ANIMATION_DURATION,
              clipPath: CLIP_PATH.FULL,
              ease: EASE_TYPE,
            });
          }

          if (buttonTitle) {
            gsap.set(buttonTitle, { opacity: 0 });
            gsap.to(buttonTitle, {
              duration: ANIMATION_DURATION,
              opacity: 1,
              ease: EASE_TYPE,
            });
          }
        },
      });

      if (modalFooter) {
        tl.to(modalFooter, {
          duration: FOOTER_DURATION,
          opacity: 0,
        });
      }

      tl.to(modal, {
        duration: ANIMATION_DURATION,
        clipPath: CLIP_PATH.HIDDEN_TOP,
      });
    } else {
      // アニメーションなしでモーダルを閉じる
      modal.close();
      document.body.style.overflow = "";
      if (buttonImg) {
        buttonImg.style.clipPath = CLIP_PATH.FULL;
      }
      if (buttonTitle) {
        buttonTitle.style.opacity = "1";
      }
    }
  };

  /**
   * ボタンクリックでモーダルopenする関数
   */
  buttons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault(); // デフォルトの動作を防ぐ
      event.stopPropagation(); // イベントの伝播を防ぐ

      const modalId = button.getAttribute("data-modal-open");
      const modal = document.getElementById(modalId);
      if (!modal) return;

      // 既にモーダルが開いている場合は何もしない
      if (modal.open) return;

      // ボタン内の画像とタイトルを取得
      const buttonImg = button.querySelector(".js-modal-button-image");
      const buttonTitle = button.querySelector(".js-modal-button-title");

      // アニメーション処理（GSAPが存在し、かつアニメーション対象の要素が存在する場合のみ実行）
      if (typeof gsap !== "undefined" && (buttonImg || buttonTitle)) {
        // 初期状態を設定
        if (buttonImg) {
          gsap.set(buttonImg, { clipPath: CLIP_PATH.FULL });
        }
        if (buttonTitle) {
          gsap.set(buttonTitle, { opacity: 1 });
        }

        // ボタン画像とタイトルのアニメーション
        const tl = gsap.timeline({
          defaults: { ease: EASE_TYPE },
          onComplete: () => openModal(modal),
        });

        if (buttonImg) {
          tl.to(buttonImg, {
            duration: ANIMATION_DURATION,
            clipPath: CLIP_PATH.HIDDEN_BOTTOM,
          });
        }

        if (buttonTitle) {
          tl.to(
            buttonTitle,
            {
              duration: ANIMATION_DURATION,
              opacity: 0,
            },
            "<"
          );
        }
      } else {
        // アニメーションなしでモーダルを開く
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
          event.preventDefault(); // デフォルト動作を防ぐ（アニメーションを実行するため）
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
