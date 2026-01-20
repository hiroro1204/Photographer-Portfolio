/**
 * component > page-transition
 * ページ遷移のアニメーション（GSAP）
 * 内部リンククリック時にヘッダー以外の要素をフェードアウトし、次ページでフェードインを実行
 */

export const initializePageTransition = () => {
  // GSAPが読み込まれているかチェック
  if (typeof gsap === "undefined") {
    console.warn("GSAP is not loaded");
    return;
  }

  const header = document.querySelector(".js-header");

  if (!header) {
    return;
  }

  /**
   * ヘッダー以外の要素を取得（.js-page-contentクラスを持つ要素）
   */
  const getNonHeaderElements = () => {
    return document.querySelectorAll(".js-page-content");
  };

  // sessionStorageのフラグキー
  // ページ遷移アニメーションフラグのセッション保持用キーを定義しておくことで、
  // 遷移先ページで「フェードインアニメーションを実行するかどうか」の判定（初回ロードは不要/遷移時のみ必要/直接アクセス時は不要）ができるため
  const TRANSITION_FLAG = "pt";

  // 遷移中フラグ（連続クリックを防ぐ）
  let isTransitioning = false;

  /**
   * 内部リンクかどうかを判定
   */
  const isInternalLink = (anchor) => {
    const href = anchor.href;
    if (!href) return false;

    // 外部リンクを除外
    try {
      const url = new URL(href);
      if (url.origin !== window.location.origin) {
        return false;
      }
    } catch (e) {
      return false;
    }

    // target="_blank"を除外
    if (anchor.target === "_blank") {
      return false;
    }

    // hrefが#始まりを除外
    if (href.startsWith("#")) {
      return false;
    }

    // javascript:を除外
    if (href.startsWith("javascript:")) {
      return false;
    }

    return true;
  };

  /**
   * Leaveアニメーション（ヘッダー以外の要素をフェードアウト）
   */
  const leaveAnimation = (href) => {
    if (isTransitioning) return;
    isTransitioning = true;

    // ヘッダーにロッククラスを付与
    header.classList.add("is-lock");

    // sessionStorageにフラグを保存
    sessionStorage.setItem(TRANSITION_FLAG, "1");

    // ヘッダー以外の要素を取得
    const nonHeaderElements = getNonHeaderElements();

    // GSAPタイムラインでアニメーション
    const tl = gsap.timeline({
      onComplete: () => {
        // アニメーション完了後にページ遷移
        window.location.href = href;
      },
    });

    tl.to(nonHeaderElements, {
      opacity: 0,
      duration: 0.5,
      ease: "power2.inOut",
    });
  };

  /**
   * Enterアニメーション（ヘッダー以外の要素をフェードイン）
   */
  const enterAnimation = () => {
    // sessionStorageのフラグを確認
    const flag = sessionStorage.getItem(TRANSITION_FLAG);
    if (!flag) {
      return;
    }

    // フラグを削除
    sessionStorage.removeItem(TRANSITION_FLAG);

    // 追加したstyleタグを削除（GSAPがアニメーションできるようにする）
    const hideStyle = document.getElementById("page-transition-hide");
    if (hideStyle) {
      hideStyle.remove();
    }

    // requestAnimationFrameを使って次のフレームで実行
    requestAnimationFrame(() => {
      // ヘッダー以外の要素を取得
      const nonHeaderElements = getNonHeaderElements();

      if (nonHeaderElements.length === 0) {
        // 要素が取得できない場合は少し待って再試行
        setTimeout(() => {
          const retryElements = getNonHeaderElements();
          if (retryElements.length > 0) {
            gsap.set(retryElements, { opacity: 0 });
            gsap.to(retryElements, {
              opacity: 1,
              duration: 0.6,
              ease: "power2.out",
              onComplete: () => {
                header.classList.remove("is-lock");
                isTransitioning = false;
              },
            });
          } else {
            header.classList.remove("is-lock");
            isTransitioning = false;
          }
        }, 100);
        return;
      }

      // ヘッダー以外の要素を非表示状態から開始
      gsap.set(nonHeaderElements, { opacity: 0 });

      // GSAPタイムラインでアニメーション
      const tl = gsap.timeline({
        onComplete: () => {
          // ヘッダーのロッククラスを解除
          header.classList.remove("is-lock");
          isTransitioning = false;
        },
      });

      tl.to(nonHeaderElements, {
        opacity: 1,
        duration: 0.6,
        ease: "power2.out",
      });
    });
  };

  // 内部リンククリックを監視
  document.addEventListener("click", (event) => {
    const anchor = event.target.closest("a");
    if (!anchor) return;

    if (!isInternalLink(anchor)) {
      return;
    }

    // デフォルトの動作を防ぐ
    event.preventDefault();

    // Leaveアニメーションを開始
    leaveAnimation(anchor.href);
  });

  // ページ読み込み時にEnterアニメーションを実行
  const runEnterAnimation = () => {
    // 少し遅延を入れて確実に要素が読み込まれてから実行
    setTimeout(() => {
      enterAnimation();
    }, 50);
  };

  if (document.readyState === "loading") {
    // DOMContentLoadedとloadの両方で実行を試みる
    document.addEventListener("DOMContentLoaded", runEnterAnimation);
    window.addEventListener("load", runEnterAnimation);
  } else {
    runEnterAnimation();
  }
};
