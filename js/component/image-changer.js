/**
 * component > image-changer
 * トップページの画像を切り替える
 */

export const initializeImageSwitcher = () => {
  const buttons = document.querySelectorAll(
    ".top-selected-list-item button[data-image-index]"
  );
  const imageItems = document.querySelectorAll(
    ".top-images-list-item[data-image-index]"
  );

  // ボタンと画像がページ内にない場合returnする
  if (!buttons.length || !imageItems.length) return;

  // 画像を切り替える関数
  const switchImage = (targetIndex) => {
    // すべての画像から--activeクラスを削除
    imageItems.forEach((item) => {
      item.classList.remove("top-images-list-item--active");
    });

    // 該当する画像に--activeクラスを追加
    const targetImage = Array.from(imageItems).find(
      (item) => item.getAttribute("data-image-index") === targetIndex
    );

    if (targetImage) {
      targetImage.classList.add("top-images-list-item--active");
    }
  };

  // ボタンクリックで画像を切り替える
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const imageIndex = button.getAttribute("data-image-index");
      if (imageIndex) {
        switchImage(imageIndex);
      }
    });
  });
};
